import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth-mysql';
import { checkAuthRateLimit, recordFailedLogin, resetAuthRateLimit } from '@/lib/auth-rate-limit';
import { logSecurityEvent } from '@/lib/security-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Check rate limit by email
    const emailLower = email.trim().toLowerCase();
    const rateLimit = checkAuthRateLimit(emailLower);

    if (!rateLimit.allowed) {
      const lockoutMinutes = rateLimit.lockedUntil
        ? Math.ceil((rateLimit.lockedUntil - Date.now()) / 60000)
        : 15;

      return NextResponse.json(
        {
          error: `Demasiados intentos. Cuenta bloqueada por ${lockoutMinutes} minutos por seguridad.`,
          lockedUntil: rateLimit.lockedUntil,
          remainingAttempts: 0,
        },
        { status: 429 }
      );
    }

    // Buscar usuario
    let result;
    try {
      const emailTrimmed = emailLower;
      const queryResult = await query(`
        SELECT id, email, password_hash, name, age, weight_kg, height_cm,
               sex, activity_level, goal, subscription_plan, daily_calorie_target, created_at
        FROM users
        WHERE email = ?
      `, [emailTrimmed]);

      // query() returns [rows, fields], so we need to extract rows
      result = Array.isArray(queryResult) ? queryResult[0] : queryResult;
    } catch (dbError: any) {
      console.error('Database connection error:', dbError.message);
      return NextResponse.json(
        {
          error: 'Error de base de datos. Asegúrate de que MySQL esté corriendo.',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 500 }
      );
    }

    // Ensure result is an array
    const users = Array.isArray(result) ? result : [result];

    if (users.length === 0) {
      // Record failed attempt for non-existent user
      recordFailedLogin(emailLower);
      logSecurityEvent('AUTH_LOGIN_FAILURE', {
        email: emailLower,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'unknown',
        action: 'login_non_existent_user'
      });
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      // Record failed attempt
      recordFailedLogin(emailLower);
      logSecurityEvent('AUTH_LOGIN_FAILURE', {
        userId: user.id,
        email: emailLower,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'unknown',
        action: 'login_wrong_password'
      });
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Successful login - reset rate limit
    resetAuthRateLimit(emailLower);

    // Crear JWT y establecer cookie directamente en la respuesta
    const token = await signJWT({ userId: user.id });

    const response = NextResponse.json({
      success: true,
      user: {
        _id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        sex: user.sex,
        weight: user.weight_kg,
        height: user.height_cm,
        activityLevel: user.activity_level,
        goal: user.goal,
        subscriptionPlan: user.subscription_plan,
        calorieGoal: user.daily_calorie_target,
        avatarUrl: user.avatar_url,
        avatarType: user.avatar_type,
        createdAt: user.created_at,
      },
    });

    // Set cookie directly on the response object
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    logSecurityEvent('AUTH_LOGIN_SUCCESS', {
      userId: user.id,
      email: user.email,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    console.log('✅ Login exitoso para:', user.email, '- UserID:', user.id);

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión: ' + error.message },
      { status: 500 }
    );
  }
}

