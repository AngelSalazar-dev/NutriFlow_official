-- Migration: Add revenue tracking tables for AI Agent revenue sharing
-- Run: mysql -u root -p nutriflow_db < scripts/migrations/003-add-revenue-tracking-tables.sql

-- Revenue records table
CREATE TABLE IF NOT EXISTS revenue_records (
    id VARCHAR(36) PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    source ENUM('subscription', 'adsense', 'affiliate', 'sponsorship', 'other') NOT NULL,
    owner_share DECIMAL(10, 2) NOT NULL,
    reinvestment_share DECIMAL(10, 2) NOT NULL,
    ai_operator_share DECIMAL(10, 2) NOT NULL,
    distributed BOOLEAN DEFAULT FALSE,
    payout_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    payout_date DATETIME DEFAULT NULL,
    metadata JSON DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_source (source),
    INDEX idx_distributed (distributed),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Revenue configuration table
CREATE TABLE IF NOT EXISTS revenue_config (
    id INT PRIMARY KEY,
    owner_percentage DECIMAL(5, 4) NOT NULL DEFAULT 0.7000,
    reinvestment_percentage DECIMAL(5, 4) NOT NULL DEFAULT 0.2000,
    ai_operator_percentage DECIMAL(5, 4) NOT NULL DEFAULT 0.1000,
    minimum_payout DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    payout_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payout accounts table
CREATE TABLE IF NOT EXISTS payout_accounts (
    id VARCHAR(36) PRIMARY KEY,
    user_type ENUM('owner', 'ai_operator') NOT NULL,
    payment_type ENUM('stripe', 'paypal', 'crypto') NOT NULL,
    account_details JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default revenue config
INSERT INTO revenue_config (id, owner_percentage, reinvestment_percentage, ai_operator_percentage, minimum_payout, payout_currency)
VALUES (1, 0.7000, 0.2000, 0.1000, 10.00, 'USD')
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Add AI agent API key to users table (for authentication)
ALTER TABLE users 
ADD COLUMN ai_agent_api_key VARCHAR(64) DEFAULT NULL,
ADD COLUMN ai_agent_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN ai_agent_last_active DATETIME DEFAULT NULL,
ADD INDEX idx_ai_agent_key (ai_agent_api_key);

-- Insert sample payout account for owner (update with your actual details)
-- INSERT INTO payout_accounts (id, user_type, payment_type, account_details, is_active)
-- VALUES (
--   UUID(),
--   'owner',
--   'stripe',
--   JSON_OBJECT('account_id', 'acct_YOUR_STRIPE_ACCOUNT_ID', 'email', 'tu@email.com'),
--   TRUE
-- );
