/**
 * Script para probar el registro de usuario
 * Ejecuta: npx tsx scripts/test-register.ts
 */

import fetch from 'node-fetch';

async function testRegister() {
  console.log('🧪 Probando registro de usuario...\n');

  const testUser = {
    email: `test+${Date.now()}@nutriflow.app`,
    password: 'test123',
    name: 'Test User',
    age: 25,
    sex: 'male' as const,
    weight: 70,
    height: 170,
    activityLevel: 'moderate' as const,
    goal: 'maintain' as const,
  };

  try {
    console.log('Datos de prueba:');
    console.log(`  Email: ${testUser.email}`);
    console.log(`  Nombre: ${testUser.name}`);
    console.log(`  Edad: ${testUser.age}`);
    console.log(`  Peso: ${testUser.weight} kg`);
    console.log(`  Altura: ${testUser.height} cm\n`);

    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const data: any = await response.json();

    console.log('Status:', response.status);
    console.log('\nRespuesta:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ ¡Registro exitoso!');
      console.log(`📧 Email: ${data.user.email}`);
      console.log(`👤 Nombre: ${data.user.name}`);
      console.log(`🎯 Calorías objetivo: ${data.user.calorieGoal} kcal/día`);
      console.log(`💪 Proteína: ${data.user.proteinGoal}g/día`);
      console.log(`🍞 Carbs: ${data.user.carbGoal}g/día`);
      console.log(`🥑 Grasa: ${data.user.fatGoal}g/día`);
    } else {
      console.log('\n❌ Error en el registro:', data.error);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

testRegister();
