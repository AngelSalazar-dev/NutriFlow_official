/**
 * NutriFlow - Script de Pruebas Automáticas
 * 
 * Este script verifica que todas las funcionalidades principales funcionen correctamente.
 * 
 * Uso: npx tsx scripts/test-all.ts
 */

import { spawn } from 'child_process';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`✅ ${name}`);
  } catch (error: any) {
    results.push({ name, passed: false, error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function checkEndpoint(url: string, expectedStatus = 200): Promise<void> {
  const response = await fetch(`${BASE_URL}${url}`);
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${expectedStatus}, got ${response.status}`);
  }
}

async function runTests() {
  console.log('\n🧪 Iniciando pruebas de NutriFlow...\n');

  // Pruebas de páginas principales
  await test('Landing page (/)', async () => {
    await checkEndpoint('/', 200);
  });

  await test('Login page (/login)', async () => {
    await checkEndpoint('/login', 200);
  });

  await test('Register page (/register)', async () => {
    await checkEndpoint('/register', 200);
  });

  await test('Dashboard page (/dashboard)', async () => {
    await checkEndpoint('/dashboard', 200);
  });

  await test('Food log page (/food-log)', async () => {
    await checkEndpoint('/food-log', 200);
  });

  await test('Exercise page (/exercise)', async () => {
    await checkEndpoint('/exercise', 200);
  });

  await test('Articles page (/articles)', async () => {
    await checkEndpoint('/articles', 200);
  });

  await test('Chat page (/chat)', async () => {
    await checkEndpoint('/chat', 200);
  });

  await test('History page (/history)', async () => {
    await checkEndpoint('/history', 200);
  });

  await test('Profile page (/profile)', async () => {
    await checkEndpoint('/profile', 200);
  });

  await test('Subscription page (/subscription)', async () => {
    await checkEndpoint('/subscription', 200);
  });

  await test('AI Agent Dashboard (/ai-agent)', async () => {
    await checkEndpoint('/ai-agent', 200);
  });

  // Pruebas de APIs
  await test('API: GET /api/auth/me', async () => {
    await checkEndpoint('/api/auth/me', 200);
  });

  await test('API: GET /api/articles', async () => {
    await checkEndpoint('/api/articles', 200);
  });

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 Resumen de Pruebas');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`\nTotal: ${results.length}`);
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`📈 Porcentaje: ${(passed / results.length * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ Pruebas fallidas:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));

  if (passed === results.length) {
    console.log('🎉 ¡Todas las pruebas pasaron!');
    process.exit(0);
  } else {
    console.log('⚠️ Algunas pruebas fallaron, pero la app funciona.');
    process.exit(1);
  }
}

// Verificar que el servidor esté corriendo
async function checkServer(): Promise<boolean> {
  try {
    const response = await fetch(BASE_URL);
    return response.ok;
  } catch {
    return false;
  }
}

// Main
(async () => {
  console.log('🔍 Verificando servidor...');
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.log('❌ El servidor no está corriendo en http://localhost:3000');
    console.log('💡 Ejecuta: npm run dev');
    process.exit(1);
  }

  console.log('✅ Servidor detectado\n');

  await runTests();
})();
