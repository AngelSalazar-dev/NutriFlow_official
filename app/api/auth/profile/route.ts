import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';
import { calculateUserProfile } from '@/lib/utils';
import type { ActivityLevel, Goal } from '@/types';

interface UserRow {
  id: string;
  email: string;
  name: string;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  sex: string | null;
  activity_level: string | null;
  goal: string | null;
  subscription_plan: string | null;
  subscription_end: string | null;
  daily_calorie_target: number | null;
  tdee: number | null;
  bmr: number | null;
  protein_goal: number | null;
  carb_goal: number | null;
  fat_goal: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        sex: user.sex,
        weight: user.weight,
        height: user.height,
        activityLevel: user.activityLevel,
        goal: user.goal,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEnd: user.subscriptionEnd,
        bmr: user.bmr,
        tdee: user.tdee,
        calorieGoal: user.calorieGoal,
        proteinGoal: user.proteinGoal,
        carbGoal: user.carbGoal,
        fatGoal: user.fatGoal,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return NextResponse.json(
      { error: 'Error getting profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const body = await request.json();

    // Fields that can be updated
    const allowedFields = ['name', 'age', 'sex', 'weight', 'height', 'activityLevel', 'goal'];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Convert camelCase to snake_case for database
        const dbField = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        updateData[dbField] = body[field];
      }
    }

    // Recalculate profile if weight, height, age, sex, activityLevel or goal changed
    if (updateData.weight_kg || updateData.height_cm || updateData.age || updateData.sex || updateData.activity_level || updateData.goal) {
      const profile = calculateUserProfile(
        updateData.weight_kg as number || user.weight,
        updateData.height_cm as number || user.height,
        updateData.age as number || user.age,
        (updateData.sex as 'male' | 'female') || user.sex,
        (updateData.activity_level as ActivityLevel) || user.activityLevel,
        (updateData.goal as Goal) || user.goal
      );
      updateData.bmr = profile.bmr;
      updateData.tdee = profile.tdee;
      updateData.daily_calorie_target = profile.calorieGoal;
      updateData.protein_goal = profile.proteinGoal;
      updateData.carb_goal = profile.carbGoal;
      updateData.fat_goal = profile.fatGoal;
    }

    updateData.updated_at = new Date();

    // Build dynamic UPDATE query
    const setClauses: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(updateData)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }

    values.push(user._id);

    await query(`
      UPDATE users
      SET ${setClauses.join(', ')}
      WHERE id = ?
    `, values);

    // Fetch updated user
    const [rows] = await query(`
      SELECT
        id, email, name, age, weight_kg, height_cm,
        sex, activity_level, goal, subscription_plan,
        subscription_end, daily_calorie_target, tdee, bmr,
        protein_goal, carb_goal, fat_goal, created_at
      FROM users
      WHERE id = ?
    `, [user._id]);

    const updatedUser = (Array.isArray(rows) ? rows[0] : rows) as UserRow | undefined;

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found after update' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: {
        _id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        age: updatedUser.age,
        sex: updatedUser.sex,
        weight: updatedUser.weight_kg,
        height: updatedUser.height_cm,
        activityLevel: updatedUser.activity_level,
        goal: updatedUser.goal,
        subscriptionPlan: updatedUser.subscription_plan,
        subscriptionEnd: updatedUser.subscription_end,
        bmr: updatedUser.bmr,
        tdee: updatedUser.tdee,
        calorieGoal: updatedUser.daily_calorie_target,
        proteinGoal: updatedUser.protein_goal,
        carbGoal: updatedUser.carb_goal,
        fatGoal: updatedUser.fat_goal,
        createdAt: updatedUser.created_at,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Error updating profile' },
      { status: 500 }
    );
  }
}
