import { query } from '../lib/mysql';
import * as fs from 'fs';
import * as path from 'path';

async function checkSchema() {
  console.log('🔍 Verificando esquemas de tablas de alimentos...');

  // Cargar variables de entorno desde .env.local si es necesario
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0 && key.startsWith('MYSQL_')) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }

  try {
    const tables = ['food_logs', 'daily_logs', 'foods'];
    for (const table of tables) {
      console.log(`\n--- ${table} ---`);
      try {
        const [rows]: any = await query(`DESCRIBE ${table}`);
        console.log(JSON.stringify(rows.map((r: any) => ({ Field: r.Field, Type: r.Type })), null, 2));
      } catch (e: any) {
        console.log(`❌ Error al describir ${table}: ${e.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Error crítico:', error);
  } finally {
    process.exit();
  }
}

checkSchema();
