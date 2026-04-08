import mysql from 'mysql2/promise';

// MySQL connection pool
let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    // TiDB Cloud requires SSL
    const isTiDBCloud = process.env.MYSQL_HOST?.includes('tidbcloud.com');
    const useSSL = isTiDBCloud || process.env.NODE_ENV === 'production';

    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'nutriflow_db',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      // Cambiamos rejectUnauthorized a false para evitar errores de certificado SSL en desarrollo local con TiDB Cloud
      ssl: useSSL ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 20, // Aumentado para evitar saturación
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      connectTimeout: 10000, // 10 segundos (reducido de 20s)
    });

    console.log('✅ MySQL connection pool created' + (useSSL ? ' (SSL enabled - permissive)' : ''));
  }

  return pool;
}

export async function query<T = any>(
  sql: string,
  params?: any[],
  providedConnection?: mysql.PoolConnection
): Promise<[T, any]> {
  const connection = providedConnection || await getPool().getConnection();

  try {
    const result = await connection.execute(sql, params);
    return result as unknown as [T, any];
  } finally {
    if (!providedConnection) {
      connection.release();
    }
  }
}

export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getPool().getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
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
  if (!row) return {} as T;
  return JSON.parse(JSON.stringify(row));
}

export function rowsToObjects<T = any>(rows: any): T[] {
  if (!rows) return [];
  if (!Array.isArray(rows)) return [rowToObject<T>(rows)];
  return rows.map(row => rowToObject<T>(row));
}
