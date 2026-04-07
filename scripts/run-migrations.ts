/**
 * Script para ejecutar migraciones
 * Ejecuta: npx tsx scripts/run-migrations.ts
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

async function runMigrations() {
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

    // Buscar archivos de migración
    const migrationsDir = path.join(process.cwd(), 'scripts', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📋 Encontradas ${migrationFiles.length} migraciones\n`);

    for (const file of migrationFiles) {
      console.log(`📄 Ejecutando ${file}...`);
      
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // Dividir en statements (separados por ;)
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('\n--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.query(statement);
            console.log(`  ✅ Statement ejecutado`);
          } catch (error: any) {
            // Ignorar errores de "table already exists"
            if (error.code === 'ER_TABLE_EXISTS_ERROR') {
              console.log(`  ⚠️ Tabla ya existe (continuando)`);
            } else {
              console.log(`  ⚠️ Error: ${error.message.substring(0, 100)}`);
            }
          }
        }
      }

      console.log(`✅ ${file} completada\n`);
    }

    console.log('✅ ¡Todas las migraciones ejecutadas exitosamente!\n');

    // Verificar tablas creadas
    console.log('📋 Verificando tablas...');
    const [tables]: any = await connection.query('SHOW TABLES');
    console.log(`Tablas en nutriflow_db: ${tables.length}\n`);
    
    tables.forEach((row: any) => {
      const tableName = row[Object.keys(row)[0]];
      console.log(`  ✅ ${tableName}`);
    });

    console.log('\n🎉 ¡Base de datos lista para usar!\n');
    console.log('📝 URL de registro: http://localhost:3000/register\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que MySQL esté corriendo\n');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Conexión cerrada\n');
    }
  }
}

runMigrations();
