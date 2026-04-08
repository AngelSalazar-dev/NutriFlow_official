/**
 * Test chat history functionality
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
    console.log('📋 Testing chat history...\n');

    // Check all messages have conversation_id
    const [messages] = await connection.query(`
      SELECT 
        id, 
        user_id, 
        role, 
        LEFT(content, 50) as content_preview,
        conversation_id,
        JSON_EXTRACT(context_snapshot, '$.title') as title,
        created_at
      FROM chat_messages
      ORDER BY created_at DESC
      LIMIT 20
    `) as any[];

    console.log(`Found ${messages.length} recent messages:`);
    messages.forEach((msg: any, idx: number) => {
      console.log(`\n${idx + 1}. [${msg.role}] ${msg.content_preview}...`);
      console.log(`   conversation_id: ${msg.conversation_id || 'NULL'}`);
      console.log(`   title: ${msg.title || 'NULL'}`);
      console.log(`   created: ${msg.created_at}`);
    });

    // Check conversations grouping
    console.log('\n\n📊 Conversation groups:');
    const [conversations] = await connection.query(`
      SELECT
        conversation_id,
        COUNT(*) as message_count,
        MIN(created_at) as first_message,
        MAX(created_at) as last_message,
        LEFT(MAX(CASE WHEN role = 'user' THEN content END), 60) as last_user_message
      FROM chat_messages
      WHERE conversation_id IS NOT NULL
      GROUP BY conversation_id
      ORDER BY last_message DESC
      LIMIT 10
    `) as any[];

    conversations.forEach((conv: any, idx: number) => {
      console.log(`\nConversation ${idx + 1}:`);
      console.log(`  ID: ${conv.conversation_id}`);
      console.log(`  Messages: ${conv.message_count}`);
      console.log(`  First: ${conv.first_message}`);
      console.log(`  Last: ${conv.last_message}`);
      console.log(`  Last user msg: ${conv.last_user_message || '(none)'}`);
    });

  } finally {
    await connection.end();
  }
}

main().catch(console.error);
