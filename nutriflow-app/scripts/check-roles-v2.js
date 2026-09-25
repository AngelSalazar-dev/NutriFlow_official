const mysql = require('mysql2/promise');

const config = {
  host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: 'REDACTED_USER',
  password: 'TU_PASSWORD_BD',
  database: 'nutriflow',
  ssl: { rejectUnauthorized: true },
};

async function main() {
  console.log('🔌 Conectando a TiDB...');
  const conn = await mysql.createConnection(config);

  const [users] = await conn.query(
    'SELECT id, name, email, role, subscription_plan FROM users'
  );

  console.log(`\n👥 Auditoría de Roles:\n`);
  users.forEach((u, i) => {
    console.log(`   ${i + 1}. ${u.email.padEnd(35)} | rol: ${u.role.padEnd(10)} | plan: ${u.subscription_plan}`);
  });

  await conn.end();
}

main();
