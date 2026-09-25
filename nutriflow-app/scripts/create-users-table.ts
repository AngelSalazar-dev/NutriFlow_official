/**
 * Script para crear la tabla users desde cero
 * Ejecuta: npx tsx scripts/create-users-table.ts
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

async function createUsersTable() {
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

    console.log('✅ Conectado a MySQL\n');

    // Deshabilitar foreign key checks
    console.log('🔓 Deshabilitando foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✅ Foreign key checks deshabilitados\n');

    // Eliminar users si existe
    console.log('🗑️ Verificando tabla users...');
    await connection.query('DROP TABLE IF EXISTS users');
    console.log('✅ users eliminada (si existía)\n');

    // Eliminar users_backup si existe
    console.log('🗑️ Verificando tabla users_backup...');
    await connection.query('DROP TABLE IF EXISTS users_backup');
    console.log('✅ users_backup eliminada (si existía)\n');

    // Crear users con estructura correcta
    console.log('📋 Creando tabla users con estructura correcta...');
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
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Foreign key checks habilitados\n');

    // Verificar estructura
    console.log('📋 Verificando estructura...');
    const [columns]: any = await connection.query('DESCRIBE users');
    console.log('Columnas en users:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    console.log('');

    // Verificar si tiene id
    const hasId = columns.some((col: any) => col.Field === 'id');
    if (hasId) {
      console.log('✅ La tabla tiene columna id\n');
    } else {
      console.log('❌ ERROR: La tabla NO tiene columna id\n');
    }

    console.log('✅ ¡Tabla users creada exitosamente!\n');
    console.log('🎉 Ahora puedes registrar usuarios\n');
    console.log('📝 URL de registro: http://localhost:3000/register\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que MySQL esté corriendo\n');
    
    // Re-enable foreign key checks on error
    if (connection) {
      try {
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      } catch {}
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('👋 Conexión cerrada\n');
    }
  }
}

createUsersTable();
