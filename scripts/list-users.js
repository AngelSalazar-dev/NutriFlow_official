const mysql = require('mysql2/promise');

const config = {
  host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3ZxNQLB5VbKt56g.root',
  password: '4BLpMj6H4QzcJ8oi',
  database: 'nutriflow',
  ssl: { rejectUnauthorized: true },
};

async function main() {
  console.log('🔌 Conectando a TiDB...');
  const conn = await mysql.createConnection(config);

  const [users] = await conn.query(
    'SELECT id, name, email, subscription_plan, created_at FROM users ORDER BY created_at DESC'
  );

  console.log(`\n👥 Total usuarios: ${users.length}\n`);
  users.forEach((u, i) => {
    console.log(`   ${i + 1}. ${u.name.padEnd(25)} | ${u.email.padEnd(35)} | plan: ${u.subscription_plan} | creado: ${u.created_at}`);
  });

  await conn.end();
}

main();
