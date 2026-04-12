import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

// Simple Excel XML generator (no dependencies needed)
function generateExcelXML(data: any[], columns: { key: string; header: string }[], filename: string) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="header">
   <Font ss:Bold="1" ss:Size="11"/>
   <Interior ss:Color="#4CAF50" ss:Pattern="Solid"/>
   <Font ss:Color="#FFFFFF" ss:Bold="1" ss:Size="11"/>
   <Alignment ss:Horizontal="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
  <Style ss:ID="default">
   <Alignment ss:Vertical="Top"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
  <Style ss:ID="number">
   <NumberFormat ss:Format="0.00"/>
   <Alignment ss:Vertical="Top" ss:Horizontal="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Alimentos">
  <Table>`;

  // Column definitions
  const colDefs = columns.map(() => `   <Column ss:AutoFitWidth="0" ss:Width="120"/>`).join('\n');

  // Header row
  const headerRow = `   <Row>\n${columns.map(c => `    <Cell ss:StyleID="header"><Data ss:Type="String">${c.header}</Data></Cell>`).join('\n')}\n   </Row>`;

  // Data rows (limit to avoid memory issues)
  const MAX_ROWS = 50000;
  const rowsToExport = data.slice(0, MAX_ROWS);
  const dataRows = rowsToExport.map(row => {
    const cells = columns.map(col => {
      const val = row[col.key];
      if (val === null || val === undefined) {
        return `    <Cell ss:StyleID="default"><Data ss:Type="String"></Data></Cell>`;
      }
      if (typeof val === 'number' && (col.key.includes('calories') || col.key.includes('protein') || col.key.includes('carbs') || col.key.includes('fat') || col.key.includes('fiber'))) {
        return `    <Cell ss:StyleID="number"><Data ss:Type="Number">${val}</Data></Cell>`;
      }
      const escaped = String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return `    <Cell ss:StyleID="default"><Data ss:Type="String">${escaped}</Data></Cell>`;
    }).join('\n');
    return `   <Row>\n${cells}\n   </Row>`;
  }).join('\n');

  const xmlFooter = `  </Table>
 </Worksheet>
</Workbook>`;

  return `${xmlHeader}\n${colDefs}\n${headerRow}\n${dataRows}\n${xmlFooter}`;
}

async function main() {
  console.log('📊 Exporting foods from TiDB to Excel...\n');

  const conn = await mysql.createConnection({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3ZxNQLB5VbKt56g.root',
    password: '4BLpMj6H4QzcJ8oi',
    database: 'nutriflow',
    ssl: { rejectUnauthorized: true },
  });

  // Get total count
  const [countRows] = await conn.query('SELECT COUNT(*) as total FROM foods') as any;
  const total = countRows[0].total;
  console.log(`📊 Total foods in database: ${total}`);

  // Get all foods with verified first
  const [foods] = await conn.query(`
    SELECT 
      name as 'Nombre',
      brand as 'Marca',
      category as 'Categoría',
      calories as 'Calorías (kcal)',
      protein as 'Proteína (g)',
      carbs as 'Carbohidratos (g)',
      fat as 'Grasa (g)',
      fiber as 'Fibra (g)',
      serving_size as 'Tamaño porción',
      serving_name as 'Unidad',
      is_verified as 'Verificado',
      is_priority as 'Prioridad',
      is_base_ingredient as 'Ingrediente base',
      ingredients as 'Ingredientes',
      data_source as 'Fuente'
    FROM foods 
    ORDER BY is_verified DESC, is_priority DESC, category, name
  `) as any;

  console.log(`📝 Foods loaded for export: ${foods.length}`);

  // Generate Excel XML
  const columns = Object.keys(foods[0] || {}).map(key => ({
    key,
    header: key
  }));

  const xml = generateExcelXML(foods, columns, 'nutriflow_alimentos');

  // Write to file
  const outputPath = path.join(process.cwd(), 'nutriflow_alimentos.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');

  const fileSizeMB = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Excel exported successfully!`);
  console.log(`📁 File: ${outputPath}`);
  console.log(`📦 Size: ${fileSizeMB} MB`);
  console.log(`📊 Rows: ${foods.length}`);

  // Category breakdown
  const [cats] = await conn.query(`
    SELECT category, 
           COUNT(*) as count,
           SUM(is_verified) as verified,
           ROUND(AVG(calories), 1) as avg_calories,
           ROUND(AVG(protein), 1) as avg_protein,
           ROUND(AVG(carbs), 1) as avg_carbs,
           ROUND(AVG(fat), 1) as avg_fat
    FROM foods 
    GROUP BY category 
    ORDER BY count DESC
  `) as any;

  console.log('\n📋 Category breakdown:');
  console.log('┌──────────────────────────────┬───────┬──────────┬──────────┬──────────┬──────────┬──────────┐');
  console.log('│ Categoría                    │ Total │ Verif.   │ Cal prom │ Prot prom│ Carb prom│ Gras prom│');
  console.log('├──────────────────────────────┼───────┼──────────┼──────────┼──────────┼──────────┼──────────┤');
  cats.forEach((c: any) => {
    const cat = c.category.padEnd(26);
    const count = String(c.count).padStart(5);
    const verif = String(c.verified).padStart(6);
    const cal = String(c.avg_calories).padStart(8);
    const pro = String(c.avg_protein).padStart(8);
    const carb = String(c.avg_carbs).padStart(8);
    const fat = String(c.avg_fat).padStart(8);
    console.log(`│ ${cat} │ ${count} │ ${verif} │ ${cal} │ ${pro} │ ${carb} │ ${fat} │`);
  });
  console.log('└──────────────────────────────┴───────┴──────────┴──────────┴──────────┴──────────┴──────────┘');

  await conn.end();
  console.log('\n🎉 Done! Open the .xml file in Excel to view all foods.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
