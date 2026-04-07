import { NextRequest, NextResponse } from 'next/server';
import { searchFoods, getFoodById, getFrequentFoods, getFoodsByCategory, FoodItem } from '@/lib/food-database';

/**
 * GET /api/food/search
 * Buscar alimentos por nombre o categoría
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const frequent = searchParams.get('frequent');

    let results: FoodItem[] = [];

    if (frequent === 'true') {
      results = getFrequentFoods();
    } else if (category) {
      results = getFoodsByCategory(category);
    } else if (q) {
      results = searchFoods(q);
    } else {
      results = getFrequentFoods();
    }

    return NextResponse.json({
      success: true,
      foods: results,
      total: results.length,
    });
  } catch (error) {
    console.error('Error searching foods:', error);
    return NextResponse.json(
      { error: 'Error buscando alimentos' },
      { status: 500 }
    );
  }
}
