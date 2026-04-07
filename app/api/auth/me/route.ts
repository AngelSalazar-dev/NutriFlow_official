import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'No authenticated' },
        { status: 401 }
      );
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
        calorieGoal: user.calorieGoal,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Error getting user' },
      { status: 500 }
    );
  }
}
