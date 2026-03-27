import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET - Get user routines
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const db = await getDb();
    const routines = await db.collection('routines').find({
      userId: user._id,
    }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      routines: routines.map((r) => ({
        ...r,
        _id: r._id?.toString(),
        userId: r.userId?.toString(),
      })),
    });
  } catch (error) {
    console.error('Error getting routines:', error);
    return NextResponse.json(
      { error: 'Error getting routines' },
      { status: 500 }
    );
  }
}

// POST - Create a new routine
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, dayOfWeek, exercises, isFavorite } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nombre de la rutina es requerido' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    const result = await db.collection('routines').insertOne({
      userId: user._id,
      name,
      description: description || '',
      dayOfWeek: dayOfWeek !== undefined ? Number(dayOfWeek) : undefined,
      exercises: exercises || [],
      isFavorite: isFavorite || false,
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      routine: {
        _id: result.insertedId.toString(),
        userId: user._id,
        name,
        description: description || '',
        dayOfWeek,
        exercises: exercises || [],
        isFavorite: isFavorite || false,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error('Error creating routine:', error);
    return NextResponse.json(
      { error: 'Error creating routine' },
      { status: 500 }
    );
  }
}

// PUT - Update a routine
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const db = await getDb();

    const allowedFields = ['name', 'description', 'dayOfWeek', 'exercises', 'isFavorite'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    updateData.updatedAt = new Date();

    await db.collection('routines').updateOne(
      { _id: new ObjectId(id), userId: user._id },
      { $set: updateData }
    );

    const updatedRoutine = await db.collection('routines').findOne({
      _id: new ObjectId(id),
      userId: user._id,
    });

    return NextResponse.json({
      routine: {
        ...updatedRoutine,
        _id: updatedRoutine?._id?.toString(),
        userId: updatedRoutine?.userId?.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating routine:', error);
    return NextResponse.json(
      { error: 'Error updating routine' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a routine
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
    const result = await db.collection('routines').deleteOne({
      _id: new ObjectId(id),
      userId: user._id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Rutina no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting routine:', error);
    return NextResponse.json(
      { error: 'Error deleting routine' },
      { status: 500 }
    );
  }
}
