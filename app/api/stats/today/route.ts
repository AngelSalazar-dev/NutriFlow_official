import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

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

    // Get food logs for today
    const foodLogs = await query(`
      SELECT calories, protein_g as protein, carbs_g as carbs, fat_g as fat
      FROM food_entries
      WHERE user_id = ? AND entry_date BETWEEN ? AND ?
    `, [user._id, today.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]]);

    // Get exercise logs - using daily_logs for exercise calories
    const dailyLogs = await query(`
      SELECT exercise_calories_burned
      FROM daily_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, today.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]]);

    // Get hydration logs for today
    const hydrationLogs = await query(`
      SELECT amount_ml
      FROM water_logs
      WHERE user_id = ? AND log_date BETWEEN ? AND ?
    `, [user._id, today.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]]);

    // Calculate totals
    const foodLogsArray = foodLogs as any[];
    const dailyLogsArray = dailyLogs as any[];
    const hydrationLogsArray = hydrationLogs as any[];

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
  } catch (error: any) {
    console.error('Error getting today stats:', error);
    return NextResponse.json(
      { error: 'Error getting stats: ' + error.message },
      { status: 500 }
    );
  }
}
