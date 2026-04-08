import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

// GET - Get weekly calorie data (last 7 days)
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday...
    // Calculate the Monday of current week
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const endDate = new Date(monday);
    endDate.setDate(monday.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const mondayStr = monday.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const [rows] = await query(
      `SELECT log_date,
              COALESCE(SUM(total_calories), 0) as consumed,
              COALESCE(SUM(exercise_calories_burned), 0) as burned
       FROM daily_logs
       WHERE user_id = ? AND log_date BETWEEN ? AND ?
       GROUP BY log_date
       ORDER BY log_date ASC`,
      [user._id, mondayStr, endDateStr]
    );

    // Build the 7-day array with proper labels
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const dataMap = new Map<string, { consumed: number; burned: number }>();

    for (const row of (rows as any[])) {
      const date = new Date(row.log_date);
      const label = dayNames[date.getDay()];
      dataMap.set(label, {
        consumed: Math.round(Number(row.consumed) || 0),
        burned: Math.round(Number(row.burned) || 0),
      });
    }

    // Always return 7 days (Mon-Sun order for the current week)
    const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    const weeklyData = weekDays.map((day) => ({
      name: day,
      consumed: dataMap.get(day)?.consumed || 0,
      burned: dataMap.get(day)?.burned || 0,
    }));

    return NextResponse.json({ weekly: weeklyData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[WEEKLY] Error getting weekly stats:', error);
    return NextResponse.json(
      { error: 'Error getting weekly stats: ' + message },
      { status: 500 }
    );
  }
}
