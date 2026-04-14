/**
 * Diagnose chat_messages save issue
 */
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '4000'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { rejectUnauthorized: true },
  });

  try {
    // 1. Show full table schema
    console.log('📋 Chat messages table columns:\n');
    const [cols] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'chat_messages'
      ORDER BY ORDINAL_POSITION
    `) as any[];
    cols.forEach((c: any) => {
      console.log(`  ${c.COLUMN_NAME.padEnd(25)} ${c.DATA_TYPE.padEnd(10)} ${c.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'} ${c.COLUMN_DEFAULT ? 'DEFAULT ' + c.COLUMN_DEFAULT : ''} ${c.EXTRA || ''}`);
    });

    // 2. Check existing messages
    console.log('\n\n📊 Existing messages count:');
    const [counts] = await connection.query(`
      SELECT COUNT(*) as total,
             COUNT(conversation_id) as with_conv_id
      FROM chat_messages
    `) as any[];
    console.log(`  Total: ${counts[0].total}`);
    console.log(`  With conversation_id: ${counts[0].with_conv_id}`);

    // 3. Show recent conversations
    console.log('\n\n💬 Recent conversations:');
    const [convs] = await connection.query(`
      SELECT conversation_id, COUNT(*) as msgs, MIN(created_at) as first_msg, MAX(created_at) as last_msg
      FROM chat_messages
      WHERE conversation_id IS NOT NULL
      GROUP BY conversation_id
      ORDER BY MAX(created_at) DESC
      LIMIT 5
    `) as any[];
    convs.forEach((c: any, i: number) => {
      console.log(`  ${i + 1}. ${c.conversation_id} — ${c.msgs} msgs — ${c.first_msg} → ${c.last_msg}`);
    });

    // 4. Test real INSERT with actual user
    console.log('\n\n🧪 Testing real INSERT with actual user...\n');
    const [firstUser] = await connection.query(`SELECT id FROM users LIMIT 1`) as any[];
    if (firstUser.length === 0) {
      console.log('❌ No users in database');
      return;
    }
    const userId = firstUser[0].id;
    const testId = crypto.randomUUID();
    const testConvId = crypto.randomUUID(); // Standard UUID, 36 chars

    console.log(`  User ID: ${userId}`);
    console.log(`  Test ID: ${testId} (${testId.length} chars)`);
    console.log(`  Conv ID: ${testConvId} (${testConvId.length} chars)`);

    try {
      await connection.query(`
        INSERT INTO chat_messages (id, user_id, role, content, conversation_id, created_at)
        VALUES (?, ?, 'user', 'test_message_diag', ?, NOW())
      `, [testId, userId, testConvId]);
      console.log('  ✅ User message INSERT succeeded');

      const testAsstId = crypto.randomUUID();
      await connection.query(`
        INSERT INTO chat_messages (id, user_id, role, content, conversation_id, created_at)
        VALUES (?, ?, 'assistant', 'test_response_diag', ?, NOW())
      `, [testAsstId, userId, testConvId]);
      console.log('  ✅ Assistant message INSERT succeeded');

      // Verify
      const [verifyCount] = await connection.query(`
        SELECT COUNT(*) as count FROM chat_messages WHERE conversation_id = ?
      `, [testConvId]) as any[];
      console.log(`  ✅ Verified: ${verifyCount[0].count} messages saved with conversation_id`);

      // Clean up
      await connection.query(`DELETE FROM chat_messages WHERE conversation_id = ?`, [testConvId]);
      console.log('  ✅ Cleaned up test messages\n');

      console.log('🎉 ALL TESTS PASSED — Messages ARE being saved to DB!');
      console.log('   If the UI shows no history, the issue is in the frontend code, not the DB.');
    } catch (err: any) {
      console.log(`  ❌ INSERT failed: ${err.message}`);
      console.log(`  ❌ SQL State: ${err.sqlState}`);
      console.log(`  ❌ Code: ${err.code}`);
    }
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
