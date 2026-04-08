import { query } from '../lib/mysql';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno desde .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0 && key.startsWith('MYSQL_')) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const CUISINES = [
  { 
    name: 'Italiana', 
    dishes: ['Lasagna Bolognese', 'Spaghetti Carbonara', 'Fettuccine Alfredo', 'Risotto de Hongos', 'Gnocchi al Pesto', 'Ravioli de Ricotta', 'Pizza Margherita', 'Pizza Pepperoni', 'Bruschetta de Timate', 'Calzone de Jamón', 'Ossobuco', 'Tiramisú', 'Gelato de Vainilla'],
    modifiers: ['al Dente', 'con Parmigiano Reggiano', 'Porto Fino', 'con Trufa Negra', 'Marinara Tradicional', 'Casera', 'Premium', 'Gourmet']
  },
  {
    name: 'Japonesa',
    dishes: ['Ramen Shoyu', 'Miso Soup', 'Sushi Nigiri de Salmón', 'Sushi Maki California', 'Sushi Uramaki Dragon', 'Sashimi de Atún', 'Tempura de Camarón', 'Edamames', 'Teriyaki de Pollo', 'Gyoza de Cerdo', 'Yakitori', 'Onigiri de Alga'],
    modifiers: ['Sashimi Grade', 'con Sriracha', 'con Salsa de Anguila', 'Tradicional', 'Extra Wasabi', 'al Estilo Kyoto', 'Premium', 'Crunchy']
  },
  {
    name: 'China',
    dishes: ['Pato a la Pekín', 'Dumplings de Cerdo', 'Chow Mein de Pollo', 'Arroz Frito Especial', 'Pollo Kung Pao', 'Cerdo Agridulce', 'Spring Rolls', 'Wonton Soup', 'Dim Sum de Camarón', 'Mapo Tofu', 'Res con Brócoli', 'Lo Mein'],
    modifiers: ['al Wok', 'Cantonese Style', 'Szechuan Spicy', 'con Jengibre y Ajo', 'Auténtico', 'Premium', 'Double Portion']
  },
  {
    name: 'India',
    dishes: ['Chicken Tikka Masala', 'Butter Chicken', 'Lamb Rogan Josh', 'Paneer Butter Masala', 'Naan con Ajo', 'Arroz Biryani', 'Samosa de Papa', 'Dal Makhani', 'Tandoori Chicken', 'Chana Masala', 'Aloo Gobi', 'Palak Paneer'],
    modifiers: ['Tandoori Baked', 'Extremadamente Picante', 'Masala Style', 'con Especias Orgánicas', 'al Horno de Barro', 'Gourmet']
  },
  {
    name: 'Mexicana',
    dishes: ['Taco de Pastor', 'Taco de Marlín Ahumado', 'Taco de Camarón Gobernador', 'Enchiladas Suizas', 'Chiles en Nogada', 'Pozole Rojo', 'Tamal de Mole', 'Gordita de Chicharrón', 'Sope de Asada', 'Ceviche de Pescado', 'Aguachile de Camaron', 'Mole Poblano'],
    modifiers: ['con Queso Fundido', 'con Aguacate Hass', 'con Crema de Rancho', 'Especial de la Casa', 'al Estilo Sinaloa', 'al Estilo Oaxaca', 'Gourmet', 'XL']
  },
  {
    name: 'Estadounidense',
    dishes: ['Cheeseburger Doble', 'Buffalo Wings', 'BBQ Ribs', 'Mac and Cheese', 'Hot Dog Nueva York', 'Apple Pie', 'Pancakes con Maple', 'Clam Chowder', 'Steak Ribeye', 'Caesar Salad', 'Philly Cheesesteak', 'Cornbread'],
    modifiers: ['Angus Beef', 'Smoked Low and Slow', 'con Extra Bacon', 'Crispy', 'Farm to Table', 'Classic Diner Style', 'Jumbo']
  },
  {
    name: 'Mediterránea',
    dishes: ['Hummus Tradicional', 'Falafel de Garbanzo', 'Ensalada Griega', 'Gyros de Cordero', 'Tabbouleh', 'Baba Ganoush', 'Moussaka', 'Paella de Mariscos', 'Tortilla Española', 'Gazpacho Andaluz', 'Kebab de Pollo'],
    modifiers: ['con Aceite de Oliva Virgen', 'con Feta Genuino', 'al Estilo Atenas', 'Fresh Mediterranean', 'Gourmet']
  }
];

const BRANDS = ['Barilla', 'Kikkoman', 'Ferrero', 'Lindt', 'Nestle', 'Bimbo', 'Lala', 'Coca-Cola', 'Kellogg\'s', 'Kraft', 'Heinz', 'Campbell\'s', 'Goya', 'De Cecco', 'Bertolli'];

async function seed() {
  console.log('🚀 Iniciando siembra GLOBAL de 250,000+ alimentos...');
  
  try {
    await query('DELETE FROM foods');
    console.log('🗑️ Tabla foods limpiada.');

    let count = 0;
    const batchSize = 1000;
    let values: any[] = [];
    let placeholders: string[] = [];

    const insertBatch = async () => {
      if (placeholders.length === 0) return;
      await query(`
        INSERT INTO foods 
        (id, name, brand, calories, protein, carbs, fat, fiber, serving_size, serving_name, category, is_verified, is_priority) 
        VALUES ${placeholders.join(',')}
      `, values);
      values = [];
      placeholders = [];
      process.stdout.write(`\r📦 Progreso: ${count} / 250,000...`);
    };

    // 1. GENERACIÓN POR COCINA (Matriz de Síntesis)
    for (const cuisine of CUISINES) {
      console.log(`\n👨‍🍳 Generando cocina ${cuisine.name}...`);
      for (const dish of cuisine.dishes) {
        for (const mod of cuisine.modifiers) {
          for (const brand of ['Local', 'Gourmet', 'Genérico', ...BRANDS.slice(0, 3)]) {
            const name = `${dish} ${mod} (${brand === 'Local' ? cuisine.name : brand})`;
            count++;
            
            const baseCal = 200 + Math.random() * 600;
            values.push(
              crypto.randomUUID(), name, brand, 
              baseCal, 10 + Math.random() * 30, 20 + Math.random() * 50, 5 + Math.random() * 30, 
              2, 1, 'porción', cuisine.name, 1, brand === 'Local' ? 1 : 0
            );
            placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            if (count % batchSize === 0) await insertBatch();
          }
        }
      }
    }

    // 2. RELLENO MASIVO PARA LLEGAR A 250k (Sin números, solo variantes descriptivas)
    console.log(`\n📦 Completando base global hasta 250,000...`);
    const globalModifiers = ['Sin Gluten', 'Orgánico', 'Bajo en Grasa', 'Extra Proteína', 'Vegano', 'Keto Friendly', 'Receta Secreta', 'Edición Limitada', 'Fresco del Día'];
    const regions = ['Norte', 'Sur', 'Costa', 'Montaña', 'Capital', 'Pueblo', 'Artesanal', 'Industrial'];

    while (count < 250000) {
      const cuisine = CUISINES[Math.floor(Math.random() * CUISINES.length)];
      const dish = cuisine.dishes[Math.floor(Math.random() * cuisine.dishes.length)];
      const mod = globalModifiers[Math.floor(Math.random() * globalModifiers.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
      
      const name = `${dish} ${mod} Estilo ${region} (${brand})`;
      // Para evitar repetición exacta, añadimos una variante de ingrediente secundaria
      const secondaryIngredients = ['con Huevo', 'con Queso', 'con Sriracha', 'con Ajo', 'con Cebolla Caramelizada', 'al Carbón'];
      const finalName = `${name} ${secondaryIngredients[count % secondaryIngredients.length]}`;

      count++;
      values.push(
        crypto.randomUUID(), finalName, brand,
        150 + Math.random() * 400, 5 + Math.random() * 25, 10 + Math.random() * 50, 2 + Math.random() * 20,
        1, 100, 'gramos', cuisine.name, 0, 0
      );
      placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      if (count % batchSize === 0 || count === 250000) await insertBatch();
    }

    console.log('\n✅ Siembra GLOBAL de 250,000 alimentos completada.');
  } catch (error) {
    console.error('\n❌ Error durante la siembra:', error);
  } finally {
    process.exit();
  }
}

seed();
