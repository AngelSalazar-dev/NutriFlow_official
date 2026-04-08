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
  exerciseCount: number;
  exerciseNames: string;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = Math.min(parseInt(searchParams.get('days') || '7'), 90);

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
        exerciseCount: 0,
        exerciseNames: '',
      };
    }

    // 1. Get daily_logs (aggregated macros, water, exercise calories)
    const [dailyLogs] = await query(`
      SELECT log_date, 
        COALESCE(total_calories, 0) as calories,
        COALESCE(total_protein, 0) as protein,
        COALESCE(total_carbs, 0) as carbs,
        COALESCE(total_fat, 0) as fat,
        COALESCE(exercise_calories_burned, 0) as exercise_cals,
        COALESCE(water_ml, 0) as water
      FROM daily_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, startDateStr, todayStr]) as any[];

    // 2. Get exercise logs for session counts and names
    const [exerciseLogs] = await query(`
      SELECT log_date, exercise_name, duration_min, calories_burned
      FROM exercise_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
      ORDER BY created_at ASC
    `, [user._id, startDateStr, todayStr]) as any[];

    // Aggregate daily logs
    for (const log of dailyLogs) {
      const dateKey = new Date(log.log_date).toISOString().split('T')[0];
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].caloriesConsumed = Number(log.calories) || 0;
        statsByDate[dateKey].protein = Number(log.protein) || 0;
        statsByDate[dateKey].carbs = Number(log.carbs) || 0;
        statsByDate[dateKey].fat = Number(log.fat) || 0;
        statsByDate[dateKey].caloriesBurned = Number(log.exercise_cals) || 0;
        statsByDate[dateKey].waterMl = Number(log.water) || 0;
      }
    }

    // Aggregate exercise logs
    const exerciseNamesByDate: Record<string, string[]> = {};
    for (const log of exerciseLogs) {
      const dateKey = new Date(log.log_date).toISOString().split('T')[0];
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].exerciseCount++;
        statsByDate[dateKey].caloriesBurned += Number(log.calories_burned) || 0;
        if (!exerciseNamesByDate[dateKey]) exerciseNamesByDate[dateKey] = [];
        exerciseNamesByDate[dateKey].push(log.exercise_name);
      }
    }

    // Add exercise names to stats
    for (const [dateKey, names] of Object.entries(exerciseNamesByDate)) {
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].exerciseNames = names.join(', ');
      }
    }

    const stats = Object.values(statsByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('[HISTORY] Error:', error.message);
    return NextResponse.json(
      { error: 'Error obteniendo historial: ' + error.message },
      { status: 500 }
    );
  }
}
