import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { calculateCaloriesBurned } from '@/lib/utils';

// GET - Get exercise logs
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const db = await getDb();
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const logs = await db.collection('exercise_logs').find({
      userId: user._id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 }).toArray();

    const totalCalories = logs.reduce((acc, log) => acc + log.caloriesBurned, 0);

    return NextResponse.json({
      logs: logs.map((log) => ({
        ...log,
        _id: log._id?.toString(),
        userId: log.userId?.toString(),
      })),
      totalCalories,
    });
  } catch (error) {
    console.error('Error getting exercise logs:', error);
    return NextResponse.json(
      { error: 'Error getting exercise logs' },
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

    const db = await getDb();
    const now = new Date();

    const result = await db.collection('exercise_logs').insertOne({
      userId: user._id,
      exerciseName,
      exerciseType: exerciseType || 'strength',
      muscleGroups: muscleGroups || [],
      setsData: setsData || [],
      metValue: Number(metValue),
      durationMin: Number(durationMin) || 0,
      caloriesBurned,
      notes: notes || '',
      date: now,
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      log: {
        _id: result.insertedId.toString(),
        userId: user._id,
        exerciseName,
        exerciseType: exerciseType || 'strength',
        muscleGroups: muscleGroups || [],
        setsData: setsData || [],
        metValue: Number(metValue),
        durationMin: Number(durationMin) || 0,
        caloriesBurned,
        notes: notes || '',
        date: now,
      },
    });
  } catch (error) {
    console.error('Error adding exercise log:', error);
    return NextResponse.json(
      { error: 'Error adding exercise log' },
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

    const db = await getDb();
    const result = await db.collection('exercise_logs').deleteOne({
      _id: new ObjectId(id),
      userId: user._id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exercise log:', error);
    return NextResponse.json(
      { error: 'Error deleting exercise log' },
      { status: 500 }
    );
  }
}
