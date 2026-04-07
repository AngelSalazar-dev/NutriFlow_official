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

  const email = 'angeluqui2017@gmail.com';

  // Get user
  const [users] = await conn.query('SELECT id, name, email, subscription_plan, daily_calorie_target FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    console.log('❌ Usuario no encontrado');
    await conn.end();
    return;
  }

  const u = users[0];
  console.log(`\n👤 ${u.name}`);
  console.log(`   Email: ${u.email}`);
  console.log(`   Plan actual: ${u.subscription_plan}`);
  console.log(`   Calorías: ${u.daily_calorie_target}`);

  // Update users table
  await conn.query(`
    UPDATE users
    SET subscription_plan = 'pro',
        daily_calorie_target = 99999
    WHERE id = ?
  `, [u.id]);
  console.log('\n✅ users → plan = pro, calories = 99999');

  // Check subscription
  const [subs] = await conn.query('SELECT * FROM subscriptions WHERE user_id = ?', [u.id]);
  const maxDate = '2099-12-31 23:59:59';
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (subs.length === 0) {
    await conn.query(`
      INSERT INTO subscriptions (user_id, tier, status, current_period_start, current_period_end, cancel_at_period_end)
      VALUES (?, 'pro', 'active', ?, ?, 0)
    `, [u.id, now, maxDate]);
    console.log('✅ subscription created → pro, active, 2099');
  } else {
    await conn.query(`
      UPDATE subscriptions
      SET tier = 'pro', status = 'active',
          current_period_start = ?, current_period_end = ?,
          cancel_at_period_end = 0, canceled_at = NULL
      WHERE user_id = ?
    `, [now, maxDate, u.id]);
    console.log('✅ subscription updated → pro, active, 2099');
  }

  // Verify
  const [verify] = await conn.query(`
    SELECT u.name, u.subscription_plan, u.daily_calorie_target,
           s.tier, s.status, s.current_period_end
    FROM users u LEFT JOIN subscriptions s ON u.id = s.user_id
    WHERE u.email = ?
  `, [email]);

  const v = verify[0];
  console.log('\n═══════════════════════════════════════════');
  console.log('✅ ANGEL SALAZAR — PLAN PRO ACTIVADO');
  console.log('═══════════════════════════════════════════');
  console.log(`   Nombre:    ${v.name}`);
  console.log(`   Plan:      ${v.subscription_plan} (máximo nivel)`);
  console.log(`   Calorías:  ${v.daily_calorie_target} kcal/día`);
  console.log(`   Sub:       ${v.tier} / ${v.status}`);
  console.log(`   Vence:     ${v.current_period_end}`);
  console.log('═══════════════════════════════════════════\n');

  await conn.end();
}

main();
