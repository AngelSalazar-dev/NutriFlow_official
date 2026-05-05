const mysql = require('mysql2/promise');

const config = {
  host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3ZxNQLB5VbKt56g.root',
  password: '4BLpMj6H4QzcJ8oi',
  database: 'nutriflow',
  ssl: { rejectUnauthorized: true },
};

async function main() {
  console.log('🔌 Conectando a TiDB...');
  const conn = await mysql.createConnection(config);

  console.log('🛠️ Adding role column and support_tickets table...');
  
  try {
    await conn.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user'
    `);
    console.log('✅ Column role added (or already existed).');
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(36) COLLATE utf8mb4_unicode_ci PRIMARY KEY,
        user_id VARCHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
        subject VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        message TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
        status ENUM('open', 'pending', 'closed') COLLATE utf8mb4_unicode_ci DEFAULT 'open',
        priority ENUM('low', 'medium', 'high') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table support_tickets created.');

    // PROMOTE USERS
    const emails = ['founder@nutriflow.com', 'angeluqui2017@gmail.com', 'bot5659@example.com'];
    for (const email of emails) {
      await conn.query("UPDATE users SET role = 'admin' WHERE email = ?", [email]);
      console.log(`⭐ User ${email} is now ADMIN.`);
    }

  } catch (e) {
    console.error('❌ Error:', e);
  }

  await conn.end();
}

main();
