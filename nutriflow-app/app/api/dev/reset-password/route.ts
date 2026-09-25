import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';

/**
 * RESET PASSWORD - SOLO PARA DESARROLLO
 * Usage: POST /api/dev/reset-password
 * Body: { email: "tu@email.com", newPassword: "nueva123" }
 */
export async function POST(request: Request) {
  // Security check: only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Esta función solo está disponible en desarrollo' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user (handle both id column naming)
    const result = await query(
      `UPDATE users 
       SET password_hash = ?, updated_at = NOW() 
       WHERE email = ?`,
      [hashedPassword, email]
    );

    const rows = Array.isArray(result) ? result : [result];
    const affectedRows = (rows as any).affectedRows || (rows as any).changedRows || 0;

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: `No se encontró usuario con email: ${email}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente',
      email,
      affectedRows,
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Error al resetear contraseña: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * LIST USERS - SOLO PARA DESARROLLO
 * Usage: GET /api/dev/reset-password
 */
export async function GET() {
  // Security check: only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Esta función solo está disponible en desarrollo' },
      { status: 403 }
    );
  }

  try {
    // Get all columns to handle different column names
    const result = await query(
      `SELECT * FROM users ORDER BY created_at DESC`
    );

    const rows = Array.isArray(result) ? result : [result];
    const users = rows as any[];

    return NextResponse.json({
      users: users.map(u => ({
        id: u.id || u.user_id,
        email: u.email,
        name: u.name || u.full_name,
        createdAt: u.created_at || u.created_at,
        hasPassword: !!u.password_hash,
      })),
      total: users.length,
      rawColumns: users.length > 0 ? Object.keys(users[0]) : [],
    });
  } catch (error: any) {
    console.error('List users error:', error);
    return NextResponse.json(
      { 
        error: 'Error al listar usuarios: ' + error.message,
        hint: 'Verifica que la tabla users existe y tiene datos'
      },
      { status: 500 }
    );
  }
}
