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
    console.log('--- DATABASE DIAGNOSIS ---');
    
    // 1. Usuarios en el sistema
    const [users] = await query('SELECT id, email, name FROM users');
    console.log('Total Users:', users.length);
    console.log('Users Sample:', JSON.stringify(users, null, 2));

    // 2. Registros de comida (últimos 10)
    const [logs] = await query('SELECT id, user_id, food_name, log_date, created_at FROM food_logs ORDER BY created_at DESC LIMIT 10');
    console.log('Last 10 Food Logs:', JSON.stringify(logs, null, 2));

    // 3. Registros diarios
    const [daily] = await query('SELECT user_id, log_date, total_calories FROM daily_logs ORDER BY log_date DESC LIMIT 5');
    console.log('Recent Daily Logs:', JSON.stringify(daily, null, 2));

  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  } finally {
    process.exit();
  }
}

main();
