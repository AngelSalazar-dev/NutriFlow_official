import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    const db = await getDb();
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    // Get food logs for the period
    const foodLogs = await db.collection('food_logs').find({
      userId: user._id,
      date: { $gte: startDate },
    }).toArray();

    // Get exercise logs for the period
    const exerciseLogs = await db.collection('exercise_logs').find({
      userId: user._id,
      date: { $gte: startDate },
    }).toArray();

    // Get hydration logs for the period
    const hydrationLogs = await db.collection('hydration_logs').find({
      userId: user._id,
      date: { $gte: startDate },
    }).toArray();

    // Group by date
    const statsByDate: Record<string, DailyStats> = {};

    // Initialize all days
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

    // Aggregate food logs
    for (const log of foodLogs) {
      const dateKey = new Date(log.date).toISOString().split('T')[0];
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].caloriesConsumed += log.calories;
        statsByDate[dateKey].protein += log.protein;
        statsByDate[dateKey].carbs += log.carbs;
        statsByDate[dateKey].fat += log.fat;
      }
    }

    // Aggregate exercise logs
    for (const log of exerciseLogs) {
      const dateKey = new Date(log.date).toISOString().split('T')[0];
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].caloriesBurned += log.caloriesBurned;
      }
    }

    // Aggregate hydration logs
    for (const log of hydrationLogs) {
      const dateKey = new Date(log.date).toISOString().split('T')[0];
      if (statsByDate[dateKey]) {
        statsByDate[dateKey].waterMl += log.amountMl;
      }
    }

    const stats = Object.values(statsByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error getting history:', error);
    return NextResponse.json(
      { error: 'Error getting history' },
      { status: 500 }
    );
  }
}

interface DailyStats {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
}
