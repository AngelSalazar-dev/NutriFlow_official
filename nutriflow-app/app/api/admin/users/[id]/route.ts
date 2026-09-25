import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [rows]: any = await query('SELECT role FROM users WHERE id = ?', [user._id]);
    const dbUser = Array.isArray(rows) ? rows[0] : rows;
    
    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { role, subscription_plan } = await req.json();

    const updates = [];
    const values = [];

    if (role) {
      updates.push('role = ?');
      values.push(role);
    }
    if (subscription_plan) {
      updates.push('subscription_plan = ?');
      values.push(subscription_plan);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_USER_UPDATE_API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
