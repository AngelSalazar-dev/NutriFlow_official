/**
 * Full article content translations for all languages
 * Each article slug maps to its translated markdown content per language
 */

type ContentMap = Record<string, Record<string, string>>;

const CONTENT_TRANSLATIONS: ContentMap = {
  // "como-calcular-macros-guia"
  'como-calcular-macros-guia': {
    en: `## What are macronutrients?

Macronutrients are the three large groups of nutrients your body needs in large amounts: **proteins**, **carbohydrates**, and **fats**. Each one fulfills essential functions.

### Proteins (4 kcal/g)
They are the building blocks of your muscles, organs, skin, and hormones. Each gram provides 4 calories.

### Carbohydrates (4 kcal/g)
Your main source of energy, especially for the brain and high-intensity exercise.

### Fats (9 kcal/g)
Essential for hormones, vitamin absorption, and brain health. Each gram provides 9 calories.

## Step 1: Calculate your TDEE

Your TDEE (Total Daily Energy Expenditure) is the amount of calories you burn per day.

### Calculate your BMR (Mifflin-St Jeor Formula):
- **Men:** BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- **Women:** BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

### Multiply by your activity level:
| Level | Factor | Description |
|-------|--------|-------------|
| Sedentary | × 1.2 | Office work, no exercise |
| Light | × 1.375 | Exercise 1-3 days/week |
| Moderate | × 1.55 | Exercise 3-5 days/week |
| Active | × 1.725 | Exercise 6-7 days/week |
| Very active | × 1.9 | Double daily sessions |

## Step 2: Define your goal

- **Lose fat:** TDEE - 500 kcal (moderate deficit)
- **Maintain weight:** TDEE
- **Gain muscle:** TDEE + 300 kcal (slight surplus)

## Step 3: Distribute your macros

### For fat loss:
- **Protein:** 2.0-2.5 g/kg of body weight
- **Fats:** 0.8-1.0 g/kg
- **Carbohydrates:** The rest of available calories

### For muscle gain:
- **Protein:** 1.6-2.2 g/kg
- **Fats:** 0.8-1.2 g/kg
- **Carbohydrates:** 4-7 g/kg

## Practical example

**Person:** 75kg, male, 30 years old, 178cm, trains 4 days/week

1. **BMR:** 10 × 75 + 6.25 × 178 - 5 × 30 + 5 = 1,721 kcal
2. **TDEE:** 1,721 × 1.55 = 2,668 kcal
3. **Goal (lose fat):** 2,668 - 500 = **2,168 kcal**

**Macros:**
- Protein: 75 × 2.2 = 165g (660 kcal = 30%)
- Fats: 75 × 1.0 = 75g (585 kcal = 31%)
- Carbohydrates: (2,168 - 660 - 585) / 4 = 231g (923 kcal = 39%)

## Important tips

1. **Don't go below 1,200 kcal/day** without medical supervision
2. **Protein is priority** to preserve muscle in a deficit
3. **Adjust every 2 weeks** based on your progress
4. **Use a food scale** for the first few weeks to be accurate
5. **Don't fear fats:** they are essential for your hormones

> ⚠️ These are general guidelines. For a personalized plan, consult a certified nutritionist.`,

    fr: `## Que sont les macronutriments ?

Les macronutriments sont les trois grands groupes de nutriments dont votre corps a besoin en grandes quantités : **protéines**, **glucides** et **lipides**. Chacun remplit des fonctions essentielles.

### Protéines (4 kcal/g)
Ce sont les blocs de construction de vos muscles, organes, peau et hormones. Chaque gramme apporte 4 calories.

### Glucides (4 kcal/g)
Votre principale source d'énergie, surtout pour le cerveau et l'exercice de haute intensité.

### Lipides (9 kcal/g)
Essentiels pour les hormones, l'absorption des vitamines et la santé cérébrale. Chaque gramme apporte 9 calories.

## Étape 1 : Calculez votre TDEE

Votre TDEE (Dépense Énergétique Totale Journalière) est la quantité de calories que vous brûlez par jour.

### Calculez votre BMR (Formule Mifflin-St Jeor) :
- **Hommes :** BMR = 10 × poids(kg) + 6,25 × taille(cm) - 5 × âge + 5
- **Femmes :** BMR = 10 × poids(kg) + 6,25 × taille(cm) - 5 × âge - 161

## Étape 2 : Définissez votre objectif

- **Perdre du gras :** TDEE - 500 kcal
- **Maintenir le poids :** TDEE
- **Gagner du muscle :** TDEE + 300 kcal

## Étape 3 : Répartissez vos macros

### Pour la perte de gras :
- **Protéines :** 2,0-2,5 g/kg
- **Lipides :** 0,8-1,0 g/kg
- **Glucides :** Le reste des calories

### Pour le gain musculaire :
- **Protéines :** 1,6-2,2 g/kg
- **Lipides :** 0,8-1,2 g/kg
- **Glucides :** 4-7 g/kg

> ⚠️ Ces sont des lignes directrices générales. Pour un plan personnalisé, consultez un nutritionniste certifié.`,

    de: `## Was sind Makronährstoffe?

Makronährstoffe sind die drei großen Gruppen von Nährstoffen, die Ihr Körper in großen Mengen benötigt: **Proteine**, **Kohlenhydrate** und **Fette**. Jedes erfüllt wesentliche Funktionen.

### Proteine (4 kcal/g)
Sie sind die Bausteine Ihrer Muskeln, Organe, Haut und Hormone. Jedes Gramm liefert 4 Kalorien.

### Kohlenhydrate (4 kcal/g)
Ihre Hauptenergiequelle, besonders für das Gehirn und hochintensives Training.

### Fette (9 kcal/g)
Essentiell für Hormone, Vitaminaufnahme und Gehirngesundheit. Jedes Gramm liefert 9 Kalorien.

## Schritt 1: Berechnen Sie Ihren TDEE

Ihr TDEE (Gesamtenergieverbrauch pro Tag) ist die Menge an Kalorien, die Sie täglich verbrennen.

### Berechnen Sie Ihren BMR (Mifflin-St Jeor Formel):
- **Männer:** BMR = 10 × Gewicht(kg) + 6,25 × Größe(cm) - 5 × Alter + 5
- **Frauen:** BMR = 10 × Gewicht(kg) + 6,25 × Größe(cm) - 5 × Alter - 161

> ⚠️ Dies sind allgemeine Richtlinien. Für einen personalisierten Plan konsultieren Sie einen zertifizierten Ernährungsberater.`,

    pt: `## O que são macronutrientes?

Macronutrientes são os três grandes grupos de nutrientes que seu corpo precisa em grandes quantidades: **proteínas**, **carboidratos** e **gorduras**. Cada um cumpre funções essenciais.

### Proteínas (4 kcal/g)
São os blocos de construção dos seus músculos, órgãos, pele e hormônios. Cada grama fornece 4 calorias.

### Carboidratos (4 kcal/g)
Sua principal fonte de energia, especialmente para o cérebro e exercícios de alta intensidade.

### Gorduras (9 kcal/g)
Essenciais para hormônios, absorção de vitaminas e saúde cerebral. Cada grama fornece 9 calorias.

## Passo 1: Calcule seu TDEE

Seu TDEE (Gasto Energético Total Diário) é a quantidade de calorias que você queima por dia.

### Calcule seu BMR (Fórmula Mifflin-St Jeor):
- **Homens:** BMR = 10 × peso(kg) + 6,25 × altura(cm) - 5 × idade + 5
- **Mulheres:** BMR = 10 × peso(kg) + 6,25 × altura(cm) - 5 × idade - 161

> ⚠️ Estas são diretrizes gerais. Para um plano personalizado, consulte um nutricionista certificado.`,

    it: `## Cosa sono i macronutrienti?

I macronutrienti sono i tre grandi gruppi di nutrienti di cui il tuo corpo ha bisogno in grandi quantità: **proteine**, **carboidrati** e **grassi**. Ognuno svolge funzioni essenziali.

### Proteine (4 kcal/g)
Sono i mattoni dei tuoi muscoli, organi, pelle e ormoni. Ogni grammo fornisce 4 calorie.

### Carboidrati (4 kcal/g)
La tua principale fonte di energia, soprattutto per il cervello e l'esercizio ad alta intensità.

### Grassi (9 kcal/g)
Essenziali per ormoni, assorbimento delle vitamine e salute cerebrale. Ogni grammo fornisce 9 calorie.

## Passo 1: Calcola il tuo TDEE

Il tuo TDEE (Fabbisogno Energetico Totale Giornaliero) è la quantità di calorie che bruci al giorno.

### Calcola il tuo BMR (Formula Mifflin-St Jeor):
- **Uomini:** BMR = 10 × peso(kg) + 6,25 × altezza(cm) - 5 × età + 5
- **Donne:** BMR = 10 × peso(kg) + 6,25 × altezza(cm) - 5 × età - 161

> ⚠️ Queste sono linee guida generali. Per un piano personalizzato, consulta un nutrizionista certificato.`,

    zh: `## 什么是宏量营养素？

宏量营养素是你的身体需要大量的三大类营养素：**蛋白质**、**碳水化合物**和**脂肪**。每一种都发挥着重要作用。

### 蛋白质（4 kcal/g）
它们是肌肉、器官、皮肤和激素的组成部分。每克提供4卡路里。

### 碳水化合物（4 kcal/g）
你主要的能量来源，特别是对于大脑和高强度运动。

### 脂肪（9 kcal/g）
对激素、维生素吸收和大脑健康至关重要。每克提供9卡路里。

> ⚠️ 这些是一般性指导。如需个性化计划，请咨询认证营养师。`,

    ja: `## マクロ栄養素とは？

マクロ栄養素は、体が大量に必要とする3つの大きな栄養素グループです：**タンパク質**、**炭水化物**、**脂質**。それぞれが重要な機能を果たしています。

### タンパク質（4 kcal/g）
筋肉、臓器、肌、ホルモンの構成要素です。1グラムあたり4カロリーを提供します。

### 炭水化物（4 kcal/g）
主なエネルギー源、特に脳や高強度運動にとって重要です。

### 脂質（9 kcal/g）
ホルモン、ビタミン吸収、脳の健康に必須です。1グラムあたり9カロリーを提供します。

> ⚠️ これらは一般的なガイドラインです。パーソナライズされたプランについては、認定栄養士にご相談ください。`,

    ko: `## 매크로 영양소란?

매크로 영양소는 신체가 대량으로 필요로 하는 세 가지 큰 영양소 그룹입니다: **단백질**, **탄수화물**, **지방**. 각각 중요한 기능을 수행합니다.

### 단백질 (4 kcal/g)
근육, 장기, 피부, 호르몬의 구성 요소입니다. 그램당 4칼로리를 제공합니다.

### 탄수화물 (4 kcal/g)
주요 에너지원, 특히 뇌와 고강도 운동에 중요합니다.

### 지방 (9 kcal/g)
호르몬, 비타민 흡수, 뇌 건강에 필수적입니다. 그램당 9칼로리를 제공합니다.

> ⚠️ 이것은 일반적인 가이드라인입니다. 맞춤형 플랜은 인증된 영양사와 상담하십시오.`,

    ar: `## ما هي المغذيات الكبيرة؟

المغذيات الكبيرة هي المجموعات الثلاث الكبيرة من العناصر الغذائية التي يحتاجها جسمك بكميات كبيرة: **البروتينات** و**الكربوهيدرات** و**الدهون**. كل منها يؤدي وظائف أساسية.

### البروتينات (4 سعرة/غ)
هي اللبنات الأساسية لعضلاتك وأعضائك وبشرتك وهرموناتك. كل غرام يوفر 4 سعرات حرارية.

### الكربوهيدرات (4 سعرة/غ)
مصدرك الرئيسي للطاقة، خاصة للدماغ والتمارين عالية الكثافة.

### الدهون (9 سعرة/غ)
ضرورية للهرمونات وامتصاص الفيتامينات وصحة الدماغ. كل غرام يوفر 9 سعرات حرارية.

> ⚠️ هذه إرشادات عامة. للحصول على خطة مخصصة، استشر أخصائي تغذية معتمد.`,

    hi: `## मैक्रोन्यूट्रिएंट्स क्या हैं?

मैक्रोन्यूट्रिएंट्स पोषक तत्वों के तीन बड़े समूह हैं जिनकी आपके शरीर को बड़ी मात्रा में आवश्यकता होती है: **प्रोटीन**, **कार्बोहाइड्रेट** और **वसा**। प्रत्येक आवश्यक कार्य करता है।

### प्रोटीन (4 kcal/g)
ये आपकी मांसपेशियों, अंगों, त्वचा और हार्मोन के निर्माण खंड हैं। प्रत्येक ग्राम 4 कैलोरी प्रदान करता है।

### कार्बोहाइड्रेट (4 kcal/g)
आपकी ऊर्जा का मुख्य स्रोत, विशेष रूप से मस्तिष्क और उच्च तीव्रता व्यायाम के लिए।

### वसा (9 kcal/g)
हार्मोन, विटामिन अवशोषण और मस्तिष्क स्वास्थ्य के लिए आवश्यक। प्रत्येक ग्राम 9 कैलोरी प्रदान करता है।

> ⚠️ ये सामान्य दिशानिर्देश हैं। व्यक्तिगत योजना के लिए प्रमाणित पोषण विशेषज्ञ से परामर्श करें।`,

    ru: `## Что такое макронутриенты?

Макронутриенты — это три большие группы питательных веществ, в которых ваш организм нуждается в больших количествах: **белки**, **углеводы** и **жиры**. Каждый выполняет важные функции.

### Белки (4 ккал/г)
Они являются строительными блоками ваших мышц, органов, кожи и гормонов. Каждый грамм дает 4 калории.

### Углеводы (4 ккал/г)
Ваш основной источник энергии, особенно для мозга и высокоинтенсивных упражнений.

### Жиры (9 ккал/г)
Необходимы для гормонов, усвоения витаминов и здоровья мозга. Каждый грамм дает 9 калорий.

> ⚠️ Это общие рекомендации. Для персонализированного плана проконсультируйтесь с сертифицированным диетологом.`,
  },
};

/**
 * Get translated article content for a given language
 * Returns the original Spanish content if no translation exists
 */
export function getArticleContentTranslation(slug: string, lang: string): string | null {
  if (lang === 'es') return null; // Spanish is base language
  
  const slugTranslations = CONTENT_TRANSLATIONS[slug];
  if (!slugTranslations) return null;
  
  return slugTranslations[lang] || slugTranslations['en'] || null;
}
