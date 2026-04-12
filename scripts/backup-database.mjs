import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const conn = await mysql.createConnection({
  host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3ZxNQLB5VbKt56g.root',
  password: '4BLpMj6H4QzcJ8oi',
  database: 'nutriflow',
  ssl: { rejectUnauthorized: true }
});

const [tables] = await conn.query('SHOW TABLES');
const tableNames = tables.map(t => Object.values(t)[0]);

let sql = `-- ========================================
-- NutriFlow Database Backup
-- Generated: ${new Date().toISOString()}
-- ========================================

SET FOREIGN_KEY_CHECKS=0;

`;

for (const tbl of tableNames) {
  console.log(`📦 Backing up: ${tbl}`);
  
  // Table structure
  const [cols] = await conn.query(`SHOW CREATE TABLE \`${tbl}\``);
  sql += cols[0]['Create Table'] + ';\n\n';
  
  // Table data
  const [rows] = await conn.query(`SELECT * FROM \`${tbl}\``);
  if (rows.length > 0) {
    const columns = Object.keys(rows[0]);
    const colNames = columns.join(',');
    
    sql += `INSERT INTO \`${tbl}\` (${colNames}) VALUES\n`;
    
    const rowStrs = rows.map(r => {
      const vals = columns.map(k => {
        const v = r[k];
        if (v === null) return 'NULL';
        if (typeof v === 'number') return v;
        if (v instanceof Date) return `'${v.toISOString().replace('T', ' ').substring(0, 19)}'`;
        return `'${String(v).replace(/'/g, "''")}'`;
      });
      return `(${vals.join(',')})`;
    });
    
    // Chunk into batches of 500
    for (let i = 0; i < rowStrs.length; i += 500) {
      const chunk = rowStrs.slice(i, Math.min(i + 500, rowStrs.length));
      sql += chunk.join(',\n') + ';\n\n';
    }
  }
}

sql += 'SET FOREIGN_KEY_CHECKS=1;\n';

// Write to file
const backupDir = path.join(process.cwd(), 'database');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `backup-${timestamp}.sql`);
fs.writeFileSync(backupPath, sql);

const sizeMB = (fs.statSync(backupPath).size / 1024 / 1024).toFixed(2);

console.log(`\n✅ Backup saved to: ${backupPath}`);
console.log(`📊 Tables: ${tableNames.length}`);
console.log(`📦 Size: ${sizeMB} MB`);

// Also count rows per table
for (const tbl of tableNames) {
  const [count] = await conn.query(`SELECT COUNT(*) as c FROM \`${tbl}\``);
  console.log(`  - ${tbl}: ${count[0].c} rows`);
}

await conn.end();
console.log('\n🎉 Done!');
