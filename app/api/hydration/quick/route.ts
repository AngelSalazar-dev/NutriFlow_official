import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query, transaction } from '@/lib/mysql';

/**
 * POST /api/hydration/quick
 * Registro rápido de bebidas con integridad ACID y soporte para tipos
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { amountMl = 250, beverageType = 'water' } = body;

    if (amountMl <= 0) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    const logId = crypto.randomUUID();
    // Obtener fecha local YYYY-MM-DD
    const now = new Date();
    const logDate = now.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD

    await transaction(async (connection) => {
      // 1. Guardar log detallado
      await query(`
        INSERT INTO water_logs (id, user_id, amount_ml, beverage_type, log_date, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `, [logId, user._id, amountMl, beverageType, logDate], connection);

      // 2. Actualizar resumen diario
      await query(`
        INSERT INTO daily_logs (user_id, log_date, water_ml, total_calories, total_protein, total_carbs, total_fat)
        VALUES (?, ?, ?, 0, 0, 0, 0)
        ON DUPLICATE KEY UPDATE
          water_ml = water_ml + ?
      `, [user._id, logDate, amountMl, amountMl], connection);
    });

    return NextResponse.json({
      success: true,
      logId,
      amountMl,
      beverageType
    });
  } catch (error: any) {
    console.error('Error logging beverage:', error.message);
    return NextResponse.json({ error: 'Error registrando bebida' }, { status: 500 });
  }
}

/**
 * DELETE /api/hydration/quick
 * Solución al error de borrado: Manejo de fechas seguro y logs de depuración
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
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    console.log(`[HYDRATION-DELETE] Buscando registro: ${logId} para usuario: ${user._id}`);

    await transaction(async (connection) => {
      // 1. Obtener datos antes de borrar
      const [rows] = await query(
        'SELECT amount_ml, log_date FROM water_logs WHERE id = ? AND user_id = ?',
        [logId, user._id],
        connection
      ) as any[];

      if (!rows || rows.length === 0) {
        console.warn(`[HYDRATION-DELETE] No se encontró el registro: ${logId}`);
        return;
      }

      const { amount_ml, log_date } = rows[0];
      
      // FORMATEO DE FECHA SEGURO (YYYY-MM-DD)
      // log_date puede venir como objeto Date de MySQL. evitamos toISOString() que desfasa horas.
      const dateObj = new Date(log_date);
      const formattedDate = dateObj.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'

      console.log(`[HYDRATION-DELETE] Eliminando ${amount_ml}ml del día ${formattedDate}`);

      // 2. Restar del total diario
      const [updateResult] = await query(`
        UPDATE daily_logs 
        SET water_ml = GREATEST(0, water_ml - ?)
        WHERE user_id = ? AND log_date = ?
      `, [amount_ml, user._id, formattedDate], connection) as any;

      console.log(`[HYDRATION-DELETE] Filas actualizadas en daily_logs: ${updateResult.affectedRows}`);

      // 3. Borrar el historial detallado
      const [deleteResult] = await query(
        'DELETE FROM water_logs WHERE id = ? AND user_id = ?', 
        [logId, user._id], 
        connection
      ) as any;
      
      console.log(`[HYDRATION-DELETE] Registro borrado de water_logs: ${deleteResult.affectedRows}`);
    });

    return NextResponse.json({ success: true, message: 'Registro eliminado con éxito' });
  } catch (error: any) {
    console.error('[HYDRATION-DELETE] Error crítico:', error.message);
    return NextResponse.json({ error: 'Error al procesar el borrado' }, { status: 500 });
  }
}
