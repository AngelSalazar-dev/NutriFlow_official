import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { query } from '../lib/mysql';

async function main() {
  console.log('🧼 Cleaning up duplicates...');
  try {
    const [duplicates] = await query('SELECT name, COUNT(*) as count FROM foods GROUP BY name HAVING count > 1');
    console.log(`Found ${duplicates.length} names with duplicates.`);
    
    let deletedTotal = 0;
    for (const row of duplicates) {
      const [result] = await query(
        'DELETE f1 FROM foods f1 INNER JOIN foods f2 WHERE f1.name = f2.name AND f1.id > f2.id AND f1.name = ?',
        [row.name]
      );
      deletedTotal += (result as any).affectedRows || 0;
    }
    
    console.log(`✅ Cleanup finished! Total deleted items: ${deletedTotal}`);
  } catch (e) {
    console.error('❌ Error during cleanup:', e);
  }
  process.exit(0);
}

main();
