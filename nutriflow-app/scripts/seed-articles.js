const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config({ path: '.env.local' });

const ARTICLES = [
  {
    title: 'La importancia de los macronutrientes',
    slug: 'importancia-macronutrientes',
    summary: 'Aprende qué son las proteínas, carbohidratos y grasas, y por qué tu cuerpo los necesita para funcionar correctamente.',
    category: 'nutrición',
    read_time_minutes: 6,
    is_premium: false,
    content: `
# Macronutrientes: Los Pilares de tu Dieta

Los macronutrientes son los nutrientes que el cuerpo necesita en grandes cantidades para proporcionar energía y mantener la estructura y funciones del organismo.

## 1. Proteínas
Son esenciales para la reparación de tejidos y el crecimiento muscular. Se encuentran en carnes, huevos, legumbres y lácteos.

## 2. Carbohidratos
La principal fuente de energía del cerebro y los músculos durante el ejercicio. Opta por carbohidratos complejos como granos enteros y vegetales.

## 3. Grasas
Cruciales para la producción de hormonas y la absorción de vitaminas (A, D, E, K). No todas las grasas son malas; enfócate en las insaturadas provenientes del aguacate y frutos secos.
    `
  },
  {
    title: 'Guía definitiva de Hidratación',
    slug: 'guia-hidratacion-2024',
    summary: '¿Realmente necesitamos 2 litros de agua al día? Descubre la ciencia detrás de la hidratación óptima.',
    category: 'hábitos',
    read_time_minutes: 5,
    is_premium: true,
    content: `
# El Agua: Tu Mejor Aliado

Mantenerse hidratado es fundamental para el metabolismo, la digestión y la salud de la piel.

## Señales de deshidratación
- Sed intensa
- Orina oscura
- Fatiga o mareos

## Consejos para beber más agua
- Lleva siempre una botella contigo.
- Infusiona el agua con frutas naturales.
- Establece recordatorios en Nutriflow.
    `
  },
  {
    title: 'Ayuno Intermitente: Mitos y Realidades',
    slug: 'ayuno-intermitente-mitos',
    summary: 'Exploramos los beneficios y precauciones que debes tener antes de empezar con el ayuno intermitente.',
    category: 'dietas',
    read_time_minutes: 8,
    is_premium: false,
    content: `
# Ayuno Intermitente: ¿Es para ti?

El ayuno intermitente no es una dieta, sino un patrón de alimentación que alterna periodos de ayuno y de ingesta.

## Métodos comunes
- **16/8:** Ayunas 16 horas y comes en una ventana de 8 horas.
- **5:2:** Comes normal 5 días y reduces drásticamente las calorías 2 días.

Recuerda siempre consultar con un profesional antes de cambiar drásticamente tus hábitos alimenticios.
    `
  },
  {
    title: 'Súper Alimentos que no pueden faltar',
    slug: 'super-alimentos-esenciales',
    summary: 'Desde semillas de chía hasta kale, descubre los alimentos con mayor densidad nutricional del planeta.',
    category: 'nutrición',
    read_time_minutes: 4,
    is_premium: false,
    content: `
# Densidad Nutricional

Los "súper alimentos" son aquellos que ofrecen una gran cantidad de nutrientes con un aporte calórico relativamente bajo.

- **Arándanos:** Cargados de antioxidantes.
- **Espinacas:** Fuente de hierro y fibra.
- **Nueces:** Ideales para la salud cerebral.
    `
  },
  {
      title: 'Consejos para un mejor descanso',
      slug: 'consejos-descanso-recuperacion',
      summary: 'El sueño es la base de la recuperación física y mental. Mejora tu higiene del sueño con estos consejos.',
      category: 'recuperación',
      read_time_minutes: 7,
      is_premium: true,
      content: `
# Dormir para Ganar

Sin un sueño adecuado, tus esfuerzos en nutrición y ejercicio se ven limitados.

## Higiene del sueño
1. Mantén un horario regular.
2. Evita pantallas 1 hora antes de dormir.
3. Mantén tu habitación oscura y fresca.
      `
  }
];

async function seed() {
  console.log('--- seeding articles ---');
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 4000,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Ensure table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        summary TEXT,
        content TEXT,
        category VARCHAR(50),
        is_premium BOOLEAN DEFAULT FALSE,
        read_time_minutes INT,
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const art of ARTICLES) {
      const id = crypto.randomUUID();
      await pool.query(
        `INSERT IGNORE INTO articles (id, title, slug, summary, content, category, is_premium, read_time_minutes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, art.title, art.slug, art.summary, art.content, art.category, art.is_premium, art.read_time_minutes]
      );
      console.log(`Seeded: ${art.title}`);
    }
    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
}

seed();
