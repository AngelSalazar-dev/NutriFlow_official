// Script para verificar columnas de la tabla users
const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '200000Angelito+',
  database: 'nutriflow_db'
};

async function checkColumns() {
  let connection;
  
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    
    console.log('📋 Verificando columnas de la tabla users...\n');
    
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'nutriflow_db' 
        AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Columnas encontradas:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
    });
    
    // Verificar específicamente password_hash
    const hasPasswordHash = columns.some(c => c.COLUMN_NAME === 'password_hash');
    console.log(`\n¿Tiene password_hash? ${hasPasswordHash ? '✅ SÍ' : '❌ NO'}`);
    
    // Verificar si hay columnas similares
    const passwordCols = columns.filter(c => 
      c.COLUMN_NAME.includes('password') || 
      c.COLUMN_NAME.includes('hash') ||
      c.COLUMN_NAME.includes('pwd')
    );
    
    if (passwordCols.length > 0) {
      console.log('\nColumnas relacionadas con contraseña:');
      passwordCols.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
      });
    }
    
    // Ver datos de un usuario
    console.log('\n👥 Usuarios existentes:');
    const [users] = await connection.query('SELECT * FROM users LIMIT 1');
    if (users.length > 0) {
      const user = users[0];
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name || user.full_name || 'N/A'}`);
      console.log(`  password_hash: ${user.password_hash ? '✅ EXISTE' : '❌ NO EXISTE'}`);
      console.log(`  Claves del objeto: ${Object.keys(user).join(', ')}`);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkColumns();
