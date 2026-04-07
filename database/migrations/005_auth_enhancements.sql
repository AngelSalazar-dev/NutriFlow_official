-- ============================================
-- NUTRIFLOW AUTHENTICATION ENHANCEMENTS
-- Migration: Email verification & Password reset
-- ============================================

-- Table for email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at),
    INDEX idx_user (user_id)
);

-- Table for password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at),
    INDEX idx_user (user_id)
);

-- Add email_verified column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Add email_verified_at column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP NULL;

-- Add last_login column for session tracking
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL;

-- Add login_attempts column for additional security
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0;

-- Add locked_until column for account lockout
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP NULL;

-- Update existing users to have email_verified = TRUE (backward compatibility)
UPDATE users SET email_verified = TRUE, email_verified_at = NOW() 
WHERE email_verified IS NULL OR email_verified = FALSE;
