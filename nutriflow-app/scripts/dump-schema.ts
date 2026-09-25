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
    const [foodLogCols]: any = await query('DESCRIBE food_logs');
    const [dailyLogCols]: any = await query('DESCRIBE daily_logs');
    const [foodCols]: any = await query('DESCRIBE foods');
    
    console.log('--- FOOD_LOGS ---');
    foodLogCols.forEach((c: any) => console.log(`${c.Field} (${c.Type})`));
    
    console.log('\n--- DAILY_LOGS ---');
    dailyLogCols.forEach((c: any) => console.log(`${c.Field} (${c.Type})`));

    console.log('\n--- FOODS ---');
    foodCols.forEach((c: any) => console.log(`${c.Field} (${c.Type})`));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

main();
