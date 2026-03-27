import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

// GET - Get food logs for a specific date
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const logs = await query(`
      SELECT 
        id as _id,
        custom_food_name as foodName,
        calories,
        protein_g as protein,
        carbs_g as carbs,
        fat_g as fat,
        servings as servingSize,
        meal_type as mealType,
        entry_date as date,
        created_at as createdAt
      FROM food_entries
      WHERE user_id = ? AND entry_date = ?
      ORDER BY created_at DESC
    `, [user._id, date]);

    const logsArray = logs as any[];

    // Calculate totals
    const totals = logsArray.reduce(
      (acc, log) => ({
        calories: acc.calories + (Number(log.calories) || 0),
        protein: acc.protein + (Number(log.protein) || 0),
        carbs: acc.carbs + (Number(log.carbs) || 0),
        fat: acc.fat + (Number(log.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return NextResponse.json({
      logs: logsArray.map((log) => ({
        ...log,
        _id: log._id,
      })),
      totals,
    });
  } catch (error: any) {
    console.error('Error getting food logs:', error);
    return NextResponse.json(
      { error: 'Error getting food logs: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Add a new food log
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
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
      isFromPhoto,
    } = body;

    // Validation
    if (!foodName || !calories) {
      return NextResponse.json(
        { error: 'Nombre del alimento y calorías son requeridos' },
        { status: 400 }
      );
    }

    // Generate UUID
    const [uuidResult] = await query('SELECT UUID() as id');
    const logId = (uuidResult as any)[0].id;
    const now = new Date().toISOString().split('T')[0];

    await query(`
      INSERT INTO food_entries (
        id, user_id, custom_food_name, calories, protein_g, carbs_g, fat_g,
        servings, meal_type, entry_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      logId,
      user._id,
      foodName,
      Number(calories),
      Number(protein) || 0,
      Number(carbs) || 0,
      Number(fat) || 0,
      Number(servingSize) || 1,
      mealType || 'snack',
      now,
    ]);

    return NextResponse.json({
      success: true,
      log: {
        _id: logId,
        userId: user._id,
        foodName,
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        servingSize: Number(servingSize) || 1,
        mealType: mealType || 'snack',
        date: now,
      },
    });
  } catch (error: any) {
    console.error('Error adding food log:', error);
    return NextResponse.json(
      { error: 'Error adding food log: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a food log
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    const result = await query('DELETE FROM food_entries WHERE id = ? AND user_id = ?', [id, user._id]);
    
    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting food log:', error);
    return NextResponse.json(
      { error: 'Error deleting food log: ' + error.message },
      { status: 500 }
    );
  }
}
