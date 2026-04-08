/**
 * Seed articles into the MySQL database
 * Run: npx tsx scripts/seed-articles.ts
 */
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { query } from '@/lib/mysql';

const articles = [
  {
    title: 'Guía completa de proteínas: Cuánta necesitas y las mejores fuentes',
    slug: 'guia-completa-proteinas',
    summary: 'Descubre cuánta proteína necesitas diariamente, las mejores fuentes animales y vegetales, y cómo distribuirla en tus comidas para optimizar tu salud.',
    content: `# Guía completa de proteínas: Cuánta necesitas y las mejores fuentes

## ¿Por qué son importantes las proteínas?

Las proteínas son los bloques constructores de tu cuerpo. Cada célula, tejido y órgano necesita proteínas para funcionar correctamente. Son esenciales para:

- **Reparación muscular**: Después del ejercicio, tus fibras musculares necesitan proteínas para recuperarse y crecer.
- **Sistema inmunológico**: Los anticuerpos son proteínas que te protegen de enfermedades.
- **Hormonas y enzimas**: La insulina, la hormona de crecimiento y cientos de enzimas son proteínas.
- **Saciedad**: Las proteínas son el macronutriente que más saciedad produce, ayudando a controlar el apetito.

## ¿Cuánta proteína necesitas?

La recomendación general varía según tu objetivo:

| Objetivo | Proteína diaria |
|----------|----------------|
| Sedentario | 0.8g por kg de peso |
| Activo moderado | 1.2-1.6g por kg de peso |
| Ganancia muscular | 1.6-2.2g por kg de peso |
| Pérdida de grasa | 1.8-2.5g por kg de peso |

**Ejemplo**: Si pesas 70 kg y quieres ganar músculo, necesitas entre 112g y 154g de proteína al día.

## Mejores fuentes de proteína

### Origen animal
- **Pechuga de pollo** (31g por 100g)
- **Atún** (26g por 100g)
- **Huevos** (6g por huevo grande)
- **Yogur griego** (10g por 100g)
- **Salmón** (20g por 100g)

### Origen vegetal
- **Lentejas** (9g por 100g cocidas)
- **Garbanzos** (8.9g por 100g cocidos)
- **Tofu** (8g por 100g)
- **Quinoa** (4.4g por 100g cocida)
- **Almendras** (21g por 100g)

## Distribución ideal

No consumas toda tu proteína en una sola comida. Tu cuerpo absorbe mejor entre 25-40g por comida. Distribúyela en 3-5 comidas al día para maximizar la síntesis de proteína muscular.

## Conclusión

Asegúrate de incluir una fuente de proteína de calidad en cada comida. Varía entre fuentes animales y vegetales para obtener todos los aminoácidos esenciales.`,
    category: 'basics',
    is_premium: false,
    read_time_minutes: 7,
  },
  {
    title: 'Hidratación y rendimiento: El agua que tu cuerpo necesita',
    slug: 'hidratacion-y-rendimiento',
    summary: 'Aprende cuánta agua necesitas según tu actividad, cómo la deshidratación afecta tu rendimiento y las mejores estrategias para mantenerte hidratado.',
    content: `# Hidratación y rendimiento: El agua que tu cuerpo necesita

## El agua es vida

El cuerpo humano está compuesto en un 60% de agua. Cada sistema depende de ella:

- **Termorregulación**: El sudor enfría tu cuerpo durante el ejercicio.
- **Transporte de nutrientes**: La sangre (90% agua) lleva oxígeno y nutrientes a tus células.
- **Lubricación articular**: El líquido sinovial protege tus articulaciones.
- **Digestión**: Las enzimas digestivas necesitan agua para funcionar.

## ¿Cuánta agua necesitas?

La recomendación básica es **35ml por kg de peso corporal** como mínimo:

- Persona de 60 kg → 2.1 litros
- Persona de 70 kg → 2.45 litros
- Persona de 80 kg → 2.8 litros

**Durante el ejercicio**, agrega 500-1000ml por hora de actividad física.

## Señales de deshidratación

- Orina oscura (debe ser amarillo claro)
- Dolor de cabeza
- Fatiga y falta de concentración
- Sequedad en boca y piel
- Calambres musculares

## Estrategias de hidratación

1. **Empieza el día con agua**: Bebe un vaso al despertar.
2. **Lleva siempre una botella**: Ten agua al alcance de la mano.
3. **Come alimentos hidratantes**: Pepino (96% agua), sandía (92%), lechuga (95%).
4. **Antes, durante y después del ejercicio**: 
   - 2 horas antes: 500ml
   - Durante: 150-250ml cada 15 minutos
   - Después: 500ml por cada kg perdido

## Conclusión

La hidratación es uno de los hábitos más simples y más impactantes que puedes mejorar. No esperes a tener sed para beber agua.`,
    category: 'tips',
    is_premium: false,
    read_time_minutes: 5,
  },
  {
    title: 'Pérdida de grasa: Lo que realmente funciona (sin dietas extremas)',
    slug: 'perdida-de-grasa-guia',
    summary: 'La ciencia detrás de la pérdida de grasa sostenible. Aprende a crear un déficit calórico moderado sin pasar hambre y manteniendo tu masa muscular.',
    content: `# Pérdida de grasa: Lo que realmente funciona (sin dietas extremas)

## El principio fundamental: Déficit calórico

Para perder grasa, necesitas consumir menos calorías de las que tu cuerpo gasta. Esto es **innegociiable** desde el punto de vista termodinámico.

Pero el déficit NO tiene que ser drástico:
- **Déficit moderado**: 300-500 kcal debajo de tu mantenimiento
- **Pérdida esperada**: 0.3-0.5 kg por semana
- **Ventaja**: Preservas masa muscular y no pasas hambre

## Los 3 pilares de la pérdida de grasa

### 1. Proteína suficiente
Consume 1.8-2.5g de proteína por kg de peso. Esto protege tu masa muscular y te mantiene saciado.

### 2. Entrenamiento de fuerza
Levanta pesas o haz ejercicios de fuerza 3-4 veces por semana. Esto le dice a tu cuerpo: "necesito estos músculos".

### 3. Déficit moderado y consistente
No necesitas días de "cheat meal" exagerados. Un 80/20 (comida saludable/comida libre) es más sostenible.

## Errores comunes

- ❌ **Déficit demasiado agresivo**: Menos de 1200 kcal/día ralentiza tu metabolismo.
- ❌ **Eliminar grupos de alimentos completos**: No necesitas cortar carbohidratos ni grasas.
- ❌ **No ser paciente**: La grasa que tardaste años en acumular no se va en semanas.
- ❌ **Confiar solo en la báscula**: El músculo pesa más que la grasa. Usa fotos, medidas y cómo te queda la ropa.

## Ejemplo de un día en déficit calórico

| Comida | Alimentos | Calorías |
|--------|-----------|----------|
| Desayuno | 2 huevos + avena + frutas | 400 |
| Snack | Yogur griego + almendras | 250 |
| Almuerzo | Pollo + arroz + ensalada | 500 |
| Snack | Fruta + mantequilla de maní | 200 |
| Cena | Pescado + verduras + quinoa | 450 |
| **Total** | | **1,800 kcal** |

## Conclusión

La pérdida de grasa sostenible no es perfecta. Es un déficit moderado, proteína suficiente, entrenamiento de fuerza y paciencia. No necesitas suplementos mágicos ni dietas de moda.`,
    category: 'weight_management',
    is_premium: false,
    read_time_minutes: 8,
  },
  {
    title: 'Ganancia muscular: Guía para ganar masa magra eficientemente',
    slug: 'ganancia-muscular-guia',
    summary: 'Todo lo que necesitas saber para ganar masa muscular: superávit calórico, distribución de proteínas, entrenamiento y recuperación.',
    content: `# Ganancia muscular: Guía para ganar masa magra eficientemente

## El principio: Superávit calórico controlado

Para construir músculo necesitas energía extra, pero no cualquier exceso:

- **Superávit ideal**: 200-400 kcal sobre tu mantenimiento
- **Ganancia esperada**: 0.25-0.5 kg por semana (principiantes pueden ganar más)
- **Evita**: Superávits de +1000 kcal que generan más grasa que músculo

## Nutrición para hipertrofia

### Proteína
**1.6-2.2g por kg de peso**, distribuidos en 4-5 comidas.

### Carbohidratos
Son tu combustible para entrenar intenso. No los limites si quieres ganar músculo.
**4-6g por kg de peso** según tu nivel de actividad.

### Grasas saludables
Esenciales para la producción hormonal (testosterona).
**0.8-1g por kg de peso**.

## Entrenamiento efectivo

- **Frecuencia**: Entrena cada grupo muscular 2+ veces por semana
- **Volumen**: 10-20 series por grupo muscular por semana
- **Progresión**: Aumenta peso, repeticiones o series gradualmente
- **Descanso**: 48 horas entre sesiones del mismo grupo muscular

## Recuperación

El músculo crece cuando descansas, no cuando entrenas:

- **Sueño**: 7-9 horas de calidad
- **Días de descanso**: Al menos 1-2 por semana
- **Estrés**: El cortisol alto dificulta la ganancia muscular

## Conclusión

Ganar músculo requiere consistencia en tres áreas: comer suficiente (con superávit), entrenar con intensidad progresiva, y recuperar adecuadamente. Los resultados toman meses, no semanas.`,
    category: 'advanced',
    is_premium: true,
    read_time_minutes: 9,
  },
  {
    title: 'Suplementos deportivos: Cuáles funcionan y cuáles son pérdida de dinero',
    slug: 'suplementos-deportivos-guia',
    summary: 'Análisis basado en evidencia de los suplementos más populares: creatina, proteína whey, BCAA, pre-entreno, y más.',
    content: `# Suplementos deportivos: Cuáles funcionan y cuáles son pérdida de dinero

## La verdad sobre los suplementos

Los suplementos son exactamente eso: **suplementos**. No reemplazan una buena dieta, pero algunos tienen evidencia científica sólida.

## Suplementos con evidencia fuerte ✅

### Creatina monohidrato
- **Dosis**: 3-5g diarios
- **Beneficio**: Aumenta fuerza y masa muscular un 5-10%
- **Seguridad**: Miles de estudios confirman su seguridad
- **Costo**: Muy económico
- **Veredicto**: El suplemento con mejor relación costo-beneficio

### Proteína Whey
- **Dosis**: 25-40g post-entreno o cuando necesites completar tu proteína diaria
- **Beneficio**: Práctico para alcanzar tu meta de proteína
- **Veredicto**: No es mágico, pero es conveniente y efectivo

### Cafeína
- **Dosis**: 3-6mg/kg, 30-60 min antes del ejercicio
- **Beneficio**: Mejora rendimiento y enfoque mental
- **Veredicto**: El pre-entreno natural más estudiado

## Suplementos con evidencia mixta ⚠️

### Beta-alanina
Puede mejorar rendimiento en ejercicios de 1-4 minutos. Efecto de "hormigueo" es normal.

### Citrulina malato
Puede mejorar el flujo sanguíneo y rendimiento. Evidencia moderada.

## Suplementos con evidencia débil ❌

### BCAA
Si ya consumes suficiente proteína, los BCAA adicionales no hacen nada.

### Glutamina
No mejora recuperación muscular en personas sanas.

### Quemadores de grasa
La mayoría contiene cafeína y poco más. No reemplazan déficit calórico.

## Conclusión

Invierte primero en: creatina + proteína whey + cafeína. El resto es opcional y con evidencia limitada. Y recuerda: ningún suplemento compensa una mala alimentación.`,
    category: 'tips',
    is_premium: false,
    read_time_minutes: 7,
  },
  {
    title: 'Meal prep: Cómo preparar tus comidas de la semana en 2 horas',
    slug: 'meal-prep-guia-practica',
    summary: 'Guía práctica para planificar, cocinar y almacenar tus comidas semanales. Ahorra tiempo, dinero y come saludable sin excusas.',
    content: `# Meal prep: Cómo preparar tus comidas de la semana en 2 horas

## ¿Por qué hacer meal prep?

- **Ahorra tiempo**: Cocinas una vez, comes toda la semana
- **Ahorra dinero**: Compras solo lo que necesitas, menos desperdicio
- **Mejora tu dieta**: Menos tentación de comer fuera o pedir delivery
- **Reduce estrés**: No tienes que pensar "¿qué como hoy?" cada día

## Paso 1: Planifica tu menú (15 min)

1. **Define tus macros**: Calcula tus necesidades calóricas
2. **Elige 2-3 proteínas**: Pollo, pescado, huevos, tofu
3. **Elige 2-3 carbohidratos**: Arroz, quinoa, camote, pasta integral
4. **Elige 3-4 verduras**: Brócoli, espinaca, pimientos, zanahoria
5. **Elige grasas**: Aceite de oliva, aguacate, nueces

## Paso 2: Lista de compras (5 min)

Haz tu lista basada en las cantidades de tu plan. No improvises en el supermercado.

## Paso 3: Cocina en batch (60-90 min)

### Orden eficiente:
1. **Horno primero**: Precalienta y cocina proteínas y verduras al horno
2. **Estufa mientras tanto**: Arroz, quinoa, pastas
3. **Corta y prepara** ensaladas y snacks crudos

## Paso 4: Almacena correctamente

- **Refrigerador**: 3-4 días máximo
- **Congelador**: Hasta 3 meses (etiqueta con fecha)
- **Contenedores**: De vidrio preferiblemente, con separadores

## Ejemplo de meal prep para 5 días

| Comida | Contenido | Calorías |
|--------|-----------|----------|
| Desayuno | Overnight oats con frutas | 350 |
| Almuerzo | Pollo + arroz + brócoli | 550 |
| Cena | Salmón + quinoa + ensalada | 500 |
| Snacks | Frutas, yogur, nueces | 300 |

## Conclusión

El meal prep es una de las herramientas más poderosas para mantener una alimentación saludable de forma consistente. Empieza con 3 días y ve aumentando gradualmente.`,
    category: 'recipes',
    is_premium: false,
    read_time_minutes: 6,
  },
  {
    title: 'Ayuno intermitente: Beneficios reales vs. mitos populares',
    slug: 'ayuno-intermitente-ciencia',
    summary: 'Lo que dice la ciencia sobre el ayuno intermitente: beneficios comprobados, para quién funciona y cuándo es contraproducente.',
    content: `# Ayuno intermitente: Beneficios reales vs. mitos populares

## ¿Qué es el ayuno intermitente?

No es una dieta, es un **patrón de alimentación**. Los métodos más comunes:

- **16:8**: Ayunas 16 horas, comes en ventana de 8 horas (el más popular)
- **14:10**: Más suave, ideal para principiantes
- **5:2**: 5 días normales, 2 días de restricción (500-600 kcal)

## Beneficios con evidencia científica ✅

### Pérdida de grasa
Funciona porque naturalmente reduces tu ingesta calórica al tener menos tiempo para comer. No es magia, es matemáticas.

### Sensibilidad a la insulina
Estudios muestran mejoras en sensibilidad a la insulina, especialmente en personas con resistencia.

### Autofagia celular
Proceso de limpieza celular que puede tener beneficios anti-envejecimiento. Evidencia principalmente en animales.

### Simplicidad
Menos comidas que planificar, menos platos que lavar. Para muchos, esto es el beneficio más real.

## Mitos populares ❌

### "Acelera el metabolismo"
FALSO. El ayuno corto (16-24h) no acelera el metabolismo. Algunos estudios muestran aumento leve de noradrenalina, pero no es significativo.

### "Pierdes músculo"
PARCIALMENTE falso. Si consumes suficiente proteína en tu ventana de alimentación y entrenas fuerza, la pérdida muscular es mínima.

### "Es para todos"
FALSO. No es recomendable para:
- Personas con historial de trastornos alimentarios
- Embarazadas o lactantes
- Personas con diabetes tipo 1 (sin supervisión médica)
- Menores de edad

## Conclusión

El ayuno intermitente es una herramienta válida que funciona para algunas personas. No es superior a una dieta convencional con las mismas calorías. Úsalo si te gusta, no si te hace sentir mal.`,
    category: 'basics',
    is_premium: false,
    read_time_minutes: 6,
  },
  {
    title: 'Entrenamiento HIIT: Máximos resultados en mínimo tiempo',
    slug: 'hiit-entrenamiento-efectivo',
    summary: 'Cómo estructurar sesiones HIIT efectivas, protocolos científicamente probados, y cómo combinar HIIT con tu plan de nutrición.',
    content: `# Entrenamiento HIIT: Máximos resultados en mínimo tiempo

## ¿Qué es HIIT?

**High Intensity Interval Training** — alternar períodos de ejercicio intenso con períodos de recuperación activa.

## Por qué funciona

1. **Eficiencia**: 15-20 minutos de HIIT pueden equivaler a 40+ minutos de cardio moderado
2. **EPOC**: El "afterburn effect" — tu cuerpo sigue quemando calorías después del ejercicio
3. **Sin equipo necesario**: Puedes hacerlo con tu propio peso corporal
4. **Mejora cardiovascular**: Aumenta tu VO2 max más que el cardio constante

## Protocolos probados

### Tabata (4 minutos)
- 20 segundos máximo esfuerzo
- 10 segundos descanso
- 8 rondas
- Ejercicio: Burpees, sprints, jumping jacks

### 30/30 (15 minutos)
- 30 segundos alta intensidad
- 30 segundos descanso activo
- 15 rondas
- Ejercicio: Sprint + caminata

### Nordic (20 minutos)
- 4 minutos alta intensidad (85-95% FC max)
- 3 minutos recuperación activa
- 4 rondas
- Ejercicio: Bicicleta, correr, remar

## Estructura de una sesión

1. **Calentamiento** (5-10 min): Trote suave, movilidad articular
2. **HIIT** (15-20 min): El protocolo que elijas
3. **Enfriamiento** (5 min): Caminata lenta, estiramientos

## Frecuencia recomendada

- **Principiantes**: 1-2 veces por semana
- **Intermedios**: 2-3 veces por semana
- **Avanzados**: 3-4 veces por semana

**Nunca** hagas HIIT dos días seguidos. Tu sistema nervioso necesita recuperarse.

## HIIT y nutrición

- **Pre-HIIT**: Carbohidrato fácil de digerir 1-2 horas antes (banana, pan con mermelada)
- **Post-HIIT**: Proteína + carbohidratos dentro de 2 horas
- **Hidratación**: Fundamental, pierdes más líquidos que en ejercicio moderado

## Precauciones

- No es para principiantes absolutos (primero construye base de 4-6 semanas de ejercicio moderado)
- No si tienes problemas cardíacos (consulta a tu médico)
- No si estás en déficit calórico muy agresivo (riesgo de sobreentrenamiento)

## Conclusión

HIIT es la herramienta más eficiente para mejorar tu condición cardiovascular y quemar calorías en poco tiempo. Úsalo 2-3 veces por semana complementando con entrenamiento de fuerza.`,
    category: 'advanced',
    is_premium: false,
    read_time_minutes: 8,
  },
  {
    title: 'Micronutrientes esenciales: Vitaminas y minerales que no puedes ignorar',
    slug: 'micronutrientes-esenciales',
    summary: 'Las vitaminas y minerales más importantes, sus fuentes alimenticias, síntomas de deficiencia y cómo asegurar tu ingesta diaria.',
    content: `# Micronutrientes esenciales: Vitaminas y minerales que no puedes ignorar

## Vitaminas y minerales: Los olvidados

Mientras nos obsesionamos con macros (proteínas, carbos, grasas), los micronutrientes son los que hacen posible cada reacción química de tu cuerpo.

## Los más importantes

### Vitamina D
- **Función**: Huesos, inmunidad, estado de ánimo
- **Fuentes**: Sol (principal), pescado graso, huevos, fortificados
- **Deficiencia**: Muy común (hasta 50% de la población). Fatiga, dolor óseo, infecciones frecuentes
- **Suplementación**: 1000-4000 UI/día si no te expones al sol regularmente

### Hierro
- **Función**: Transporte de oxígeno en sangre
- **Fuentes**: Carnes rojas, legumbres, espinaca (con vitamina C para mejor absorción)
- **Deficiencia**: Anemia, fatiga extrema, palidez. Más común en mujeres.

### Magnesio
- **Función**: 300+ reacciones enzimáticas, relajación muscular, sueño
- **Fuentes**: Almendras, espinaca, chocolate negro, aguacate
- **Deficiencia**: Calambres, insomnio, ansiedad
- **Suplementación**: 200-400mg de citrato o glicinato antes de dormir

### Zinc
- **Función**: Inmunidad, cicatrización, testosterona
- **Fuentes**: Ostras, carne de res, semillas de calabaza
- **Deficiencia**: Infecciones frecuentes, pérdida de gusto/olfato

### Omega-3 (EPA/DHA)
- **Función**: Anti-inflamatorio, cerebro, corazón
- **Fuentes**: Salmón, sardinas, nueces, chía
- **Suplementación**: 1-2g de EPA+DHA combinados

## Come el arcoíris

La regla más simple para obtener micronutrientes: **come alimentos de muchos colores diferentes**.

- 🟠 Naranja: betacaroteno (zanahoria, camote)
- 🟢 Verde: folato, vitamina K (espinaca, brócoli)
- 🔴 Rojo: licopeno (tomate, sandía)
- 🟣 Morado: antocianinas (arándanos, uvas)
- ⚪ Blanco: alicina (ajo, cebolla)

## Conclusión

Un multivitamínico puede ser un seguro, pero no reemplaza una dieta variada. Prioriza alimentos integrales de muchos colores y tipos. Si suplementas, hazlo con base en análisis de sangre, no en marketing.`,
    category: 'basics',
    is_premium: false,
    read_time_minutes: 7,
  },
  {
    title: 'Sueño y rendimiento: La pieza olvidada de tu fitness',
    slug: 'sueno-y-rendimiento-fitness',
    summary: 'Cómo el sueño afecta tu composición corporal, recuperación, hormonas y rendimiento. Estrategias probadas para dormir mejor.',
    content: `# Sueño y rendimiento: La pieza olvidada de tu fitness

## Por qué el sueño importa tanto

Puedes tener la mejor dieta y el mejor plan de entrenamiento, pero si duermes mal, tus resultados serán mediocres. El sueño es cuando:

- **Se libera la hormona de crecimiento** (esencial para reparar músculo)
- **Se consolida la memoria motora** (aprendizaje de ejercicios)
- **Se regulan las hormonas del hambre** (grelina y leptina)
- **Se elimina toxinas cerebrales** (sistema glinfático)

## Efectos de dormir mal

### En tu composición corporal
- Solo 5 días de dormir 5 horas reduce la pérdida de grasa en un **55%** (estudio de la U. de Chicago)
- Aumenta la grelina (hormona del hambre) → comes más
- Disminuye la leptina (hormona de saciedad) → menos satisfacción

### En tu rendimiento
- Reduce fuerza máxima hasta un 10%
- Reduce tiempo hasta agotamiento hasta un 30%
- Aumenta riesgo de lesión hasta un 1.7x

### En tus hormonas
- Testosterona reducida hasta un 15% con solo 1 semana de sueño corto
- Cortisol elevado → más almacenamiento de grasa abdominal

## Cómo dormir mejor: Protocolo

### 1. Horario consistente
Acuéstate y despierta a la misma hora **incluso los fines de semana**.

### 2. Temperatura fresca
18-20°C es ideal. Tu cuerpo necesita bajar su temperatura para dormir profundo.

### 3. Oscuridad total
Blackout curtains o antifaz. Incluso la luz del LED de un aparato afecta la producción de melatonina.

### 4. Sin pantallas 1 hora antes
O al menos usa filtros de luz azul (gafas, Night Shift, f.lux).

### 5. Cafeína con horario
Última cafeína **8 horas antes** de dormir. La cafeína tiene vida media de 5-6 horas.

### 6. Rutina pre-sueño
15-30 min de: lectura, estiramientos suaves, meditación, respiración 4-7-8.

## Conclusión

El sueño no es un lujo, es un pilar de tu salud. Prioriza 7-9 horas como priorizas tu entrenamiento y tu dieta. Es la pieza que conecta todo.`,
    category: 'tips',
    is_premium: true,
    read_time_minutes: 8,
  },
];

async function seedArticles() {
  console.log('🌱 Seeding articles...');

  for (const article of articles) {
    try {
      // Check if article already exists by slug
      const [existing] = await query('SELECT id FROM articles WHERE slug = ?', [article.slug]);

      if ((existing as any[]).length > 0) {
        console.log(`⏭️  "${article.title}" already exists`);
        continue;
      }

      // Insert article
      const [uuidResult] = await query('SELECT UUID() as id');
      const id = (uuidResult as any)[0].id;

      await query(
        `INSERT INTO articles (id, title, slug, summary, content, category, is_premium, read_time_minutes, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          id,
          article.title,
          article.slug,
          article.summary,
          article.content,
          article.category,
          article.is_premium ? 1 : 0,
          article.read_time_minutes,
        ]
      );

      console.log(`✅ "${article.title}" inserted`);
    } catch (error) {
      console.error(`❌ Failed to insert "${article.title}":`, error);
    }
  }

  console.log('🎉 Article seeding complete!');
  process.exit(0);
}

seedArticles();
