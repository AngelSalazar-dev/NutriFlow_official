/**
 * Test the conversations query directly against TiDB Cloud
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
    const userId = 'cd6a6535-67aa-485d-832c-5f8832ea847f';

    // 1. Raw count
    console.log('📋 Step 1: Count messages with conversation_id...');
    const [countRows] = await connection.query(`
      SELECT conversation_id, COUNT(*) as cnt, MIN(created_at) as first_msg
      FROM chat_messages
      WHERE user_id = ? AND conversation_id IS NOT NULL
      GROUP BY conversation_id
      ORDER BY first_msg DESC
    `, [userId]) as any[];

    console.log(`   Found ${countRows.length} conversations:`);
    countRows.forEach((r: any, i: number) => {
      console.log(`   ${i + 1}. conv_id=${r.conversation_id}, msgs=${r.cnt}, first=${r.first_msg}`);
    });

    // 2. Full query (same as API)
    console.log('\n📋 Step 2: Running the API query...');
    const convs = await connection.query(`
      SELECT
        cm.conversation_id as id,
        DATE_FORMAT(MAX(cm.created_at), '%Y-%m-%dT%H:%i:%sZ') as updatedAt,
        DATE_FORMAT(MIN(cm.created_at), '%Y-%m-%dT%H:%i:%sZ') as createdAt,
        COUNT(*) as messageCount,
        SUBSTRING(MAX(CASE WHEN cm.role = 'user' THEN cm.content END), 1, 80) as lastMessage
      FROM chat_messages cm
      WHERE cm.user_id = ? AND cm.conversation_id IS NOT NULL
      GROUP BY cm.conversation_id
      ORDER BY MAX(cm.created_at) DESC
      LIMIT 50
    `, [userId]) as any[];

    console.log(`   Query returned ${convs[0].length} rows`);
    convs[0].forEach((c: any, i: number) => {
      console.log(`   ${i + 1}. id=${c.id}, msgs=${c.messageCount}, last=${c.lastMessage?.substring(0, 50)}`);
    });

    // 3. Check if user_id type matches
    console.log('\n📋 Step 3: Check user_id types...');
    const [typeCheck] = await connection.query(`
      SELECT DISTINCT
        user_id,
        LENGTH(user_id) as id_length,
        HEX(user_id) as id_hex
      FROM chat_messages
      LIMIT 5
    `) as any[];
    typeCheck[0].forEach((r: any, i: number) => {
      console.log(`   ${i + 1}. user_id=${r.user_id}, len=${r.id_length}, hex=${r.id_hex}`);
    });

    console.log('\n✅ Done!\n');
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
