/**
 * Script para resetear completamente la base de datos
 * Ejecuta: npx tsx scripts/reset-database.ts
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

async function resetDatabase() {
  console.log('🔧 Conectando a MySQL...\n');
  console.log('⚠️  ADVERTENCIA: Esto eliminará la base de datos nutriflow_db\n');

  let connection;

  try {
    // Conectar SIN database específica
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
    });

    console.log('✅ Conectado a MySQL\n');

    // Deshabilitar foreign key checks GLOBALMENTE
    console.log('🔓 Deshabilitando foreign key checks (GLOBAL)...');
    await connection.query('SET GLOBAL FOREIGN_KEY_CHECKS = 0');
    console.log('✅ Foreign key checks deshabilitados\n');

    // Drop database y crear de nuevo (más limpio)
    console.log('🗑️ Eliminando base de datos nutriflow_db...');
    await connection.query('DROP DATABASE IF EXISTS nutriflow_db');
    console.log('✅ nutriflow_db eliminada\n');

    console.log('📋 Creando base de datos nutriflow_db...');
    await connection.query('CREATE DATABASE nutriflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ nutriflow_db creada\n');

    // Conectar a la nueva database
    await connection.changeUser({ database: 'nutriflow_db' });
    console.log('✅ Conectado a nutriflow_db\n');

    // Crear users con estructura correcta
    console.log('📋 Creando tabla users...');
    await connection.query(`
      CREATE TABLE users (
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

    // Habilitar foreign key checks
    console.log('🔒 Habilitando foreign key checks...');
    await connection.query('SET GLOBAL FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Foreign key checks habilitados\n');

    // Verificar estructura
    console.log('📋 Verificando estructura...');
    const [columns]: any = await connection.query('DESCRIBE users');
    console.log('Columnas en users:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    console.log('');

    const hasId = columns.some((col: any) => col.Field === 'id');
    console.log(hasId ? '✅ La tabla tiene columna id\n' : '❌ ERROR: La tabla NO tiene columna id\n');

    console.log('✅ ¡Base de datos reseteada exitosamente!\n');
    console.log('🎉 Ahora puedes registrar usuarios\n');
    console.log('📝 URL de registro: http://localhost:3000/register\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que MySQL esté corriendo\n');
    
    if (connection) {
      try {
        await connection.query('SET GLOBAL FOREIGN_KEY_CHECKS = 1');
      } catch {}
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('👋 Conexión cerrada\n');
    }
  }
}

resetDatabase();
