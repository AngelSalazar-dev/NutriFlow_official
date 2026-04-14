-- =============================================
-- NUTRIFLOW DATABASE SCHEMA
-- MySQL 8.0+
-- =============================================

CREATE DATABASE IF NOT EXISTS nutriflow_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE nutriflow_db;

-- =============================================
-- TABLA: users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
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
    INDEX idx_subscription (subscription_plan),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: settings (configuración del usuario)
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    water_goal_ml INT UNSIGNED DEFAULT 2500,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    theme ENUM('light', 'dark', 'system') DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: food_database (catálogo de alimentos)
-- =============================================
CREATE TABLE IF NOT EXISTS food_database (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100) DEFAULT NULL,
    calories DECIMAL(8,2) NOT NULL DEFAULT 0,
    protein_g DECIMAL(8,2) NOT NULL DEFAULT 0,
    carbs_g DECIMAL(8,2) NOT NULL DEFAULT 0,
    fat_g DECIMAL(8,2) NOT NULL DEFAULT 0,
    fiber_g DECIMAL(8,2) DEFAULT 0,
    sugar_g DECIMAL(8,2) DEFAULT 0,
    sodium_mg DECIMAL(8,2) DEFAULT 0,
    serving_size VARCHAR(50) DEFAULT '100g',
    serving_weight_g DECIMAL(8,2) DEFAULT 100,
    category ENUM('protein', 'carbs', 'vegetable', 'fruit', 'dairy', 'fat', 'nuts', 'beverage', 'snack', 'other') DEFAULT 'other',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_category (category),
    FULLTEXT INDEX ft_search (name, brand)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: food_entries (registros de comida del usuario)
-- =============================================
CREATE TABLE IF NOT EXISTS food_entries (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    food_id CHAR(36) DEFAULT NULL,
    custom_food_name VARCHAR(200) DEFAULT NULL,
    calories DECIMAL(8,2) NOT NULL,
    protein_g DECIMAL(8,2) NOT NULL DEFAULT 0,
    carbs_g DECIMAL(8,2) NOT NULL DEFAULT 0,
    fat_g DECIMAL(8,2) NOT NULL DEFAULT 0,
    fiber_g DECIMAL(8,2) DEFAULT 0,
    serving_size VARCHAR(50) NOT NULL,
    servings DECIMAL(5,2) DEFAULT 1.00,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    entry_date DATE NOT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food_database(id) ON DELETE SET NULL,
    INDEX idx_user_date (user_id, entry_date),
    INDEX idx_meal (meal_type),
    INDEX idx_date (entry_date)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: daily_logs (resumen diario)
-- =============================================
CREATE TABLE IF NOT EXISTS daily_logs (
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
    mood ENUM('great', 'good', 'okay', 'bad', 'terrible') DEFAULT NULL,
    sleep_hours DECIMAL(4,2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, log_date),
    INDEX idx_user (user_id),
    INDEX idx_date (log_date)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: water_logs (registro de hidratación)
-- =============================================
CREATE TABLE IF NOT EXISTS water_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    amount_ml INT UNSIGNED NOT NULL,
    log_date DATE NOT NULL,
    log_time TIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, log_date)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: exercise_logs (registro de ejercicios)
-- =============================================
CREATE TABLE IF NOT EXISTS exercise_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    exercise_name VARCHAR(200) NOT NULL,
    exercise_type ENUM('strength', 'cardio', 'flexibility', 'hiit') NOT NULL,
    muscle_groups JSON DEFAULT NULL,
    met_value DECIMAL(4,1) DEFAULT 0,
    duration_min DECIMAL(5,2) DEFAULT 0,
    calories_burned DECIMAL(8,2) DEFAULT 0,
    sets_data JSON DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, log_date),
    INDEX idx_type (exercise_type)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: chat_messages (historial de chat IA)
-- =============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    session_id VARCHAR(100) NULL,
    conversation_id VARCHAR(100) NULL,
    context_snapshot JSON NULL,
    role ENUM('user', 'assistant', 'system') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_session (user_id, session_id),
    INDEX idx_conversation (user_id, conversation_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: ai_chat_usage (uso diario de IA)
-- =============================================
CREATE TABLE IF NOT EXISTS ai_chat_usage (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    usage_date DATE NOT NULL,
    message_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, usage_date),
    INDEX idx_date (usage_date)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: articles (artículos educativos)
-- =============================================
CREATE TABLE IF NOT EXISTS articles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    category ENUM('basics', 'weight_management', 'advanced', 'recipes', 'tips') NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    author_name VARCHAR(100) DEFAULT NULL,
    author_credentials VARCHAR(200) DEFAULT NULL,
    read_time_minutes INT UNSIGNED DEFAULT 5,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_premium (is_premium),
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: subscriptions (transacciones de pago)
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) DEFAULT NULL,
    plan ENUM('premium', 'pro') NOT NULL,
    amount_cents INT UNSIGNED NOT NULL,
    currency VARCHAR(10) DEFAULT 'usd',
    status ENUM('pending', 'active', 'cancelled', 'expired', 'failed') DEFAULT 'pending',
    current_period_start TIMESTAMP DEFAULT NULL,
    current_period_end TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_stripe_session (stripe_session_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: sessions (sesiones de usuario)
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: promo_codes (códigos promocionales)
-- =============================================
CREATE TABLE IF NOT EXISTS promo_codes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    max_uses INT UNSIGNED DEFAULT 1,
    used_count INT UNSIGNED DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- =============================================
-- TABLA: referrals (referidos)
-- =============================================
CREATE TABLE IF NOT EXISTS referrals (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    referrer_id CHAR(36) NOT NULL,
    referred_id CHAR(36) NOT NULL,
    referral_code VARCHAR(50) NOT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_referrer (referrer_id),
    INDEX idx_code (referral_code)
) ENGINE=InnoDB;

-- =============================================
-- DATOS SEMILLA: Catálogo de Alimentos
-- =============================================
INSERT INTO food_database (id, name, calories, protein_g, carbs_g, fat_g, fiber_g, serving_size, category, is_verified) VALUES
(UUID(), 'Pechuga de Pollo', 165, 31, 0, 3.6, 0, '100g', 'protein', TRUE),
(UUID(), 'Arroz Integral', 112, 2.6, 24, 0.9, 1.8, '100g', 'carbs', TRUE),
(UUID(), 'Brócoli', 34, 2.8, 7, 0.4, 2.6, '100g', 'vegetable', TRUE),
(UUID(), 'Salmón', 208, 20, 0, 13, 0, '100g', 'protein', TRUE),
(UUID(), 'Huevo', 155, 13, 1.1, 11, 0, '100g', 'protein', TRUE),
(UUID(), 'Avena', 68, 2.4, 12, 1.4, 1.7, '100g', 'carbs', TRUE),
(UUID(), 'Plátano', 89, 1.1, 23, 0.3, 2.6, '100g', 'fruit', TRUE),
(UUID(), 'Yogurt Griego', 97, 9, 3.6, 5, 0, '100g', 'dairy', TRUE),
(UUID(), 'Aguacate', 160, 2, 9, 15, 7, '100g', 'fat', TRUE),
(UUID(), 'Quinoa', 120, 4.4, 21, 1.9, 2.8, '100g', 'carbs', TRUE),
(UUID(), 'Almendras', 579, 21, 22, 50, 12, '100g', 'nuts', TRUE),
(UUID(), 'Espinaca', 23, 2.9, 3.6, 0.4, 2.2, '100g', 'vegetable', TRUE),
(UUID(), 'Camote', 86, 1.6, 20, 0.1, 3, '100g', 'carbs', TRUE),
(UUID(), 'Atún', 132, 28, 0, 1.3, 0, '100g', 'protein', TRUE),
(UUID(), 'Manzana', 52, 0.3, 14, 0.2, 2.4, '100g', 'fruit', TRUE),
(UUID(), 'Leche Descremada', 34, 3.4, 5, 0.1, 0, '100ml', 'dairy', TRUE),
(UUID(), 'Carne de Res Magra', 250, 26, 0, 15, 0, '100g', 'protein', TRUE),
(UUID(), 'Pasta Integral', 124, 5, 25, 1.1, 3, '100g', 'carbs', TRUE),
(UUID(), 'Aceite de Oliva', 884, 0, 0, 100, 0, '100ml', 'fat', TRUE),
(UUID(), 'Naranja', 47, 0.9, 12, 0.1, 2.4, '100g', 'fruit', TRUE);

-- =============================================
-- DATOS SEMILLA: Artículos
-- =============================================
INSERT INTO articles (id, title, slug, summary, content, category, is_premium) VALUES
(UUID(), 'Entendiendo los Macronutrientes', 'entendiendo-macronutrientes',
'Aprende sobre proteínas, carbohidratos y grasas - los tres macronutrientes esenciales.',
'Los macronutrientes son los nutrientes que tu cuerpo necesita en grandes cantidades para funcionar correctamente...\n\n## Proteínas\nLas proteínas son esenciales para la reparación y crecimiento muscular...\n\n## Carbohidratos\nLos carbohidratos son la principal fuente de energía...\n\n## Grasas\nLas grasas saludables son importantes para la absorción de vitaminas...',
'basics', FALSE),
(UUID(), 'La Ciencia del Balance Calórico', 'ciencia-balance-calorico',
'Descubre cómo funcionan las calorías y cómo manejar tu balance energético.',
'El balance calórico es la relación entre las calorías consumidas y las calorías quemadas...\n\n## Déficit Calórico\nPara perder peso, necesitas consumir menos calorías de las que quemas...\n\n## Superávit Calórico\nPara ganar peso, necesitas consumir más calorías de las que quemas...',
'weight_management', FALSE),
(UUID(), 'Estrategias Avanzadas de Timing de Comidas', 'timing-comidas-avanzado',
'Aprende cómo el timing de tus comidas puede optimizar tus resultados.',
'Aunque la ingesta total importa más, el timing de las comidas puede proporcionar una ventaja adicional...',
'advanced', TRUE);

-- =============================================
-- TABLA: notifications (notificaciones del usuario)
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'daily_tip',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_type (type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- =============================================
-- VERIFICACIÓN
-- =============================================
SELECT 'Database created successfully!' AS status;
SHOW TABLES;
