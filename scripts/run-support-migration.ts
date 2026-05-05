import { query } from '../lib/mysql';

async function main() {
  console.log('--- Migrating Support Tickets Table ---');
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('open', 'pending', 'closed') DEFAULT 'open',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ support_tickets table created or already exists.');

    // Add role column to users if not exists (for admin panel)
    const columns: any = await query("SHOW COLUMNS FROM users LIKE 'role'");
    if (columns.length === 0) {
      await query("ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'");
      console.log('✅ Added role column to users table.');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

main().then(() => process.exit(0));
