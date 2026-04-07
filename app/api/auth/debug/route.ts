import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

/**
 * Debug endpoint para verificar sesión
 */
export async function GET() {
  const debug: any = {
    cookies: {},
    jwt: null,
    user: null,
  };

  try {
    // 1. Ver cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    debug.cookies = allCookies.map(c => ({
      name: c.name,
      valuePreview: c.value ? c.value.substring(0, 20) + '...' : 'empty',
    }));

    const sessionCookie = cookieStore.get('session');
    debug.hasSessionCookie = !!sessionCookie;

    if (!sessionCookie) {
      return NextResponse.json({
        status: 'no_session',
        message: 'No hay cookie de sesión',
        debug,
      });
    }

    // 2. Verificar JWT
    const payload = await verifyJWT(sessionCookie.value);
    debug.jwt = payload ? { userId: payload.userId } : null;

    if (!payload?.userId) {
      return NextResponse.json({
        status: 'invalid_jwt',
        message: 'JWT inválido',
        debug,
      });
    }

    // 3. Buscar usuario en DB
    const queryResult = await query(
      'SELECT id, email, name FROM users WHERE id = ?',
      [payload.userId]
    );

    // query() returns [rows, fields]
    const rows = Array.isArray(queryResult) ? queryResult[0] : queryResult;
    const users = Array.isArray(rows) ? rows : [rows];

    debug.dbQuery = {
      totalResults: users.length,
      columns: users.length > 0 ? Object.keys(users[0]) : [],
    };

    if (users.length === 0) {
      return NextResponse.json({
        status: 'user_not_found',
        message: 'Usuario no encontrado en DB',
        debug,
      });
    }

    const user = users[0] as any;
    debug.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return NextResponse.json({
      status: 'authenticated',
      message: 'Sesión válida',
      debug,
    });
  } catch (error: any) {
    debug.error = error.message;
    return NextResponse.json({
      status: 'error',
      message: 'Error verificando sesión',
      debug,
    });
  }
}
