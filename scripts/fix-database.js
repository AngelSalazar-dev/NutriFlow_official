// Script para verificar y arreglar la base de datos
const mysql = require('mysql2/promise');

// Hardcoded credentials from .env.local
const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '200000Angelito+',
  database: 'nutriflow_db'
};

async function fixDatabase() {
  let connection;
  
  try {
    console.log('🔌 Conectando a MySQL...');
    console.log(`   Host: ${DB_CONFIG.host}`);
    console.log(`   User: ${DB_CONFIG.user}`);
    
    connection = await mysql.createConnection(DB_CONFIG);

    console.log('✅ Conectado a MySQL');

    // 1. Crear base de datos si no existe
    console.log('\n📦 Creando base de datos...');
    await connection.query('CREATE DATABASE IF NOT EXISTS nutriflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Base de datos nutriflow_db creada/verificada');

    // 2. Usar la base de datos
    await connection.query('USE nutriflow_db');

    // 3. Verificar si la tabla users existe
    const [tables] = await connection.query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'nutriflow_db' AND TABLE_NAME = 'users'
    `);

    if (tables.length === 0) {
      console.log('\n❌ La tabla users NO existe');
      console.log('⚠️  Necesitas ejecutar el script SQL: database/setup.sql');
      
      // Crear tabla básica mínima para que funcione el login
      console.log('\n🔨 Creando tabla users básica...');
      await connection.query(`
        CREATE TABLE users (
          id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL,
          age INT UNSIGNED DEFAULT 25,
          weight_kg DECIMAL(5,2) DEFAULT 70,
          height_cm DECIMAL(5,2) DEFAULT 170,
          sex ENUM('male', 'female') DEFAULT 'male',
          activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') DEFAULT 'moderate',
          goal ENUM('lose', 'maintain', 'gain') DEFAULT 'maintain',
          bmr DECIMAL(10,2) DEFAULT NULL,
          tdee DECIMAL(10,2) DEFAULT NULL,
          daily_calorie_target INT UNSIGNED DEFAULT 2000,
          protein_goal INT UNSIGNED DEFAULT 150,
          carb_goal INT UNSIGNED DEFAULT 250,
          fat_goal INT UNSIGNED DEFAULT 65,
          subscription_plan ENUM('free', 'premium', 'pro') DEFAULT 'free',
          subscription_end TIMESTAMP NULL DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);
      console.log('✅ Tabla users creada');
    } else {
      console.log('\n✅ Tabla users existe');
    }

    // 4. Verificar si existe la columna password_hash
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'nutriflow_db' 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'password_hash'
    `);

    if (columns.length === 0) {
      console.log('\n⚠️  Columna password_hash NO existe, agregándola...');
      await connection.query('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) AFTER email');
      console.log('✅ Columna password_hash agregada');
    } else {
      console.log('✅ Columna password_hash existe');
    }

    // 5. Verificar otros campos necesarios
    const requiredColumns = [
      { name: 'bmr', type: 'DECIMAL(10,2) DEFAULT NULL', after: 'sex' },
      { name: 'tdee', type: 'DECIMAL(10,2) DEFAULT NULL', after: 'bmr' },
      { name: 'daily_calorie_target', type: 'INT UNSIGNED DEFAULT 2000', after: 'tdee' },
      { name: 'protein_goal', type: 'INT UNSIGNED DEFAULT 150', after: 'daily_calorie_target' },
      { name: 'carb_goal', type: 'INT UNSIGNED DEFAULT 250', after: 'protein_goal' },
      { name: 'fat_goal', type: 'INT UNSIGNED DEFAULT 65', after: 'carb_goal' },
      { name: 'subscription_end', type: 'TIMESTAMP NULL DEFAULT NULL', after: 'subscription_plan' },
    ];

    for (const col of requiredColumns) {
      const [colExists] = await connection.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'nutriflow_db' 
          AND TABLE_NAME = 'users' 
          AND COLUMN_NAME = '${col.name}'
      `);

      if (colExists.length === 0) {
        console.log(`  ⚠️  Agregando columna: ${col.name}`);
        try {
          await connection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        } catch (e) {
          console.log(`  ❌ Error agregando ${col.name}: ${e.message}`);
        }
      }
    }

    // 6. Verificar otras tablas necesarias
    const requiredTables = ['food_database', 'food_entries', 'water_logs', 'exercise_logs', 'chat_messages', 'ai_chat_usage', 'daily_logs', 'articles'];
    
    for (const tableName of requiredTables) {
      const [tableExists] = await connection.query(`
        SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = 'nutriflow_db' AND TABLE_NAME = '${tableName}'
      `);

      if (tableExists.length === 0) {
        console.log(`  ⚠️  Tabla ${tableName} no existe (se creará con migration completo)`);
      }
    }

    // 7. Listar usuarios existentes
    console.log('\n👥 Usuarios registrados:');
    const [users] = await connection.query('SELECT id, email, name, created_at, subscription_plan FROM users');
    
    if (users.length === 0) {
      console.log('   ⚠️  No hay usuarios registrados');
      console.log('\n📝 Creando usuario de prueba...');
      
      // Crear usuario de prueba con contraseña: 123456
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      await connection.query(`
        INSERT INTO users (email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, goal, subscription_plan)
        VALUES (?, ?, ?, 25, 70, 170, 'male', 'moderate', 'maintain', 'free')
      `, ['test@test.com', hashedPassword, 'Usuario Prueba']);
      
      console.log('✅ Usuario de prueba creado:');
      console.log('   📧 Email: test@test.com');
      console.log('   🔑 Contraseña: 123456');
    } else {
      console.log(`   ✅ ${users.length} usuario(s) encontrado(s):\n`);
      users.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.name} (${user.email})`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Plan: ${user.subscription_plan}`);
        console.log(`      Creado: ${user.created_at}`);
        console.log('');
      });
    }

    // 8. Verificar que los usuarios tengan password_hash
    console.log('\n🔒 Verificando contraseñas...');
    const [usersWithoutPassword] = await connection.query(`
      SELECT email, name FROM users WHERE password_hash IS NULL OR password_hash = ''
    `);
    
    if (usersWithoutPassword.length > 0) {
      console.log(`   ⚠️  ${usersWithoutPassword.length} usuario(s) sin contraseña:`);
      usersWithoutPassword.forEach(u => {
        console.log(`      - ${u.name} (${u.email})`);
      });
      
      // Asignar contraseña por defecto
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      for (const user of usersWithoutPassword) {
        await connection.query(
          'UPDATE users SET password_hash = ? WHERE email = ?',
          [hashedPassword, user.email]
        );
        console.log(`   ✅ Contraseña asignada para: ${user.email}`);
      }
    } else {
      console.log('   ✅ Todos los usuarios tienen contraseña');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ BASE DE DATOS VERIFICADA Y ARREGLADA');
    console.log('='.repeat(60));
    console.log('\n🚀 Ahora puedes iniciar sesión con:');
    console.log('   📧 Email: test@test.com');
    console.log('   🔑 Contraseña: 123456');
    console.log('\nO ve a http://localhost:3000/register para crear una nueva cuenta');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Código de error:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL no está corriendo. Inicia el servicio MySQL.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Contraseña de MySQL incorrecta. Verifica tu .env.local');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Conexión cerrada');
    }
  }
}

fixDatabase();
