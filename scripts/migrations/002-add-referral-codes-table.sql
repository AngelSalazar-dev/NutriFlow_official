-- Migration: Add referral_codes table for ambassador program
-- Run: mysql -u root -p nutriflow_db < scripts/migrations/002-add-referral-codes-table.sql

CREATE TABLE IF NOT EXISTS referral_codes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_code (code),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS referrals (
    id VARCHAR(36) PRIMARY KEY,
    referrer_id VARCHAR(36) NOT NULL,
    referred_user_id VARCHAR(36) NOT NULL,
    referral_code VARCHAR(20) NOT NULL,
    rewarded BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_referrer (referrer_id),
    INDEX idx_referred (referred_user_id),
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add referral tracking to users
ALTER TABLE users 
ADD COLUMN referral_code VARCHAR(20) DEFAULT NULL,
ADD COLUMN referred_by VARCHAR(36) DEFAULT NULL,
ADD COLUMN referral_credits INT DEFAULT 0,
ADD INDEX idx_referral_code (referral_code);
