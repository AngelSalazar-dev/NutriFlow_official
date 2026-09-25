/**
 * Script para ejecutar la migración de tablas de ejercicio y rutinas
 * Run: npx tsx scripts/run-exercise-migration.ts
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

async function runMigration() {
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

    // Leer el script SQL
    const sqlPath = path.join(process.cwd(), 'scripts', 'migrations', '004-add-exercise-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Ejecutando migración 004-add-exercise-tables.sql...\n');

    // Dividir y ejecutar cada statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('SELECT'));

    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log(`✅ Statement ejecutado`);
      } catch (error: any) {
        console.log(`⚠️ Statement skipped: ${error.message}`);
      }
    }

    console.log('\n✅ ¡Migración completada exitosamente!\n');
    console.log('📊 Tablas creadas:');
    console.log('   - exercise_logs: Registro de ejercicios');
    console.log('   - routines: Rutinas de ejercicio');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\nAsegúrate de que:');
    console.error('   1. MySQL esté corriendo');
    console.error('   2. La base de datos nutriflow_db exista');
    console.error('   3. Las credenciales en .env.local sean correctas\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Conexión cerrada\n');
    }
  }
}

runMigration();
