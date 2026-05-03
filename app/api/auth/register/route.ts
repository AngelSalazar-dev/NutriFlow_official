import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth-mysql';
import { isStrongPassword, sanitizeInput, isValidEmail } from '@/lib/validation';
import { createEmailVerificationToken } from '@/lib/auth-tokens';
import { logSecurityEvent } from '@/lib/security-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      confirmPassword,
      name,
      age,
      sex,
      weight,
      height,
      activityLevel,
      goal,
      referralCode: providedReferralCode,
    } = body;

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedName = sanitizeInput(name);

    // Validación básica
    if (!sanitizedEmail || !password || !sanitizedName) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Validar email
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      );
    }

    // Validar contraseña con requisitos fuertes
    const passwordValidation = isStrongPassword(password, { minLength: 8 });
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Contraseña débil: ' + passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Validar confirmación de contraseña
    if (password.trim() !== confirmPassword?.trim()) {
      return NextResponse.json(
        { error: 'Las contraseñas no coinciden' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingQuery = await query(
      'SELECT id FROM users WHERE email = ?',
      [sanitizedEmail]
    );
    const existingRows = Array.isArray(existingQuery) ? existingQuery[0] : existingQuery;

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Calcular TDEE y calorías objetivo (fórmula Mifflin-St Jeor)
    const weightNum = Number(weight);
    const heightNum = Number(height);
    const ageNum = Number(age);
    
    // BMR
    const bmr = sex === 'male'
      ? 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
      : 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;

    // Actividad multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const multiplier = activityMultipliers[activityLevel] || 1.2;

    // TDEE
    const tdee = Math.round(bmr * multiplier);

    // Calorías objetivo según goal
    let calorieGoal = tdee;
    if (goal === 'lose') {
      calorieGoal = tdee - 500;
    } else if (goal === 'gain') {
      calorieGoal = tdee + 300;
    }

    // Macros (40% carbs, 30% protein, 30% fat)
    const proteinGoal = Math.round((weightNum * 2)); // 2g por kg
    const fatGoal = Math.round((calorieGoal * 0.25) / 9);
    const carbGoal = Math.round((calorieGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4);

    // Generar ID único
    const userId = crypto.randomUUID();

    // Determinar si fue referido por alguien
    let referredBy = null;
    if (providedReferralCode) {
      const [referrerRows] = await query(
        'SELECT user_id FROM referral_codes WHERE code = ?',
        [providedReferralCode.toUpperCase()]
      ) as any[];
      
      if (referrerRows && referrerRows.length > 0) {
        referredBy = referrerRows[0].user_id;
      }
    }

    // Generar código de referido inicial
    const referralCode = sanitizedName.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();

    // Insertar usuario
    await query(`
      INSERT INTO users (
        id, email, password_hash, name, age, weight_kg, height_cm,
        sex, activity_level, goal, subscription_plan,
        daily_calorie_target, tdee, bmr, referral_code, referred_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'free', ?, ?, ?, ?, ?)
    `, [
      userId,
      sanitizedEmail,
      passwordHash,
      sanitizedName,
      ageNum,
      weightNum,
      heightNum,
      sex,
      activityLevel,
      goal,
      calorieGoal,
      tdee,
      bmr,
      referralCode,
      referredBy
    ]);

    // Procesar recompensa para el referente si existe
    if (referredBy) {
      const rewardDays = 3;
      const [referrerRows] = await query(
        'SELECT subscription_plan, subscription_end FROM users WHERE id = ?',
        [referredBy]
      ) as any[];

      if (referrerRows && referrerRows.length > 0) {
        const referrer = referrerRows[0];
        const now = new Date();
        const currentEnd = referrer.subscription_end ? new Date(referrer.subscription_end) : now;
        const baseDate = currentEnd > now ? currentEnd : now;
        
        const newSubscriptionEnd = new Date(baseDate);
        newSubscriptionEnd.setDate(newSubscriptionEnd.getDate() + rewardDays);

        await query(
          `UPDATE users 
           SET subscription_plan = 'premium', 
               subscription_end = ?, 
               referral_credits = referral_credits + ?
           WHERE id = ?`,
          [newSubscriptionEnd, rewardDays, referredBy]
        );

        // Registrar el referido
        await query(
          `INSERT INTO referrals (id, referrer_id, referred_user_id, referral_code, rewarded, created_at)
           VALUES (UUID(), ?, ?, ?, TRUE, NOW())`,
          [referredBy, userId, providedReferralCode.toUpperCase()]
        );
      }
    }

    // Create email verification token
    const verificationToken = await createEmailVerificationToken(userId);
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;

    // Log verification URL (in production, send via email)
    console.log(`\n📧 [NEW REGISTRATION] User: ${sanitizedEmail}`);
    console.log(`🔗 Verification URL: ${verificationUrl}`);
    console.log(`⏰ Token expires in 24 hours\n`);

    // TODO: Send verification email in production
    // await sendEmail({
    //   to: sanitizedEmail,
    //   subject: 'Verifica tu email - NutriFlow',
    //   html: renderVerificationEmail({ userName: sanitizedName, verificationUrl }),
    // });

    // Create JWT and set cookie
    const token = await signJWT({ userId });

    const response = NextResponse.json({
      success: true,
      user: {
        _id: userId,
        email: sanitizedEmail,
        name: sanitizedName,
        age: ageNum,
        sex,
        weight: weightNum,
        height: heightNum,
        activityLevel,
        goal,
        subscriptionPlan: 'free',
        calorieGoal,
        createdAt: new Date(),
        emailVerified: false,
      },
      message: 'Cuenta creada exitosamente. Por favor verifica tu email.',
    });

    logSecurityEvent('AUTH_REGISTER', {
      userId,
      email: sanitizedEmail,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario: ' + error.message },
      { status: 500 }
    );
  }
}
