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

    // Get food calories per day
    const [foodData] = await query(
      `SELECT log_date, SUM(calories) as consumed
       FROM food_logs
       WHERE user_id = ? AND log_date BETWEEN ? AND ?
       GROUP BY log_date`,
      [user._id, mondayStr, endDateStr]
    );

    // Get exercise calories per day
    const [exerciseData] = await query(
      `SELECT log_date, SUM(calories_burned) as burned
       FROM exercise_logs
       WHERE user_id = ? AND log_date BETWEEN ? AND ?
       GROUP BY log_date`,
      [user._id, mondayStr, endDateStr]
    );

    // Build the 7-day array with proper labels
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const dataMap = new Map<string, { consumed: number; burned: number }>();

    // Initial fill for the 7 days of this specific week
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const label = dayNames[d.getDay()];
      dataMap.set(label, { consumed: 0, burned: 0 });
    }

    // Fill with food data
    for (const row of (foodData as any[])) {
      const date = new Date(row.log_date);
      const label = dayNames[date.getDay()];
      if (dataMap.has(label)) {
        const current = dataMap.get(label)!;
        dataMap.set(label, { ...current, consumed: Math.round(Number(row.consumed) || 0) });
      }
    }

    // Fill with exercise data
    for (const row of (exerciseData as any[])) {
      const date = new Date(row.log_date);
      const label = dayNames[date.getDay()];
      if (dataMap.has(label)) {
        const current = dataMap.get(label)!;
        dataMap.set(label, { ...current, burned: Math.round(Number(row.burned) || 0) });
      }
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
