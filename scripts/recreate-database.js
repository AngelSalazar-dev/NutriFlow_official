// Script completo para recrear la base de datos NutriFlow
const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '200000Angelito+',
};

async function recreateDatabase() {
  let connection;
  
  try {
    console.log('🔌 Conectando a MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Conectado a MySQL\n');

    // 1. Eliminar base de datos existente
    console.log('🗑️  Eliminando base de datos existente...');
    await connection.query('DROP DATABASE IF EXISTS nutriflow_db');
    console.log('✅ Base de datos eliminada\n');

    // 2. Crear nueva base de datos
    console.log('📦 Creando nueva base de datos...');
    await connection.query('CREATE DATABASE nutriflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    await connection.query('USE nutriflow_db');
    console.log('✅ Base de datos nutriflow_db creada\n');

    // 3. Crear tabla users
    console.log('🔨 Creando tablas...');
    
    console.log('  - users');
    await connection.query(`
      CREATE TABLE users (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        age INT UNSIGNED CHECK (age >= 10 AND age <= 120),
        weight_kg DECIMAL(5,2) CHECK (weight_kg >= 20 AND weight_kg <= 400),
        height_cm DECIMAL(5,2) CHECK (height_cm >= 50 AND height_cm <= 280),
        sex ENUM('male', 'female') DEFAULT NULL,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_email (email),
        INDEX idx_subscription (subscription_plan)
      ) ENGINE=InnoDB;
    `);

    console.log('  - food_entries');
    await connection.query(`
      CREATE TABLE food_entries (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        food_id CHAR(36) DEFAULT NULL,
        custom_food_name VARCHAR(200) DEFAULT NULL,
        calories DECIMAL(8,2) NOT NULL,
        protein_g DECIMAL(8,2) NOT NULL DEFAULT 0,
        carbs_g DECIMAL(8,2) NOT NULL DEFAULT 0,
        fat_g DECIMAL(8,2) NOT NULL DEFAULT 0,
        serving_size VARCHAR(50) NOT NULL,
        servings DECIMAL(5,2) DEFAULT 1.00,
        meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
        entry_date DATE NOT NULL,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_date (user_id, entry_date),
        INDEX idx_meal (meal_type)
      ) ENGINE=InnoDB;
    `);

    console.log('  - daily_logs');
    await connection.query(`
      CREATE TABLE daily_logs (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        log_date DATE NOT NULL,
        total_calories DECIMAL(10,2) DEFAULT 0,
        total_protein_g DECIMAL(10,2) DEFAULT 0,
        total_carbs_g DECIMAL(10,2) DEFAULT 0,
        total_fat_g DECIMAL(10,2) DEFAULT 0,
        total_water_ml INT UNSIGNED DEFAULT 0,
        exercise_minutes INT UNSIGNED DEFAULT 0,
        exercise_calories_burned INT UNSIGNED DEFAULT 0,
        weight_kg DECIMAL(5,2) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_date (user_id, log_date)
      ) ENGINE=InnoDB;
    `);

    console.log('  - water_logs');
    await connection.query(`
      CREATE TABLE water_logs (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        amount_ml INT UNSIGNED NOT NULL,
        log_date DATE NOT NULL,
        log_time TIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_date (user_id, log_date)
      ) ENGINE=InnoDB;
    `);

    console.log('  - exercise_logs');
    await connection.query(`
      CREATE TABLE exercise_logs (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        exercise_name VARCHAR(200) NOT NULL,
        exercise_type ENUM('strength', 'cardio', 'flexibility', 'hiit') NOT NULL,
        met_value DECIMAL(4,1) DEFAULT 0,
        duration_min DECIMAL(5,2) DEFAULT 0,
        calories_burned DECIMAL(8,2) DEFAULT 0,
        sets_data JSON DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        log_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_date (user_id, log_date)
      ) ENGINE=InnoDB;
    `);

    console.log('  - chat_messages');
    await connection.query(`
      CREATE TABLE chat_messages (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        role ENUM('user', 'assistant', 'system') NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (user_id, created_at)
      ) ENGINE=InnoDB;
    `);

    console.log('  - ai_chat_usage');
    await connection.query(`
      CREATE TABLE ai_chat_usage (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        usage_date DATE NOT NULL,
        message_count INT UNSIGNED DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_date (user_id, usage_date)
      ) ENGINE=InnoDB;
    `);

    console.log('  - food_database');
    await connection.query(`
      CREATE TABLE food_database (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(200) NOT NULL,
        brand VARCHAR(100) DEFAULT NULL,
        calories DECIMAL(8,2) NOT NULL DEFAULT 0,
        protein_g DECIMAL(8,2) NOT NULL DEFAULT 0,
        carbs_g DECIMAL(8,2) NOT NULL DEFAULT 0,
        fat_g DECIMAL(8,2) NOT NULL DEFAULT 0,
        serving_size VARCHAR(50) DEFAULT '100g',
        serving_weight_g DECIMAL(8,2) DEFAULT 100,
        category VARCHAR(50) DEFAULT 'other',
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_name (name),
        INDEX idx_category (category)
      ) ENGINE=InnoDB;
    `);

    console.log('  - articles');
    await connection.query(`
      CREATE TABLE articles (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        summary TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        is_premium BOOLEAN DEFAULT FALSE,
        read_time_minutes INT UNSIGNED DEFAULT 5,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_category (category),
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB;
    `);

    console.log('  - subscriptions');
    await connection.query(`
      CREATE TABLE subscriptions (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        stripe_session_id VARCHAR(255) UNIQUE,
        stripe_subscription_id VARCHAR(255) DEFAULT NULL,
        plan ENUM('premium', 'pro') NOT NULL,
        amount_cents INT UNSIGNED NOT NULL,
        status ENUM('pending', 'active', 'cancelled', 'expired') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB;
    `);

    console.log('  - sessions');
    await connection.query(`
      CREATE TABLE sessions (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        token VARCHAR(500) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token)
      ) ENGINE=InnoDB;
    `);

    console.log('✅ Todas las tablas creadas\n');

    // 4. Insertar datos de ejemplo
    console.log('📝 Insertando datos de ejemplo...');
    
    // Alimentos
    console.log('  - Alimentos');
    const foods = [
      ['Pechuga de Pollo', 165, 31, 0, 3.6, '100g', 'Proteína'],
      ['Arroz Integral', 112, 2.6, 24, 0.9, '100g', 'Carbohidrato'],
      ['Brócoli', 34, 2.8, 7, 0.4, '100g', 'Verdura'],
      ['Huevo', 155, 13, 1.1, 11, '100g', 'Proteína'],
      ['Plátano', 89, 1.1, 23, 0.3, '100g', 'Fruta'],
      ['Avena', 68, 2.4, 12, 1.4, '100g', 'Carbohidrato'],
      ['Salmón', 208, 20, 0, 13, '100g', 'Proteína'],
      ['Yogurt Griego', 97, 9, 3.6, 5, '100g', 'Lácteo'],
      ['Aguacate', 160, 2, 9, 15, '100g', 'Grasa'],
      ['Manzana', 52, 0.3, 14, 0.2, '100g', 'Fruta'],
    ];

    for (const food of foods) {
      const id = require('crypto').randomUUID();
      await connection.query(
        `INSERT INTO food_database (id, name, calories, protein_g, carbs_g, fat_g, serving_size, category, is_verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [id, ...food]
      );
    }

    // Artículos
    console.log('  - Artículos');
    const articles = [
      [
        'Entendiendo los Macronutrientes',
        'entendiendo-macronutrientes',
        'Aprende sobre proteínas, carbohidratos y grasas.',
        'Los macronutrientes son nutrientes esenciales...\n\n## Proteínas\nEsenciales para músculos...\n\n## Carbohidratos\nFuente de energía...\n\n## Grasas\nImportantes para hormonas...',
        'basics',
        false,
        5,
      ],
      [
        'Guía de Hidratación',
        'guia-hidratacion',
        '¿Cuánta agua debes tomar al día?',
        'La hidratación es fundamental...\n\n## ¿Cuánta agua?\nRecomendación general: 2-3 litros...\n\n## Señales de deshidratación\nDolor de cabeza, fatiga...',
        'basics',
        false,
        3,
      ],
    ];

    for (const article of articles) {
      const id = require('crypto').randomUUID();
      await connection.query(
        `INSERT INTO articles (id, title, slug, summary, content, category, is_premium, read_time_minutes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, ...article]
      );
    }

    console.log('✅ Datos de ejemplo insertados\n');

    // 5. Crear usuario admin
    console.log('👤 Creando usuario admin...');
    const bcrypt = require('bcryptjs');
    const crypto = require('crypto');
    
    const adminEmail = 'admin@nutriflow.com';
    const adminPassword = '200000Angelito+';
    const adminName = 'Admin NutriFlow';
    const adminId = crypto.randomUUID();
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await connection.query(`
      INSERT INTO users (id, email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, goal, subscription_plan)
      VALUES (?, ?, ?, ?, 25, 70, 170, 'male', 'moderate', 'maintain', 'free')
    `, [adminId, adminEmail, hashedPassword, adminName]);
    
    console.log(`✅ Usuario admin creado: ${adminEmail}\n`);

    // 6. Resumen final
    console.log('='.repeat(60));
    console.log('✅ BASE DE DATOS NUTRIFLOW CREADA EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('\n📊 Tablas creadas: 10');
    console.log('🍎 Alimentos de ejemplo: 10');
    console.log('📰 Artículos: 2');
    console.log('👤 Usuarios: 1 (admin)\n');
    
    console.log('🔑 Credenciales de acceso:');
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Contraseña: ${adminPassword}\n`);
    
    console.log('🚀 Próximos pasos:');
    console.log('   1. Ve a http://localhost:3000/login');
    console.log('   2. Inicia sesión con las credenciales de arriba');
    console.log('   3. ¡Listo! El dashboard debería funcionar correctamente\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Código:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL no está corriendo. Inicia el servicio.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Contraseña incorrecta. Verifica .env.local');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('👋 Conexión cerrada');
    }
  }
}

recreateDatabase();
