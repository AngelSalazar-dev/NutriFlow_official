import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql';

export async function GET() {
  const diagnostics: any = {
    environment: {
      MYSQL_HOST: process.env.MYSQL_HOST,
      MYSQL_PORT: process.env.MYSQL_PORT,
      MYSQL_USER: process.env.MYSQL_USER,
      MYSQL_DATABASE: process.env.MYSQL_DATABASE,
      NODE_ENV: process.env.NODE_ENV,
    },
    pool: {
      status: 'unknown',
      error: null,
    },
    database: {
      exists: false,
      tables: [],
    },
    timestamp: new Date().toISOString(),
  };

  // Test pool connection
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT 1 as test');
    diagnostics.pool.status = 'connected';
    diagnostics.pool.test = rows;
  } catch (error: any) {
    diagnostics.pool.status = 'error';
    diagnostics.pool.error = error.message;
    
    return NextResponse.json({
      status: 'error',
      message: 'No se puede conectar a MySQL',
      diagnostics,
    }, { status: 500 });
  }

  // Check if database exists
  try {
    const pool = getPool();
    const [dbRows] = await pool.execute(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [process.env.MYSQL_DATABASE || 'nutriflow_db']
    );
    
    diagnostics.database.exists = (dbRows as any[]).length > 0;

    if (diagnostics.database.exists) {
      // Get tables
      const [tableRows] = await pool.execute(
        'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?',
        [process.env.MYSQL_DATABASE || 'nutriflow_db']
      );
      
      diagnostics.database.tables = (tableRows as any[]).map((r: any) => r.TABLE_NAME);
      diagnostics.database.tableCount = diagnostics.database.tables.length;
    }
  } catch (error: any) {
    diagnostics.database.error = error.message;
  }

  const status = diagnostics.pool.status === 'connected' ? 'ok' : 'error';
  
  return NextResponse.json({
    status,
    message: status === 'ok' ? 'Base de datos conectada correctamente' : 'Error en la base de datos',
    diagnostics,
  });
}
