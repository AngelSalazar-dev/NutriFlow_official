import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

// POST - Add hydration log
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { amountMl } = body;

    if (!amountMl || amountMl <= 0) {
      return NextResponse.json(
        { error: 'Cantidad inválida' },
        { status: 400 }
      );
    }

    // Generate UUID
    const [uuidResult] = await query('SELECT UUID() as id');
    const logId = (uuidResult as any)[0].id;
    const now = new Date().toISOString().split('T')[0];

    await query(`
      INSERT INTO water_logs (id, user_id, amount_ml, log_date, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [logId, user._id, Number(amountMl), now]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding hydration log:', error);
    return NextResponse.json(
      { error: 'Error adding hydration log: ' + error.message },
      { status: 500 }
    );
  }
}

// GET - Get hydration logs for today
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    const logs = await query(`
      SELECT id as _id, amount_ml as amountMl, log_date as date, created_at as createdAt
      FROM water_logs
      WHERE user_id = ? AND log_date = ?
      ORDER BY created_at DESC
    `, [user._id, today]);

    const logsArray = logs as any[];
    const totalMl = logsArray.reduce((acc, log) => acc + (Number(log.amountMl) || 0), 0);

    return NextResponse.json({
      logs: logsArray.map((log) => ({
        ...log,
        _id: log._id,
      })),
      totalMl,
    });
  } catch (error: any) {
    console.error('Error getting hydration logs:', error);
    return NextResponse.json(
      { error: 'Error getting hydration logs: ' + error.message },
      { status: 500 }
    );
  }
}
