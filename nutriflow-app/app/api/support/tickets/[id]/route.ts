import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin
    const [rows]: any = await query('SELECT role FROM users WHERE id = ?', [user._id]);
    const dbUser = Array.isArray(rows) ? rows[0] : rows;
    
    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, priority, message } = body;

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (priority) {
      updates.push('priority = ?');
      values.push(priority);
    }
    // If it's a reply message, maybe we would save it to a ticket_replies table. 
    // Since we don't have one, we could append it to the message or just update the status for now.

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    await query(`UPDATE support_tickets SET ${updates.join(', ')} WHERE id = ?`, values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TICKET_UPDATE_API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
