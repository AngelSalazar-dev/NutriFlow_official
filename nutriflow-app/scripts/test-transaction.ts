import { query, transaction } from '../lib/mysql';
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
    const userId = '113c2fa9-e905-4068-9db6-9d1433400d47';
    const logId = 'manual-test-' + Date.now();
    const logDate = '2026-04-07';

    console.log('--- Intentando inserción manual idéntica al API ---');
    
    await transaction(async (connection) => {
      // 1. Inserción en food_logs
      console.log('1. Ejecutando INSERT en food_logs...');
      await query(`
        INSERT INTO food_logs (
          id, user_id, food_id, food_name, brand, calories,
          protein_g, carbs_g, fat_g, serving_size_g, serving_name, meal_type,
          log_date, is_custom_food, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        logId,
        userId,
        null,
        'Prueba Manual de Error',
        'Debug',
        100,
        10, 10, 10, 100, 'gramos', 'snack',
        logDate,
        0
      ], connection);
      console.log('✅ INSERT en food_logs completado.');

      // 2. Inserción/Actualización en daily_logs
      console.log('2. Ejecutando UPSERT en daily_logs...');
      await query(`
        INSERT INTO daily_logs (user_id, log_date, total_calories, total_protein, total_carbs, total_fat, water_ml)
        VALUES (?, ?, ?, ?, ?, ?, 0)
        ON DUPLICATE KEY UPDATE
          total_calories = total_calories + ?,
          total_protein = total_protein + ?,
          total_carbs = total_carbs + ?,
          total_fat = total_fat + ?
      `, [
        userId,
        logDate,
        100, 10, 10, 10,
        100, 10, 10, 10
      ], connection);
      console.log('✅ UPSERT en daily_logs completado.');
    });

    console.log('🎉 Transacción manual exitosa.');

  } catch (error: any) {
    console.error('❌ ERROR FATAL EN TRANSACCIÓN:', error.message);
    if (error.sql) console.error('SQL Fallido:', error.sql);
  } finally {
    process.exit();
  }
}

main();
