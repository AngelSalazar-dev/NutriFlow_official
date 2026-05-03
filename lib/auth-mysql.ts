import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { query } from './mysql';
import { User } from '@/types';

// Enforce JWT_SECRET in production - fail fast if not set
const JWT_SECRET_STRING = process.env.JWT_SECRET;

if (!JWT_SECRET_STRING && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ WARNING: JWT_SECRET environment variable is missing. Using fallback for build. Generate one and add it to Vercel.');
}

const JWT_SECRET = new TextEncoder().encode(
  JWT_SECRET_STRING || 'dev-secret-do-not-use-in-production'
);

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(userId: string): Promise<void> {
  const token = await signJWT({ userId });
  const cookieStore = await cookies();
  
  console.log('[Auth] Setting session cookie for user:', userId);
  console.log('[Auth] Token:', token.substring(0, 20) + '...');
  
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  
  console.log('[Auth] Session cookie set successfully');
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  console.log('[Auth] Getting session cookie:', sessionCookie ? 'FOUND' : 'NOT FOUND');
  
  if (!sessionCookie) {
    return undefined;
  }
  
  // In Next.js 15+, cookie value is directly accessible
  const value = typeof sessionCookie === 'string' ? sessionCookie : sessionCookie.value;
  console.log('[Auth] Cookie value:', value ? `${value.substring(0, 20)}...` : 'undefined');
  
  return value;
}

export async function deleteSessionCookie(): Promise<void> {
  const cookiesStore = await cookies();
  cookiesStore.delete('session');
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const tokenValue = await getSessionCookie();
    
    if (!tokenValue) return null;

    const payload = await verifyJWT(tokenValue);
    console.log('[Auth] JWT payload:', payload);
    
    if (!payload?.userId) return null;

    const userId = payload.userId as string;

    // Get user from MySQL
    const [rows] = await query(`
      SELECT
        id, email, name, age, weight_kg, height_cm,
        sex, activity_level, goal, subscription_plan,
        daily_calorie_target, tdee, bmr, created_at, updated_at,
        avatar_url, avatar_type, banner_url, banner_type, referral_code
      FROM users
      WHERE id = ?
      LIMIT 1
    `, [userId]);

    const users = Array.isArray(rows) ? rows : [rows];
    
    console.log('[Auth] DB query result:', {
      totalRows: users.length,
      columns: users.length > 0 ? Object.keys(users[0]) : [],
    });

    if (!users || users.length === 0) {
      console.log('[Auth] No user found in DB');
      return null;
    }

    const user = users[0] as any;
    
    const result = {
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
      tdee: user.tdee,
      bmr: user.bmr,
      avatarUrl: user.avatar_url,
      avatarType: user.avatar_type,
      bannerUrl: user.banner_url,
      bannerType: user.banner_type,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      referralCode: user.referral_code,
    } as User;
    
    console.log('[Auth] User loaded:', result.name, result.email);
    return result;
  } catch (error: any) {
    console.error('[Auth] Error getting current user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
