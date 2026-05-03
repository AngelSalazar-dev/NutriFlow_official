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

  // Find Nanci by email
  const [users] = await conn.query(
    'SELECT id, name, email, subscription_plan FROM users WHERE email = ?',
    ['luquev2013@gmail.com']
  );

  if (users.length === 0) {
    console.log('❌ No se encontró el usuario luquev2013@gmail.com');
    await conn.end();
    return;
  }

  console.log(`\n🔍 Se encontraron ${users.length} usuario(s) que coinciden:`);
  users.forEach((u, i) => {
    console.log(`   ${i + 1}. ${u.name} (${u.email}) — plan: ${u.subscription_plan}`);
  });

  if (users.length > 1) {
    console.log('\n⚠️ Múltiples usuarios encontrados. Usando el primero.');
  }

  const nanci = users[0];
  console.log(`\n👤 Actualizando cuenta de: ${nanci.name} (${nanci.email})`);

  // Update or insert subscription record
  const [existingSub] = await conn.query(
    'SELECT id FROM subscriptions WHERE user_id = ?',
    [nanci.id]
  );

  if (existingSub.length > 0) {
    // Update existing subscription
    await conn.query(
      `UPDATE subscriptions
       SET tier = 'pro',
           status = 'active',
           current_period_start = NOW(),
           current_period_end = '2099-12-31 23:59:59',
           cancel_at_period_end = 0
       WHERE user_id = ?`,
      [nanci.id]
    );
    console.log('✅ Subscription updated: tier=pro, active, until 2099-12-31');
  } else {
    // Insert new subscription record
    await conn.query(
      `INSERT INTO subscriptions (user_id, tier, status, current_period_start, current_period_end, cancel_at_period_end)
       VALUES (?, 'pro', 'active', NOW(), '2099-12-31 23:59:59', 0)`,
      [nanci.id]
    );
    console.log('✅ Subscription created: tier=pro, active, until 2099-12-31');
  }

  // Update user table
  await conn.query(
    `UPDATE users
     SET subscription_plan = 'pro',
         daily_calorie_target = 99999,
         protein_goal = 9999,
         carb_goal = 9999,
         fat_goal = 9999
     WHERE id = ?`,
    [nanci.id]
  );
  console.log('✅ User updated: plan=pro, targets=99999');

  // Verify
  const [verify] = await conn.query(
    `SELECT u.name, u.email, u.subscription_plan, u.daily_calorie_target,
            s.tier as sub_tier, s.status, s.current_period_end, s.cancel_at_period_end
     FROM users u
     JOIN subscriptions s ON u.id = s.user_id
     WHERE u.email = ?`,
    [nanci.email]
  );

  const v = verify[0];
  console.log('\n═══════════════════════════════════════════════');
  console.log('✅ Nanci - CUENTA AL MÁXIMO');
  console.log('═══════════════════════════════════════════════');
  console.log(`   Nombre:          ${v.name}`);
  console.log(`   Email:           ${v.email}`);
  console.log(`   Plan (users):    ${v.subscription_plan}`);
  console.log(`   Tier (subs):     ${v.sub_tier}`);
  console.log(`   Estado:          ${v.status}`);
  console.log(`   Calorías/día:    ${v.daily_calorie_target}`);
  console.log(`   Vence:           ${v.current_period_end}`);
  console.log(`   Auto-cancel:     ${v.cancel_at_period_end === 0 ? 'NO ✅' : 'SÍ ❌'}`);
  console.log('═══════════════════════════════════════════════\n');

  await conn.end();
}

main();
