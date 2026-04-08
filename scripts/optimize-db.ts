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
    console.log('--- Optimizing foods table with FULLTEXT indices ---');
    
    // El índice FULLTEXT requiere que las columnas sean char, varchar o text
    // Usaremos name, brand y category
    try {
      await query('ALTER TABLE foods ADD FULLTEXT INDEX idx_foods_fulltext (name, brand, category)');
      console.log('✅ FULLTEXT index idx_foods_fulltext created.');
    } catch (e: any) {
      if (e.code === 'ER_DUP_KEYNAME') console.log('ℹ️ FULLTEXT index already exists.');
      else throw e;
    }

    console.log('🎉 Database optimization complete.');
  } catch (error) {
    console.error('❌ Error optimizing database:', error);
  } finally {
    process.exit();
  }
}

main();
