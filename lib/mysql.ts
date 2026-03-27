import mysql from 'mysql2/promise';

// MySQL connection pool
let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'nutriflow_db',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    console.log('✅ MySQL connection pool created');
  }

  return pool;
}

export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T> {
  const connection = await getPool().getConnection();
  
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T;
  } finally {
    connection.release();
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('👋 MySQL pool closed');
  }
}

// Helper to convert MySQL rows to plain objects
export function rowToObject<T = any>(row: any): T {
  return JSON.parse(JSON.stringify(row));
}

export function rowsToObjects<T = any>(rows: any[]): T[] {
  return rows.map(row => rowToObject<T>(row));
}
