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

  // List all users
  const [users] = await conn.query(`
    SELECT id, email, name, subscription_plan, daily_calorie_target, created_at
    FROM users
    ORDER BY created_at DESC
  `);

  console.log('\n👥 TODOS LOS USUARIOS:');
  console.log('─'.repeat(90));
  users.forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.name.padEnd(25)} ${u.email.padEnd(35)} Plan: ${u.subscription_plan.padEnd(6)} Cal: ${u.daily_calorie_target}`);
  });

  console.log('\n═══════════════════════════════════════════');
  console.log('¿A qué usuario quieres darle plan PRO?');
  console.log('Escribe el nombre o email exacto, o "founder" para el fundador.');
  console.log('═══════════════════════════════════════════');

  await conn.end();
}

main();
