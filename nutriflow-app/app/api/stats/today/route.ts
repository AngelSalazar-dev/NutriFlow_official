import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

interface FoodLog {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailyLog {
  exercise_calories_burned: number;
}

interface WaterLog {
  amount_ml: number;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Get food logs for today
    const [foodLogs] = await query(`
      SELECT calories, protein_g as protein, carbs_g as carbs, fat_g as fat
      FROM food_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, todayStr, tomorrowStr]) as any[];

    // Get exercise logs - using daily_logs for exercise calories
    const [dailyLogs] = await query(`
      SELECT exercise_calories_burned
      FROM daily_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, todayStr, tomorrowStr]) as any[];

    // Get hydration logs for today
    const [hydrationLogs] = await query(`
      SELECT amount_ml
      FROM water_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, todayStr, tomorrowStr]) as any[];

    // Calculate totals
    const foodLogsArray = foodLogs as unknown as FoodLog[];
    const dailyLogsArray = dailyLogs as unknown as DailyLog[];
    const hydrationLogsArray = hydrationLogs as unknown as WaterLog[];

    const caloriesConsumed = foodLogsArray.reduce((acc, log) => acc + (Number(log.calories) || 0), 0);
    const protein = foodLogsArray.reduce((acc, log) => acc + (Number(log.protein) || 0), 0);
    const carbs = foodLogsArray.reduce((acc, log) => acc + (Number(log.carbs) || 0), 0);
    const fat = foodLogsArray.reduce((acc, log) => acc + (Number(log.fat) || 0), 0);
    const caloriesBurned = dailyLogsArray.reduce((acc, log) => acc + (Number(log.exercise_calories_burned) || 0), 0);
    const waterMl = hydrationLogsArray.reduce((acc, log) => acc + (Number(log.amount_ml) || 0), 0);

    return NextResponse.json({
      stats: {
        caloriesConsumed,
        caloriesBurned,
        protein,
        carbs,
        fat,
        waterMl,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting today stats:', error);
    return NextResponse.json(
      { error: 'Error getting stats: ' + message },
      { status: 500 }
    );
  }
}
