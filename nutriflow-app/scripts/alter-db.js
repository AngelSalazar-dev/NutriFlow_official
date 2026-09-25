require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Altering table...');
    await connection.query('ALTER TABLE users MODIFY avatar_url MEDIUMTEXT');
    console.log('Table users altered successfully.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Already altered.');
    } else {
      console.error('Error altering table:', err);
    }
  } finally {
    await connection.end();
  }
}

main();
