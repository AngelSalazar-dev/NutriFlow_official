import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [rows]: any = await query('SELECT role FROM users WHERE id = ?', [user._id]);
    const dbUser = Array.isArray(rows) ? rows[0] : rows;
    
    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [users] = await query('SELECT id, name, email, subscription_plan, role, created_at, activity_level FROM users ORDER BY created_at DESC LIMIT 100');
    
    return NextResponse.json({ users: Array.isArray(users) ? users : [users] });
  } catch (error) {
    console.error('[ADMIN_USERS_API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
