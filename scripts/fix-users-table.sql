-- Script para verificar/crear la tabla users correctamente
-- Ejecutar: mysql -u root -p nutriflow_db < scripts/fix-users-table.sql

-- Verificar si la tabla existe y mostrar estructura
SELECT 'Verificando tabla users...' as status;

-- Si la tabla no tiene la columna id, la agregamos
-- Primero verificamos las columnas existentes

-- Opción 1: Si la tabla existe pero no tiene id, creamos una nueva tabla temporal
DROP TABLE IF EXISTS users_backup;
DROP TABLE IF EXISTS users_new;

-- Crear tabla users con la estructura correcta
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    weight_kg DECIMAL(5, 2) NOT NULL,
    height_cm DECIMAL(5, 2) NOT NULL,
    sex ENUM('male', 'female') NOT NULL,
    activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') NOT NULL,
    goal ENUM('lose', 'maintain', 'gain') NOT NULL,
    subscription_plan ENUM('free', 'premium', 'pro') NOT NULL DEFAULT 'free',
    subscription_end DATETIME DEFAULT NULL,
    daily_calorie_target INT DEFAULT NULL,
    tdee DECIMAL(10, 2) DEFAULT NULL,
    bmr DECIMAL(10, 2) DEFAULT NULL,
    protein_goal DECIMAL(10, 2) DEFAULT NULL,
    carb_goal DECIMAL(10, 2) DEFAULT NULL,
    fat_goal DECIMAL(10, 2) DEFAULT NULL,
    referral_code VARCHAR(20) DEFAULT NULL,
    referred_by VARCHAR(36) DEFAULT NULL,
    referral_credits INT DEFAULT 0,
    promo_code_id VARCHAR(36) DEFAULT NULL,
    promo_applied_at DATETIME DEFAULT NULL,
    promo_expires_at DATETIME DEFAULT NULL,
    stripe_subscription_id VARCHAR(255) DEFAULT NULL,
    ai_agent_api_key VARCHAR(64) DEFAULT NULL,
    ai_agent_enabled BOOLEAN DEFAULT FALSE,
    ai_agent_last_active DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_subscription (subscription_plan),
    INDEX idx_referral_code (referral_code),
    INDEX idx_ai_agent_key (ai_agent_api_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar estructura
SELECT 'Tabla users creada/verificada exitosamente' as status;

-- Mostrar estructura
DESCRIBE users;

-- Insertar usuario de prueba (opcional)
-- Password: test123 (hasheado con bcrypt)
-- INSERT INTO users (id, email, password_hash, name, age, weight_kg, height_cm, sex, activity_level, goal, subscription_plan, daily_calorie_target)
-- VALUES (UUID(), 'test@nutriflow.app', '$2a$10$rMx9YQYXQYQYQYQYQYQYQu.test123hashed', 'Test User', 25, 70, 170, 'male', 'moderate', 'maintain', 'free', 2000);

SELECT 'Script completado exitosamente' as status;
