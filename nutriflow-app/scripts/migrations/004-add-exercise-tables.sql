-- Migration script to add exercise and routines tables
-- Run: mysql -u root -p nutriflow_db < scripts/migrations/004-add-exercise-tables.sql

-- Create exercise_logs table
CREATE TABLE IF NOT EXISTS exercise_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    exercise_name VARCHAR(255) NOT NULL,
    exercise_type ENUM('strength', 'cardio', 'flexibility', 'balance', 'mixed') DEFAULT 'strength',
    muscle_groups JSON,
    sets_data JSON,
    met_value DECIMAL(5, 2) NOT NULL,
    duration_min INT DEFAULT 0,
    calories_burned DECIMAL(10, 2) DEFAULT 0,
    notes TEXT DEFAULT '',
    log_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_date (log_date),
    INDEX idx_exercise (exercise_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create routines table
CREATE TABLE IF NOT EXISTS routines (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    day_of_week INT DEFAULT NULL,
    exercises JSON,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_day (day_of_week),
    INDEX idx_favorite (is_favorite)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Exercise and routines tables created successfully!' as status;
