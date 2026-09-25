import { test, expect } from '@playwright/test';

test.describe('NutriFlow - Pruebas E2E Completas', () => {
  
  // ============================================
  // PÁGINA DE INICIO (LANDING)
  // ============================================
  test.describe('Landing Page', () => {
    test('debería cargar la landing page correctamente', async ({ page }) => {
      await page.goto('/');
      
      // Verificar título
      await expect(page).toHaveTitle(/NutriFlow/i);
      
      // Verificar elementos principales
      await expect(page.getByText('Nutrición Inteligente')).toBeVisible();
      await expect(page.getByText('Resultados Reales')).toBeVisible();
    });

    test('debería mostrar todas las secciones', async ({ page }) => {
      await page.goto('/');
      
      // Verificar secciones
      await expect(page.locator('#features')).toBeVisible();
      await expect(page.locator('#pricing')).toBeVisible();
      await expect(page.locator('#testimonials')).toBeVisible();
    });

    test('debería navegar a registro', async ({ page }) => {
      await page.goto('/');
      await page.getByText('Comenzar gratis').click();
      await expect(page).toHaveURL(/\/register/);
    });

    test('debería navegar a login', async ({ page }) => {
      await page.goto('/');
      await page.getByText('Iniciar sesión').click();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  // ============================================
  // AUTENTICACIÓN
  // ============================================
  test.describe('Autenticación', () => {
    test('debería mostrar formulario de registro', async ({ page }) => {
      await page.goto('/register');
      
      await expect(page.getByPlaceholder(/nombre/i)).toBeVisible();
      await expect(page.getByPlaceholder(/email/i)).toBeVisible();
      await expect(page.getByPlaceholder(/contraseña/i)).toBeVisible();
    });

    test('debería mostrar formulario de login', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page.getByPlaceholder(/email/i)).toBeVisible();
      await expect(page.getByPlaceholder(/contraseña/i)).toBeVisible();
      await expect(page.getByText('Iniciar sesión')).toBeVisible();
    });

    test('debería validar campos requeridos en registro', async ({ page }) => {
      await page.goto('/register');
      
      // Intentar enviar sin datos
      await page.getByText('Crear cuenta', { exact: true }).click();
      
      // Debería mostrar error o no enviar
      await expect(page).toHaveURL(/\/register/);
    });
  });

  // ============================================
  // DASHBOARD
  // ============================================
  test.describe('Dashboard', () => {
    test('debería cargar dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Verificar elementos del dashboard
      await expect(page.getByText('Dashboard')).toBeVisible();
    });

    test('debería mostrar resumen de calorías', async ({ page }) => {
      await page.goto('/dashboard');
      
      await expect(page.getByText(/calorías/i)).toBeVisible();
    });

    test('debería mostrar hidratación', async ({ page }) => {
      await page.goto('/dashboard');
      
      await expect(page.getByText(/hidratación/i)).toBeVisible();
    });
  });

  // ============================================
  // FOOD LOG (REGISTRO DE ALIMENTOS)
  // ============================================
  test.describe('Food Log', () => {
    test('debería cargar food log', async ({ page }) => {
      await page.goto('/food-log');
      
      await expect(page.getByText('Registro de Alimentos')).toBeVisible();
    });

    test('debería mostrar búsqueda de alimentos', async ({ page }) => {
      await page.goto('/food-log');
      
      const searchInput = page.getByPlaceholder(/Escribe/i);
      await expect(searchInput).toBeVisible();
    });

    test('debería mostrar hidratación rápida', async ({ page }) => {
      await page.goto('/food-log');
      
      await expect(page.getByText('Hidratación')).toBeVisible();
      await expect(page.locator('button').filter({ hasText: /250ml/i })).toBeVisible();
    });

    test('debería buscar alimentos', async ({ page }) => {
      await page.goto('/food-log');
      
      const searchInput = page.getByPlaceholder(/Escribe/i);
      await searchInput.fill('manzana');
      await page.waitForTimeout(500); // Esperar debounce
      
      // Debería mostrar resultados
      const results = page.locator('button').filter({ hasText: /manzana/i });
      await expect(results.first()).toBeVisible({ timeout: 5000 });
    });
  });

  // ============================================
  // EJERCICIO
  // ============================================
  test.describe('Ejercicio', () => {
    test('debería cargar página de ejercicio', async ({ page }) => {
      await page.goto('/exercise');
      
      await expect(page.getByText('Ejercicio')).toBeVisible();
    });
  });

  // ============================================
  // CHAT IA
  // ============================================
  test.describe('Chat IA', () => {
    test('debería cargar chat', async ({ page }) => {
      await page.goto('/chat');
      
      await expect(page.getByText(/chat/i)).toBeVisible();
    });

    test('debería mostrar input de mensaje', async ({ page }) => {
      await page.goto('/chat');
      
      const input = page.getByPlaceholder(/Escribe/i);
      await expect(input).toBeVisible();
    });
  });

  // ============================================
  // ARTÍCULOS
  // ============================================
  test.describe('Artículos', () => {
    test('debería cargar artículos', async ({ page }) => {
      await page.goto('/articles');
      
      await expect(page.getByText('Artículos')).toBeVisible();
    });
  });

  // ============================================
  // HISTORIAL
  // ============================================
  test.describe('Historial', () => {
    test('debería cargar historial', async ({ page }) => {
      await page.goto('/history');
      
      await expect(page.getByText('Historial')).toBeVisible();
    });
  });

  // ============================================
  // SUSCRIPCIÓN
  // ============================================
  test.describe('Suscripción', () => {
    test('debería mostrar planes', async ({ page }) => {
      await page.goto('/subscription');
      
      await expect(page.getByText('Gratuito')).toBeVisible();
      await expect(page.getByText('Premium')).toBeVisible();
      await expect(page.getByText('Pro')).toBeVisible();
    });

    test('debería mostrar código promocional', async ({ page }) => {
      await page.goto('/subscription');
      
      await expect(page.getByText('Canjear Código')).toBeVisible();
    });

    test('debería mostrar programa de referidos', async ({ page }) => {
      await page.goto('/subscription');
      
      await expect(page.getByText('Referidos')).toBeVisible();
    });
  });

  // ============================================
  // PERFIL
  // ============================================
  test.describe('Perfil', () => {
    test('debería cargar perfil', async ({ page }) => {
      await page.goto('/profile');
      
      await expect(page.getByText('Perfil')).toBeVisible();
    });
  });

  // ============================================
  // AI AGENT DASHBOARD
  // ============================================
  test.describe('AI Agent', () => {
    test('debería cargar AI Agent dashboard', async ({ page }) => {
      await page.goto('/ai-agent');
      
      await expect(page.getByText('AI Agent')).toBeVisible();
    });

    test('debería mostrar revenue share', async ({ page }) => {
      await page.goto('/ai-agent');
      
      await expect(page.getByText(/70%/i)).toBeVisible();
      await expect(page.getByText(/20%/i)).toBeVisible();
      await expect(page.getByText(/10%/i)).toBeVisible();
    });
  });

  // ============================================
  // NAVEGACIÓN
  // ============================================
  test.describe('Navegación', () => {
    test('debería navegar desde sidebar', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Click en cada item del sidebar
      const navItems = [
        { text: 'Dashboard', url: '/dashboard' },
        { text: 'Alimentos', url: '/food-log' },
        { text: 'Ejercicio', url: '/exercise' },
        { text: 'Chat', url: '/chat' },
        { text: 'Artículos', url: '/articles' },
        { text: 'Historial', url: '/history' },
      ];

      for (const item of navItems) {
        const link = page.getByText(item.text);
        if (await link.isVisible()) {
          await link.click();
          await expect(page).toHaveURL(new RegExp(item.url));
          await page.waitForTimeout(100);
        }
      }
    });
  });

  // ============================================
  // RESPONSIVE
  // ============================================
  test.describe('Responsive Design', () => {
    test('debería verse bien en móvil', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Verificar que el menú hamburguesa esté visible
      const menuButton = page.locator('button.md\\:hidden');
      await expect(menuButton).toBeVisible();
    });

    test('debería verse bien en desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      // Verificar navegación desktop
      await expect(page.locator('.md\\:flex')).toBeVisible();
    });
  });

  // ============================================
  // DARK MODE
  // ============================================
  test.describe('Dark Mode', () => {
    test('debería tener toggle de dark mode', async ({ page }) => {
      await page.goto('/dashboard');
      
      const themeToggle = page.locator('button').filter({ hasText: /sun|moon/i }).first();
      await expect(themeToggle).toBeVisible();
    });
  });

  // ============================================
  // PERFORMANCE
  // ============================================
  test.describe('Performance', () => {
    test('debería cargar rápido', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Debería cargar en menos de 3 segundos
      expect(loadTime).toBeLessThan(3000);
    });

    test('debería tener buen LCP', async ({ page }) => {
      await page.goto('/');
      
      const metrics = await page.evaluate(() => {
        return new Promise<any>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve({ lcp: lastEntry.startTime });
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          setTimeout(() => resolve({ lcp: 0 }), 3000);
        });
      });
      
      // LCP debería ser menos de 2.5 segundos
      expect(metrics.lcp).toBeLessThan(2500);
    });
  });
});
