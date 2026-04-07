import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

interface Routine {
  id: string;
  user_id: string;
  name: string;
  description: string;
  day_of_week: number | null;
  exercises: string;
  is_favorite: boolean;
  created_at: string;
  updated_at?: string;
}

// GET - Get user routines
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const rows = await query(`
      SELECT id, name, description, day_of_week, exercises, is_favorite, created_at
      FROM routines
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [user._id]);

    const routines = (rows as unknown as Routine[]).map((r) => ({
      _id: r.id,
      userId: r.user_id,
      name: r.name,
      description: r.description,
      dayOfWeek: r.day_of_week,
      exercises: r.exercises ? JSON.parse(r.exercises) : [],
      isFavorite: r.is_favorite,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ routines });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting routines:', error);
    return NextResponse.json(
      { error: 'Error getting routines: ' + message },
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

    const now = new Date();

    const [uuidResult] = await query('SELECT UUID() as id');
    const routineId = (uuidResult as any)[0].id;

    await query(`
      INSERT INTO routines (
        id, user_id, name, description, day_of_week, exercises, is_favorite, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      routineId,
      user._id,
      name,
      description || '',
      dayOfWeek !== undefined ? Number(dayOfWeek) : null,
      JSON.stringify(exercises || []),
      isFavorite || false,
      now,
    ]);

    return NextResponse.json({
      success: true,
      routine: {
        _id: routineId,
        userId: user._id,
        name,
        description: description || '',
        dayOfWeek,
        exercises: exercises || [],
        isFavorite: isFavorite || false,
        createdAt: now,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating routine:', error);
    return NextResponse.json(
      { error: 'Error creating routine: ' + message },
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

    const allowedFields: Record<string, string> = {
      name: 'name',
      description: 'description',
      dayOfWeek: 'day_of_week',
      exercises: 'exercises',
      isFavorite: 'is_favorite',
    };

    const setClauses: string[] = [];
    const values: unknown[] = [];

    for (const [field, dbField] of Object.entries(allowedFields)) {
      if (body[field] !== undefined) {
        setClauses.push(`${dbField} = ?`);
        if (field === 'exercises' || field === 'dayOfWeek') {
          values.push(field === 'exercises' ? JSON.stringify(body[field]) : Number(body[field]));
        } else {
          values.push(body[field]);
        }
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    setClauses.push('updated_at = ?');
    values.push(new Date());
    values.push(id);
    values.push(user._id);

    await query(`
      UPDATE routines
      SET ${setClauses.join(', ')}
      WHERE id = ? AND user_id = ?
    `, values);

    // Fetch updated routine
    const [rows] = await query(`
      SELECT id, name, description, day_of_week, exercises, is_favorite, created_at
      FROM routines
      WHERE id = ? AND user_id = ?
    `, [id, user._id]);

    const updatedRoutine = (Array.isArray(rows) ? rows[0] : rows) as Routine | undefined;

    if (!updatedRoutine) {
      return NextResponse.json(
        { error: 'Rutina no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      routine: {
        _id: updatedRoutine.id,
        userId: updatedRoutine.user_id,
        name: updatedRoutine.name,
        description: updatedRoutine.description,
        dayOfWeek: updatedRoutine.day_of_week,
        exercises: updatedRoutine.exercises ? JSON.parse(updatedRoutine.exercises) : [],
        isFavorite: updatedRoutine.is_favorite,
        createdAt: updatedRoutine.created_at,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating routine:', error);
    return NextResponse.json(
      { error: 'Error updating routine: ' + message },
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

    const result = await query('DELETE FROM routines WHERE id = ? AND user_id = ?', [id, user._id]);

    const affectedRows = (result as any).affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: 'Rutina no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting routine:', error);
    return NextResponse.json(
      { error: 'Error deleting routine: ' + message },
      { status: 500 }
    );
  }
}
