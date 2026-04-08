/**
 * Migration: Add conversation_id and context_snapshot to chat_messages table
 * 
 * This migration fixes the mismatch between the database schema (which had session_id)
 * and the application code (which uses conversation_id).
 * 
 * Run this ONCE to update your database schema:
 *   npx tsx scripts/migrate-chat-messages.ts
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🚀 Starting chat_messages migration...\n');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '4000'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  try {
    // Step 1: Check if conversation_id column already exists
    console.log('📋 Step 1: Checking if conversation_id column exists...');
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'chat_messages' 
        AND COLUMN_NAME = 'conversation_id'
    `) as any[];

    if (columns.length === 0) {
      console.log('   ❌ conversation_id column not found. Adding it...');
      await connection.query(`
        ALTER TABLE chat_messages 
        ADD COLUMN conversation_id VARCHAR(100) NULL AFTER session_id,
        ADD INDEX idx_conversation (user_id, conversation_id)
      `);
      console.log('   ✅ conversation_id column added successfully\n');
    } else {
      console.log('   ✅ conversation_id column already exists\n');
    }

    // Step 2: Check if context_snapshot column exists
    console.log('📋 Step 2: Checking if context_snapshot column exists...');
    const [contextCols] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'chat_messages' 
        AND COLUMN_NAME = 'context_snapshot'
    `) as any[];

    if (contextCols.length === 0) {
      console.log('   ❌ context_snapshot column not found. Adding it...');
      await connection.query(`
        ALTER TABLE chat_messages 
        ADD COLUMN context_snapshot JSON NULL AFTER conversation_id
      `);
      console.log('   ✅ context_snapshot column added successfully\n');
    } else {
      console.log('   ✅ context_snapshot column already exists\n');
    }

    // Step 3: Check if session_id column exists
    console.log('📋 Step 3: Checking if session_id column exists...');
    const [sessionCols] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'chat_messages' 
        AND COLUMN_NAME = 'session_id'
    `) as any[];

    if (sessionCols.length > 0) {
      console.log('   ⚠️  session_id column exists. Migrating data to conversation_id...');
      
      const [rows] = await connection.query(`
        SELECT id, session_id, conversation_id 
        FROM chat_messages 
        WHERE conversation_id IS NULL AND session_id IS NOT NULL
        LIMIT 1000
      `) as any[];

      if (rows.length > 0) {
        console.log(`   Found ${rows.length} messages to migrate...`);
        
        for (const row of rows) {
          await connection.query(`
            UPDATE chat_messages 
            SET conversation_id = ? 
            WHERE id = ?
          `, [row.session_id, row.id]);
        }
        
        console.log(`   ✅ Migrated ${rows.length} messages from session_id to conversation_id\n`);
      } else {
        console.log('   ✅ No messages to migrate (already migrated or empty table)\n');
      }
    } else {
      console.log('   ✅ session_id column does not exist (using conversation_id only)\n');
    }

    // Step 4: Verify the migration
    console.log('📋 Step 4: Verifying migration...');
    const [verifyCols] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'chat_messages' 
        AND COLUMN_NAME IN ('conversation_id', 'context_snapshot')
      ORDER BY ORDINAL_POSITION
    `) as any[];

    console.log('   Column verification:');
    verifyCols.forEach((col: any) => {
      console.log(`     - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'nullable' : 'not null'})`);
    });

    const [msgCount] = await connection.query(`
      SELECT COUNT(*) as count FROM chat_messages WHERE conversation_id IS NOT NULL
    `) as any[];
    console.log(`\n   📊 Messages with conversation_id: ${msgCount[0].count}`);

    console.log('\n✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main()
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
