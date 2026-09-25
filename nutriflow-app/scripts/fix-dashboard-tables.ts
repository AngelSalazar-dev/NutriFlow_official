/**
 * Fix missing dashboard tables
 * Run: npx tsx scripts/fix-dashboard-tables.ts
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

import { query, closePool } from '../lib/mysql';

async function fixTables() {
  console.log('🔧 Fixing missing dashboard tables...\n');

  const tables = [
    // food_logs table
    `CREATE TABLE IF NOT EXISTS food_logs (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      food_name VARCHAR(255) NOT NULL,
      calories INT NOT NULL DEFAULT 0,
      protein_g DECIMAL(5,2) NOT NULL DEFAULT 0,
      carbs_g DECIMAL(5,2) NOT NULL DEFAULT 0,
      fat_g DECIMAL(5,2) NOT NULL DEFAULT 0,
      meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') DEFAULT 'snack',
      log_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_date (user_id, log_date),
      INDEX idx_date (log_date)
    )`,

    // daily_logs table
    `CREATE TABLE IF NOT EXISTS daily_logs (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      log_date DATE NOT NULL,
      total_calories INT NOT NULL DEFAULT 0,
      total_protein DECIMAL(5,2) NOT NULL DEFAULT 0,
      total_carbs DECIMAL(5,2) NOT NULL DEFAULT 0,
      total_fat DECIMAL(5,2) NOT NULL DEFAULT 0,
      exercise_calories_burned INT NOT NULL DEFAULT 0,
      water_ml INT NOT NULL DEFAULT 0,
      weight_kg DECIMAL(5,2),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_date (user_id, log_date),
      INDEX idx_user_date (user_id, log_date)
    )`,

    // water_logs table (alias for water_entries if it exists)
    `CREATE TABLE IF NOT EXISTS water_logs (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      amount_ml INT NOT NULL,
      log_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_date (user_id, log_date),
      INDEX idx_date (log_date)
    )`,
  ];

  console.log(`📝 Found ${tables.length} tables to create\n`);

  for (let i = 0; i < tables.length; i++) {
    const sql = tables[i];
    try {
      await query(sql);
      console.log(`✅ [${i + 1}/${tables.length}] Table created successfully`);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`⚠️  [${i + 1}/${tables.length}] Table already exists, skipping`);
      } else {
        console.error(`❌ [${i + 1}/${tables.length}] Error:`, error.message);
        throw error;
      }
    }
  }

  console.log('\n✨ Dashboard tables created successfully!');
  console.log('\n📊 Tables created:');
  console.log('  - food_logs');
  console.log('  - daily_logs');
  console.log('  - water_logs\n');
}

fixTables()
  .then(async () => {
    await closePool();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Fix failed:', error);
    await closePool();
    process.exit(1);
  });
