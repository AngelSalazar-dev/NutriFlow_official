import { query } from '../lib/mysql';
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
    console.log('--- AUDITORÍA COMPLETA DE CLAVES FORÁNEAS (MODO DIOS) ---');

    // 1. Obtener todas las claves foráneas de la base de datos
    const dbName = process.env.MYSQL_DATABASE || 'nutriflow_db';
    const [constraints] = await query(`
      SELECT TABLE_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME 
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [dbName]);

    console.log('Restricciones encontradas:', JSON.stringify(constraints, null, 2));

    const badTables = ['food_logs', 'daily_logs', 'user_profiles', 'workout_routines', 'water_logs'];

    for (const constraint of (constraints as any[])) {
      if (constraint.REFERENCED_TABLE_NAME === 'user') {
        console.log(`🧨 ALERTA: ${constraint.TABLE_NAME}.${constraint.CONSTRAINT_NAME} apunta a la tabla equivocada "user"!`);
        
        try {
          console.log(`🔨 Eliminando restricción ${constraint.CONSTRAINT_NAME}...`);
          await query(`ALTER TABLE ${constraint.TABLE_NAME} DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`);
          
          console.log(`✅ Creando nueva restricción fk_${constraint.TABLE_NAME}_users...`);
          await query(`ALTER TABLE ${constraint.TABLE_NAME} ADD CONSTRAINT fk_${constraint.TABLE_NAME}_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
        } catch (err: any) {
          console.error(`❌ Error reparando ${constraint.TABLE_NAME}:`, err.message);
        }
      }
    }

    console.log('🎉 Auditoría y reparación terminada.');

  } catch (error: any) {
    console.error('❌ Error general:', error.message);
  } finally {
    process.exit();
  }
}

main();
