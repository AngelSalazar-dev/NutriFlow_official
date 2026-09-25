import { test, expect } from '@playwright/test';

test.describe('NutriFlow Landing Page', () => {
  test('should display the landing page correctly', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/NutriFlow/i);

    // Check hero section
    await expect(page.getByText('Nutrición Inteligente')).toBeVisible();
    await expect(page.getByText('Resultados Reales')).toBeVisible();

    // Check navigation
    await expect(page.getByText('Características')).toBeVisible();
    await expect(page.getByText('Precios')).toBeVisible();
    await expect(page.getByText('Iniciar sesión')).toBeVisible();
    await expect(page.getByText('Comenzar gratis')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Comenzar gratis').click();

    await expect(page).toHaveURL(/\/register/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Iniciar sesión').click();

    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('NutriFlow Pricing', () => {
  test('should display all pricing plans', async ({ page }) => {
    await page.goto('/');

    // Scroll to pricing section
    await page.getByText('Precios').click();

    // Check plans are visible
    await expect(page.getByText('Gratuito')).toBeVisible();
    await expect(page.getByText('Premium')).toBeVisible();
    await expect(page.getByText('Pro')).toBeVisible();

    // Check prices
    await expect(page.getByText('Gratis')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();
    await expect(page.getByText('$19.99')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('should show registration form', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByPlaceholder(/nombre/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/contraseña/i)).toBeVisible();
  });

  test('should show login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/contraseña/i)).toBeVisible();
  });
});
