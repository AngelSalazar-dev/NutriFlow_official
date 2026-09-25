/**
 * Test chat conversations API
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
    console.log('📋 Testing conversation listing with titles...\n');

    // Simulate the conversation list query
    const userId = 'test-user-id'; // We'll just check structure
    
    const [convs] = await connection.query(`
      SELECT
        cm.conversation_id as id,
        DATE_FORMAT(MAX(cm.created_at), '%Y-%m-%dT%H:%i:%sZ') as updatedAt,
        DATE_FORMAT(MIN(cm.created_at), '%Y-%m-%dT%H:%i:%sZ') as createdAt,
        COUNT(*) as messageCount,
        SUBSTRING(MAX(CASE WHEN cm.role = 'user' THEN cm.content END), 1, 80) as lastMessage,
        JSON_UNQUOTE(JSON_EXTRACT(MAX(COALESCE(cm.context_snapshot, '{}')), '$.title')) as title
      FROM chat_messages cm
      WHERE cm.conversation_id IS NOT NULL
      GROUP BY cm.conversation_id
      ORDER BY MAX(cm.created_at) DESC
      LIMIT 50
    `) as any[];

    console.log(`Found ${convs.length} conversations:\n`);
    
    convs.forEach((conv: any, idx: number) => {
      console.log(`${idx + 1}. Conversation ID: ${conv.id}`);
      console.log(`   Title: ${conv.title || '(using lastMessage)'}`);
      console.log(`   Last Message: ${conv.lastMessage?.substring(0, 60)}...`);
      console.log(`   Messages: ${conv.messageCount}`);
      console.log(`   Created: ${conv.createdAt}`);
      console.log(`   Updated: ${conv.updatedAt}\n`);
    });

  } finally {
    await connection.end();
  }
}

main().catch(console.error);
