const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const mysql = require('mysql2/promise');

async function main() {
  const isTiDBCloud = (process.env.MYSQL_HOST || '').includes('tidbcloud');
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'nutriflow_db',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    ssl: isTiDBCloud ? { rejectUnauthorized: false } : undefined,
  });

  try {
    console.log('Altering table...');
    await pool.query('ALTER TABLE users MODIFY avatar_url MEDIUMTEXT');
    console.log('Table users altered successfully.');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    process.exit(0);
  }
}
main();
