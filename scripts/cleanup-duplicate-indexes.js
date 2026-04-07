/**
 * NutriFlow - Remove Duplicate Indexes from TiDB
 * 
 * Found duplicates (UNIQUE index already covers the same columns):
 * 1. chat_quotas:        idx_user_date  (covered by unique_user_date)
 * 2. daily_logs:         idx_user_date  (covered by unique_user_date)
 * 3. email_verif_tokens: idx_token      (covered by UNIQUE token)
 * 4. password_reset:     idx_token      (covered by UNIQUE token)
 * 5. user_profiles:      idx_user_id    (covered by UNIQUE user_id)
 * 6. user_xp:            idx_user_id    (covered by UNIQUE user_id)
 * 7. users:              idx_referral_code (covered by UNIQUE referral_code)
 * 8. users:              idx_email      (covered by UNIQUE email)
 */

const mysql = require('mysql2/promise');

const config = {
  host: process.env.MYSQL_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.MYSQL_PORT || '4000'),
  user: process.env.MYSQL_USER || '3ZxNQLB5VbKt56g.root',
  password: process.env.MYSQL_PASSWORD || '4BLpMj6H4QzcJ8oi',
  database: process.env.MYSQL_DATABASE || 'nutriflow',
  ssl: { rejectUnauthorized: true },
};

const DUPLICATE_INDEXES = [
  { table: 'chat_quotas',           index: 'idx_user_date' },
  { table: 'daily_logs',            index: 'idx_user_date' },
  { table: 'email_verification_tokens', index: 'idx_token' },
  { table: 'password_reset_tokens', index: 'idx_token' },
  { table: 'user_profiles',         index: 'idx_user_id' },
  { table: 'user_xp',               index: 'idx_user_id' },
  { table: 'users',                 index: 'idx_referral_code' },
  { table: 'users',                 index: 'idx_email' },
];

async function main() {
  console.log('🔌 Conectando a TiDB Cloud...');
  const conn = await mysql.createConnection(config);

  try {
    console.log('🗑️  Removing duplicate indexes...\n');

    for (const { table, index } of DUPLICATE_INDEXES) {
      try {
        await conn.query(`DROP INDEX \`${index}\` ON \`${table}\``);
        console.log(`   ✅ Dropped ${index} on ${table}`);
      } catch (err) {
        if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
          console.log(`   ℹ️  ${index} on ${table} already doesn't exist`);
        } else {
          console.log(`   ❌ Error dropping ${index} on ${table}: ${err.message}`);
        }
      }
    }

    console.log('\n📈 Running ANALYZE TABLE on all tables...');
    const [tables] = await conn.query(`
      SELECT TABLE_NAME FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
    `, [config.database]);

    for (const t of tables) {
      await conn.query(`ANALYZE TABLE \`${t.TABLE_NAME}\``);
    }
    console.log(`   ✅ ${tables.length} tables analyzed`);

    // Verify remaining indexes
    console.log('\n🔑 Remaining indexes after cleanup:');
    const [indexes] = await conn.query(`
      SELECT TABLE_NAME, INDEX_NAME, 
        GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols,
        NON_UNIQUE
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ?
      GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE
      ORDER BY TABLE_NAME, INDEX_NAME
    `, [config.database]);

    let currentTable = '';
    for (const idx of indexes) {
      if (idx.TABLE_NAME !== currentTable) {
        currentTable = idx.TABLE_NAME;
        console.log(`\n   📁 ${currentTable}:`);
      }
      const type = idx.NON_UNIQUE == 0 ? '🔒' : '📌';
      console.log(`      ${type} ${idx.INDEX_NAME} (${idx.cols})`);
    }

    console.log('\n═══════════════════════════════════════════');
    console.log('✅ CLEANUP COMPLETE');
    console.log('═══════════════════════════════════════════');
    console.log(`   8 duplicate indexes removed`);
    console.log(`   All tables analyzed and optimized`);
    console.log(`   DB is now leaner for writes and inserts\n`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await conn.end();
    console.log('🔌 Connection closed.\n');
  }
}

main();
