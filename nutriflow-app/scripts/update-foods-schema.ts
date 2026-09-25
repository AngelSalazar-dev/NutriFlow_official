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
    console.log('--- Updating foods schema ---');
    
    // Agregar is_priority
    try {
      await query('ALTER TABLE foods ADD COLUMN is_priority TINYINT(1) DEFAULT 0');
      console.log('✅ Column is_priority added.');
    } catch (e: any) {
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('ℹ️ Column is_priority already exists.');
      else throw e;
    }

    // Agregar serving_name
    try {
      await query('ALTER TABLE foods ADD COLUMN serving_name VARCHAR(100)');
      console.log('✅ Column serving_name added.');
    } catch (e: any) {
      if (e.code === 'ER_DUP_COLUMN_NAME') console.log('ℹ️ Column serving_name already exists.');
      else throw e;
    }

    // Agregar índice
    try {
      await query('CREATE INDEX idx_foods_priority ON foods(is_priority)');
      console.log('✅ Index idx_foods_priority created.');
    } catch (e: any) {
      if (e.code === 'ER_DUP_KEYNAME') console.log('ℹ️ Index idx_foods_priority already exists.');
      else throw e;
    }

    console.log('🎉 Foods schema update complete.');
  } catch (error) {
    console.error('❌ Error updating foods schema:', error);
  } finally {
    process.exit();
  }
}

main();
