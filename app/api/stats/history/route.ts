import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

interface DailyStats {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);

    const todayStr = today.toISOString().split('T')[0];
    const startDateStr = startDate.toISOString().split('T')[0];

    // Initialize all days
    const statsByDate: Record<string, DailyStats> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      statsByDate[dateKey] = {
        date: dateKey,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        waterMl: 0,
      };
    }

    // Get food logs for the period
    const foodLogs = await query(`
      SELECT calories, protein_g, carbs_g, fat_g, log_date
      FROM food_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, startDateStr, todayStr]);

    // Get daily logs for exercise calories
    const dailyLogs = await query(`
      SELECT exercise_calories_burned, log_date
      FROM daily_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, startDateStr, todayStr]);

    // Get hydration logs for the period
    const waterLogs = await query(`
      SELECT amount_ml, log_date
      FROM water_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, startDateStr, todayStr]);

    // Aggregate food logs
    const foodLogsArray = foodLogs as unknown as Array<{
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
      log_date: string;
    }>;

    for (const log of foodLogsArray) {
      const dateKey = new Date(log.log_date).toISOString().split('T')[0];
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].caloriesConsumed += Number(log.calories) || 0;
        statsByDate[dateKey].protein += Number(log.protein_g) || 0;
        statsByDate[dateKey].carbs += Number(log.carbs_g) || 0;
        statsByDate[dateKey].fat += Number(log.fat_g) || 0;
      }
    }

    // Aggregate daily logs (exercise calories)
    const dailyLogsArray = dailyLogs as unknown as Array<{
      exercise_calories_burned: number;
      log_date: string;
    }>;

    for (const log of dailyLogsArray) {
      const dateKey = new Date(log.log_date).toISOString().split('T')[0];
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].caloriesBurned += Number(log.exercise_calories_burned) || 0;
      }
    }

    // Aggregate water logs
    const waterLogsArray = waterLogs as unknown as Array<{
      amount_ml: number;
      log_date: string;
    }>;

    for (const log of waterLogsArray) {
      const dateKey = new Date(log.log_date).toISOString().split('T')[0];
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].waterMl += Number(log.amount_ml) || 0;
      }
    }

    const stats = Object.values(statsByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({ stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting history:', error);
    return NextResponse.json(
      { error: 'Error getting history: ' + message },
      { status: 500 }
    );
  }
}
