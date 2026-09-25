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
  avatar_url: string | null;
  avatar_type: string | null;
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
        avatarUrl: user.avatarUrl,
        avatarType: user.avatarType,
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
        // Handle specific database column names for weight and height
        let dbField;
        if (field === 'weight') {
          dbField = 'weight_kg';
        } else if (field === 'height') {
          dbField = 'height_cm';
        } else {
          // Convert camelCase to snake_case for other fields (e.g., activityLevel -> activity_level)
          dbField = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        }
        updateData[dbField] = body[field];
      }
    }

    // Recalculate profile if weight, height, age, sex, activityLevel or goal changed
    // Only recalculate if we have ALL required fields
    const needsRecalculation = updateData.weight_kg !== undefined || 
                               updateData.height_cm !== undefined || 
                               updateData.age !== undefined || 
                               updateData.sex !== undefined || 
                               updateData.activity_level !== undefined || 
                               updateData.goal !== undefined;

    if (needsRecalculation) {
      const w = updateData.weight_kg !== undefined ? Number(updateData.weight_kg) : (user.weight ? Number(user.weight) : 0);
      const h = updateData.height_cm !== undefined ? Number(updateData.height_cm) : (user.height ? Number(user.height) : 0);
      const a = updateData.age !== undefined ? Number(updateData.age) : Number(user.age || 0);
      const s = (updateData.sex as 'male' | 'female') || user.sex;
      const al = (updateData.activity_level as ActivityLevel) || user.activityLevel;
      const g = (updateData.goal as Goal) || user.goal;

      console.log('[Profile] calculateUserProfile params:', { w, h, a, s, al, g });

      // Only recalculate if we have ALL required fields available
      if (w && h && a && s && al && g) {
        try {
          const profile = calculateUserProfile(w, h, a, s as 'male' | 'female', al, g);
          updateData.bmr = profile.bmr;
          updateData.tdee = profile.tdee;
          updateData.daily_calorie_target = profile.calorieGoal;
          updateData.protein_goal = profile.proteinGoal;
          updateData.carb_goal = profile.carbGoal;
          updateData.fat_goal = profile.fatGoal;
          console.log('[Profile] Calculated new profile stats:', profile);
        } catch (calcError) {
          console.error('[Profile] Error calculating profile:', calcError);
          // Continue with update without recalculating
        }
      } else {
        console.warn('[Profile] Skipping profile calculation - missing required fields:', { w, h, a, s, al, g });
      }
    }

    updateData.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Build dynamic UPDATE query
    const setClauses: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(updateData)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }

    values.push(user._id);

    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;
    console.log('[Profile] Final SQL:', sql);
    console.log('[Profile] Final Values:', values);

    await query(sql, values);

    // Fetch updated user
    const [rows] = await query(`
      SELECT
        id, email, name, age, weight_kg, height_cm,
        sex, activity_level, goal, subscription_plan,
        subscription_end, daily_calorie_target, tdee, bmr,
        protein_goal, carb_goal, fat_goal, avatar_url, avatar_type, created_at
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
        avatarUrl: updatedUser.avatar_url,
        avatarType: updatedUser.avatar_type,
        createdAt: updatedUser.created_at,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Profile update error details:', errorMessage);
    if (error instanceof Error && error.message.includes('mysql')) {
      return NextResponse.json(
        { error: 'Database error: ' + errorMessage },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Error updating profile' },
      { status: 500 }
    );
  }
}
