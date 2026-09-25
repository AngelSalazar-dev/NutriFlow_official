const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const pool = mysql.createPool({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    user: 'REDACTED_USER',
    password: 'TU_PASSWORD_BD',
    database: 'nutriflow',
    port: 4000,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 1
  });

  const [users] = await pool.execute('SELECT email, password_hash FROM users WHERE email = ?', ['founder@nutriflow.com']);
  console.log('DB User:', users[0]?.email);
  console.log('Hash:', users[0]?.password_hash);
  
  const test = await bcrypt.compare('REDACTED', users[0].password_hash);
  console.log('bcrypt compare (old hash):', test);
  
  // Reset the password hash to be sure
  const newHash = await bcrypt.hash('REDACTED', 10);
  console.log('New hash:', newHash);
  
  await pool.execute('UPDATE users SET password_hash = ? WHERE email = ?', [newHash, 'founder@nutriflow.com']);
  
  const verify2 = await bcrypt.compare('REDACTED', newHash);
  console.log('After reset, bcrypt compare:', verify2);

  await pool.end();
})();
