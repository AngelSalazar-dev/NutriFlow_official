import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const host = process.env.MYSQL_HOST || 'not set';
    const port = process.env.MYSQL_PORT || 'not set';
    const user = process.env.MYSQL_USER || 'not set';
    const db = process.env.MYSQL_DATABASE || 'not set';
    
    // Test DNS resolution
    const dns = await import('dns');
    let dnsResult = 'pending';
    try {
      await dns.promises.lookup(host);
      dnsResult = 'resolved';
    } catch (e: any) {
      dnsResult = `failed: ${e.message}`;
    }

    // Test MySQL connection
    const conn = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password: process.env.MYSQL_PASSWORD || '',
      database: db,
      ssl: { rejectUnauthorized: true },
      connectTimeout: 10000,
    });

    const [rows] = await conn.query('SELECT 1 as test');
    await conn.end();

    return NextResponse.json({
      status: 'success',
      connection: { host, port, user, database: db },
      dns: dnsResult,
      query: rows,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      code: error.code,
      env: {
        MYSQL_HOST: process.env.MYSQL_HOST || 'not set',
        MYSQL_PORT: process.env.MYSQL_PORT || 'not set',
        MYSQL_USER: process.env.MYSQL_USER || 'not set',
        MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'not set',
        hasPassword: !!process.env.MYSQL_PASSWORD,
      }
    }, { status: 500 });
  }
}
