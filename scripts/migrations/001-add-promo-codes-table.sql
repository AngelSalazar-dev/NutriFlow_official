-- Migration: Add promo_codes table
-- Run: mysql -u root -p nutriflow_db < scripts/migrations/001-add-promo-codes-table.sql

CREATE TABLE IF NOT EXISTS promo_codes (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    plan_type ENUM('free', 'premium', 'pro') NOT NULL DEFAULT 'premium',
    duration_type ENUM('days', 'months', 'lifetime') NOT NULL DEFAULT 'months',
    duration_value INT NOT NULL DEFAULT 1,
    max_uses INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add promo_code_id to users table for tracking
ALTER TABLE users 
ADD COLUMN promo_code_id VARCHAR(36) DEFAULT NULL,
ADD COLUMN promo_applied_at DATETIME DEFAULT NULL,
ADD COLUMN promo_expires_at DATETIME DEFAULT NULL,
ADD INDEX idx_promo_code (promo_code_id);

-- Insert default promo codes for testing
INSERT INTO promo_codes (id, code, plan_type, duration_type, duration_value, max_uses, is_active) VALUES
(UUID(), 'BETA100', 'premium', 'lifetime', 0, 100, TRUE),
(UUID(), 'EARLYBIRD', 'premium', 'months', 12, 50, TRUE),
(UUID(), 'STUDENT', 'premium', 'months', 6, NULL, TRUE),
(UUID(), 'WELCOME7', 'premium', 'days', 7, NULL, TRUE),
(UUID(), 'PRO30', 'pro', 'days', 30, 25, TRUE);
