/**
 * Food name translations from Spanish to other languages
 * Maps common Spanish food names to their equivalents in different languages
 */

// English translations
const FOOD_NAME_EN: Record<string, string> = {
  'Taco al Pastor': 'Pastor Taco (Pork)',
  'Taco de Birria': 'Birria Taco (Goat/Beef)',
  'Taco de Bistec': 'Steak Taco',
  'Taco de Camarón': 'Shrimp Taco',
  'Taco de Carne Asada': 'Grilled Meat Taco',
  'Taco de Carnitas': 'Carnitas Taco (Pulled Pork)',
  'Taco de Chicharrón': 'Pork Rind Taco',
  'Taco de Cochinita Pibil': 'Cochinita Pibil Taco',
  'Taco de Marlín': 'Marlin Taco',
  'Taco de Pescado': 'Fish Taco',
  'Taco de Pollo': 'Chicken Taco',
  'Taco de Tinga': 'Tinga Taco (Shredded Chicken)',
  'Taco Vegetariano': 'Vegetarian Taco',
  'Quesadilla de Pollo': 'Chicken Quesadilla',
  'Quesadilla de Champiñón': 'Mushroom Quesadilla',
  'Enchiladas Suizas': 'Swiss-style Enchiladas',
  'Enchiladas Rojas': 'Red Enchiladas',
  'Torta de Milanesa': 'Breaded Cutlet Sandwich',
  'Torta de Pollo': 'Chicken Sandwich',
  'Chilaquiles Rojos con Pollo': 'Red Chilaquiles with Chicken',
  'Chilaquiles Verdes con Huevo': 'Green Chilaquiles with Egg',
  'Caldo de Pollo': 'Chicken Soup',
  'Caldo de Res': 'Beef Soup',
  'Pozole Rojo': 'Red Pozole (Hominy Soup)',
  'Pozole Verde': 'Green Pozole',
  'Menudo': 'Tripe Soup',
  'Birria de Res': 'Beef Birria',
  'Pollo en Mole Poblano': 'Chicken in Poblano Mole',
  'Pollo en Salsa Verde': 'Chicken in Green Sauce',
  'Cochinita Pibil': 'Cochinita Pibil (Slow-roasted Pork)',
  'Carne Molida con Papa': 'Ground Beef with Potato',
  'Huevos Rancheros': 'Ranch-style Eggs',
  'Ceviche de Camarón': 'Shrimp Ceviche',
  'Ceviche de Pescado': 'Fish Ceviche',
  'Camarones al Mojo de Ajo': 'Garlic Shrimp',
  'Elote con Mayonesa y Chile': 'Street Corn with Mayo',
  'Churros con Azúcar y Canela': 'Churros with Sugar and Cinnamon',
  'Agua de Horchata': 'Horchata Water',
  'Agua de Jamaica': 'Hibiscus Water',
  'Café de Olla': 'Pot Coffee',
  'Flan de Huevo': 'Egg Flan',
  'Arroz con Leche': 'Rice Pudding',
  'Guacamole': 'Guacamole',
  'Totopos con Guacamole': 'Tortilla Chips with Guacamole',
  'Molletes': 'Molletes (Bean Toast)',
  'Burrito de Carne Asada': 'Grilled Meat Burrito',
  'Burrito de Pollo': 'Chicken Burrito',
  'Nachos con Queso': 'Cheese Nachos',
  'Tamales de Pollo': 'Chicken Tamales',
  'Tamales de Dulce': 'Sweet Tamales',
};

// French translations
const FOOD_NAME_FR: Record<string, string> = {
  'Taco al Pastor': 'Taco al Pastor (Porc)',
  'Taco de Camarón': 'Taco aux Crevettes',
  'Taco de Pollo': 'Taco au Poulet',
  'Taco de Pescado': 'Taco au Poisson',
  'Quesadilla de Pollo': 'Quesadilla au Poulet',
  'Enchiladas Suizas': 'Enchiladas Suisses',
  'Caldo de Pollo': 'Soupe au Poulet',
  'Caldo de Res': 'Soupe au Boeuf',
  'Pozole Rojo': 'Pozole Rouge',
  'Pollo en Mole Poblano': 'Poulet au Mole',
  'Cochinita Pibil': 'Cochinita Pibil (Porc)',
  'Ceviche de Camarón': 'Ceviche de Crevettes',
  'Churros con Azúcar y Canela': 'Churros au Sucre et Cannelle',
  'Agua de Horchata': 'Eau d\'Horchata',
  'Flan de Huevo': 'Flan aux Oeufs',
  'Guacamole': 'Guacamole',
  'Burrito de Pollo': 'Burrito au Poulet',
};

// German translations
const FOOD_NAME_DE: Record<string, string> = {
  'Taco al Pastor': 'Pastor Taco (Schwein)',
  'Taco de Camarón': 'Garnelen Taco',
  'Taco de Pollo': 'Hähnchen Taco',
  'Taco de Pescado': 'Fisch Taco',
  'Caldo de Pollo': 'Hühnersuppe',
  'Caldo de Res': 'Rindersuppe',
  'Pozole Rojo': 'Roter Pozole',
  'Pollo en Mole Poblano': 'Hähnchen in Mole',
  'Churros con Azúcar y Canela': 'Churros mit Zucker und Zimt',
  'Flan de Huevo': 'Eier-Flan',
  'Guacamole': 'Guacamole',
  'Burrito de Pollo': 'Hähnchen Burrito',
};

// Portuguese translations
const FOOD_NAME_PT: Record<string, string> = {
  'Taco al Pastor': 'Taco al Pastor (Porco)',
  'Taco de Camarón': 'Taco de Camarão',
  'Taco de Pollo': 'Taco de Frango',
  'Taco de Pescado': 'Taco de Peixe',
  'Quesadilla de Pollo': 'Quesadilla de Frango',
  'Caldo de Pollo': 'Sopa de Frango',
  'Caldo de Res': 'Sopa de Carne',
  'Pozole Rojo': 'Pozole Vermelho',
  'Pollo en Mole Poblano': 'Frango ao Mole',
  'Cochinita Pibil': 'Cochinita Pibil (Porco)',
  'Ceviche de Camarón': 'Ceviche de Camarão',
  'Churros con Azúcar y Canela': 'Churros com Açúcar e Canela',
  'Flan de Huevo': 'Flan de Ovos',
  'Guacamole': 'Guacamole',
  'Burrito de Pollo': 'Burrito de Frango',
};

// Italian translations
const FOOD_NAME_IT: Record<string, string> = {
  'Taco al Pastor': 'Taco al Pastor (Maiale)',
  'Taco de Camarón': 'Taco ai Gamberi',
  'Taco de Pollo': 'Taco al Pollo',
  'Taco de Pescado': 'Taco al Pesce',
  'Caldo de Pollo': 'Zuppa di Pollo',
  'Caldo de Res': 'Zuppa di Manzo',
  'Pozole Rojo': 'Pozole Rosso',
  'Pollo en Mole Poblano': 'Pollo al Mole',
  'Churros con Azúcar y Canela': 'Churros con Zucchero e Cannella',
  'Flan de Huevo': 'Flan alle Uova',
  'Guacamole': 'Guacamole',
  'Burrito de Pollo': 'Burrito al Pollo',
};

// For Asian languages, use English as fallback (more recognizable)
const FOOD_NAME_ZH: Record<string, string> = {
  'Taco al Pastor': '墨西哥 Pastor 塔可（猪肉）',
  'Taco de Camarón': '鲜虾塔可',
  'Taco de Pollo': '鸡肉塔可',
  'Taco de Pescado': '鱼肉塔可',
  'Caldo de Pollo': '鸡汤',
  'Caldo de Res': '牛肉汤',
  'Guacamole': '牛油果酱',
  'Churros con Azúcar y Canela': '吉事果配肉桂糖',
};

const FOOD_NAME_JA: Record<string, string> = {
  'Taco al Pastor': 'パストールタコス（豚肉）',
  'Taco de Camarón': 'エビタコス',
  'Taco de Pollo': 'チキンタコス',
  'Taco de Pescado': 'フィッシュタコス',
  'Caldo de Pollo': 'チキンスープ',
  'Caldo de Res': 'ビーフスープ',
  'Guacamole': 'グアカモーレ',
  'Churros con Azúcar y Canela': 'チュロス（シナモンシュガー）',
};

const FOOD_NAME_KO: Record<string, string> = {
  'Taco al Pastor': '파스토르 타코 (돼지고기)',
  'Taco de Camarón': '새우 타코',
  'Taco de Pollo': '치킨 타코',
  'Taco de Pescado': '생선 타코',
  'Caldo de Pollo': '치킨 수프',
  'Caldo de Res': '소고기 수프',
  'Guacamole': '과카몰리',
  'Churros con Azúcar y Canela': '시나몬 슈가 츄로스',
};

// Arabic translations
const FOOD_NAME_AR: Record<string, string> = {
  'Taco al Pastor': 'تاكو الباستور (لحم خنزير)',
  'Taco de Camarón': 'تاكو الروبيان',
  'Taco de Pollo': 'تاكو الدجاج',
  'Taco de Pescado': 'تاكو السمك',
  'Caldo de Pollo': 'شوربة الدجاج',
  'Caldo de Res': 'شوربة اللحم',
  'Guacamole': 'غواكامولي',
  'Churros con Azúcar y Canela': 'تشوروس بالسكر والقرفة',
};

// Hindi translations
const FOOD_NAME_HI: Record<string, string> = {
  'Taco al Pastor': 'पास्टर टैको (पोर्क)',
  'Taco de Camarón': 'झींगा टैको',
  'Taco de Pollo': 'चिकन टैको',
  'Taco de Pescado': 'फिश टैको',
  'Caldo de Pollo': 'चिकन सूप',
  'Caldo de Res': 'बीफ सूप',
  'Guacamole': 'गुआकामोल',
  'Churros con Azúcar y Canela': 'चीनी और दालचीनी के साथ चुरोस',
};

// Russian translations
const FOOD_NAME_RU: Record<string, string> = {
  'Taco al Pastor': 'Тако аль Пастор (Свинина)',
  'Taco de Camarón': 'Тако с Креветками',
  'Taco de Pollo': 'Тако с Курицей',
  'Taco de Pescado': 'Тако с Рыбой',
  'Caldo de Pollo': 'Куриный Суп',
  'Caldo de Res': 'Говяжий Суп',
  'Guacamole': 'Гуакамоле',
  'Churros con Azúcar y Canela': 'Чурос с Сахаром и Корицей',
};

// Master translation map
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: FOOD_NAME_EN,
  fr: FOOD_NAME_FR,
  de: FOOD_NAME_DE,
  pt: FOOD_NAME_PT,
  it: FOOD_NAME_IT,
  zh: FOOD_NAME_ZH,
  ja: FOOD_NAME_JA,
  ko: FOOD_NAME_KO,
  ar: FOOD_NAME_AR,
  hi: FOOD_NAME_HI,
  ru: FOOD_NAME_RU,
};

/**
 * Get the translated food name for a given language
 * Falls back to English, then to original Spanish name
 */
export function getFoodName(name: string, lang: string): string {
  if (lang === 'es') return name; // Spanish is the base language

  // Try the requested language
  const langTranslations = TRANSLATIONS[lang];
  if (langTranslations && langTranslations[name]) {
    return langTranslations[name];
  }

  // Fall back to English for non-Spanish languages
  if (lang !== 'en' && FOOD_NAME_EN[name]) {
    return FOOD_NAME_EN[name];
  }

  // Return original name if no translation found
  return name;
}

/**
 * Get all available translations for a food item
 */
export function getAllTranslations(name: string): Record<string, string> {
  const result: Record<string, string> = { es: name };

  for (const [lang, translations] of Object.entries(TRANSLATIONS)) {
    if (translations[name]) {
      result[lang] = translations[name];
    } else if (FOOD_NAME_EN[name]) {
      result[lang] = FOOD_NAME_EN[name];
    }
  }

  return result;
}

