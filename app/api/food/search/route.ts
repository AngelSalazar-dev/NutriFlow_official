import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

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

    let queryStr = `SELECT id, name, brand, category, calories, protein, carbs, fat, fiber, serving_size as servingSize, serving_name as servingName, is_priority, is_verified as isVerified, data_source as dataSource, ingredients, is_base_ingredient as isBaseIngredient FROM foods`;
    const queryParams: any[] = [];

    if (q) {
      const words = q.trim().split(/\s+/);
      const conditions: string[] = [];
      
      words.forEach(word => {
        conditions.push(`(name LIKE ? OR brand LIKE ? OR category LIKE ?)`);
        const pattern = `%${word}%`;
        queryParams.push(pattern, pattern, pattern);
      });
      
      queryStr += ` WHERE ${conditions.join(' AND ')}`;
      queryStr += ` ORDER BY is_priority DESC, is_verified DESC, name ASC LIMIT 50`;
    } else if (frequent === 'true') {
      queryStr += ` ORDER BY is_priority DESC, created_at DESC LIMIT 20`;
    } else if (category) {
      queryStr += ` WHERE category = ? ORDER BY is_priority DESC, is_verified DESC, name ASC LIMIT 50`;
      queryParams.push(category);
    } else {
      queryStr += ` ORDER BY is_priority DESC, is_verified DESC, name ASC LIMIT 20`;
    }

    const [rows] = await query(queryStr, queryParams);
    const results = rows as any[];

    return NextResponse.json({
      success: true,
      foods: results,
      total: results.length,
    });
  } catch (error: any) {
    console.error('❌ Error searching foods:', error);
    return NextResponse.json(
      { error: 'Error buscando alimentos', details: error.message },
      { status: 500 }
    );
  }
}
