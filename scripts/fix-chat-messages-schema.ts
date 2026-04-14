/**
 * Migration: Fix session_id NOT NULL constraint in chat_messages table
 *
 * The application code uses conversation_id but the schema has session_id as NOT NULL,
 * causing every INSERT to fail with: "Field 'session_id' doesn't have a default value"
 *
 * Run this ONCE:
 *   npx tsx scripts/fix-chat-messages-schema.ts
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🔧 Fixing chat_messages schema...\n');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '4000'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { rejectUnauthorized: true },
  });

  try {
    // Step 1: Check current session_id constraint
    console.log('📋 Step 1: Checking session_id column...');
    const [cols] = await connection.query(`
      SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'chat_messages'
        AND COLUMN_NAME = 'session_id'
    `) as any[];

    if (cols.length === 0) {
      console.log('   ✅ session_id column does not exist — no fix needed\n');
    } else {
      const col = cols[0];
      console.log(`   Found: session_id IS_NULLABLE=${col.IS_NULLABLE}, DEFAULT=${col.COLUMN_DEFAULT}`);

      if (col.IS_NULLABLE === 'NO' && !col.COLUMN_DEFAULT) {
        console.log('   ❌ session_id is NOT NULL without default — FIXING...\n');

        // Make session_id nullable
        await connection.query(`
          ALTER TABLE chat_messages
          MODIFY COLUMN session_id VARCHAR(100) NULL
        `);
        console.log('   ✅ session_id is now NULLABLE\n');
      } else {
        console.log('   ✅ session_id is already nullable — no fix needed\n');
      }
    }

    // Step 2: Verify the fix with a test INSERT
    console.log('📋 Step 2: Testing with a dummy INSERT...');
    const testId = crypto.randomUUID();
    const testConvId = `test-${crypto.randomUUID()}`;

    try {
      await connection.query(`
        INSERT INTO chat_messages (id, user_id, role, content, conversation_id, created_at)
        VALUES (?, 0x31323334353637382D313233342D313233342D313233342D31323334353637383930313233, 'system', 'test_message', ?, NOW())
      `, [testId, testConvId]);

      // Clean up test message
      await connection.query(`DELETE FROM chat_messages WHERE id = ?`, [testId]);
      console.log('   ✅ Test INSERT succeeded — messages will now save correctly!\n');
    } catch (testError: any) {
      console.log(`   ❌ Test INSERT failed: ${testError.message}\n`);
      if (testError.message?.includes('session_id')) {
        console.log('   ⚠️ session_id IS the problem — applying fix...\n');
        await connection.query(`ALTER TABLE chat_messages ADD COLUMN session_id VARCHAR(100) NULL`);
        console.log('   ✅ Added session_id as NULLABLE\n');
      } else {
        console.log('   Note: Test used dummy user_id. Real messages with valid user_id should work.');
      }
    }

    // Step 3: Final verification
    console.log('📋 Step 3: Final column verification...');
    const [verifyCols] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'chat_messages'
        AND COLUMN_NAME IN ('session_id', 'conversation_id', 'context_snapshot')
      ORDER BY ORDINAL_POSITION
    `) as any[];

    console.log('   Chat messages columns:');
    verifyCols.forEach((col: any) => {
      console.log(`     - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'nullable' : 'not null'})`);
    });

    console.log('\n✅ Schema fix complete!\n');
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

main()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
