import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3ZxNQLB5VbKt56g.root',
  password: '4BLpMj6H4QzcJ8oi',
  database: 'nutriflow',
  ssl: { rejectUnauthorized: true }
});

await conn.query('DELETE FROM articles');
console.log('🗑️ Cleared old articles');

const articles = [
  {
    title: 'Cómo calcular tus macros correctamente: Guía práctica basada en ciencia',
    slug: 'como-calcular-macros-guia',
    category: 'basics',
    isPremium: 0,
    readTime: 8,
    author: 'Dr. Carlos Fernández',
    credentials: 'Nutriólogo Deportivo, PhD en Ciencias de la Nutrición',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    content: `## ¿Qué son los macronutrientes?

Los macronutrientes son los tres grandes grupos de nutrientes que tu cuerpo necesita en grandes cantidades: **proteínas**, **carbohidratos** y **grasas**. Cada uno cumple funciones esenciales.

### Proteínas (4 kcal/g)
Son los bloques de construcción de tus músculos, órganos, piel y hormonas. Cada gramo aporta 4 calorías.

### Carbohidratos (4 kcal/g)
Tu fuente principal de energía, especialmente para el cerebro y el ejercicio de alta intensidad.

### Grasas (9 kcal/g)
Esenciales para hormonas, absorción de vitaminas y salud cerebral. Cada gramo aporta 9 calorías.

## Paso 1: Calcula tu TDEE

Tu TDEE (Gasto Energético Total Diario) es la cantidad de calorías que quemas al día.

### Calcula tu BMR (Fórmula Mifflin-St Jeor):
- **Hombres:** BMR = 10 × peso(kg) + 6.25 × altura(cm) - 5 × edad + 5
- **Mujeres:** BMR = 10 × peso(kg) + 6.25 × altura(cm) - 5 × edad - 161

### Multiplica por tu nivel de actividad:
| Nivel | Factor | Descripción |
|-------|--------|-------------|
| Sedentario | × 1.2 | Trabajo de oficina, sin ejercicio |
| Ligero | × 1.375 | Ejercicio 1-3 días/semana |
| Moderado | × 1.55 | Ejercicio 3-5 días/semana |
| Activo | × 1.725 | Ejercicio 6-7 días/semana |
| Muy activo | × 1.9 | Doble sesión diaria |

## Paso 2: Define tu objetivo

- **Perder grasa:** TDEE - 500 kcal (déficit moderado)
- **Mantener peso:** TDEE
- **Ganar músculo:** TDEE + 300 kcal (superávit ligero)

## Paso 3: Distribuye tus macros

### Para pérdida de grasa:
- **Proteína:** 2.0-2.5 g/kg de peso corporal
- **Grasas:** 0.8-1.0 g/kg
- **Carbohidratos:** El resto de calorías disponibles

### Para ganancia muscular:
- **Proteína:** 1.6-2.2 g/kg
- **Grasas:** 0.8-1.2 g/kg
- **Carbohidratos:** 4-7 g/kg

## Ejemplo práctico

**Persona:** 75kg, hombre, 30 años, 178cm, entrena 4 días/semana

1. **BMR:** 10 × 75 + 6.25 × 178 - 5 × 30 + 5 = 1,721 kcal
2. **TDEE:** 1,721 × 1.55 = 2,668 kcal
3. **Objetivo (perder grasa):** 2,668 - 500 = **2,168 kcal**

**Macros:**
- Proteína: 75 × 2.2 = 165g (660 kcal = 30%)
- Grasas: 75 × 1.0 = 75g (675 kcal = 31%)
- Carbohidratos: (2,168 - 660 - 675) / 4 = 208g (833 kcal = 39%)

## Tips importantes

1. **No bajes de 1,200 kcal/día** sin supervisión médica
2. **La proteína es prioritaria** para preservar músculo en déficit
3. **Ajusta cada 2 semanas** según tu progreso en báscula y medidas
4. **Usa una báscula de alimentos** las primeras semanas para ser preciso
5. **No temas a las grasas:** son esenciales para tus hormonas

> ⚠️ Estos son lineamientos generales. Para un plan personalizado, consulta a un nutriólogo certificado.`
  },
  {
    title: 'Los 10 mejores ejercicios para ganar masa muscular',
    slug: 'mejores-ejercicios-masa-muscular',
    category: 'advanced',
    isPremium: 0,
    readTime: 10,
    author: 'Lic. Andrea Morales',
    credentials: 'Entrenadora Personal Certificada NSCA, Especialista en Biomecánica',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    content: `## Los ejercicios compuestos son la base

Los ejercicios **multiarticulares** son los más efectivos para ganar músculo porque trabajan más fibras musculares simultáneamente y estimulan mayor liberación de hormona de crecimiento y testosterona.

## El Top 10

### 1. Sentadilla (Squat)
**Músculos:** Cuádriceps, glúteos, core
- Pies al ancho de hombros, puntas ligeramente hacia afuera
- Baja hasta que tus muslos estén paralelos al piso
- Mantén el pecho arriba y las rodillas alineadas con los pies
- **Series recomendadas:** 4 × 6-10

### 2. Peso Muerto (Deadlift)
**Músculos:** Espalda baja, glúteos, isquiotibiales
- Barra cerca de las espinillas
- Espalda recta, nunca redondeada
- Empuja con los talones, no tires con la espalda
- **Series recomendadas:** 3 × 5-8

### 3. Press de Banca (Bench Press)
**Músculos:** Pecho, tríceps, hombro frontal
- Escápulas retraídas y deprimidas
- Barra controlada al pecho (línea de los pezones)
- No rebotes en el pecho
- **Series recomendadas:** 4 × 6-10

### 4. Press Militar (Overhead Press)
**Músculos:** Hombros, tríceps, core
- De pie, core apretado para proteger la espalda
- Baja la barra hasta la barbilla
- No arquees la espalda baja
- **Series recomendadas:** 3 × 8-12

### 5. Dominadas (Pull-Ups)
**Músculos:** Espalda (dorsal), bíceps
- Agarre prono (palmas al frente), ligeramente más ancho que hombros
- Sube hasta que la barbilla pase la barra
- Baja controlado en 3 segundos
- **Series recomendadas:** 4 × 6-12

### 6. Remo con Barra (Barbell Row)
**Músculos:** Espalda media, romboides, bíceps
- Torso a 45 grados del piso
- Tira la barra hacia el ombligo
- Aprieta las escápulas en la parte de arriba
- **Series recomendadas:** 3 × 8-12

### 7. Zancadas (Lunges)
**Músculos:** Cuádriceps, glúteos
- Paso largo, rodilla trasera casi toca el piso
- Rodilla delantera no pasa la punta del pie
- Alterna piernas en cada repetición
- **Series recomendadas:** 3 × 10 por pierna

### 8. Fondos en Paralelas (Dips)
**Músculos:** Pecho inferior, tríceps
- Cuerpo ligeramente inclinado hacia adelante para enfatizar pecho
- Baja hasta 90 grados en codos
- No hiperextiendas los hombros en la subida
- **Series recomendadas:** 3 × 8-12

### 9. Hip Thrust
**Músculos:** Glúteos, isquiotibiales
- Espalda alta apoyada en banco
- Empuja la cadera arriba hasta extensión completa
- Aprieta glúteos 2 segundos arriba
- **Series recomendadas:** 4 × 10-15

### 10. Curl de Bíceps con Barra
**Músculos:** Bíceps
- Codos pegados al cuerpo, no los muevas
- No balancees el torso
- Contrae arriba y baja en 3 segundos
- **Series recomendadas:** 3 × 10-15

## Programa de 4 días recomendado

| Día | Enfoque | Ejercicios principales |
|-----|---------|----------------------|
| Lunes | Empuje | Bench Press, Press Militar, Dips |
| Martes | Tirón | Deadlift, Pull-Ups, Remo con Barra |
| Jueves | Piernas | Squat, Zancadas, Hip Thrust |
| Viernes | Full Body | Variantes de los anteriores |

> 💡 **Regla de oro:** Descansa 48 horas entre sesiones del mismo grupo muscular. El músculo crece durante el descanso, no durante el entrenamiento.`
  },
  {
    title: 'Alimentación antiinflamatoria: Lo que dice la ciencia',
    slug: 'alimentacion-antiinflamatoria-ciencia',
    category: 'tips',
    isPremium: 0,
    readTime: 7,
    author: 'Dra. María Elena Ríos',
    credentials: 'Médica Nutrióloga, Especialista en Medicina Funcional',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    content: `## ¿Qué es la inflamación crónica?

La inflamación crónica de bajo grado es un proceso silencioso vinculado a enfermedades cardíacas, diabetes tipo 2, artritis y hasta depresión. La buena noticia: **tu alimentación puede modularla significativamente**.

## 8 alimentos antiinflamatorios comprobados por la ciencia

### 1. Pescados grasos (Omega-3)
- **Cuáles:** Salmón, sardinas, caballa, atún
- **Dosis:** 2-3 porciones por semana
- **Evidencia:** EPA y DHA reducen proteína C reactiva (PCR) hasta un 20%

### 2. Frutos rojos
- **Cuáles:** Arándanos, fresas, frambuesas, moras
- **Dosis:** 1 taza diaria
- **Evidencia:** Antocianinas con potente efecto antioxidante

### 3. Cúrcuma
- **Compuesto activo:** Curcumina
- **Dosis:** 500-1,000 mg/día con pimienta negra (aumenta absorción 2,000%)
- **Evidencia:** Inhibe NF-kB, molécula que activa genes inflamatorios

### 4. Aceite de oliva extra virgen
- **Dosis:** 2-4 cucharadas diarias
- **Evidencia:** Oleocantal actúa similar al ibuprofeno

### 5. Vegetales de hoja verde
- **Cuáles:** Espinaca, kale, acelgas, brócoli
- **Dosis:** 2-3 tazas diarias
- **Evidencia:** Rico en vitamina K, magnesio y sulforafano

### 6. Frutos secos
- **Cuáles:** Nueces, almendras, pistaches
- **Dosis:** 30g diarios (un puñado)
- **Evidencia:** Reducción del 20% en PCR según estudio PREDIMED

### 7. Tomate
- **Compuesto:** Licopeno
- **Tip:** Más biodisponible cocido con aceite de oliva
- **Dosis:** 1-2 tomates diarios

### 8. Té verde
- **Compuesto:** EGCG (epigalocatequina galato)
- **Dosis:** 2-3 tazas diarias
- **Evidencia:** Reduce citoquinas inflamatorias IL-6 y TNF-α

## Alimentos que debes limitar o evitar

| Alimento | Efecto inflamatorio |
|----------|-------------------|
| Azúcar añadida | Aumenta proteína C reactiva (PCR) |
| Grasas trans | Disparan inflamación sistémica |
| Harinas refinadas | Picos de glucosa = inflamación |
| Aceites vegetales refinados | Exceso de omega-6 proinflamatorio |
| Alcohol en exceso | Daño intestinal → inflamación sistémica |
| Carnes procesadas | Nitritos y AGEs proinflamatorios |

> 🔬 **Evidencia clave:** Estudio en *The New England Journal of Medicine* (2019) mostró que la dieta mediterránea reduce PCR en un 25% en 6 meses.`
  },
  {
    title: 'Creatina monohidratada: El suplemento más estudiado y efectivo',
    slug: 'creatina-guia-completa',
    category: 'advanced',
    isPremium: 0,
    readTime: 6,
    author: 'Dr. Roberto Sánchez',
    credentials: 'Bioquímico, Investigador en Suplementación Deportiva',
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800',
    content: `## ¿Qué es la creatina?

La creatina es un compuesto natural que tu cuerpo produce (1-2g/día) y que también se encuentra en carnes y pescados. Es el **suplemento deportivo más estudiado en la historia**, con más de 500 estudios científicos respaldando su seguridad y eficacia.

## ¿Cómo funciona?

La creatina se almacena en tus músculos como **fosfocreatina**. Durante ejercicios de alta intensidad, ayuda a regenerar ATP (la moneda de energía celular) más rápido.

### Resultado:
- 1-2 repeticiones extra por serie
- Recuperación más rápida entre series
- Mayor volumen total de entrenamiento

## Beneficios comprobados científicamente

### Fuerza y potencia
- Aumento del **5-10%** en fuerza máxima
- Mejora del **10-20%** en trabajo de alta intensidad

### Masa muscular
- **+1-2 kg** de masa magra en las primeras 4 semanas (principalmente agua intracelular)
- Mayor síntesis de proteína muscular a largo plazo
- Activación de vías anabólicas (mTOR)

### Rendimiento cognitivo
- Mejora de memoria de trabajo en situaciones de fatiga
- Efecto neuroprotector documentado en estudios recientes

## Dosis correcta

### Método estándar (recomendado):
**3-5g diarios**, todos los días incluyendo días de descanso. Resultados visibles en 3-4 semanas.

### Fase de carga (opcional):
**20g/día durante 5-7 días** dividido en 4 tomas de 5g. Saturación muscular más rápida pero puede causar malestar estomacal.

## Mitos vs Realidades

| Mito | Realidad |
|------|----------|
| Daña los riñones | Falso en personas sanas (estudios de hasta 5 años) |
| Causa calvicie | Un solo estudio de 2009, nunca replicado |
| Hay que ciclarla | No, puedes tomarla indefinidamente |
| La líquida es mejor | La monohidratada en polvo es la más estudiada |
| Engorda | Solo retención de agua intracelular (dentro del músculo) |

## ¿Cuándo tomarla?

El timing no es crítico. Lo importante es la **consistencia diaria**. Si quieres optimizar:
- **Post-entreno** con carbohidratos (mejor absorción vía insulina)
- **Con comida** (evita malestar estomacal)

## Marcas recomendadas

Busca creatina con sello **Creapure®** (pureza alemana certificada):
- MyProtein Creapure
- Optimum Nutrition Creatine
- BulkSupplements Creapure

> ⚠️ Personas con enfermedad renal preexistente deben consultar a su médico antes de suplementar.`
  },
  {
    title: 'Meal Prep Dominical: Prepara 15 comidas en 2 horas',
    slug: 'meal-prep-dominical-guia',
    category: 'recipes',
    isPremium: 0,
    readTime: 9,
    author: 'Chef Laura Gutiérrez',
    credentials: 'Chef Nutricional Certificada, Especialista en Meal Prep',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    content: `## ¿Por qué hacer Meal Prep?

Preparar tus comidas con anticipación te ahorra **tiempo, dinero** y evita que caigas en comida chatarra por conveniencia.

## Lista de compras (1 persona, 5 días)

### Proteínas
- 2 pechugas de pollo grandes (~600g)
- 500g de carne molida magra (90/10)
- 10 huevos

### Carbohidratos
- 2 tazas de arroz integral crudo
- 1 kg de camote/batata
- 1 taza de avena

### Verduras
- 500g de brócoli
- 3 pimientos (rojo, verde, amarillo)
- 1 lechuga grande
- 2 aguacates

### Extras
- Aceite de oliva, sal, pimienta, especias
- Fruta para snacks (manzanas, plátanos)

## Cronograma de 2 horas

### Minuto 0-15: Precalentar y cortar
- Precalienta el horno a 200°C
- Corta camote en cubos, pimientos en tiras, brócoli en floretes
- Coloca en bandejas con aceite de oliva y sal

### Minuto 15-45: Hornear
- Hornea camote 30 min, pimientos y brócoli 25 min
- Mientras, cocina el arroz (20 min)

### Minuto 30-60: Proteínas
- **Pollo:** Sazona y cocina en sartén (6 min por lado)
- **Carne molida:** Sofríe con cebolla y especias (10 min)
- **Huevos:** Tortilla grande cortada en 5 porciones

### Minuto 60-90: Armar contenedores

**Desayunos (5):** 2 huevos + avena con fruta
**Comidas (5):** 120g pollo + arroz + brócoli
**Cenas (5):** 120g carne molida + camote + pimientos

### Minuto 90-120: Snacks
- Corta frutas y verduras
- Guarda todo en contenedores separados

## Macros por día

| Comida | Calorías | Proteína | Carbs | Grasas |
|--------|----------|----------|-------|--------|
| Desayuno | 350 | 20g | 35g | 14g |
| Comida | 480 | 35g | 55g | 10g |
| Cena | 420 | 30g | 35g | 16g |
| **Total** | **1,250** | **85g** | **125g** | **40g** |

> 💡 Agrega aderezos (limón, salsa, aguacate fresco) al momento de comer, no al preparar.`
  },
  {
    title: 'Índice glucémico vs carga glucémica: Lo que necesitas saber',
    slug: 'indice-glucemico-carga-glucemica',
    category: 'basics',
    isPremium: 0,
    readTime: 7,
    author: 'Dra. Patricia Luna',
    credentials: 'Endocrinóloga, Especialista en Diabetes y Metabolismo',
    image: 'https://images.unsplash.com/photo-1505576399279-0d754c0ce141?w=800',
    content: `## ¿Qué es el índice glucémico?

El **índice glucémico (IG)** mide qué tan rápido un alimento eleva tu azúcar en sangre comparado con glucosa pura (IG = 100).

| IG | Clasificación | Ejemplos |
|----|--------------|----------|
| 55 o menos | Bajo | Lentejas (32), manzana (36) |
| 56-69 | Medio | Arroz integral (68), plátano (62) |
| 70+ | Alto | Pan blanco (75), papa cocida (85) |

## El problema del índice glucémico

El IG **no considera la porción**. La sandía tiene IG de 72 (alto), pero necesitarías comer 5 tazas para obtener ese efecto glucémico.

Aquí entra la **carga glucémica (CG)**.

## Carga glucémica: El dato que realmente importa

**CG = (IG × gramos de carbohidrato por porción) ÷ 100**

| CG | Clasificación |
|----|--------------|
| 10 o menos | Baja |
| 11-19 | Media |
| 20+ | Alta |

## Comparativa práctica

| Alimento | IG | CG (porción normal) |
|----------|-----|---------------------|
| Sandía (1 taza) | 72 | **8 (baja)** |
| Zanahoria cocida | 85 | **6 (baja)** |
| Avena (1 taza) | 55 | **13 (media)** |
| Papa cocida (1 mediana) | 85 | **29 (alta)** |
| Arroz blanco (1 taza) | 73 | **40 (alta)** |
| Arroz integral (1 taza) | 68 | **23 (media)** |

## 5 estrategias para reducir la CG

1. **Combina con proteína:** Arroz con pollo tiene menor impacto que arroz solo
2. **Agrega grasa saludable:** Aguacate o aceite de oliva ralentizan absorción
3. **Come fibra primero:** Verduras antes del carbohidrato reducen el pico de glucosa
4. **Enfría y recalienta:** Desarrolla almidón resistente (menor CG)
5. **Elige integral:** Arroz integral CG 23 vs arroz blanco CG 40

> 🔬 Estudio en *Diabetes Care* (2020): Reducir la CG mejora la hemoglobina glicosilada en 0.5% en diabéticos tipo 2.`
  }
];

for (const art of articles) {
  try {
    const summary = art.content.replace(/[#*|>`_-]/g, '').substring(0, 200).trim() + '...';
    await conn.query(
      `INSERT INTO articles(id, title, slug, category, is_premium, read_time_minutes, author_name, author_credentials, summary, content, image_url, is_verified)
       VALUES(UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [art.title, art.slug, art.category, art.isPremium, art.readTime, art.author, art.credentials, summary, art.content, art.image]
    );
    console.log(`✅ ${art.title}`);
  } catch (err) {
    console.error(`❌ ${art.title}: ${err.message}`);
  }
}

const [count] = await conn.query('SELECT COUNT(*) as c FROM articles');
console.log(`\n📊 Total articles: ${count[0].c}`);
await conn.end();
console.log('🎉 Done!');
