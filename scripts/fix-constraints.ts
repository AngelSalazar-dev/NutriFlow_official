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
    console.log('--- REPARANDO RESTRICCIONES DE CLAVE FORÁNEA ---');

    // 1. Identificar restricciones en food_logs
    try {
      console.log('Detectando claves foráneas en food_logs...');
      // Intentamos borrar la que sabemos que falla
      await query('ALTER TABLE food_logs DROP FOREIGN KEY IF EXISTS food_logs_ibfk_1');
      console.log('✅ Antigua restricción eliminada (si existía).');
      
      // También probamos con otros posibles nombres generados automáticamente
      await query('ALTER TABLE food_logs DROP FOREIGN KEY IF EXISTS fk_food_logs_user');
    } catch (e) {
      console.log('ℹ️ No se pudo eliminar la clave foránea (quizás no existe con ese nombre).');
    }

    // 2. Crear la restricción correcta hacia la tabla 'users'
    console.log('Creando nueva restricción vinculada a la tabla "users"...');
    await query('ALTER TABLE food_logs ADD CONSTRAINT fk_food_logs_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    console.log('✅ Nueva restricción fk_food_logs_users creada exitosamente.');

    // 3. Lo mismo para daily_logs (por si acaso)
    console.log('Reparando daily_logs...');
    try {
      await query('ALTER TABLE daily_logs DROP FOREIGN KEY IF EXISTS daily_logs_ibfk_1');
      await query('ALTER TABLE daily_logs ADD CONSTRAINT fk_daily_logs_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
      console.log('✅ Restricción en daily_logs actualizada.');
    } catch (e) {
      console.log('ℹ️ No se pudo actualizar daily_logs (el error es aceptable si no tiene FK).');
    }

    console.log('🎉 Reparación de integridad de datos completada.');

  } catch (error: any) {
    console.error('❌ Error reparando restricciones:', error.message);
  } finally {
    process.exit();
  }
}

main();
