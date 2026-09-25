import { query } from '../lib/mysql';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
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
    console.log('--- REPARANDO TABLAS DE ALIMENTOS ---');

    // 1. Corregir food_logs
    const tableLogs = 'food_logs';
    const [colsLogs] = await query(`DESCRIBE ${tableLogs}`);
    const existingLogsCols = (colsLogs as any[]).map(c => c.Field);

    const neededLogs: Record<string, string> = {
      'food_id': 'VARCHAR(36)',
      'brand': 'VARCHAR(255)',
      'serving_name': 'VARCHAR(100)'
    };

    for (const [col, type] of Object.entries(neededLogs)) {
      if (!existingLogsCols.includes(col)) {
        console.log(`➕ Agregando columna ${col} a ${tableLogs}...`);
        await query(`ALTER TABLE ${tableLogs} ADD COLUMN ${col} ${type}`);
        console.log(`✅ Columna ${col} agregada.`);
      } else {
        console.log(`ℹ️ Columna ${col} ya existe en ${tableLogs}.`);
      }
    }

    // 2. Corregir foods (por si acaso)
    const tableFoods = 'foods';
    const [colsFoods] = await query(`DESCRIBE ${tableFoods}`);
    const existingFoodsCols = (colsFoods as any[]).map(c => c.Field);

    const neededFoods: Record<string, string> = {
      'is_priority': 'TINYINT(1) DEFAULT 0',
      'serving_name': 'VARCHAR(100)'
    };

    for (const [col, type] of Object.entries(neededFoods)) {
      if (!existingFoodsCols.includes(col)) {
        console.log(`➕ Agregando columna ${col} a ${tableFoods}...`);
        await query(`ALTER TABLE ${tableFoods} ADD COLUMN ${col} ${type}`);
        console.log(`✅ Columna ${col} agregada.`);
      } else {
        console.log(`ℹ️ Columna ${col} ya existe en ${tableFoods}.`);
      }
    }

    console.log('🎉 Todas las tablas están en orden.');
  } catch (error) {
    console.error('❌ Error reparando tablas:', error);
  } finally {
    process.exit();
  }
}

main();
