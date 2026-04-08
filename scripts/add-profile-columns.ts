import { query } from '../lib/mysql';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  console.log('🚀 Iniciando sincronización completa de esquema de base de datos...');

  // Cargar variables de entorno desde .env.local si es necesario
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
    // 1. Verificar columnas existentes
    console.log('📋 Verificando columnas actuales de la tabla users...');
    const [columns]: any = await query('DESCRIBE users');
    const columnNames = columns.map((col: any) => col.Field);

    const columnsToAdd = [
      // Perfil y Nutrición
      { name: 'bmr', definition: 'DECIMAL(10, 2) DEFAULT NULL' },
      { name: 'tdee', definition: 'DECIMAL(10, 2) DEFAULT NULL' },
      { name: 'protein_goal', definition: 'DECIMAL(10, 2) DEFAULT NULL' },
      { name: 'carb_goal', definition: 'DECIMAL(10, 2) DEFAULT NULL' },
      { name: 'fat_goal', definition: 'DECIMAL(10, 2) DEFAULT NULL' },
      
      // Suscripción
      { name: 'subscription_end', definition: 'DATETIME DEFAULT NULL' },
      { name: 'stripe_subscription_id', definition: 'VARCHAR(255) DEFAULT NULL' },
      
      // Avatar
      { name: 'avatar_url', definition: 'TEXT DEFAULT NULL' },
      { name: 'avatar_type', definition: 'ENUM("initials", "preset", "custom") DEFAULT "initials"' },
      
      // Referidos y Promociones
      { name: 'referral_code', definition: 'VARCHAR(20) DEFAULT NULL' },
      { name: 'referred_by', definition: 'VARCHAR(36) DEFAULT NULL' },
      { name: 'referral_credits', definition: 'INT DEFAULT 0' },
      { name: 'promo_code_id', definition: 'VARCHAR(36) DEFAULT NULL' },
      { name: 'promo_applied_at', definition: 'DATETIME DEFAULT NULL' },
      { name: 'promo_expires_at', definition: 'DATETIME DEFAULT NULL' },
      
      // AI Agent
      { name: 'ai_agent_api_key', definition: 'VARCHAR(64) DEFAULT NULL' },
      { name: 'ai_agent_enabled', definition: 'BOOLEAN DEFAULT FALSE' },
      { name: 'ai_agent_last_active', definition: 'DATETIME DEFAULT NULL' }
    ];

    for (const col of columnsToAdd) {
      if (!columnNames.includes(col.name)) {
        console.log(`➕ Agregando columna: ${col.name}`);
        try {
          await query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.definition}`);
          console.log(`✅ Columna ${col.name} agregada.`);
        } catch (alterError: any) {
          console.error(`❌ Error agregando ${col.name}: ${alterError.message}`);
        }
      } else {
        console.log(`ℹ️ La columna ${col.name} ya existe.`);
      }
    }

    console.log('🎉 Sincronización de esquema completada exitosamente.');
  } catch (error) {
    console.error('❌ Error crítico durante la migración:', error);
  } finally {
    process.exit();
  }
}

migrate();
