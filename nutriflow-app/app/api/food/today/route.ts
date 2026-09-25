import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

/**
 * GET /api/food/today
 * Obtener alimentos registrados hoy
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    const selectedDate = dateParam ? new Date(dateParam) : new Date();
    const targetDate = selectedDate.toISOString().split('T')[0];

    const [rows] = await query(`
      SELECT 
        id,
        food_name as foodName,
        brand,
        calories,
        protein_g as protein,
        carbs_g as carbs,
        fat_g as fat,
        serving_size_g as servingSize,
        serving_name as servingName,
        meal_type as mealType,
        log_date as date,
        is_custom_food as isCustom,
        created_at as createdAt
      FROM food_logs
      WHERE user_id = ? AND DATE(log_date) = ?
      ORDER BY created_at DESC
    `, [user._id, targetDate]) as any[];

    const logs = rows || [];

    // Obtener totales
    const totals = logs.reduce(
      (acc: any, log: any) => ({
        calories: acc.calories + (Number(log.calories) || 0),
        protein: acc.protein + (Number(log.protein) || 0),
        carbs: acc.carbs + (Number(log.carbs) || 0),
        fat: acc.fat + (Number(log.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return NextResponse.json({
      success: true,
      logs,
      totals,
      count: logs.length,
    });
  } catch (error) {
    console.error('Error getting today food logs:', error);
    return NextResponse.json(
      { error: 'Error obteniendo registros' },
      { status: 500 }
    );
  }
}
