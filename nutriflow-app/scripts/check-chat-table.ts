/**
 * Check actual chat_messages table structure
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
    console.log('📋 Checking chat_messages table structure...\n');

    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'chat_messages'
      ORDER BY ORDINAL_POSITION
    `) as any[];

    console.log('Columns in chat_messages:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} (${col.IS_NULLABLE === 'YES' ? 'nullable' : 'not null'})`);
    });

    const [indexes] = await connection.query(`
      SHOW INDEX FROM chat_messages
    `) as any[];

    console.log('\nIndexes:');
    indexes.forEach((idx: any) => {
      console.log(`  - ${idx.Key_name}: ${idx.Column_name}`);
    });

    const [count] = await connection.query(`
      SELECT COUNT(*) as count FROM chat_messages
    `) as any[];

    console.log(`\n📊 Total messages: ${count[0].count}`);

  } finally {
    await connection.end();
  }
}

main().catch(console.error);
