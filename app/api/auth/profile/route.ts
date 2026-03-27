import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import { calculateUserProfile } from '@/lib/utils';
import { ObjectId } from 'mongodb';

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
    const db = await getDb();

    // Fields that can be updated
    const allowedFields = ['name', 'age', 'sex', 'weight', 'height', 'activityLevel', 'goal'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Recalculate profile if weight, height, age, sex, activityLevel or goal changed
    if (updateData.weight || updateData.height || updateData.age || updateData.sex || updateData.activityLevel || updateData.goal) {
      const profile = calculateUserProfile(
        updateData.weight || user.weight,
        updateData.height || user.height,
        updateData.age || user.age,
        updateData.sex || user.sex,
        updateData.activityLevel || user.activityLevel,
        updateData.goal || user.goal
      );
      updateData.bmr = profile.bmr;
      updateData.tdee = profile.tdee;
      updateData.calorieGoal = profile.calorieGoal;
      updateData.proteinGoal = profile.proteinGoal;
      updateData.carbGoal = profile.carbGoal;
      updateData.fatGoal = profile.fatGoal;
    }

    updateData.updatedAt = new Date();

    const userId = new ObjectId(String(user._id));

    await db.collection('users').updateOne(
      { _id: userId },
      { $set: updateData }
    );

    const updatedUser = await db.collection('users').findOne({ _id: userId });

    return NextResponse.json({
      user: {
        _id: updatedUser?._id?.toString(),
        email: updatedUser?.email,
        name: updatedUser?.name,
        age: updatedUser?.age,
        sex: updatedUser?.sex,
        weight: updatedUser?.weight,
        height: updatedUser?.height,
        activityLevel: updatedUser?.activityLevel,
        goal: updatedUser?.goal,
        subscriptionPlan: updatedUser?.subscriptionPlan,
        bmr: updatedUser?.bmr,
        tdee: updatedUser?.tdee,
        calorieGoal: updatedUser?.calorieGoal,
        proteinGoal: updatedUser?.proteinGoal,
        carbGoal: updatedUser?.carbGoal,
        fatGoal: updatedUser?.fatGoal,
        createdAt: updatedUser?.createdAt,
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
