/**
 * Script para arreglar la tabla users
 * Ejecuta: npx tsx scripts/fix-database.ts
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
  console.log('✅ Variables de entorno cargadas desde .env.local\n');
}

async function fixDatabase() {
  console.log('🔧 Conectando a MySQL...\n');

  let connection;

  try {
    // Crear conexión
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'nutriflow_db',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
    });

    console.log('✅ Conectado a MySQL\n');

    // Verificar si la tabla users existe
    console.log('📋 Verificando tabla users...');
    const [tables]: any = await connection.query(`
      SHOW TABLES LIKE 'users'
    `);

    if (tables.length === 0) {
      console.log('⚠️ La tabla users no existe, creándola...\n');
      await createUsersTable(connection);
    } else {
      console.log('✅ Tabla users encontrada\n');
      
      // Verificar columnas
      console.log('🔍 Verificando columnas...');
      const [columns]: any = await connection.query(`
        SHOW COLUMNS FROM users
      `);

      const columnNames = columns.map((col: any) => col.Field);
      
      // Verificar si tiene la columna id
      if (!columnNames.includes('id')) {
        console.log('❌ La tabla no tiene columna id, recreando...\n');
        await recreateUsersTable(connection, columns);
      } else {
        console.log('✅ La tabla tiene la columna id\n');
      }

      // Verificar columnas faltantes
      const requiredColumns = [
        'id', 'email', 'password_hash', 'name', 'age', 'weight_kg', 'height_cm',
        'sex', 'activity_level', 'goal', 'subscription_plan', 'daily_calorie_target'
      ];

      const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));

      if (missingColumns.length > 0) {
        console.log(`❌ Faltan columnas: ${missingColumns.join(', ')}`);
        console.log('Recreando tabla con estructura completa...\n');
        await recreateUsersTable(connection, columns);
      } else {
        console.log('✅ Todas las columnas requeridas existen\n');
      }
    }

    // Verificar otras tablas
    console.log('📋 Verificando otras tablas...');
    await checkTable(connection, 'promo_codes');
    await checkTable(connection, 'referral_codes');
    await checkTable(connection, 'referrals');
    await checkTable(connection, 'revenue_records');
    await checkTable(connection, 'payout_accounts');

    console.log('\n✅ ¡Base de datos verificada exitosamente!\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que MySQL esté corriendo y las credenciales en .env.local sean correctas\n');
  } finally {
    if (connection) {
      await connection.end();
      console.log('👋 Conexión cerrada\n');
    }
  }
}

async function createUsersTable(connection: any) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      weight_kg DECIMAL(5, 2) NOT NULL,
      height_cm DECIMAL(5, 2) NOT NULL,
      sex ENUM('male', 'female') NOT NULL,
      activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') NOT NULL,
      goal ENUM('lose', 'maintain', 'gain') NOT NULL,
      subscription_plan ENUM('free', 'premium', 'pro') NOT NULL DEFAULT 'free',
      subscription_end DATETIME DEFAULT NULL,
      daily_calorie_target INT DEFAULT NULL,
      tdee DECIMAL(10, 2) DEFAULT NULL,
      bmr DECIMAL(10, 2) DEFAULT NULL,
      protein_goal DECIMAL(10, 2) DEFAULT NULL,
      carb_goal DECIMAL(10, 2) DEFAULT NULL,
      fat_goal DECIMAL(10, 2) DEFAULT NULL,
      referral_code VARCHAR(20) DEFAULT NULL,
      referred_by VARCHAR(36) DEFAULT NULL,
      referral_credits INT DEFAULT 0,
      promo_code_id VARCHAR(36) DEFAULT NULL,
      promo_applied_at DATETIME DEFAULT NULL,
      promo_expires_at DATETIME DEFAULT NULL,
      stripe_subscription_id VARCHAR(255) DEFAULT NULL,
      ai_agent_api_key VARCHAR(64) DEFAULT NULL,
      ai_agent_enabled BOOLEAN DEFAULT FALSE,
      ai_agent_last_active DATETIME DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_subscription (subscription_plan),
      INDEX idx_referral_code (referral_code),
      INDEX idx_ai_agent_key (ai_agent_api_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Tabla users creada\n');
}

async function recreateUsersTable(connection: any, oldColumns: any[]) {
  // Backup de datos si existen
  const [rows]: any = await connection.query('SELECT * FROM users LIMIT 100');
  
  if (rows.length > 0) {
    console.log(`💾 Resguardando ${rows.length} usuarios existentes...\n`);
    await connection.query('DROP TABLE IF EXISTS users_backup');
    await connection.query('CREATE TABLE users_backup AS SELECT * FROM users');
  }

  await connection.query('DROP TABLE IF EXISTS users');
  await createUsersTable(connection);

  // Restaurar datos si había backup
  if (rows.length > 0) {
    console.log('Restaurando datos desde backup...\n');
    // Intentar restaurar columnas comunes
    await connection.query(`
      INSERT INTO users (email, name, age, subscription_plan, created_at)
      SELECT email, name, age, subscription_plan, created_at
      FROM users_backup
    `);
    console.log('✅ Datos restaurados\n');
  }
}

async function checkTable(connection: any, tableName: string) {
  const [tables]: any = await connection.query(`
    SHOW TABLES LIKE '${tableName}'
  `);

  if (tables.length === 0) {
    console.log(`⚠️ Tabla ${tableName} no existe`);
  } else {
    console.log(`✅ Tabla ${tableName} existe`);
  }
}

fixDatabase();
