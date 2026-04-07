/**
 * Script para crear tablas de alimentos e hidratación
 * Ejecuta: npx tsx scripts/create-food-tables.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import mysql from 'mysql2/promise';

// Cargar variables de entorno desde .env.local manualmente
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0 && key.startsWith('MYSQL_')) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
  console.log('✅ Variables de entorno cargadas\n');
}

async function createFoodTables() {
  console.log('🔧 Conectando a MySQL...\n');

  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'nutriflow_db',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
    });

    console.log('✅ Conectado a nutriflow_db\n');

    // Deshabilitar foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔓 Foreign key checks deshabilitados\n');

    // Crear tabla food_logs
    console.log('📋 Creando tabla food_logs...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS food_logs (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        food_id VARCHAR(36) DEFAULT NULL,
        custom_food_name VARCHAR(255) NOT NULL,
        calories DECIMAL(10, 2) NOT NULL,
        protein_g DECIMAL(10, 2) DEFAULT 0,
        carbs_g DECIMAL(10, 2) DEFAULT 0,
        fat_g DECIMAL(10, 2) DEFAULT 0,
        serving_size_g INT DEFAULT 100,
        meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') DEFAULT 'snack',
        log_date DATE NOT NULL,
        is_custom_food BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_date (log_date),
        INDEX idx_meal (meal_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ food_logs creada\n');

    // Crear tabla daily_logs
    console.log('📋 Creando tabla daily_logs...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS daily_logs (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        log_date DATE NOT NULL,
        total_calories DECIMAL(10, 2) DEFAULT 0,
        total_protein_g DECIMAL(10, 2) DEFAULT 0,
        total_carbs_g DECIMAL(10, 2) DEFAULT 0,
        total_fat_g DECIMAL(10, 2) DEFAULT 0,
        total_water_ml INT DEFAULT 0,
        exercise_calories_burned INT DEFAULT 0,
        weight_kg DECIMAL(5, 2) DEFAULT NULL,
        mood TEXT DEFAULT NULL,
        sleep_hours DECIMAL(4, 2) DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_date (user_id, log_date),
        INDEX idx_user (user_id),
        INDEX idx_date (log_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ daily_logs creada\n');

    // Crear tabla water_logs
    console.log('📋 Creando tabla water_logs...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS water_logs (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        amount_ml INT NOT NULL,
        log_date DATE NOT NULL,
        log_time TIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_date (log_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ water_logs creada\n');

    // Habilitar foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔒 Foreign key checks habilitados\n');

    console.log('✅ ¡Todas las tablas creadas exitosamente!\n');
    console.log('📊 Resumen:');
    console.log('   - food_logs: Registro de alimentos');
    console.log('   - daily_logs: Resumen diario');
    console.log('   - water_logs: Registro de hidratación\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('👋 Conexión cerrada\n');
    }
  }
}

createFoodTables();
