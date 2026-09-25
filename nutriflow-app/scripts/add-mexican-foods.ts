/**
 * Script para agregar alimentos mexicanos a la base de datos
 * Incluye tacos, mariscos, antojitos y comida típica mexicana
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { query } from '../lib/mysql';

interface MexicanFood {
  name: string;
  category: string;
  calories: number; // por 100g
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: number;
  servingName: string;
  isVerified: boolean;
  isPriority: boolean;
}

const MEXICAN_FOODS: MexicanFood[] = [
  // ═══════════════════════════════════════
  // TACOS Y ANTOJITOS
  // ═══════════════════════════════════════
  { name: 'Taco de Camarón', category: 'tacos', calories: 175, protein: 12, carbs: 18, fat: 6, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Marlín', category: 'tacos', calories: 190, protein: 14, carbs: 18, fat: 7, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Pollo', category: 'tacos', calories: 165, protein: 11, carbs: 17, fat: 6, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Carne Asada', category: 'tacos', calories: 210, protein: 13, carbs: 17, fat: 10, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Pastor', category: 'tacos', calories: 225, protein: 11, carbs: 20, fat: 11, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Suizo', category: 'tacos', calories: 240, protein: 13, carbs: 19, fat: 12, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Bistec', category: 'tacos', calories: 200, protein: 12, carbs: 17, fat: 9, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Chicharrón', category: 'tacos', calories: 230, protein: 10, carbs: 16, fat: 14, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Tinga', category: 'tacos', calories: 185, protein: 10, carbs: 18, fat: 8, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Carnitas', category: 'tacos', calories: 245, protein: 11, carbs: 17, fat: 14, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Pescado', category: 'tacos', calories: 180, protein: 12, carbs: 17, fat: 7, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Cochinita Pibil', category: 'tacos', calories: 220, protein: 12, carbs: 19, fat: 11, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Birria', category: 'tacos', calories: 235, protein: 13, carbs: 17, fat: 13, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco Dorado de Pollo', category: 'tacos', calories: 220, protein: 10, carbs: 20, fat: 11, fiber: 2, servingSize: 60, servingName: '1 taco dorado', isVerified: true, isPriority: true },
  { name: 'Taco Dorado de Papa', category: 'tacos', calories: 195, protein: 4, carbs: 22, fat: 10, fiber: 2, servingSize: 60, servingName: '1 taco dorado', isVerified: true, isPriority: true },
  { name: 'Taco Vegetariano', category: 'tacos', calories: 140, protein: 6, carbs: 18, fat: 5, fiber: 4, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: true },
  { name: 'Taco de Guisado', category: 'tacos', calories: 190, protein: 10, carbs: 19, fat: 8, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: false },
  { name: 'Taco de Tripa', category: 'tacos', calories: 260, protein: 9, carbs: 16, fat: 17, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: false },
  { name: 'Taco de Lengua', category: 'tacos', calories: 250, protein: 11, carbs: 16, fat: 16, fiber: 2, servingSize: 85, servingName: '1 taco', isVerified: true, isPriority: false },

  // ═══════════════════════════════════════
  // TORTILLAS
  // ═══════════════════════════════════════
  { name: 'Tortilla de Maíz', category: 'tortillas', calories: 218, protein: 6, carbs: 46, fat: 3, fiber: 6, servingSize: 24, servingName: '1 tortilla', isVerified: true, isPriority: true },
  { name: 'Tortilla de Harina', category: 'tortillas', calories: 304, protein: 8, carbs: 52, fat: 7, fiber: 2, servingSize: 40, servingName: '1 tortilla', isVerified: true, isPriority: true },
  { name: 'Tostada de Maíz', category: 'tortillas', calories: 360, protein: 9, carbs: 72, fat: 3, fiber: 7, servingSize: 15, servingName: '1 tostada', isVerified: true, isPriority: true },

  // ═══════════════════════════════════════
  // QUESADILLAS Y ENCHILADAS
  // ═══════════════════════════════════════
  { name: 'Quesadilla de Queso', category: 'antojitos', calories: 280, protein: 14, carbs: 28, fat: 13, fiber: 2, servingSize: 100, servingName: '1 quesadilla', isVerified: true, isPriority: true },
  { name: 'Quesadilla de Pollo', category: 'antojitos', calories: 260, protein: 16, carbs: 25, fat: 11, fiber: 2, servingSize: 100, servingName: '1 quesadilla', isVerified: true, isPriority: true },
  { name: 'Quesadilla de Huitlacoche', category: 'antojitos', calories: 240, protein: 12, carbs: 28, fat: 9, fiber: 4, servingSize: 100, servingName: '1 quesadilla', isVerified: true, isPriority: true },
  { name: 'Quesadilla de Flor de Calabaza', category: 'antojitos', calories: 220, protein: 10, carbs: 27, fat: 8, fiber: 3, servingSize: 100, servingName: '1 quesadilla', isVerified: true, isPriority: true },
  { name: 'Enchiladas Rojas de Pollo', category: 'antojitos', calories: 210, protein: 12, carbs: 20, fat: 9, fiber: 3, servingSize: 150, servingName: '1 enchilada', isVerified: true, isPriority: true },
  { name: 'Enchiladas Verdes de Pollo', category: 'antojitos', calories: 195, protein: 12, carbs: 19, fat: 8, fiber: 3, servingSize: 150, servingName: '1 enchilada', isVerified: true, isPriority: true },
  { name: 'Enchiladas Suizas', category: 'antojitos', calories: 250, protein: 14, carbs: 20, fat: 13, fiber: 2, servingSize: 150, servingName: '1 enchilada', isVerified: true, isPriority: true },
  { name: 'Chilaquiles Rojos', category: 'antojitos', calories: 230, protein: 10, carbs: 25, fat: 10, fiber: 3, servingSize: 250, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Chilaquiles Verdes', category: 'antojitos', calories: 220, protein: 10, carbs: 24, fat: 9, fiber: 3, servingSize: 250, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Chilaquiles con Pollo', category: 'antojitos', calories: 260, protein: 16, carbs: 24, fat: 11, fiber: 3, servingSize: 250, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Chilaquiles con Huevo', category: 'antojitos', calories: 280, protein: 14, carbs: 25, fat: 14, fiber: 3, servingSize: 250, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Tlacoyo de Frijol', category: 'antojitos', calories: 180, protein: 9, carbs: 28, fat: 4, fiber: 5, servingSize: 120, servingName: '1 tlacoyo', isVerified: true, isPriority: true },
  { name: 'Tlacoyo de Haba', category: 'antojitos', calories: 175, protein: 10, carbs: 26, fat: 4, fiber: 5, servingSize: 120, servingName: '1 tlacoyo', isVerified: true, isPriority: false },
  { name: 'Gordita de Chicharrón', category: 'antojitos', calories: 250, protein: 11, carbs: 24, fat: 12, fiber: 3, servingSize: 130, servingName: '1 gordita', isVerified: true, isPriority: true },
  { name: 'Gordita de Pollo', category: 'antojitos', calories: 230, protein: 13, carbs: 22, fat: 10, fiber: 3, servingSize: 130, servingName: '1 gordita', isVerified: true, isPriority: true },
  { name: 'Sope de Pollo', category: 'antojitos', calories: 220, protein: 10, carbs: 24, fat: 9, fiber: 3, servingSize: 120, servingName: '1 sope', isVerified: true, isPriority: true },
  { name: 'Sope de Frijol', category: 'antojitos', calories: 200, protein: 8, carbs: 26, fat: 7, fiber: 4, servingSize: 120, servingName: '1 sope', isVerified: true, isPriority: true },
  { name: 'Tostada de Tinga', category: 'antojitos', calories: 210, protein: 11, carbs: 20, fat: 9, fiber: 3, servingSize: 80, servingName: '1 tostada', isVerified: true, isPriority: true },
  { name: 'Tostada de Pata', category: 'antojitos', calories: 230, protein: 10, carbs: 19, fat: 12, fiber: 2, servingSize: 80, servingName: '1 tostada', isVerified: true, isPriority: false },
  { name: 'Tostada de Atún', category: 'antojitos', calories: 170, protein: 13, carbs: 18, fat: 5, fiber: 2, servingSize: 80, servingName: '1 tostada', isVerified: true, isPriority: true },
  { name: 'Tamal de Pollo', category: 'antojitos', calories: 240, protein: 9, carbs: 30, fat: 10, fiber: 2, servingSize: 200, servingName: '1 tamal', isVerified: true, isPriority: true },
  { name: 'Tamal de Cerdo', category: 'antojitos', calories: 270, protein: 11, carbs: 28, fat: 13, fiber: 2, servingSize: 200, servingName: '1 tamal', isVerified: true, isPriority: true },
  { name: 'Tamal de Dulce', category: 'antojitos', calories: 280, protein: 5, carbs: 45, fat: 9, fiber: 1, servingSize: 200, servingName: '1 tamal', isVerified: true, isPriority: true },
  { name: 'Tamal Oaxaqueño', category: 'antojitos', calories: 290, protein: 12, carbs: 30, fat: 14, fiber: 2, servingSize: 250, servingName: '1 tamal', isVerified: true, isPriority: true },
  { name: 'Pozol', category: 'antojitos', calories: 200, protein: 8, carbs: 26, fat: 8, fiber: 4, servingSize: 180, servingName: '1 bola', isVerified: true, isPriority: false },

  // ═══════════════════════════════════════
  // MARISCOS
  // ═══════════════════════════════════════
  { name: 'Camarón a la Plancha', category: 'mariscos', calories: 99, protein: 21, carbs: 0.2, fat: 1.4, fiber: 0, servingSize: 100, servingName: '100g', isVerified: true, isPriority: true },
  { name: 'Camarón al Ajillo', category: 'mariscos', calories: 140, protein: 18, carbs: 3, fat: 6, fiber: 0, servingSize: 120, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Camarón Empapelado', category: 'mariscos', calories: 130, protein: 16, carbs: 5, fat: 5, fiber: 1, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Coctel de Camarón', category: 'mariscos', calories: 110, protein: 14, carbs: 10, fat: 2, fiber: 1, servingSize: 250, servingName: '1 vaso', isVerified: true, isPriority: true },
  { name: 'Aguachile de Camarón', category: 'mariscos', calories: 95, protein: 15, carbs: 5, fat: 2, fiber: 1, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Ceviche de Camarón', category: 'mariscos', calories: 100, protein: 16, carbs: 6, fat: 2, fiber: 1, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Ceviche de Pescado', category: 'mariscos', calories: 90, protein: 15, carbs: 5, fat: 1, fiber: 1, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Ceviche de Pulpo', category: 'mariscos', calories: 85, protein: 14, carbs: 5, fat: 1, fiber: 1, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: false },
  { name: 'Marlín a la Plancha', category: 'mariscos', calories: 140, protein: 25, carbs: 0, fat: 4, fiber: 0, servingSize: 150, servingName: '1 filete', isVerified: true, isPriority: true },
  { name: 'Marlín Ahumado', category: 'mariscos', calories: 150, protein: 24, carbs: 0, fat: 5, fiber: 0, servingSize: 100, servingName: '100g', isVerified: true, isPriority: true },
  { name: 'Pescado Zarandeado', category: 'mariscos', calories: 180, protein: 22, carbs: 3, fat: 8, fiber: 1, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Pescado a la Diabla', category: 'mariscos', calories: 170, protein: 20, carbs: 4, fat: 8, fiber: 1, servingSize: 180, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Filete de Pescado Empanizado', category: 'mariscos', calories: 230, protein: 16, carbs: 15, fat: 12, fiber: 1, servingSize: 150, servingName: '1 filete', isVerified: true, isPriority: true },
  { name: 'Filete de Pescado a la Plancha', category: 'mariscos', calories: 130, protein: 22, carbs: 0, fat: 4, fiber: 0, servingSize: 150, servingName: '1 filete', isVerified: true, isPriority: true },
  { name: 'Pulpo a la Gallega', category: 'mariscos', calories: 120, protein: 16, carbs: 4, fat: 5, fiber: 1, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: false },
  { name: 'Tostada de Ceviche', category: 'mariscos', calories: 130, protein: 10, carbs: 16, fat: 3, fiber: 2, servingSize: 50, servingName: '1 tostada', isVerified: true, isPriority: true },
  { name: 'Tostada de Camarón', category: 'mariscos', calories: 140, protein: 11, carbs: 16, fat: 4, fiber: 2, servingSize: 50, servingName: '1 tostada', isVerified: true, isPriority: true },
  { name: 'Tostada de Marlín', category: 'mariscos', calories: 155, protein: 13, carbs: 16, fat: 5, fiber: 2, servingSize: 50, servingName: '1 tostada', isVerified: true, isPriority: true },
  { name: 'Tostada de Atún', category: 'mariscos', calories: 120, protein: 12, carbs: 15, fat: 2, fiber: 2, servingSize: 50, servingName: '1 tostada', isVerified: true, isPriority: true },
  { name: 'Tostada de Pulpo', category: 'mariscos', calories: 110, protein: 10, carbs: 15, fat: 2, fiber: 2, servingSize: 50, servingName: '1 tostada', isVerified: true, isPriority: false },

  // ═══════════════════════════════════════
  // SOPAS Y CALDOS
  // ═══════════════════════════════════════
  { name: 'Caldo Tlalpeño', category: 'sopas', calories: 150, protein: 12, carbs: 12, fat: 6, fiber: 2, servingSize: 300, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Caldo de Pollo', category: 'sopas', calories: 80, protein: 8, carbs: 6, fat: 3, fiber: 1, servingSize: 300, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Caldo de Res', category: 'sopas', calories: 160, protein: 14, carbs: 10, fat: 7, fiber: 2, servingSize: 350, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Pozole Rojo', category: 'sopas', calories: 220, protein: 14, carbs: 24, fat: 7, fiber: 3, servingSize: 350, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Pozole Verde', category: 'sopas', calories: 200, protein: 13, carbs: 22, fat: 6, fiber: 3, servingSize: 350, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Pozole Blanco', category: 'sopas', calories: 190, protein: 12, carbs: 24, fat: 5, fiber: 3, servingSize: 350, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Menudo', category: 'sopas', calories: 180, protein: 14, carbs: 10, fat: 9, fiber: 2, servingSize: 300, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Sopa de Tortilla', category: 'sopas', calories: 160, protein: 8, carbs: 18, fat: 7, fiber: 3, servingSize: 300, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Sopa de Lima', category: 'sopas', calories: 140, protein: 12, carbs: 12, fat: 5, fiber: 2, servingSize: 300, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Birria de Res', category: 'sopas', calories: 240, protein: 18, carbs: 8, fat: 15, fiber: 2, servingSize: 300, servingName: '1 plato', isVerified: true, isPriority: true },
  { name: 'Barbacoa', category: 'sopas', calories: 230, protein: 19, carbs: 6, fat: 14, fiber: 1, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Consumé de Barbacoa', category: 'sopas', calories: 120, protein: 10, carbs: 8, fat: 5, fiber: 1, servingSize: 300, servingName: '1 plato', isVerified: true, isPriority: true },

  // ═══════════════════════════════════════
  // GUISADOS MEXICANOS
  // ═══════════════════════════════════════
  { name: 'Chiles en Nogada', category: 'guisados', calories: 320, protein: 12, carbs: 30, fat: 18, fiber: 4, servingSize: 250, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Mole Poblano con Pollo', category: 'guisados', calories: 310, protein: 18, carbs: 25, fat: 16, fiber: 3, servingSize: 250, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Chile Relleno de Queso', category: 'guisados', calories: 280, protein: 14, carbs: 18, fat: 17, fiber: 3, servingSize: 200, servingName: '1 chile', isVerified: true, isPriority: true },
  { name: 'Chile Relleno de Carne', category: 'guisados', calories: 310, protein: 18, carbs: 18, fat: 18, fiber: 3, servingSize: 220, servingName: '1 chile', isVerified: true, isPriority: true },
  { name: 'Cochinita Pibil', category: 'guisados', calories: 260, protein: 18, carbs: 10, fat: 16, fiber: 2, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Tinga de Pollo', category: 'guisados', calories: 190, protein: 14, carbs: 8, fat: 11, fiber: 2, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Picadillo Mexicano', category: 'guisados', calories: 220, protein: 16, carbs: 12, fat: 12, fiber: 3, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Milanesa de Pollo', category: 'guisados', calories: 250, protein: 20, carbs: 18, fat: 12, fiber: 1, servingSize: 150, servingName: '1 pieza', isVerified: true, isPriority: true },
  { name: 'Milanesa de Res', category: 'guisados', calories: 280, protein: 22, carbs: 18, fat: 14, fiber: 1, servingSize: 160, servingName: '1 pieza', isVerified: true, isPriority: true },
  { name: 'Albóndigas', category: 'guisados', calories: 210, protein: 14, carbs: 14, fat: 11, fiber: 2, servingSize: 200, servingName: '4 albóndigas', isVerified: true, isPriority: true },
  { name: 'Nopales Guisados', category: 'guisados', calories: 60, protein: 3, carbs: 8, fat: 2, fiber: 4, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Nopales con Huevo', category: 'guisados', calories: 150, protein: 10, carbs: 8, fat: 8, fiber: 4, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Huevos a la Mexicana', category: 'guisados', calories: 180, protein: 12, carbs: 6, fat: 12, fiber: 2, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Huevos con Chorizo', category: 'guisados', calories: 320, protein: 16, carbs: 2, fat: 28, fiber: 0, servingSize: 180, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Huevos Rancheros', category: 'guisados', calories: 290, protein: 14, carbs: 22, fat: 16, fiber: 3, servingSize: 250, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Huevos Divorciados', category: 'guisados', calories: 310, protein: 15, carbs: 24, fat: 17, fiber: 3, servingSize: 250, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Frijoles de la Olla', category: 'guisados', calories: 130, protein: 8, carbs: 22, fat: 1, fiber: 7, servingSize: 170, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Frijoles Refritos', category: 'guisados', calories: 180, protein: 8, carbs: 24, fat: 6, fiber: 7, servingSize: 170, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Arroz Rojo Mexicano', category: 'guisados', calories: 160, protein: 3, carbs: 30, fat: 3, fiber: 1, servingSize: 150, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Arroz Verde', category: 'guisados', calories: 150, protein: 3, carbs: 28, fat: 3, fiber: 2, servingSize: 150, servingName: '1 taza', isVerified: true, isPriority: true },

  // ═══════════════════════════════════════
  // SALSAS Y ACOMPAÑAMIENTOS
  // ═══════════════════════════════════════
  { name: 'Salsa Roja', category: 'salsas', calories: 30, protein: 1, carbs: 5, fat: 1, fiber: 1, servingSize: 30, servingName: '2 cdas', isVerified: true, isPriority: true },
  { name: 'Salsa Verde', category: 'salsas', calories: 25, protein: 1, carbs: 4, fat: 1, fiber: 1, servingSize: 30, servingName: '2 cdas', isVerified: true, isPriority: true },
  { name: 'Salsa de Chile de Árbol', category: 'salsas', calories: 20, protein: 1, carbs: 3, fat: 1, fiber: 1, servingSize: 30, servingName: '2 cdas', isVerified: true, isPriority: true },
  { name: 'Salsa de Aguachile', category: 'salsas', calories: 35, protein: 1, carbs: 5, fat: 1, fiber: 1, servingSize: 30, servingName: '2 cdas', isVerified: true, isPriority: true },
  { name: 'Pico de Gallo', category: 'salsas', calories: 20, protein: 1, carbs: 4, fat: 0, fiber: 1, servingSize: 30, servingName: '2 cdas', isVerified: true, isPriority: true },
  { name: 'Guacamole', category: 'salsas', calories: 150, protein: 2, carbs: 9, fat: 14, fiber: 5, servingSize: 60, servingName: '1/4 taza', isVerified: true, isPriority: true },
  { name: 'Crema Mexicana', category: 'salsas', calories: 200, protein: 3, carbs: 3, fat: 20, fiber: 0, servingSize: 30, servingName: '2 cdas', isVerified: true, isPriority: true },
  { name: 'Queso Fresco', category: 'salsas', calories: 280, protein: 18, carbs: 4, fat: 21, fiber: 0, servingSize: 30, servingName: '1 rebanada', isVerified: true, isPriority: true },
  { name: 'Cebolla Curtida', category: 'salsas', calories: 25, protein: 0, carbs: 6, fat: 0, fiber: 1, servingSize: 30, servingName: '2 cdas', isVerified: true, isPriority: false },
  { name: 'Zanahorias en Escabeche', category: 'salsas', calories: 35, protein: 1, carbs: 7, fat: 1, fiber: 2, servingSize: 50, servingName: '1/4 taza', isVerified: true, isPriority: false },

  // ═══════════════════════════════════════
  // SNACKS Y BOTANAS
  // ═══════════════════════════════════════
  { name: 'Totopos con Guacamole', category: 'botanas', calories: 220, protein: 4, carbs: 20, fat: 14, fiber: 4, servingSize: 80, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Totopos con Queso', category: 'botanas', calories: 280, protein: 8, carbs: 24, fat: 17, fiber: 3, servingSize: 80, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Nachos con Queso', category: 'botanas', calories: 300, protein: 10, carbs: 26, fat: 18, fiber: 3, servingSize: 100, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Elote', category: 'botanas', calories: 180, protein: 5, carbs: 22, fat: 9, fiber: 3, servingSize: 150, servingName: '1 elote', isVerified: true, isPriority: true },
  { name: 'Esquite', category: 'botanas', calories: 160, protein: 4, carbs: 20, fat: 7, fiber: 3, servingSize: 200, servingName: '1 vaso', isVerified: true, isPriority: true },
  { name: 'Dorilocos', category: 'botanas', calories: 320, protein: 4, carbs: 36, fat: 18, fiber: 3, servingSize: 120, servingName: '1 porción', isVerified: true, isPriority: false },
  { name: 'Papel Picado (Fruta)', category: 'botanas', calories: 80, protein: 1, carbs: 18, fat: 1, fiber: 3, servingSize: 200, servingName: '1 porción', isVerified: true, isPriority: false },
  { name: 'Jícama con Chile', category: 'botanas', calories: 40, protein: 1, carbs: 9, fat: 0, fiber: 5, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Pepino con Chile', category: 'botanas', calories: 25, protein: 1, carbs: 5, fat: 0, fiber: 2, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: false },
  { name: 'Mango con Chile', category: 'botanas', calories: 70, protein: 1, carbs: 17, fat: 0, fiber: 2, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: true },

  // ═══════════════════════════════════════
  // BEBIDAS MEXICANAS
  // ═══════════════════════════════════════
  { name: 'Agua de Horchata', category: 'bebidas', calories: 80, protein: 1, carbs: 18, fat: 1, fiber: 0, servingSize: 250, servingName: '1 vaso', isVerified: true, isPriority: true },
  { name: 'Agua de Jamaica', category: 'bebidas', calories: 60, protein: 0, carbs: 15, fat: 0, fiber: 0, servingSize: 250, servingName: '1 vaso', isVerified: true, isPriority: true },
  { name: 'Agua de Tamarindo', category: 'bebidas', calories: 70, protein: 0, carbs: 17, fat: 0, fiber: 0, servingSize: 250, servingName: '1 vaso', isVerified: true, isPriority: true },
  { name: 'Agua de Limón', category: 'bebidas', calories: 40, protein: 0, carbs: 10, fat: 0, fiber: 0, servingSize: 250, servingName: '1 vaso', isVerified: true, isPriority: true },
  { name: 'Agua de Sandía', category: 'bebidas', calories: 50, protein: 1, carbs: 12, fat: 0, fiber: 1, servingSize: 250, servingName: '1 vaso', isVerified: true, isPriority: true },
  { name: 'Agua de Piña', category: 'bebidas', calories: 55, protein: 0, carbs: 14, fat: 0, fiber: 1, servingSize: 250, servingName: '1 vaso', isVerified: true, isPriority: true },
  { name: 'Atole', category: 'bebidas', calories: 120, protein: 3, carbs: 22, fat: 2, fiber: 1, servingSize: 250, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Atole de Chocolate', category: 'bebidas', calories: 150, protein: 3, carbs: 26, fat: 4, fiber: 2, servingSize: 250, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Champurrado', category: 'bebidas', calories: 170, protein: 4, carbs: 28, fat: 5, fiber: 2, servingSize: 250, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Café de Olla', category: 'bebidas', calories: 30, protein: 0, carbs: 7, fat: 0, fiber: 0, servingSize: 240, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Chocolate Caliente', category: 'bebidas', calories: 180, protein: 5, carbs: 24, fat: 8, fiber: 2, servingSize: 250, servingName: '1 taza', isVerified: true, isPriority: true },

  // ═══════════════════════════════════════
  // POSTRES MEXICANOS
  // ═══════════════════════════════════════
  { name: 'Flan Napolitano', category: 'postres', calories: 220, protein: 6, carbs: 30, fat: 9, fiber: 0, servingSize: 120, servingName: '1 rebanada', isVerified: true, isPriority: true },
  { name: 'Arroz con Leche', category: 'postres', calories: 180, protein: 5, carbs: 30, fat: 4, fiber: 0, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: true },
  { name: 'Churros', category: 'postres', calories: 350, protein: 5, carbs: 40, fat: 18, fiber: 1, servingSize: 80, servingName: '3 piezas', isVerified: true, isPriority: true },
  { name: 'Tres Leches', category: 'postres', calories: 300, protein: 7, carbs: 36, fat: 14, fiber: 0, servingSize: 120, servingName: '1 rebanada', isVerified: true, isPriority: true },
  { name: 'Gelatina de Mosaico', category: 'postres', calories: 80, protein: 2, carbs: 18, fat: 0, fiber: 0, servingSize: 150, servingName: '1 porción', isVerified: true, isPriority: false },
  { name: 'Cajeta', category: 'postres', calories: 320, protein: 5, carbs: 56, fat: 8, fiber: 0, servingSize: 30, servingName: '2 cdas', isVerified: true, isPriority: true },
  { name: 'Alegrías de Amaranto', category: 'postres', calories: 420, protein: 10, carbs: 52, fat: 20, fiber: 6, servingSize: 50, servingName: '1 barra', isVerified: true, isPriority: true },

  // ═══════════════════════════════════════
  // FRUTAS TROPICALES
  // ═══════════════════════════════════════
  { name: 'Mango', category: 'frutas', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, servingSize: 165, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Papaya', category: 'frutas', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, servingSize: 140, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Sandía', category: 'frutas', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, servingSize: 152, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Piña', category: 'frutas', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, servingSize: 165, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Guayaba', category: 'frutas', calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, servingSize: 55, servingName: '1 pieza', isVerified: true, isPriority: true },
  { name: 'Mamey', category: 'frutas', calories: 130, protein: 2, carbs: 32, fat: 0.5, fiber: 5, servingSize: 170, servingName: '1 taza', isVerified: true, isPriority: false },
  { name: 'Zapote Negro', category: 'frutas', calories: 110, protein: 1.5, carbs: 27, fat: 0.3, fiber: 4, servingSize: 150, servingName: '1 taza', isVerified: true, isPriority: false },
  { name: 'Chirimoya', category: 'frutas', calories: 75, protein: 1.6, carbs: 18, fat: 0.4, fiber: 2.5, servingSize: 100, servingName: '1 taza', isVerified: true, isPriority: false },
  { name: 'Nanche', category: 'frutas', calories: 50, protein: 0.8, carbs: 11, fat: 0.5, fiber: 2, servingSize: 100, servingName: '1/2 taza', isVerified: true, isPriority: false },
  { name: 'Tuna', category: 'frutas', calories: 41, protein: 0.7, carbs: 10, fat: 0.3, fiber: 3.6, servingSize: 100, servingName: '1 pieza', isVerified: true, isPriority: false },

  // ═══════════════════════════════════════
  // VERDURAS Y LEGUMBRES MEXICANAS
  // ═══════════════════════════════════════
  { name: 'Nopales', category: 'verduras', calories: 16, protein: 0.7, carbs: 3, fat: 0.1, fiber: 2.2, servingSize: 128, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Chayote', category: 'verduras', calories: 19, protein: 0.8, carbs: 4.5, fat: 0.1, fiber: 1.7, servingSize: 100, servingName: '1 pieza', isVerified: true, isPriority: true },
  { name: 'Calabacita', category: 'verduras', calories: 17, protein: 1.2, carbs: 3.2, fat: 0.2, fiber: 1, servingSize: 124, servingName: '1 taza', isVerified: true, isPriority: true },
  { name: 'Elote/Maíz', category: 'verduras', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, fiber: 2.4, servingSize: 154, servingName: '1 elote', isVerified: true, isPriority: true },
  { name: 'Huitlacoche', category: 'verduras', calories: 45, protein: 5, carbs: 6, fat: 1, fiber: 2, servingSize: 100, servingName: '100g', isVerified: true, isPriority: true },
  { name: 'Flor de Calabaza', category: 'verduras', calories: 15, protein: 1.5, carbs: 2, fat: 0.2, fiber: 1, servingSize: 60, servingName: '5 flores', isVerified: true, isPriority: true },
  { name: 'Quelites', category: 'verduras', calories: 25, protein: 3, carbs: 3, fat: 0.4, fiber: 2, servingSize: 100, servingName: '1 taza', isVerified: true, isPriority: false },
  { name: 'Huauzontles', category: 'verduras', calories: 30, protein: 3.5, carbs: 4, fat: 0.5, fiber: 2.5, servingSize: 100, servingName: '1 taza', isVerified: true, isPriority: false },
];

async function addMexicanFoods() {
  console.log('🌮 Agregando alimentos mexicanos a la base de datos...\n');

  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (const food of MEXICAN_FOODS) {
    try {
      // Check if food already exists
      const [existing] = await query('SELECT id FROM foods WHERE name = ?', [food.name]) as any[];

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      // Insert new food
      await query(
        `INSERT INTO foods (
          id, name, brand, category, calories, protein, carbs, fat, fiber,
          serving_size, serving_name, is_priority, is_verified, data_source,
          created_at
        ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'mexican-database', NOW())`,
        [
          food.name,
          '', // brand (empty for generic foods)
          food.category,
          food.calories,
          food.protein,
          food.carbs,
          food.fat,
          food.fiber,
          food.servingSize,
          food.servingName,
          food.isPriority ? 1 : 0,
          food.isVerified ? 1 : 0,
        ]
      );

      added++;
      console.log(`✅ ${food.name} (${food.category})`);
    } catch (error: any) {
      errors++;
      console.error(`❌ Error agregando ${food.name}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Resumen:`);
  console.log(`   ✅ Agregados: ${added}`);
  console.log(`   ⏭️  Omitidos (ya existen): ${skipped}`);
  console.log(`   ❌ Errores: ${errors}`);
  console.log(`   📦 Total procesados: ${MEXICAN_FOODS.length}`);
  console.log('='.repeat(50));
}

// Run
addMexicanFoods()
  .then(() => {
    console.log('\n🎉 ¡Proceso completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
