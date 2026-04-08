/**
 * Backfill script: Auto-generate titles for existing conversations
 * 
 * This script finds all conversations without titles and generates one
 * from the first user message (truncated to 50 chars).
 * 
 * Run: npx tsx scripts/backfill-chat-titles.ts
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🚀 Starting chat titles backfill...\n');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '4000'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { rejectUnauthorized: true },
  });

  try {
    // Step 1: Find all conversations
    console.log('📋 Step 1: Finding all conversations...\n');
    const [conversations] = await connection.query(`
      SELECT
        conversation_id,
        COUNT(*) as message_count,
        MIN(created_at) as first_message_at
      FROM chat_messages
      WHERE conversation_id IS NOT NULL
      GROUP BY conversation_id
      ORDER BY first_message_at ASC
    `) as any[];

    console.log(`Found ${conversations.length} conversations\n`);

    let updated = 0;
    let skipped = 0;

    for (const conv of conversations) {
      const convId = conv.conversation_id;

      // Step 2: Check if this conversation already has a title
      console.log(`Processing conversation: ${convId}`);
      
      const [existingTitles] = await connection.query(`
        SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(context_snapshot, '$.title')) as title
        FROM chat_messages
        WHERE conversation_id = ? AND context_snapshot IS NOT NULL
      `, [convId]) as any[];

      const hasTitle = existingTitles.length > 0 && existingTitles[0].title !== null;

      if (hasTitle) {
        console.log(`   ⏭️  Already has title: "${existingTitles[0].title}"`);
        skipped++;
        continue;
      }

      // Step 3: Get first user message to generate title
      const [firstMessages] = await connection.query(`
        SELECT content
        FROM chat_messages
        WHERE conversation_id = ? AND role = 'user'
        ORDER BY created_at ASC
        LIMIT 1
      `, [convId]) as any[];

      if (firstMessages.length === 0) {
        console.log(`   ⚠️  No user messages found, skipping`);
        skipped++;
        continue;
      }

      // Generate title from first user message (first 50 chars)
      const rawContent = firstMessages[0].content as string;
      const title = rawContent.length > 50 ? rawContent.substring(0, 50) + '...' : rawContent;
      const contextSnapshot = JSON.stringify({ title });

      console.log(`   📝 Generated title: "${title}"`);

      // Step 4: Update all messages in this conversation with the title
      await connection.query(`
        UPDATE chat_messages
        SET context_snapshot = ?
        WHERE conversation_id = ?
      `, [contextSnapshot, convId]);

      updated++;
      console.log(`   ✅ Updated ${conv.message_count} messages\n`);
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Backfill completed!`);
    console.log(`   - Updated: ${updated} conversations`);
    console.log(`   - Skipped: ${skipped} conversations (already had titles)`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
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
