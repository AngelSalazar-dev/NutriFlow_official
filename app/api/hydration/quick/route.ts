import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

/**
 * POST /api/hydration/quick
 * Registro rápido de agua (un clic)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { amountMl = 250 } = body; // Default: 250ml (1 vaso)

    const logId = crypto.randomUUID();
    const now = new Date();
    const logDate = now.toISOString().split('T')[0];

    // Guardar en water_logs
    await query(`
      INSERT INTO water_logs (id, user_id, amount_ml, log_date, log_time, created_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [logId, user._id, amountMl, logDate]);

    // Actualizar daily_logs
    await query(`
      INSERT INTO daily_logs (user_id, log_date, total_water_ml)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        total_water_ml = total_water_ml + ?
    `, [user._id, logDate, amountMl, amountMl]);

    return NextResponse.json({
      success: true,
      message: `${amountMl}ml de agua registrados`,
      logId,
      amountMl,
    });
  } catch (error) {
    console.error('Error logging water:', error);
    return NextResponse.json(
      { error: 'Error registrando agua' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/hydration/quick
 * Eliminar registro de agua
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const logId = searchParams.get('id');

    if (!logId) {
      return NextResponse.json(
        { error: 'ID de registro requerido' },
        { status: 400 }
      );
    }

    // Obtener datos del registro
    const [rows] = await query(
      'SELECT amount_ml FROM water_logs WHERE id = ? AND user_id = ?',
      [logId, user._id]
    ) as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    const amount = rows[0].amount_ml;

    // Eliminar registro
    await query('DELETE FROM water_logs WHERE id = ? AND user_id = ?', [logId, user._id]);

    // Actualizar daily_logs (restar)
    const [dateRows] = await query(
      'SELECT log_date FROM water_logs WHERE id = ? AND user_id = ?',
      [logId, user._id]
    ) as any[];

    if (dateRows && dateRows.length > 0) {
      const logDate = new Date(dateRows[0].log_date).toISOString().split('T')[0];
      
      await query(`
        UPDATE daily_logs 
        SET total_water_ml = GREATEST(0, total_water_ml - ?)
        WHERE user_id = ? AND log_date = ?
      `, [amount, user._id, logDate]);
    }

    return NextResponse.json({
      success: true,
      message: 'Registro de agua eliminado',
    });
  } catch (error) {
    console.error('Error deleting water log:', error);
    return NextResponse.json(
      { error: 'Error eliminando registro' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/hydration/today
 * Obtener agua consumida hoy
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    const [rows] = await query(
      'SELECT SUM(amount_ml) as total FROM water_logs WHERE user_id = ? AND DATE(log_date) = ?',
      [user._id, today]
    ) as any[];

    const totalMl = rows && rows[0] ? Number(rows[0].total) || 0 : 0;

    return NextResponse.json({
      success: true,
      totalMl,
      glasses: Math.floor(totalMl / 250),
      goal: 2000, // 2L default
      percentage: Math.min((totalMl / 2000) * 100, 100),
    });
  } catch (error) {
    console.error('Error getting hydration:', error);
    return NextResponse.json(
      { error: 'Error obteniendo hidratación' },
      { status: 500 }
    );
  }
}
