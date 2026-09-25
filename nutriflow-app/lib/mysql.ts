import mysql from 'mysql2/promise';

interface IDatabase {
  query<T = any>(sql: string, params?: any[], connection?: mysql.PoolConnection): Promise<[T, any]>;
  transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T>;
  getConnection(): Promise<mysql.PoolConnection>;
}

class Database implements IDatabase {
  private static instance: Database | null = null;
  private pool: mysql.Pool | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): mysql.Pool {
    if (!this.pool) {
      const isTiDBCloud = process.env.MYSQL_HOST?.includes('tidbcloud.com');
      const useSSL = isTiDBCloud || process.env.NODE_ENV === 'production';

      this.pool = mysql.createPool({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'nutriflow_db',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        ssl: useSSL ? { rejectUnauthorized: false } : undefined,
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 10000,
      });
      console.log(`✅ Database pool initialized ${useSSL ? '(SSL)' : ''}`);
    }
    return this.pool;
  }

  public async getConnection(): Promise<mysql.PoolConnection> {
    return await this.getPool().getConnection();
  }

  public async query<T = any>(sql: string, params?: any[], connection?: mysql.PoolConnection): Promise<[T, any]> {
    const conn = connection || await this.getConnection();
    try {
      const result = await conn.execute(sql, params);
      return result as unknown as [T, any];
    } finally {
      if (!connection) conn.release();
    }
  }

  public async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const conn = await this.getConnection();
    await conn.beginTransaction();
    try {
      const result = await callback(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

class LoggingDatabaseDecorator implements IDatabase {
  constructor(private db: IDatabase) {}
  async query<T = any>(sql: string, params?: any[], connection?: mysql.PoolConnection) {
    const start = Date.now();
    const result = await this.db.query<T>(sql, params, connection);
    console.log(`[DB Query] ${Date.now() - start}ms | ${sql.substring(0, 50)}...`);
    return result;
  }
  async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>) {
    const start = Date.now();
    const result = await this.db.transaction(callback);
    console.log(`[DB Transaction] ${Date.now() - start}ms`);
    return result;
  }
  async getConnection() { return this.db.getConnection(); }
}

let dbInstance: IDatabase | null = null;
const getDB = (): IDatabase => {
  if (!dbInstance) dbInstance = new LoggingDatabaseDecorator(Database.getInstance());
  return dbInstance;
};

export const query = (sql: string, params?: any[], connection?: mysql.PoolConnection) => getDB().query(sql, params, connection);
export const transaction = <T>(callback: (connection: mysql.PoolConnection) => Promise<T>) => getDB().transaction(callback);
export const getPool = () => Database.getInstance().getPool();
export const closePool = () => Database.getInstance().close();

export function rowToObject<T = any>(row: any): T {
  if (!row) return {} as T;
  return JSON.parse(JSON.stringify(row));
}

export function rowsToObjects<T = any>(rows: any): T[] {
  if (!rows) return [];
  if (!Array.isArray(rows)) return [rowToObject<T>(rows)];
  return rows.map(row => rowToObject<T>(row));
}



