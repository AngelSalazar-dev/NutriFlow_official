const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const NEW_PASSWORD = process.env.FOUNDER_NEW_PASSWORD;
if (!NEW_PASSWORD) {
  console.error('Set FOUNDER_NEW_PASSWORD env var first');
  process.exit(1);
}

(async () => {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 1
  });

  const newHash = await bcrypt.hash(NEW_PASSWORD, 10);
  await pool.execute('UPDATE users SET password_hash = ? WHERE email = ?', [newHash, 'founder@nutriflow.com']);
  console.log('Password updated successfully');

  await pool.end();
})();
