const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const pool = mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    user: '3ZxNQLB5VbKt56g.root',
    password: '4BLpMj6H4QzcJ8oi',
    database: 'nutriflow',
    port: 4000,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 1
  });

  const [users] = await pool.execute('SELECT email, password_hash FROM users WHERE email = ?', ['founder@nutriflow.com']);
  console.log('DB User:', users[0]?.email);
  console.log('Hash:', users[0]?.password_hash);
  
  const test = await bcrypt.compare('NutriFlow2026!', users[0].password_hash);
  console.log('bcrypt compare (old hash):', test);
  
  // Reset the password hash to be sure
  const newHash = await bcrypt.hash('NutriFlow2026!', 10);
  console.log('New hash:', newHash);
  
  await pool.execute('UPDATE users SET password_hash = ? WHERE email = ?', [newHash, 'founder@nutriflow.com']);
  
  const verify2 = await bcrypt.compare('NutriFlow2026!', newHash);
  console.log('After reset, bcrypt compare:', verify2);

  await pool.end();
})();
