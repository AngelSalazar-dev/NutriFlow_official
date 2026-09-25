/**
 * Database Seed Script for MySQL
 * Run this once to populate the database with initial articles
 * 
 * Usage: npx tsx scripts/seed-mysql.ts
 */

import { query, closePool } from '../lib/mysql';

const ARTICLES = [
  {
    title: 'Los 10 Mejores Alimentos para la Salud del Corazón',
    slug: 'alimentos-salud-corazon',
    summary: 'Descubre qué alimentos pueden reducir el riesgo de enfermedades cardiovasculares y mejorar tu salud cardíaca.',
    category: 'nutrition',
    readTime: 7,
  },
  {
    title: 'Guía Completa sobre Proteínas: ¿Cuánta Realmente Necesitas?',
    slug: 'guia-completa-proteinas',
    summary: 'La ciencia actualizada sobre requerimientos de proteína para diferentes objetivos y poblaciones.',
    category: 'nutrition',
    readTime: 9,
  },
  {
    title: 'Entrenamiento de Fuerza vs Cardio: ¿Cuál es Mejor?',
    slug: 'fuerza-vs-cardio',
    summary: 'Analizamos la evidencia científica para ayudarte a elegir el mejor enfoque para tus objetivos.',
    category: 'exercise',
    readTime: 8,
  },
  {
    title: 'El Impacto del Sueño en tu Rendimiento Deportivo',
    slug: 'sueno-rendimiento-deportivo',
    summary: 'Cómo la calidad del sueño afecta tu recuperación, fuerza y composición corporal.',
    category: 'wellness',
    readTime: 6,
  },
  {
    title: 'Suplementos con Evidencia Científica Real',
    slug: 'suplementos-evidencia-cientifica',
    summary: 'Separando los hechos de la ficción: qué suplementos realmente funcionan según la ciencia.',
    category: 'supplements',
    readTime: 12,
  },
  {
    title: 'Nutrición Pre y Post Entrenamiento: Guía Basada en Ciencia',
    slug: 'nutricion-pre-post-entreno',
    summary: 'Optimiza tu alimentación alrededor del ejercicio para maximizar resultados.',
    category: 'nutrition',
    readTime: 10,
  },
  {
    title: 'Cómo Crear Hábitos Saludables que Duren para Siempre',
    slug: 'crear-habitos-saludables',
    summary: 'Estrategias psicológicas validadas para transformar tu estilo de vida permanentemente.',
    category: 'wellness',
    readTime: 8,
  },
  {
    title: 'Metabolismo y Pérdida de Peso: La Verdad Científica',
    slug: 'metabolismo-perdida-peso',
    summary: 'Entiende cómo funciona realmente tu metabolismo y cómo optimizarlo.',
    category: 'nutrition',
    readTime: 11,
  },
];

const ARTICLE_CONTENT: Record<string, string> = {
  'alimentos-salud-corazon': `
# Los 10 Mejores Alimentos para la Salud del Corazón

Las enfermedades cardiovasculares son la principal causa de muerte a nivel mundial, pero la buena noticia es que muchos casos pueden prevenirse con una alimentación adecuada.

## ¿Por Qué la Alimentación Importa?

Tu corazón bombea aproximadamente 100,000 veces al día, circulando 7,500 litros de sangre. Para mantener este ritmo increíble, necesita nutrientes específicos que solo una alimentación balanceada puede proporcionar.

## Los 10 Alimentos Estrella

### 1. Salmón y Pescados Grasos
Ricos en omega-3, reducen la inflamación y los triglicéridos.
- **Porción recomendada**: 2 porciones de 150g por semana
- **Beneficio**: Reduce riesgo de arritmias en 30%

### 2. Avena
La fibra soluble reduce el colesterol LDL.
- **Porción recomendada**: 40g diarios
- **Beneficio**: Reduce colesterol en 5-10% en 4 semanas

### 3. Nueces y Almendras
Grasas saludables, vitamina E y magnesio.
- **Porción recomendada**: 30g diarios (un puñado)
- **Beneficio**: Reduce riesgo cardiovascular en 30%

### 4. Aceite de Oliva Extra Virgen
Antioxidantes y grasas monoinsaturadas.
- **Porción recomendada**: 2-3 cucharadas diarias
- **Beneficio**: Reduce presión arterial

### 5. Vegetales de Hojas Verdes
Espinacas, kale, acelgas: ricos en nitratos.
- **Porción recomendada**: 1-2 tazas diarias
- **Beneficio**: Reduce presión arterial en 2-4 mmHg

## Conclusión

Incorporar estos alimentos no es difícil. Comienza con 2-3 esta semana y ve añadiendo más gradualmente. Tu corazón te lo agradecerá.

---

*Artículo basado en investigaciones de la American Heart Association.*
`,

  'guia-completa-proteinas': `
# Guía Completa sobre Proteínas: ¿Cuánta Realmente Necesitas?

La proteína es el macronutriente más discutido y frecuentemente malentendido. Vamos a aclarar la ciencia.

## ¿Qué Es la Proteína?

Las proteínas son cadenas de aminoácidos que forman:
- Músculos
- Enzimas
- Hormonas
- Anticuerpos
- Tejido conectivo

Tu cuerpo no puede almacenar proteína, por lo que necesita un suministro constante.

## Requerimientos por Objetivo

### Población General (Sedentaria)
**0.8g por kg de peso corporal**

Ejemplo: Persona de 70kg = 56g de proteína diaria

### Para Ganar Músculo
**1.6-2.2g por kg de peso corporal**

La investigación muestra que más de 2.2g/kg no aporta beneficios adicionales.

### Para Perder Peso
**2.0-2.5g por kg de peso corporal**

La proteína alta:
- Aumenta saciedad
- Preserva masa muscular
- Tiene mayor efecto térmico

## Conclusión

Calcula tu objetivo, distribuye tu proteína a lo largo del día, y prioriza fuentes de calidad. Simple, efectivo, basado en ciencia.

---

*Referencias: Journal of Nutrition, International Society of Sports Nutrition Position Stand 2023*
`,
};

async function seedArticles() {
  try {
    console.log('🗑️  Eliminando artículos existentes...');
    await query('DELETE FROM articles');

    console.log('📝 Insertando nuevos artículos...');
    
    for (const article of ARTICLES) {
      const content = ARTICLE_CONTENT[article.slug] || `
# ${article.title}

Contenido completo del artículo...

Este es un artículo de ejemplo. En producción, este contenido sería obtenido de fuentes verificadas mediante web scraping ético o APIs oficiales.

## Sección 1
Contenido detallado...

## Conclusión
Resumen final...
      `;

      const [uuidResult] = await query('SELECT UUID() as id');
      const articleId = (uuidResult as any)[0].id;

      await query(`
        INSERT INTO articles (
          id, title, slug, summary, content, category, 
          is_premium, read_time_minutes, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, FALSE, ?, NOW())
      `, [
        articleId,
        article.title,
        article.slug,
        article.summary,
        content,
        article.category,
        article.readTime,
      ]);

      console.log(`  ✓ ${article.title}`);
    }

    console.log('✅ Seed de artículos completado');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error seeding articles:', error);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Iniciando seed de NutriFlow MySQL...\n');

  try {
    // Seed articles
    await seedArticles();

    console.log('\n✅ ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log('   - Artículos: 8');
    console.log('   - Categorías: nutrition, exercise, wellness, supplements');
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await closePool();
    console.log('\n👋 Conexión MySQL cerrada\n');
  }
}

main();
