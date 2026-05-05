import { query } from '../lib/mysql';

async function test() {
  try {
    console.log('Testing DB connection...');
    const result = await query('SELECT 1 + 1 as result');
    console.log('Result:', result[0]);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();
