import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query, transaction } from '@/lib/mysql';

/**
 * POST /api/food/log
 * Registrar alimento consumido
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      foodName,
      calories,
      protein,
      carbs,
      fat,
      servingSize,
      mealType,
      date,
      foodId,
      isCustom,
    } = body;

    console.log('Registrando alimento:', body);

    // Validación
    if (!foodName || calories === undefined || calories === null) {
      console.error('Faltan datos requeridos:', { foodName, calories });
      return NextResponse.json(
        { error: 'Nombre y calorías son requeridos' },
        { status: 400 }
      );
    }

    // Generar ID único
    const logId = crypto.randomUUID();
    const logDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    // Guardar en food_logs y actualizar daily_logs DENTRO DE UNA TRANSACCIÓN ACID
    await transaction(async (connection) => {
      await query(`
        INSERT INTO food_logs (
          id, user_id, food_id, custom_food_name, calories,
          protein_g, carbs_g, fat_g, serving_size_g, meal_type,
          log_date, is_custom_food, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        logId,
        user._id,
        foodId || null,
        foodName,
        Number(calories),
        Number(protein) || 0,
        Number(carbs) || 0,
        Number(fat) || 0,
        Number(servingSize) || 100,
        mealType || 'snack',
        logDate,
        isCustom ? 1 : 0,
      ], connection);

      await query(`
        INSERT INTO daily_logs (user_id, log_date, total_calories, total_protein_g, total_carbs_g, total_fat_g, total_water_ml)
        VALUES (?, ?, ?, ?, ?, ?, 0)
        ON DUPLICATE KEY UPDATE
          total_calories = total_calories + ?,
          total_protein_g = total_protein_g + ?,
          total_carbs_g = total_carbs_g + ?,
          total_fat_g = total_fat_g + ?
      `, [
        user._id,
        logDate,
        Number(calories),
        Number(protein) || 0,
        Number(carbs) || 0,
        Number(fat) || 0,
        Number(calories),
        Number(protein) || 0,
        Number(carbs) || 0,
        Number(fat) || 0,
      ], connection);
    });

    console.log('Alimento y Daily Logs transaccionados con éxito');

    return NextResponse.json({
      success: true,
      message: 'Alimento registrado exitosamente',
      logId,
    });
  } catch (error: any) {
    console.error('Error logging food:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Error registrando alimento: ' + error.message },
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
    const logId = searchParams.get('id');

    if (!logId) {
      return NextResponse.json(
        { error: 'ID de registro requerido' },
        { status: 400 }
      );
    }

    // Obtener datos del registro antes de eliminar
    const [rows] = await query(
      'SELECT calories, protein_g, carbs_g, fat_g, log_date FROM food_logs WHERE id = ? AND user_id = ?',
      [logId, user._id]
    ) as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    const log = rows[0];

    // Eliminar registro
    await query('DELETE FROM food_logs WHERE id = ? AND user_id = ?', [logId, user._id]);

    // Actualizar daily_logs (restar)
    const logDate = new Date(log.log_date).toISOString().split('T')[0];
    
    await query(`
      UPDATE daily_logs 
      SET 
        total_calories = GREATEST(0, total_calories - ?),
        total_protein_g = GREATEST(0, total_protein_g - ?),
        total_carbs_g = GREATEST(0, total_carbs_g - ?),
        total_fat_g = GREATEST(0, total_fat_g - ?)
      WHERE user_id = ? AND log_date = ?
    `, [
      log.calories,
      log.protein_g,
      log.carbs_g,
      log.fat_g,
      user._id,
      logDate,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Alimento eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting food log:', error);
    return NextResponse.json(
      { error: 'Error eliminando registro' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/food/log
 * Actualizar registro de alimento
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      logId,
      foodName,
      calories,
      protein,
      carbs,
      fat,
      servingSize,
      mealType,
    } = body;

    if (!logId) {
      return NextResponse.json(
        { error: 'ID de registro requerido' },
        { status: 400 }
      );
    }

    // Obtener datos anteriores
    const [oldRows] = await query(
      'SELECT calories, protein_g, carbs_g, fat_g FROM food_logs WHERE id = ? AND user_id = ?',
      [logId, user._id]
    ) as any[];

    if (!oldRows || oldRows.length === 0) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    const oldLog = oldRows[0];

    // Actualizar registro
    await query(`
      UPDATE food_logs 
      SET 
        custom_food_name = ?,
        calories = ?,
        protein_g = ?,
        carbs_g = ?,
        fat_g = ?,
        serving_size_g = ?,
        meal_type = ?,
        updated_at = NOW()
      WHERE id = ? AND user_id = ?
    `, [
      foodName,
      Number(calories),
      Number(protein) || 0,
      Number(carbs) || 0,
      Number(fat) || 0,
      Number(servingSize) || 100,
      mealType || 'snack',
      logId,
      user._id,
    ]);

    // Actualizar daily_logs (restar viejo + sumar nuevo)
    const [dateRows] = await query(
      'SELECT log_date FROM food_logs WHERE id = ?',
      [logId]
    ) as any[];
    
    const logDate = new Date(dateRows[0].log_date).toISOString().split('T')[0];
    
    await query(`
      UPDATE daily_logs 
      SET 
        total_calories = GREATEST(0, total_calories - ? + ?),
        total_protein_g = GREATEST(0, total_protein_g - ? + ?),
        total_carbs_g = GREATEST(0, total_carbs_g - ? + ?),
        total_fat_g = GREATEST(0, total_fat_g - ? + ?)
      WHERE user_id = ? AND log_date = ?
    `, [
      oldLog.calories,
      Number(calories),
      oldLog.protein_g,
      Number(protein) || 0,
      oldLog.carbs_g,
      Number(carbs) || 0,
      oldLog.fat_g,
      Number(fat) || 0,
      user._id,
      logDate,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Alimento actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error updating food log:', error);
    return NextResponse.json(
      { error: 'Error actualizando registro' },
      { status: 500 }
    );
  }
}
