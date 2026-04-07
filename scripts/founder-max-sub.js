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

  const founderEmail = 'founder@nutriflow.com';

  // Get founder ID
  const [users] = await conn.query('SELECT id, name FROM users WHERE email = ?', [founderEmail]);
  const founder = users[0];
  console.log(`\n👤 ${founder.name} (${founder.id})`);

  // Update subscription to max
  await conn.query(`
    UPDATE subscriptions
    SET tier = 'pro',
        status = 'active',
        current_period_start = NOW(),
        current_period_end = '2099-12-31 23:59:59',
        cancel_at_period_end = 0
    WHERE user_id = ?
  `, [founder.id]);
  console.log('✅ Subscription updated: pro, active, until 2099-12-31');

  // Update user table
  await conn.query(`
    UPDATE users
    SET subscription_plan = 'pro',
        daily_calorie_target = 99999
    WHERE id = ?
  `, [founder.id]);
  console.log('✅ User updated: plan=pro, calories=99999');

  // Verify
  const [verify] = await conn.query(`
    SELECT u.name, u.subscription_plan, u.daily_calorie_target,
           s.tier, s.status, s.current_period_end, s.cancel_at_period_end
    FROM users u
    JOIN subscriptions s ON u.id = s.user_id
    WHERE u.email = ?
  `, [founderEmail]);

  const v = verify[0];
  console.log('\n═══════════════════════════════════════════');
  console.log('✅ FOUNDER - CUENTA AL MÁXIMO');
  console.log('═══════════════════════════════════════════');
  console.log(`   Nombre:          ${v.name}`);
  console.log(`   Plan (users):    ${v.subscription_plan}`);
  console.log(`   Plan (subs):     ${v.tier}`);
  console.log(`   Estado:          ${v.status}`);
  console.log(`   Calorías/día:    ${v.daily_calorie_target}`);
  console.log(`   Vence:           ${v.current_period_end}`);
  console.log(`   Auto-cancel:     ${v.cancel_at_period_end === 0 ? 'NO ✅' : 'SÍ ❌'}`);
  console.log('═══════════════════════════════════════════\n');

  await conn.end();
}

main();
