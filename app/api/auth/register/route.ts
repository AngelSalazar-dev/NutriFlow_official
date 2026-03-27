import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth-mysql';
import { calculateUserProfile } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, age, sex, weight, height, activityLevel, goal } = body;

    // Validation
    const isInvalid = 
      !email || 
      !password || 
      !name || 
      age === undefined || age === null || age === '' ||
      !sex || 
      weight === undefined || weight === null || weight === '' ||
      height === undefined || height === null || height === '' ||
      !activityLevel || 
      !goal;

    if (isInvalid) {
      console.log('Validation failed:', { email, password, name, age, sex, weight, height, activityLevel, goal });
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUsers] = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está registrado' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Calculate user profile
    const profile = calculateUserProfile(
      Number(weight), 
      Number(height), 
      Number(age), 
      sex, 
      activityLevel, 
      goal
    );

    // Generate UUID for user
    const [uuidResult] = await query('SELECT UUID() as id');
    const userId = (uuidResult as any)[0].id;

    // Create user
    await query(`
      INSERT INTO users (
        id, email, password_hash, name, age, weight_kg, height_cm, 
        sex, activity_level, goal, subscription_plan, daily_calorie_target
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      email,
      hashedPassword,
      name,
      Number(age),
      Number(weight),
      Number(height),
      sex,
      activityLevel,
      goal,
      'free',
      profile.calorieGoal,
    ]);

    // Set session cookie
    await setSessionCookie(userId);

    // Return user without password
    return NextResponse.json({
      success: true,
      user: {
        _id: userId,
        email,
        name,
        age: Number(age),
        sex,
        weight: Number(weight),
        height: Number(height),
        activityLevel,
        goal,
        subscriptionPlan: 'free',
        calorieGoal: profile.calorieGoal,
        createdAt: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario: ' + error.message },
      { status: 500 }
    );
  }
}
