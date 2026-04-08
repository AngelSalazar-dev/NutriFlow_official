/**
 * Create articles table and seed articles
 * Run: npx tsx scripts/create-articles-table.ts
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { query } from '@/lib/mysql';

async function createTable() {
  console.log('🔧 Creating articles table...');

  await query(`
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
    ) ENGINE=InnoDB
  `);

  console.log('✅ Articles table created');
}

createTable()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
