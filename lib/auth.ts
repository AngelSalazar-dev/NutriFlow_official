import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { User } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
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
  const cookiesStore = await cookies();
  cookiesStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookiesStore = await cookies();
  return cookiesStore.get('session')?.value;
}

export async function deleteSessionCookie(): Promise<void> {
  const cookiesStore = await cookies();
  cookiesStore.delete('session');
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getSessionCookie();
    if (!token) return null;

    const payload = await verifyJWT(token);
    if (!payload?.userId) return null;

    const { getDb } = await import('@/lib/mongodb');
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({ _id: payload.userId });

    if (!user) return null;

    return {
      ...user,
      _id: user._id?.toString(),
    };
  } catch (error) {
    console.error('Error getting current user:', error);
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
