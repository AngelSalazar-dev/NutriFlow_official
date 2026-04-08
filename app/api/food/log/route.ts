import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query, transaction } from '@/lib/mysql';

/**
 * POST /api/food/log
 * Registrar alimento(s) consumido(s)
 * Soporta un solo alimento o un arreglo de alimentos (batch)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const logs = Array.isArray(body) ? body : [body];

    if (logs.length === 0) {
      return NextResponse.json({ error: 'No se enviaron datos para registrar' }, { status: 400 });
    }

    console.log(`Registrando ${logs.length} alimento(s):`, logs);

    // Guardar en food_logs y actualizar daily_logs DENTRO DE UNA TRANSACCIÓN ACID
    await transaction(async (connection) => {
      for (const log of logs) {
        const {
          foodName, brand, calories, protein, carbs, fat,
          servingSize, servingName, mealType, date, foodId, isCustom,
        } = log;

        // Validación básica por ítem
        if (!foodName || calories === undefined || calories === null) {
          throw new Error(`Faltan datos requeridos para el alimento: ${foodName || 'Desconocido'}`);
        }

        const logId = crypto.randomUUID();
        const logDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        await query(`
          INSERT INTO food_logs (
            id, user_id, food_id, food_name, brand, calories,
            protein_g, carbs_g, fat_g, serving_size_g, serving_name, meal_type,
            log_date, is_custom_food, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
          logId, user._id, foodId || null, foodName, brand || null,
          Number(calories), Number(protein) || 0, Number(carbs) || 0, Number(fat) || 0,
          Number(servingSize) || 100, servingName || 'gramos', mealType || 'snack',
          logDate, isCustom ? 1 : 0,
        ], connection);

        await query(`
          INSERT INTO daily_logs (user_id, log_date, total_calories, total_protein, total_carbs, total_fat, water_ml)
          VALUES (?, ?, ?, ?, ?, ?, 0)
          ON DUPLICATE KEY UPDATE
            total_calories = total_calories + ?,
            total_protein = total_protein + ?,
            total_carbs = total_carbs + ?,
            total_fat = total_fat + ?
        `, [
          user._id, logDate, Number(calories), Number(protein) || 0, Number(carbs) || 0, Number(fat) || 0,
          Number(calories), Number(protein) || 0, Number(carbs) || 0, Number(fat) || 0,
        ], connection);
      }
    });

    console.log('Transacción de registro finalizada con éxito');

    return NextResponse.json({
      success: true,
      message: `${logs.length} alimento(s) registrado(s) exitosamente`,
    });
  } catch (error: any) {
    console.error('❌ [API/FOOD/LOG] Error registrando alimento:', error.message);
    if (error.sql) console.error('SQL Fallido:', error.sql);
    
    return NextResponse.json(
      { 
        error: 'Error registrando alimento', 
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/food/log
 * Eliminar registro de alimento
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de registro requerido' }, { status: 400 });
    }

    await transaction(async (connection) => {
      // 1. Obtener datos del log antes de borrar para restar del diario
      const [rows] = await query(
        'SELECT calories, protein_g, carbs_g, fat_g, log_date FROM food_logs WHERE id = ? AND user_id = ?',
        [id, user._id],
        connection
      );

      if (rows && (rows as any[]).length > 0) {
        const log = (rows as any[])[0];

        // 2. Restar del total diario
        await query(`
          UPDATE daily_logs 
          SET 
            total_calories = GREATEST(0, total_calories - ?),
            total_protein = GREATEST(0, total_protein - ?),
            total_carbs = GREATEST(0, total_carbs - ?),
            total_fat = GREATEST(0, total_fat - ?)
          WHERE user_id = ? AND log_date = ?
        `, [
          Number(log.calories), Number(log.protein_g), Number(log.carbs_g), Number(log.fat_g),
          user._id, log.log_date
        ], connection);

        // 3. Borrar el registro
        await query('DELETE FROM food_logs WHERE id = ? AND user_id = ?', [id, user._id], connection);
      }
    });

    return NextResponse.json({ success: true, message: 'Registro eliminado' });
  } catch (error: any) {
    console.error('Error eliminando registro:', error);
    return NextResponse.json({ error: 'Error eliminando registro' }, { status: 500 });
  }
}

/**
 * PUT /api/food/log
 * Editar un registro de alimento (actualizar macros y serving_size)
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { logId, servingSize, calories, protein, carbs, fat } = body;

    if (!logId || !servingSize || calories === undefined) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    await transaction(async (connection) => {
      // 1. Obtener el registro antiguo para calcular el delta
      const [rows] = await query(
        'SELECT calories, protein_g, carbs_g, fat_g, log_date FROM food_logs WHERE id = ? AND user_id = ?',
        [logId, user._id],
        connection
      ) as [any[], any];

      if (!rows || rows.length === 0) {
        throw new Error('Registro no encontrado o no pertenece al usuario');
      }

      const oldLog = rows[0];
      const deltaCalories = Number(calories) - Number(oldLog.calories);
      const deltaProtein = Number(protein) - Number(oldLog.protein_g);
      const deltaCarbs = Number(carbs) - Number(oldLog.carbs_g);
      const deltaFat = Number(fat) - Number(oldLog.fat_g);

      // 2. Actualizar el registro antiguo
      await query(`
        UPDATE food_logs 
        SET 
          serving_size_g = ?,
          calories = ?,
          protein_g = ?,
          carbs_g = ?,
          fat_g = ?
        WHERE id = ? AND user_id = ?
      `, [servingSize, calories, protein, carbs, fat, logId, user._id], connection);

      // 3. Actualizar los resúmenes diarios con el delta
      // GREATEST(0, val) prevent negatives if we reduce size
      const dateObj = new Date(oldLog.log_date);
      const formattedDate = dateObj.toLocaleDateString('en-CA');
      
      await query(`
        UPDATE daily_logs 
        SET 
          total_calories = GREATEST(0, total_calories + ?),
          total_protein = GREATEST(0, total_protein + ?),
          total_carbs = GREATEST(0, total_carbs + ?),
          total_fat = GREATEST(0, total_fat + ?)
        WHERE user_id = ? AND log_date = ?
      `, [deltaCalories, deltaProtein, deltaCarbs, deltaFat, user._id, formattedDate], connection);
    });

    return NextResponse.json({ success: true, message: 'Registro actualizado' });
  } catch (error: any) {
    console.error('Error actualizando registro:', error);
    return NextResponse.json({ error: 'Error actualizando registro' }, { status: 500 });
  }
}

