import { NextRequest, NextResponse } from 'next/server';
import { AIManager } from '@/lib/ai/strategy';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query, transaction } from '@/lib/mysql';

const aiManager = new AIManager();

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text, date } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const prompt = `
      Eres un experto nutricionista. Analiza la siguiente descripción de una comida y extrae los alimentos, sus cantidades estimadas en gramos, calorías y macronutrientes (proteína, carbohidratos, grasas).
      
      Descripción: "${text}"
      Idioma de salida: Español.
      
      IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido que siga esta estructura exacta:
      {
        "mealType": "breakfast" | "lunch" | "dinner" | "snack",
        "foods": [
          {
            "name": "nombre del alimento",
            "calories": número,
            "protein": número,
            "carbs": número,
            "fat": número,
            "servingSize": número (en gramos),
            "servingName": "porción (ej: 1 pieza, 2 huevos, 1 taza)"
          }
        ]
      }
      
      Si no puedes determinar algo, usa valores estimados realistas basados en nutrición estándar.
    `;

    const aiResponse = await aiManager.generate(prompt);
    
    // Clean JSON if the model added markdown blocks
    const jsonStr = aiResponse.text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(jsonStr);

    if (!parsedData.foods || !Array.isArray(parsedData.foods)) {
      throw new Error('Invalid AI response structure');
    }

    const results = [];
    const logDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    // Use transaction for consistency
    await transaction(async (connection) => {
      for (const food of parsedData.foods) {
        const id = crypto.randomUUID();
        
        // 1. Insert in food_logs
        await query(`
          INSERT INTO food_logs (
            id, user_id, food_name, calories, protein_g, carbs_g, fat_g, 
            serving_size_g, serving_name, meal_type, log_date, is_custom_food, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
          id,
          user._id,
          food.name,
          Number(food.calories),
          Number(food.protein) || 0,
          Number(food.carbs) || 0,
          Number(food.fat) || 0,
          Number(food.servingSize) || 100,
          food.servingName || 'gramos',
          parsedData.mealType || 'snack',
          logDate,
          0
        ], connection);

        // 2. Update daily_logs
        await query(`
          INSERT INTO daily_logs (user_id, log_date, total_calories, total_protein, total_carbs, total_fat, water_ml)
          VALUES (?, ?, ?, ?, ?, ?, 0)
          ON DUPLICATE KEY UPDATE
            total_calories = total_calories + ?,
            total_protein = total_protein + ?,
            total_carbs = total_carbs + ?,
            total_fat = total_fat + ?
        `, [
          user._id, logDate, Number(food.calories), Number(food.protein) || 0, Number(food.carbs) || 0, Number(food.fat) || 0,
          Number(food.calories), Number(food.protein) || 0, Number(food.carbs) || 0, Number(food.fat) || 0,
        ], connection);

        results.push({ id, ...food });
      }
    });

    return NextResponse.json({ 
      success: true, 
      mealType: parsedData.mealType,
      foods: results,
      provider: aiResponse.provider
    });

  } catch (error: any) {
    console.error('[SMART-LOG] Error:', error);
    return NextResponse.json({ error: 'Failed to parse meal description', details: error.message }, { status: 500 });
  }
}
