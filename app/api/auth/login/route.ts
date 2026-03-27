import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth-mysql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Find user
    const [rows] = await query(`
      SELECT 
        id, email, password_hash as password, name, age, weight_kg as weight, 
        height_cm as height, sex, activity_level, goal, subscription_plan,
        daily_calorie_target as calorieGoal, created_at as createdAt
      FROM users 
      WHERE email = ?
    `, [email]);

    const users = rows as any[];
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Set session cookie
    await setSessionCookie(user.id);

    // Return user without password
    return NextResponse.json({
      success: true,
      user: {
        _id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        sex: user.sex,
        weight: user.weight,
        height: user.height,
        activityLevel: user.activity_level,
        goal: user.goal,
        subscriptionPlan: user.subscription_plan,
        calorieGoal: user.calorieGoal,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión: ' + error.message },
      { status: 500 }
    );
  }
}
