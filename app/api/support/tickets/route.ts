import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ticketId = uuidv4();
    await query(
      'INSERT INTO support_tickets (id, user_id, subject, message, status, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [ticketId, user._id, subject || 'No Subject', message, 'open', 'medium']
    );

    return NextResponse.json({ success: true, ticketId });
  } catch (error) {
    console.error('[SUPPORT_API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [rows]: any = await query('SELECT role FROM users WHERE id = ?', [user._id]);
    const dbUser = Array.isArray(rows) ? rows[0] : rows;
    const role = dbUser ? dbUser.role : 'user';

    let ticketsRows;
    if (role === 'admin') {
      const [rows] = await query(
        'SELECT t.*, u.name as user_name, u.email as user_email FROM support_tickets t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC'
      );
      ticketsRows = rows;
    } else {
      const [rows] = await query(
        'SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
        [user._id]
      );
      ticketsRows = rows;
    }

    return NextResponse.json({ tickets: Array.isArray(ticketsRows) ? ticketsRows : [ticketsRows] });
  } catch (error) {
    console.error('[SUPPORT_API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
