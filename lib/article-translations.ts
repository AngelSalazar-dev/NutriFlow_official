/**
 * Article title and excerpt translations for all 12 languages
 * Maps Spanish article slugs to their translated equivalents
 */

type ArticleTranslation = { title: string; excerpt: string };

// English
const EN: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': {
    title: 'How to Calculate Your Macros Correctly: Science-Based Guide',
    excerpt: 'What are macronutrients? Macronutrients are the three large groups of nutrients your body needs in large amounts: proteins, carbohydrates, and fats. Each one fulfills essential functions...',
  },
  'mejores-ejercicios-masa-muscular': {
    title: 'The 10 Best Exercises to Gain Muscle Mass',
    excerpt: 'Compound exercises are the foundation. Multi-joint exercises are the most effective for building muscle because they work more muscle fibers simultaneously and stimulate greater growth hormone release...',
  },
  'alimentacion-antiinflamatoria-ciencia': {
    title: 'Anti-Inflammatory Nutrition: What Science Says',
    excerpt: 'What is chronic inflammation? Chronic low-grade inflammation is a silent process linked to heart disease, type 2 diabetes, arthritis, and even depression. The good news: your diet can modulate it...',
  },
  'creatina-guia-completa': {
    title: 'Creatine Monohydrate: The Most Studied and Effective Supplement',
    excerpt: 'What is creatine? Creatine is a natural compound your body produces (1-2g/day) that is also found in meats and fish. It is the most studied sports supplement in history, with over 500 scientific studies...',
  },
  'meal-prep-dominical-guia': {
    title: 'Sunday Meal Prep: Prepare 15 Meals in 2 Hours',
    excerpt: 'Why do Meal Prep? Preparing your meals in advance saves you time, money, and prevents you from falling into junk food out of convenience. Shopping list (1 person, 5 days) Proteins...',
  },
  'indice-glucemico-carga-glucemica': {
    title: 'Glycemic Index vs Glycemic Load: What You Need to Know',
    excerpt: 'What is the glycemic index? The glycemic index (GI) measures how quickly a food raises your blood sugar compared to pure glucose (GI = 100). GI Classification Examples 55 or less Low Lentils (32)...',
  },
};

// French
const FR: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: 'Comment Calculer Vos Macros Correctement: Guide Pratique', excerpt: 'Que sont les macronutriments? Les macronutriments sont les trois grands groupes de nutriments dont votre corps a besoin en grandes quantités: protéines, glucides et lipides. Chacun remplit des fonctions essentielles...' },
  'mejores-ejercicios-masa-muscular': { title: 'Les 10 Meilleurs Exercices pour Gagner de la Masse Musculaire', excerpt: 'Les exercices composés sont la base. Les exercices multi-articulaires sont les plus efficaces pour construire du muscle car ils travaillent plus de fibres musculaires simultanément...' },
  'alimentacion-antiinflamatoria-ciencia': { title: 'Nutrition Anti-Inflammatoire: Ce que Dit la Science', excerpt: 'Qu\'est-ce que l\'inflammation chronique? L\'inflammation chronique de faible intensité est un processus silencieux lié aux maladies cardiaques, au diabète de type 2, à l\'arthrite et même à la dépression...' },
  'creatina-guia-completa': { title: 'Créatine Monohydrate: Le Supplément le Plus Étudié', excerpt: 'Qu\'est-ce que la créatine? La créatine est un composé naturel que votre corps produit (1-2g/jour) et qui se trouve également dans les viandes et poissons. C\'est le supplément sportif le plus étudié de l\'histoire...' },
  'meal-prep-dominical-guia': { title: 'Meal Prep du Dimanche: Préparez 15 Repas en 2 Heures', excerpt: 'Pourquoi faire du Meal Prep? Préparer vos repas à l\'avance vous fait gagner du temps, de l\'argent et vous évite de tomber dans la malbouffe par commodité. Liste de courses (1 personne, 5 jours)...' },
  'indice-glucemico-carga-glucemica': { title: 'Index Glycémique vs Charge Glycémique: Ce Qu\'il Faut Savoir', excerpt: 'Qu\'est-ce que l\'index glycémique? L\'index glycémique (IG) mesure la rapidité avec laquelle un aliment augmente votre taux de sucre dans le sang par rapport au glucose pur (IG = 100)...' },
};

// German
const DE: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: 'Wie Man Seine Makros Richtig Berechnet: Wissenschaftlicher Leitfaden', excerpt: 'Was sind Makronährstoffe? Makronährstoffe sind die drei großen Gruppen von Nährstoffen, die Ihr Körper in großen Mengen benötigt: Proteine, Kohlenhydrate und Fette. Jeder erfüllt wesentliche Funktionen...' },
  'mejores-ejercicios-masa-muscular': { title: 'Die 10 Besten Übungen für Muskelaufbau', excerpt: 'Verbundübungen sind die Grundlage. Mehrgelenkige Übungen sind am effektivsten für den Muskelaufbau, weil sie mehr Muskelfasern gleichzeitig beanspruchen und mehr Wachstumshormone ausschütten...' },
  'alimentacion-antiinflamatoria-ciencia': { title: 'Antientzündliche Ernährung: Was die Wissenschaft Sagt', excerpt: 'Was ist chronische Entzündung? Chronische Entzündung niedrigen Grades ist ein stiller Prozess, der mit Herzerkrankungen, Typ-2-Diabetes, Arthritis und sogar Depressionen verbunden ist...' },
  'creatina-guia-completa': { title: 'Kreatin-Monohydrat: Das am Meisten Erforschte Nahrungsergänzungsmittel', excerpt: 'Was ist Kreatin? Kreatin ist eine natürliche Verbindung, die Ihr Körper produziert (1-2g/Tag) und die auch in Fleisch und Fisch vorkommt. Es ist das am meisten erforschte Sportnahrungsergänzungsmittel...' },
  'meal-prep-dominical-guia': { title: 'Sonntags Meal Prep: 15 Mahlzeiten in 2 Stunden Vorbereiten', excerpt: 'Warum Meal Prep? Das Vorbereiten Ihrer Mahlzeiten im Voraus spart Zeit, Geld und verhindert, dass Sie aus Bequemlichkeit zu Junk Food greifen. Einkaufsliste (1 Person, 5 Tage)...' },
  'indice-glucemico-carga-glucemica': { title: 'Glykämischer Index vs Glykämische Last: Was Sie Wissen Müssen', excerpt: 'Was ist der glykämische Index? Der glykämische Index (GI) misst, wie schnell ein Lebensmittel Ihren Blutzucker im Vergleich zu reinem Glukose (GI = 100) ansteigen lässt...' },
};

// Portuguese
const PT: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: 'Como Calcular Seus Macros Corretamente: Guia Prático Baseado em Ciência', excerpt: 'O que são macronutrientes? Macronutrientes são os três grandes grupos de nutrientes que seu corpo precisa em grandes quantidades: proteínas, carboidratos e gorduras. Cada um cumpre funções essenciais...' },
  'mejores-ejercicios-masa-muscular': { title: 'Os 10 Melhores Exercícios para Ganhar Massa Muscular', excerpt: 'Exercícios compostos são a base. Exercícios multiarticulares são os mais eficazes para ganhar músculo porque trabalham mais fibras musculares simultaneamente e estimulam maior liberação de hormônio de crescimento...' },
  'alimentacion-antiinflamatoria-ciencia': { title: 'Nutrição Anti-inflamatória: O que a Ciência Diz', excerpt: 'O que é inflamação crônica? A inflamação crônica de baixo grau é um processo silencioso ligado a doenças cardíacas, diabetes tipo 2, artrite e até depressão. A boa notícia: sua alimentação pode modulá-la...' },
  'creatina-guia-completa': { title: 'Creatina Monohidratada: O Suplemento Mais Estudado e Eficaz', excerpt: 'O que é creatina? A creatina é um composto natural que seu corpo produz (1-2g/dia) e que também é encontrado em carnes e peixes. É o suplemento esportivo mais estudado da história...' },
  'meal-prep-dominical-guia': { title: 'Meal Prep Dominical: Prepare 15 Refeições em 2 Horas', excerpt: 'Por que fazer Meal Prep? Preparar suas refeições com antecedência economiza tempo, dinheiro e evita que você caia em junk food por conveniência. Lista de compras (1 pessoa, 5 dias)...' },
  'indice-glucemico-carga-glucemica': { title: 'Índice Glicêmico vs Carga Glicêmica: O que Você Precisa Saber', excerpt: 'O que é índice glicêmico? O índice glicêmico (IG) mede o quão rápido um alimento eleva seu açúcar no sangue comparado com glicose pura (IG = 100)...' },
};

// Italian
const IT: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: 'Come Calcolare i Tuoi Macro Correttamente: Guida Pratica Basata sulla Scienza', excerpt: 'Cosa sono i macronutrienti? I macronutrienti sono i tre grandi gruppi di nutrienti di cui il tuo corpo ha bisogno in grandi quantità: proteine, carboidrati e grassi. Ognuno svolge funzioni essenziali...' },
  'mejores-ejercicios-masa-muscular': { title: 'I 10 Migliori Esercizi per Guadagnare Massa Muscolare', excerpt: 'Gli esercizi composti sono la base. Gli esercizi multiarticolari sono i più efficaci per costruire muscolo perché lavorano più fibre muscolari simultaneamente e stimolano un maggiore rilascio di ormone della crescita...' },
  'alimentacion-antiinflamatoria-ciencia': { title: 'Nutrizione Antinfiammatoria: Cosa Dice la Scienza', excerpt: 'Cos\'è l\'infiammazione cronica? L\'infiammazione cronica di basso grado è un processo silenzioso legato a malattie cardiache, diabete di tipo 2, artrite e persino depressione...' },
  'creatina-guia-completa': { title: 'Creatina Monoidrato: L\'Integratore Più Studiato ed Efficace', excerpt: 'Cos\'è la creatina? La creatina è un composto naturale che il tuo corpo produce (1-2g/giorno) e che si trova anche in carne e pesce. È l\'integratore sportivo più studiato nella storia...' },
  'meal-prep-dominical-guia': { title: 'Meal Prep Domenicale: Prepara 15 Pasti in 2 Ore', excerpt: 'Perché fare Meal Prep? Preparare i pasti in anticipo ti fa risparmiare tempo, denaro ed evita di cadere nel junk food per comodità. Lista della spesa (1 persona, 5 giorni)...' },
  'indice-glucemico-carga-glucemica': { title: 'Indice Glicemico vs Carico Glicemico: Cosa Devi Sapere', excerpt: 'Cos\'è l\'indice glicemico? L\'indice glicemico (IG) misura quanto rapidamente un alimento alza la glicemia rispetto al glucosio puro (IG = 100)...' },
};

// Chinese
const ZH: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: '如何正确计算你的宏量营养素：基于科学的实用指南', excerpt: '什么是宏量营养素？宏量营养素是你身体需要大量的三大类营养素：蛋白质、碳水化合物和脂肪。每一种都发挥着重要作用...' },
  'mejores-ejercicios-masa-muscular': { title: '增肌的10个最佳运动', excerpt: '复合运动是基础。多关节运动对增肌最有效，因为它们同时锻炼更多肌纤维并刺激更多生长激素释放...' },
  'alimentacion-antiinflamatoria-ciencia': { title: '抗炎饮食：科学怎么说', excerpt: '什么是慢性炎症？慢性低度炎症是一个无声的过程，与心脏病、2型糖尿病、关节炎甚至抑郁症有关。好消息：你的饮食可以调节它...' },
  'creatina-guia-completa': { title: '一水肌酸：研究最多且最有效的补充剂', excerpt: '什么是肌酸？肌酸是你身体产生的一种天然化合物（每天1-2克），也存在于肉类和鱼类中。它是历史上研究最多的运动补充剂...' },
  'meal-prep-dominical-guia': { title: '周日备餐：2小时准备15顿饭', excerpt: '为什么要备餐？提前准备饭菜可以节省时间和金钱，避免你因为方便而吃垃圾食品。购物清单（1人，5天）...' },
  'indice-glucemico-carga-glucemica': { title: '血糖指数 vs 血糖负荷：你需要知道的', excerpt: '什么是血糖指数？血糖指数（GI）衡量食物提升血糖的速度与纯葡萄糖（GI = 100）相比...' },
};

// Japanese
const JA: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: 'マクロ栄養素の正しい計算方法：科学に基づく実践ガイド', excerpt: 'マクロ栄養素とは？マクロ栄養素は、体が大量に必要とする3つの大きな栄養素グループです：タンパク質、炭水化物、脂肪。それぞれが重要な機能を果たしています...' },
  'mejores-ejercicios-masa-muscular': { title: '筋量を増やすためのベスト10エクササイズ', excerpt: 'コンパウンドエクササイズが基本です。多関節運動は、より多くの筋繊維を同時に使い、成長ホルモンの分泌を促進するため、筋肉をつけるのに最も効果的です...' },
  'alimentacion-antiinflamatoria-ciencia': { title: '抗炎症食：科学が語るもの', excerpt: '慢性炎症とは？慢性の低度炎症は、心臓病、2型糖尿病、関節炎、うつ病などに関連する静かなプロセスです。良い知らせ：食事で調節できます...' },
  'creatina-guia-completa': { title: 'クレアチン一水和物：最も研究され効果的なサプリメント', excerpt: 'クレアチンとは？クレアチンは体が生成する天然化合物（1日1-2g）で、肉や魚にも含まれています。史上最も研究されたスポーツサプリメントです...' },
  'meal-prep-dominical-guia': { title: '日曜日の Meal Prep：2時間で15食準備', excerpt: 'なぜ Meal Prep するのか？事前に食事を準備することで、時間とお金を節約し、利便性からジャンクフードに走るのを防ぎます。買い物リスト（1人、5日分）...' },
  'indice-glucemico-carga-glucemica': { title: 'GI値 vs グリセミックロード：知っておくべきこと', excerpt: 'GI値とは？グリセミックインデックス（GI）は、食品が純ブドウ糖（GI = 100）と比較してどれくらい速く血糖値を上げるかを測定します...' },
};

// Korean
const KO: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: '매크로 영양소 올바르게 계산하기: 과학 기반 실용 가이드', excerpt: '매크로 영양소란? 매크로 영양소는 신체가 대량으로 필요로 하는 세 가지 큰 영양소 그룹입니다: 단백질, 탄수화물, 지방. 각각 중요한 기능을 수행합니다...' },
  'mejores-ejercicios-masa-muscular': { title: '근육량 증가를 위한最佳 10가지 운동', excerpt: '복합 운동이 기본입니다. 다관절 운동은 더 많은 근육 섬유를 동시에 사용하고 성장 호르몬 분비를 자극하기 때문에 근육을 만드는 데 가장 효과적입니다...' },
  'alimentacion-antiinflamatoria-ciencia': { title: '항염증 식단: 과학이 말하는 것', excerpt: '만성 염증이란? 만성 저등급 염증은 심장병, 제2형 당뇨병, 관절염, 심지어 우울증과 관련된 조용한 과정입니다. 좋은 소식: 식단으로 조절할 수 있습니다...' },
  'creatina-guia-completa': { title: '크레아틴 일수화물: 가장 많이 연구되고 효과적인 보충제', excerpt: '크레아틴이란? 크레아틴은 신체가 생성하는 천연 화합물(하루 1-2g)이며 육류와 생선에도 포함되어 있습니다. 역사상 가장 많이 연구된 스포츠 보충제입니다...' },
  'meal-prep-dominical-guia': { title: '일요일 Meal Prep: 2시간 만에 15끼 준비', excerpt: '왜 Meal Prep 을 하는가? 미리 식사를 준비하면 시간과 돈을 절약하고, 편의성 때문에 정크푸드를 먹는 것을 방지합니다. 쇼핑 목록 (1인, 5일분)...' },
  'indice-glucemico-carga-glucemica': { title: '혈당 지수 vs 혈당 부하: 알아야 할 것', excerpt: '혈당 지수란? 혈당 지수(GI)는 음식이 순 포도당(GI = 100)에 비해 얼마나 빨리 혈당을 높이는지 측정합니다...' },
};

// Arabic
const AR: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: 'كيفية حساب المغذيات الكبيرة بشكل صحيح: دليل عملي علمي', excerpt: 'ما هي المغذيات الكبيرة؟ المغذيات الكبيرة هي المجموعات الثلاث الكبيرة من العناصر الغذائية التي يحتاجها جسمك بكميات كبيرة: البروتينات والكربوهيدرات والدهون. كل منها يؤدي وظائف أساسية...' },
  'mejores-ejercicios-masa-muscular': { title: 'أفضل 10 تمارين لزيادة الكتلة العضلية', excerpt: 'تمارين المركب هي الأساس. تمارين المفاصل المتعددة هي الأكثر فعالية لبناء العضلات لأنها تعمل على المزيد من الألياف العضلية في وقت واحد وتحفز إفراز هرمون النمو...' },
  'alimentacion-antiinflamatoria-ciencia': { title: 'التغذية المضادة للالتهابات: ما يقوله العلم', excerpt: 'ما هو الالتهاب المزمن؟ الالتهاب المزمن منخفض الدرجة هو عملية صامتة مرتبطة بأمراض القلب والسكري من النوع الثاني والتهاب المفاصل وحتى الاكتئاب. الخبر السار: نظامك الغذائي يمكن أن يعدله...' },
  'creatina-guia-completa': { title: 'الكرياتين مونوهيدرات: المكمل الأكثر دراسة وفعالية', excerpt: 'ما هو الكرياتين؟ الكرياتين مركب طبيعي ينتجه جسمك (1-2 غرام/يوم) ويتواجد أيضاً في اللحوم والأسماك. إنه المكمل الرياضي الأكثر دراسة في التاريخ...' },
  'meal-prep-dominical-guia': { title: 'تحضير وجبات الأحد: حضر 15 وجبة في ساعتين', excerpt: 'لماذا تحضير الوجبات؟ إعداد وجباتك مسبقاً يوفر لك الوقت والمال ويمنعك من الوقوع في الوجبات السريعة للراحة. قائمة التسوق (شخص واحد، 5 أيام)...' },
  'indice-glucemico-carga-glucemica': { title: 'المؤشر الجلايسيمي vs العبء الجلايسيمي: ما تحتاج معرفته', excerpt: 'ما هو المؤشر الجلايسيمي؟ المؤشر الجلايسيمي (GI) يقيس مدى سرعة رفع الطعام لسكر الدم مقارنة بالجلوكوز النقي (GI = 100)...' },
};

// Hindi
const HI: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: 'मैक्रोन्यूट्रिएंट्स की सही गणना कैसे करें: विज्ञान-आधारित व्यावहारिक गाइड', excerpt: 'मैक्रोन्यूट्रिएंट्स क्या हैं? मैक्रोन्यूट्रिएंट्स पोषक तत्वों के तीन बड़े समूह हैं जिनकी आपके शरीर को बड़ी मात्रा में आवश्यकता होती है: प्रोटीन, कार्बोहाइड्रेट और वसा। प्रत्येक आवश्यक कार्य करता है...' },
  'mejores-ejercicios-masa-muscular': { title: 'मांसपेशियों का द्रव्यमान बढ़ाने के लिए 10 सर्वश्रेष्ठ व्यायाम', excerpt: 'कंपाउंड व्यायाम आधार हैं। मल्टी-जॉइंट व्यायाम मांसपेशियों को बनाने के लिए सबसे प्रभावी हैं क्योंकि वे एक साथ अधिक मांसपेशी फाइबर पर काम करते हैं और अधिक विकास हार्मोन रिलीज को उत्तेजित करते हैं...' },
  'alimentacion-antiinflamatoria-ciencia': { title: 'एंटी-इंफ्लेमेटरी पोषण: विज्ञान क्या कहता है', excerpt: 'जीर्ण सूजन क्या है? कम ग्रेड की पुरानी सूजन हृदय रोग, टाइप 2 मधुमेह, गठिया और अवसाद से जुड़ी एक मौन प्रक्रिया है। अच्छी खबर: आपका आहार इसे नियंत्रित कर सकता है...' },
  'creatina-guia-completa': { title: 'क्रिएटिन मोनोहाइड्रेट: सबसे अधिक अध्ययन किया गया और प्रभावी सप्लीमेंट', excerpt: 'क्रिएटिन क्या है? क्रिएटिन एक प्राकृतिक यौगिक है जो आपका शरीर उत्पन्न करता है (1-2 ग्राम/दिन) और जो मांस और मछली में भी पाया जाता है। यह इतिहास में सबसे अधिक अध्ययन किया गया स्पोर्ट्स सप्लीमेंट है...' },
  'meal-prep-dominical-guia': { title: 'रविवार मील प्रेप: 2 घंटे में 15 भोजन तैयार करें', excerpt: 'मील प्रेप क्यों करें? अपने भोजन को पहले से तैयार करने से आपका समय और पैसा बचता है और सुविधा के लिए जंक फूड में जाने से बचता है। शॉपिंग लिस्ट (1 व्यक्ति, 5 दिन)...' },
  'indice-glucemico-carga-glucemica': { title: 'ग्लाइसेमिक इंडेक्स vs ग्लाइसेमिक लोड: आपको क्या जानना चाहिए', excerpt: 'ग्लाइसेमिक इंडेक्स क्या है? ग्लाइसेमिक इंडेक्स (GI) मापता है कि एक भोजन शुद्ध ग्लूकोज (GI = 100) की तुलना में कितनी तेजी से आपका ब्लड शुगर बढ़ाता है...' },
};

// Russian
const RU: Record<string, ArticleTranslation> = {
  'como-calcular-macros-guia': { title: 'Как Правильно Рассчитать Макронутриенты: Практическое Руководство', excerpt: 'Что такое макронутриенты? Макронутриенты — это три большие группы питательных веществ, в которых ваш организм нуждается в больших количествах: белки, углеводы и жиры. Каждый выполняет важные функции...' },
  'mejores-ejercicios-masa-muscular': { title: '10 Лучших Упражнений для Набора Мышечной Массы', excerpt: 'Составные упражнения — это основа. Многосуставные упражнения наиболее эффективны для набора мышц, так как работают больше мышечных волокон одновременно и стимулируют больший выброс гормона роста...' },
  'alimentacion-antiinflamatoria-ciencia': { title: 'Противовоспалительное Питание: Что Говорит Наука', excerpt: 'Что такое хроническое воспаление? Хроническое воспаление низкой степени — это тихий процесс, связанный с сердечными заболеваниями, диабетом 2 типа, артритом и даже депрессией. Хорошая новость: ваше питание может это регулировать...' },
  'creatina-guia-completa': { title: 'Креатин Моногидрат: Самая Изученная и Эффективная Добавка', excerpt: 'Что такое креатин? Креатин — это природное соединение, которое производит ваш организм (1-2 г/день) и которое также содержится в мясе и рыбе. Это самая изученная спортивная добавка в истории...' },
  'meal-prep-dominical-guia': { title: 'Воскресный Meal Prep: Приготовьте 15 Блюд за 2 Часа', excerpt: 'Зачем делать Meal Prep? Приготовление еды заранее экономит время, деньги и предотвращает переход на фастфуд из-за удобства. Список покупок (1 человек, 5 дней)...' },
  'indice-glucemico-carga-glucemica': { title: 'Гликемический Индекс vs Гликемическая Нагрузка: Что Нужно Знать', excerpt: 'Что такое гликемический индекс? Гликемический индекс (ГИ) измеряет, насколько быстро продукт повышает уровень сахара в крови по сравнению с чистой глюкозой (ГИ = 100)...' },
};

// Master translations map
const TRANSLATIONS: Record<string, Record<string, ArticleTranslation>> = {
  en: EN,
  fr: FR,
  de: DE,
  pt: PT,
  it: IT,
  zh: ZH,
  ja: JA,
  ko: KO,
  ar: AR,
  hi: HI,
  ru: RU,
};

/**
 * Get translated article data for any language
 * Falls back to English, then to original (Spanish)
 */
export function getArticleTranslation(slug: string, lang: string): { title: string; excerpt: string } {
  if (lang === 'es') return { title: '', excerpt: '' }; // Spanish is base language

  // Try the requested language
  const langTranslations = TRANSLATIONS[lang];
  if (langTranslations && langTranslations[slug]) {
    return langTranslations[slug];
  }

  // Fall back to English
  if (lang !== 'en' && EN[slug]) {
    return EN[slug];
  }

  // Return empty (use original Spanish)
  return { title: '', excerpt: '' };
}
