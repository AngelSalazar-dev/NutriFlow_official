// Script para crear usuario admin
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '200000Angelito+',
  database: 'nutriflow_db'
};

async function createAdmin() {
  let connection;
  
  try {
    console.log('🔌 Conectando a MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Conectado');

    const email = 'admin@nutriflow.com';
    const password = '200000Angelito+';
    const name = 'Admin NutriFlow';

    // Verificar si ya existe
    const [existing] = await connection.query(
      'SELECT id, email FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log(`\n⚠️  El usuario ${email} ya existe. Actualizando contraseña...`);
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [hashedPassword, email]
      );
      
      console.log('✅ Contraseña actualizada');
    } else {
      // Crear usuario
      console.log('\n📝 Creando usuario admin...');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = require('crypto').randomUUID();
      
      await connection.query(`
        INSERT INTO users (id, email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, goal, subscription_plan)
        VALUES (?, ?, ?, ?, 25, 70, 170, 'male', 'moderate', 'maintain', 'free')
      `, [userId, email, hashedPassword, name]);
      
      console.log('✅ Usuario admin creado');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ USUARIO ADMIN LISTO');
    console.log('='.repeat(60));
    console.log('\n🚀 Credenciales de acceso:');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Contraseña: ${password}`);
    console.log('\n📍 Ve a: http://localhost:3000/login');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Conexión cerrada');
    }
  }
}

createAdmin();
