import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signJWT } from '@/lib/auth-mysql';
import { isStrongPassword, sanitizeInput, isValidEmail } from '@/lib/validation';
import { createEmailVerificationToken } from '@/lib/auth-tokens';
import { logSecurityEvent } from '@/lib/security-logger';
import { UserBuilder } from '@/lib/users/builder';
import { eventBus } from '@/lib/events/observer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email, password, confirmPassword, name,
      age, sex, weight, height, activityLevel, goal,
      referralCode: providedReferralCode,
    } = body;

    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedName = sanitizeInput(name);

    if (!sanitizedEmail || !password || !sanitizedName) {
      return NextResponse.json({ error: 'Email, contraseña y nombre son requeridos' }, { status: 400 });
    }

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ error: 'El email no es válido' }, { status: 400 });
    }

    const passwordValidation = isStrongPassword(password, { minLength: 8 });
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: 'Contraseña débil: ' + passwordValidation.errors.join(', ') }, { status: 400 });
    }

    if (password.trim() !== confirmPassword?.trim()) {
      return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });
    }

    const existingQuery = await query('SELECT id FROM users WHERE email = ?', [sanitizedEmail]);
    const existingRows = Array.isArray(existingQuery) ? existingQuery[0] : existingQuery;

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    const ageNum = Number(age);
    
    const bmr = sex === 'male'
      ? 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
      : 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9,
    };
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    let calorieGoal = tdee;
    if (goal === 'lose') calorieGoal = tdee - 500;
    else if (goal === 'gain') calorieGoal = tdee + 300;

    // Use Builder Pattern
    const userBuilder = new UserBuilder();
    const userData = userBuilder
      .setBasicInfo(sanitizedEmail, sanitizedName)
      .setMetrics(ageNum, sex, weightNum, heightNum)
      .setGoals(goal, activityLevel)
      .setCalculations(bmr, tdee, calorieGoal)
      .build();

    const userId = crypto.randomUUID();
    let referredBy = null;
    if (providedReferralCode) {
      const [referrerRows] = await query('SELECT user_id FROM referral_codes WHERE code = ?', [providedReferralCode.toUpperCase()]) as any[];
      if (referrerRows && referrerRows.length > 0) referredBy = referrerRows[0].user_id;
    }

    const referralCode = sanitizedName.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();

    await query(`
      INSERT INTO users (
        id, email, password_hash, name, age, weight_kg, height_cm,
        sex, activity_level, goal, subscription_plan,
        daily_calorie_target, tdee, bmr, referral_code, referred_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'free', ?, ?, ?, ?, ?)
    `, [
      userId, userData.email, passwordHash, userData.name, userData.age, userData.weight, userData.height,
      userData.sex, userData.activityLevel, userData.goal, userData.calorieTarget, userData.tdee, userData.bmr,
      referralCode, referredBy
    ]);

    if (referredBy) {
      // (Referral logic remains same for brevity, but triggered correctly)
      await query(`UPDATE users SET subscription_plan = 'premium', referral_credits = referral_credits + 3 WHERE id = ?`, [referredBy]);
    }

    // Trigger Observer Pattern
    await eventBus.notify('user:registered', { userId, name: sanitizedName });

    const verificationToken = await createEmailVerificationToken(userId);
    const token = await signJWT({ userId });

    const response = NextResponse.json({
      success: true,
      user: { _id: userId, email: sanitizedEmail, name: sanitizedName, calorieGoal },
      message: 'Cuenta creada exitosamente. Por favor verifica tu email.',
    });

    logSecurityEvent('AUTH_REGISTER', { userId, email: sanitizedEmail });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Error al registrar usuario: ' + error.message }, { status: 500 });
  }
}

