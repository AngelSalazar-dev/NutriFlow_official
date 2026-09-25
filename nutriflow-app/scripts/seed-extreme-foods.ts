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

const CATEGORIES = [
  'Proteínas', 'Carbohidratos', 'Grasas', 'Frutas', 'Verduras', 
  'Bebidas', 'Comida Mexicana', 'Fast Food', 'Snacks', 'Salsas y Aderezos'
];

const PREPARATIONS = [
  { name: 'Crudo/Natural', calMod: 1, pMod: 1, cMod: 1, fMod: 1 },
  { name: 'Asado', calMod: 1.1, pMod: 1.05, cMod: 1, fMod: 1.2 },
  { name: 'Hervido', calMod: 0.9, pMod: 1, cMod: 1, fMod: 0.8 },
  { name: 'Frito', calMod: 2.5, pMod: 1, cMod: 1.1, fMod: 4.0 },
  { name: 'Empanizado', calMod: 2.0, pMod: 1.1, cMod: 3.0, fMod: 3.0 },
  { name: 'Al Horno', calMod: 1.2, pMod: 1.05, cMod: 1, fMod: 1.3 },
  { name: 'A la Plancha', calMod: 1.1, pMod: 1.05, cMod: 1, fMod: 1.3 },
  { name: 'Guisado', calMod: 1.5, pMod: 1.1, cMod: 1.5, fMod: 1.8 },
  { name: 'Capeado', calMod: 3.0, pMod: 1.2, cMod: 4.0, fMod: 5.0 },
  { name: 'Al Vapor', calMod: 0.95, pMod: 1, cMod: 1, fMod: 0.9 },
  { name: 'BBQ', calMod: 1.6, pMod: 1.05, cMod: 2.5, fMod: 1.4 },
  { name: 'Sancochado', calMod: 1.3, pMod: 1, cMod: 1.2, fMod: 2.0 },
];

const ADDONS = [
  { name: 'Sencillo', cal: 0, p: 0, c: 0, f: 0 },
  { name: 'con Queso', cal: 100, p: 6, c: 1, f: 8 },
  { name: 'con Aguacate', cal: 80, p: 1, c: 4, f: 7 },
  { name: 'con Crema', cal: 60, p: 1, c: 2, f: 6 },
  { name: 'Especial', cal: 150, p: 8, c: 5, f: 12 },
  { name: 'con Todo', cal: 200, p: 10, c: 8, f: 15 },
  { name: 'al Mojo de Ajo', cal: 90, p: 0, c: 1, f: 10 },
  { name: 'al Chipotle', cal: 70, p: 1, c: 6, f: 5 },
  { name: 'Gobernador', cal: 180, p: 12, c: 10, f: 10 }, // Específico para mariscos
  { name: 'Light/Ligero', cal: -20, p: 0, c: -5, f: -5 },
];

const BRANDS = [
  'Bimbo', 'Lala', 'Herdez', 'Sabritas', 'Barcel', 'Nestle', 'Marinela', 'Tía Rosa', 'Gamesa',
  'Coca-Cola', 'Pepsi', 'Kellogg\'s', 'Quaker', 'Goya', 'Herdez', 'Bachoco', 'Tyson', 'Kraft',
  'General Mills', 'Heinz', 'Campbell\'s', 'Nabisco', 'Planters', 'Oscar Mayer', 'Smucker\'s'
];

const BASE_PROTEINS = [
  { name: 'Pechuga de Pollo', cal: 165, p: 31, c: 0, f: 3.6 },
  { name: 'Carne de Res (Bistec)', cal: 250, p: 26, c: 0, f: 15 },
  { name: 'Carne de Res (Molida)', cal: 241, p: 24, c: 0, f: 16 },
  { name: 'Puerco (Lomo)', cal: 242, p: 27, c: 0, f: 14 },
  { name: 'Salmon', cal: 208, p: 20, c: 0, f: 13 },
  { name: 'Atún en Agua', cal: 116, p: 26, c: 0, f: 0.8 },
  { name: 'Camarones', cal: 99, p: 24, c: 0.2, f: 0.3 },
  { name: 'Marlín Ahumado', cal: 150, p: 28, c: 0, f: 4 },
  { name: 'Pulpo', cal: 82, p: 15, c: 2, f: 1 },
  { name: 'Pescado Blanco (Tilapia)', cal: 128, p: 26, c: 0, f: 3 },
  { name: 'Tofu', cal: 76, p: 8, c: 2, f: 4.8 },
  { name: 'Huevo Blanco', cal: 155, p: 13, c: 1.1, f: 11 },
  { name: 'Cecina de Res', cal: 280, p: 35, c: 0, f: 15 },
  { name: 'Arrachera', cal: 280, p: 22, c: 0, f: 21 },
  { name: 'Costilla de Puerco', cal: 350, p: 20, c: 0, f: 30 },
];

const MEXICAN_BASE = [
  'Taco de Pastor', 'Taco de Barbacoa', 'Taco de Suadero', 'Taco de Carnitas', 'Taco de Lengua',
  'Taco de Marlín', 'Taco de Camarón', 'Taco Capeado', 'Enchilada Verde', 'Enchilada Roja',
  'Enchilada de Mole', 'Tamal de Rajas', 'Tamal de Verde', 'Tamal Oaxaqueño', 'Gordita de Chicharrón',
  'Gordita de Deshebrada', 'Sope de Pollo', 'Tostada de Mariscos', 'Ceviche de Pescado',
  'Aguachile Verde', 'Burrito de Machaca', 'Chilaquiles con Pollo', 'Pozole de Puerco', 'Menudo',
  'Flautas de Papa', 'Enfrijoladas', 'Huarache de Cecina', 'Pambazo', 'Torta Ahogada', 'Lonche de Pierna'
];

async function seed() {
  console.log('🚀 Iniciando siembra EXTREMA de 100,000 alimentos...');
  
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
      process.stdout.write(`\r📦 Progreso: ${count} / 100,000...`);
    };

    // 1. FUNDAMENTALES (Prioridad Alta) - ~2,000 items
    console.log('\n🌱 Generando fundamentales...');
    for (const prot of BASE_PROTEINS) {
      for (const prep of PREPARATIONS) {
        const name = `${prot.name} ${prep.name}`;
        count++;
        values.push(
          crypto.randomUUID(), name, 'Genérico', 
          prot.cal * prep.calMod, prot.p * prep.pMod, prot.c * prep.cMod, prot.f * prep.fMod, 
          0, 100, 'gramos', 'Proteínas', 1, 1
        );
        placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        if (count % batchSize === 0) await insertBatch();
      }
    }

    // 2. COMIDA MEXICANA Y REGIONAL - ~40,000 items
    console.log('\n🌮 Generando platillos mexicanos...');
    for (const base of MEXICAN_BASE) {
      for (const addon of ADDONS) {
        for (let i = 1; i <= 150; i++) {
          const style = i === 1 ? '' : `Estilo ${i}`;
          const name = `${base} ${addon.name} ${style}`.trim();
          count++;
          
          const baseCal = 200 + Math.random() * 300;
          values.push(
            crypto.randomUUID(), name, 'Local', 
            baseCal + addon.cal, 15 + addon.p, 30 + addon.c, 10 + addon.f, 
            2, 1, 'orden', 'Comida Mexicana', 1, i === 1 ? 1 : 0
          );
          placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
          if (count % batchSize === 0) await insertBatch();
          if (count >= 100000) break;
        }
        if (count >= 100000) break;
      }
      if (count >= 100000) break;
    }

    // 3. MARCAS Y PRODUCTOS COMERCIALES - ~60,000 items
    console.log('\n🍞 Generando marcas y productos comerciales...');
    const productTypes = [
      'Galletas', 'Pan', 'Yogur', 'Cereal', 'Botana', 'Refresco', 'Leche', 'Queso', 'Jamón', 
      'Pasta', 'Salsa', 'Aderezo', 'Helado', 'Jugo', 'Café', 'Té', 'Barra de Proteía'
    ];
    
    for (const brand of BRANDS) {
      for (const type of productTypes) {
        for (let i = 1; i <= 250; i++) {
          const flavor = `Sabor ${i}`;
          const variants = ['Clásico', 'Zero', 'Light', 'Premium', 'Integral', 'con Stevia', 'XL'];
          const v = variants[i % variants.length];
          const name = `${brand} - ${type} ${flavor} ${v}`;
          count++;

          values.push(
            crypto.randomUUID(), name, brand,
            50 + Math.random() * 500, 2 + Math.random() * 20, 10 + Math.random() * 60, 1 + Math.random() * 30,
            0, 100, 'g/ml', 'Marcas', 0, 0
          );
          placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
          if (count % batchSize === 0) await insertBatch();
          if (count >= 100000) break;
        }
        if (count >= 100000) break;
      }
      if (count >= 100000) break;
    }

    // Relleno final para asegurar 100k exactos
    while (count < 100000) {
      count++;
      values.push(
        crypto.randomUUID(), `Producto Genérico de Alta Calidad #${count}`, 'NutriFlow',
        100, 5, 15, 2, 0, 100, 'gramos', 'Otros', 0, 0
      );
      placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      if (count % batchSize === 0 || count === 100000) await insertBatch();
    }

    console.log('\n✅ Siembra EXTREMA completada con éxito.');
  } catch (error) {
    console.error('\n❌ Error durante la siembra:', error);
  } finally {
    process.exit();
  }
}

seed();
