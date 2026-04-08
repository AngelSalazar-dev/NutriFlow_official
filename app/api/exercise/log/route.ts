import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';
import { calculateCaloriesBurned } from '@/lib/utils';

interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_name: string;
  exercise_type: string;
  muscle_groups: string;
  sets_data: string;
  met_value: number;
  duration_min: number;
  calories_burned: number;
  notes: string;
  log_date: string;
  created_at: string;
}

// GET - Get exercise logs
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const [rows] = await query(
      `SELECT id, exercise_name, exercise_type, muscle_groups, met_value,
              duration_min, calories_burned, notes, log_date,
              DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at
       FROM exercise_logs
       WHERE user_id = ? AND log_date BETWEEN ? AND ?
       ORDER BY log_date DESC, created_at DESC`,
      [user._id, startDateStr, endDateStr]
    );

    console.log('[EXERCISE] Query returned', (rows as any[]).length, 'rows');

    const logs = (rows as unknown as ExerciseLog[]).map((log) => ({
      id: log.id,
      userId: log.user_id,
      exerciseName: log.exercise_name,
      exerciseType: log.exercise_type,
      muscleGroups: Array.isArray(log.muscle_groups) ? log.muscle_groups : (log.muscle_groups ? JSON.parse(log.muscle_groups) : []),
      metValue: Number(log.met_value) || 0,
      durationMin: Number(log.duration_min) || 0,
      caloriesBurned: Number(log.calories_burned) || 0,
      notes: log.notes,
      logDate: log.log_date,
      createdAt: log.created_at || new Date().toISOString(),
    }));

    const totalCalories = logs.reduce((acc, log) => acc + log.caloriesBurned, 0);

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log.id,
        _id: log.id,
        exerciseName: log.exerciseName,
        exerciseType: log.exerciseType,
        muscleGroups: log.muscleGroups,
        metValue: log.metValue,
        durationMin: log.durationMin,
        caloriesBurned: log.caloriesBurned,
        notes: log.notes,
        date: log.logDate,
        createdAt: log.createdAt,
      })),
      totalCalories,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting exercise logs:', error);
    return NextResponse.json(
      { error: 'Error getting exercise logs: ' + message },
      { status: 500 }
    );
  }
}

// POST - Add a new exercise log
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const {
      exerciseName,
      exerciseType,
      muscleGroups,
      setsData,
      metValue,
      durationMin,
      notes,
      date: logDateOverride,
    } = body;

    // Validation
    if (!exerciseName || !metValue) {
      return NextResponse.json(
        { error: 'Nombre del ejercicio y MET son requeridos' },
        { status: 400 }
      );
    }

    // Calculate calories burned
    const caloriesBurned = calculateCaloriesBurned(
      metValue,
      user.weight,
      durationMin || 0
    );

    const now = new Date();
    const logDate = logDateOverride
      ? new Date(logDateOverride).toISOString().split('T')[0]
      : now.toISOString().split('T')[0];

    const [uuidResult] = await query('SELECT UUID() as id');
    const logId = (uuidResult as any)[0].id;

    await query(`
      INSERT INTO exercise_logs (
        id, user_id, exercise_name, exercise_type, muscle_groups,
        met_value, duration_min, calories_burned, notes, log_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      logId,
      user._id,
      exerciseName,
      exerciseType || 'strength',
      JSON.stringify(muscleGroups || []),
      Number(metValue),
      Number(durationMin) || 0,
      caloriesBurned,
      notes || '',
      logDate,
      now,
    ]);

    return NextResponse.json({
      success: true,
      log: {
        _id: logId,
        userId: user._id,
        exerciseName,
        exerciseType: exerciseType || 'strength',
        muscleGroups: muscleGroups || [],
        metValue: Number(metValue),
        durationMin: Number(durationMin) || 0,
        caloriesBurned,
        notes: notes || '',
        date: logDate,
        createdAt: now,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [EXERCISE LOG] Error adding exercise:', error);
    if ((error as any).sql) console.error('SQL:', (error as any).sql);
    return NextResponse.json(
      { error: 'Error adding exercise log: ' + message },
      { status: 500 }
    );
  }
}

// DELETE - Delete an exercise log
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

    const result = await query('DELETE FROM exercise_logs WHERE id = ? AND user_id = ?', [id, user._id]);

    const affectedRows = (result as any).affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting exercise log:', error);
    return NextResponse.json(
      { error: 'Error deleting exercise log: ' + message },
      { status: 500 }
    );
  }
}
