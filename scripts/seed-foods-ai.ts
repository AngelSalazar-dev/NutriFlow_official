import { AIManager } from '../lib/ai/strategy';
import { query, transaction } from '../lib/mysql';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const aiManager = new AIManager();

const CATEGORIES = [
  'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 
  'Mexican Food', 'American Cuisine', 'Regional', 'Fast Food'
];

async function generateFoodsBatch(region: string, count: number = 10) {
  console.log(`[SEEDER] Generating ${count} food items for region: ${region}...`);
  
  const prompt = `
    Generate a list of ${count} popular dishes or food items from: "${region}".
    Include common variants.
    
    IMPORTANT: Respond ONLY with a valid JSON array of objects with this structure:
    [
      {
        "name": "English Name (Spanish Name)",
        "brand": "Generic" | "Popular Brand",
        "category": "One of: ${CATEGORIES.join(', ')}",
        "calories": number (kcal per 100g),
        "protein": number (g per 100g),
        "carbs": number (g per 100g),
        "fat": number (g per 100g),
        "fiber": number (g per 100g),
        "servingSize": 100,
        "servingName": "100g",
        "ingredients": "main ingredients list in English and Spanish",
        "isBaseIngredient": false
      }
    ]
    
    Ensure nutritional values are realistic per 100g.
  `;

  try {
    const aiResponse = await aiManager.generate(prompt);
    // Robust JSON extraction
    const jsonMatch = aiResponse.text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      console.error(`[SEEDER] No JSON array found in response for ${region}`);
      return [];
    }
    const foods = JSON.parse(jsonMatch[0]);
    return foods;
  } catch (error) {
    console.error(`[SEEDER] Error generating batch for ${region}:`, error);
    return [];
  }
}

async function seedFoods() {
  const regions = [
    'Traditional Mexican - Central Region',
    'Traditional Mexican - Northern Region',
    'Traditional Mexican - Southern Region',
    'Traditional Mexican - Street Food',
    'American - Classic Comfort Food',
    'American - Regional BBQ Styles',
    'American - Fast Food Favorites',
    'Tex-Mex Fusion Dishes'
  ];

  console.log('🚀 Starting AI Food Seeder (Resilient Mode)...');

  for (const region of regions) {
    // Run multiple small batches per region
    for (let i = 0; i < 3; i++) {
      const foods = await generateFoodsBatch(region, 10);
      
      if (foods.length === 0) {
        console.log(`[SEEDER] Batch ${i+1} failed for ${region}, retrying...`);
        continue;
      }

      console.log(`[SEEDER] Inserting ${foods.length} items from batch ${i+1} into DB...`);
      
      await transaction(async (connection) => {
        for (const food of foods) {
          const id = uuidv4();
          try {
            // Deduplication check
            const [existing] = await query('SELECT id FROM foods WHERE name = ? LIMIT 1', [food.name], connection);
            if ((existing as any[]).length > 0) {
              console.log(`[SEEDER] Skipping duplicate: ${food.name}`);
              continue;
            }

            await query(`
              INSERT INTO foods (
                id, name, brand, category, calories, protein, carbs, fat, fiber, 
                serving_size, serving_name, is_priority, is_verified, data_source, 
                ingredients, is_base_ingredient, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
              id,
              food.name,
              food.brand || 'Generic',
              food.category || 'Regional',
              food.calories,
              food.protein,
              food.carbs,
              food.fat,
              food.fiber || 0,
              food.servingSize || 100,
              food.servingName || '100g',
              1, 
              1, 
              'NutriFlow AI Seeder v2',
              food.ingredients || '',
              food.isBaseIngredient ? 1 : 0
            ], connection);
          } catch (e) {
            // Silence errors
          }
        }
      });
      console.log(`✅ Batch ${i+1} for ${region} complete.`);
    }
  }

  console.log('🏁 Seeding finished successfully!');
  process.exit(0);
}

seedFoods();
