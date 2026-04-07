const mysql = require('mysql2/promise');

const config = {
  host: process.env.MYSQL_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.MYSQL_PORT || '4000'),
  user: process.env.MYSQL_USER || '3ZxNQLB5VbKt56g.root',
  password: process.env.MYSQL_PASSWORD || '4BLpMj6H4QzcJ8oi',
  database: process.env.MYSQL_DATABASE || 'nutriflow',
  ssl: { rejectUnauthorized: true },
};

async function main() {
  const conn = await mysql.createConnection(config);

  // Show subscriptions columns
  const [cols] = await conn.query(`
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'nutriflow' AND TABLE_NAME = 'subscriptions'
    ORDER BY ORDINAL_POSITION
  `);

  console.log('📁 subscriptions columns:');
  cols.forEach(c => {
    console.log(`   ${c.COLUMN_NAME.padEnd(35)} ${c.DATA_TYPE.padEnd(20)} ${c.IS_NULLABLE} ${c.COLUMN_DEFAULT || ''} ${c.EXTRA || ''}`);
  });

  // Show existing data
  console.log('\n📊 subscriptions data:');
  const [rows] = await conn.query('SELECT * FROM subscriptions');
  if (rows.length === 0) {
    console.log('   (empty table)');
  } else {
    rows.forEach(r => {
      console.log('   ', JSON.stringify(r, null, 2));
    });
  }

  await conn.end();
}

main();
