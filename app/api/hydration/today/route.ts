import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

/**
 * GET /api/hydration/today
 * Obtener agua consumida hoy (con historial detallado)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Manejo de fecha seguro como en el POST/DELETE
    const now = new Date();
    const today = now.toLocaleDateString('en-CA');

    // 1. Obtener el total consolidado
    const [dailyRows] = await query(
      'SELECT water_ml as totalMl FROM daily_logs WHERE user_id = ? AND log_date = ?',
      [user._id, today]
    ) as any[];

    const totalMl = dailyRows && dailyRows.length > 0 ? Number(dailyRows[0].totalMl) || 0 : 0;

    // 2. Obtener historial detallado (corregir destructuring para sólo tomar los rows)
    const [logs] = await query(`
      SELECT id, amount_ml as amountMl, beverage_type as beverageType, created_at as createdAt
      FROM water_logs
      WHERE user_id = ? AND log_date = ?
      ORDER BY created_at DESC
    `, [user._id, today]) as any[];

    return NextResponse.json({
      success: true,
      totalMl,
      logs: logs || [],
      glasses: Math.floor(totalMl / 250),
      goal: 2000, 
      percentage: Math.min((totalMl / 2000) * 100, 100),
    });
  } catch (error: any) {
    console.error('Error obteniendo historial de hidratación:', error.message);
    return NextResponse.json(
      { error: 'Error obteniendo hidratación' },
      { status: 500 }
    );
  }
}
