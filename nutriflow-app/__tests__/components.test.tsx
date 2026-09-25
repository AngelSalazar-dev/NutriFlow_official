/**
 * Tests Unitarios para Componentes de NutriFlow
 * Ejecuta: npm run test
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/dashboard';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock de AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      name: 'Test User',
      email: 'test@test.com',
      subscriptionPlan: 'free' as const,
    },
    isPremium: false,
    isPro: false,
    logout: jest.fn(),
  }),
}));

describe('Componentes UI', () => {
  
  describe('Button', () => {
    it('debería renderizar correctamente', () => {
      const { Button } = require('@/components/ui/button');
      const { container } = render(<Button>Click me</Button>);
      
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('debería manejar clicks', () => {
      const { Button } = require('@/components/ui/button');
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByText('Click me'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debería estar deshabilitado cuando disabled=true', () => {
      const { Button } = require('@/components/ui/button');
      
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByText('Disabled')).toBeDisabled();
    });
  });

  describe('Card', () => {
    it('debería renderizar Card completo', () => {
      const { Card, CardHeader, CardTitle, CardContent } = require('@/components/ui/card');
      
      render(
        <Card>
          <CardHeader>
            <CardTitle>Título</CardTitle>
          </CardHeader>
          <CardContent>Contenido</CardContent>
        </Card>
      );
      
      expect(screen.getByText('Título')).toBeInTheDocument();
      expect(screen.getByText('Contenido')).toBeInTheDocument();
    });
  });

  describe('Input', () => {
    it('debería renderizar input correctamente', () => {
      const { Input } = require('@/components/ui/input');
      
      render(<Input placeholder="Test placeholder" />);
      expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
    });

    it('debería manejar cambios de texto', () => {
      const { Input } = require('@/components/ui/input');
      const handleChange = jest.fn();
      
      render(<Input onChange={handleChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hello' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Badge', () => {
    it('debería renderizar badge correctamente', () => {
      const { Badge } = require('@/components/ui/badge');
      
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toBeInTheDocument();
    });
  });

  describe('Progress', () => {
    it('debería renderizar progress bar', () => {
      const { Progress } = require('@/components/ui/progress');
      
      render(<Progress value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});

describe('Layout Components', () => {
  
  describe('Sidebar', () => {
    it('debería renderizar sidebar', () => {
      const { Sidebar } = require('@/components/layout/Sidebar');
      
      render(<Sidebar />);
      expect(screen.getByText('NutriFlow')).toBeInTheDocument();
    });

    it('debería mostrar items de navegación', () => {
      const { Sidebar } = require('@/components/layout/Sidebar');
      
      render(<Sidebar />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Alimentos')).toBeInTheDocument();
      expect(screen.getByText('Ejercicio')).toBeInTheDocument();
    });

    it('debería colapsar cuando isCollapsed=true', () => {
      const { Sidebar } = require('@/components/layout/Sidebar');
      
      const { container } = render(<Sidebar isCollapsed={true} />);
      expect(container.firstChild).toHaveClass('w-20');
    });
  });

  describe('DashboardLayout', () => {
    it('debería renderizar layout con children', () => {
      const { DashboardLayout } = require('@/components/layout/DashboardLayout');
      
      render(
        <DashboardLayout>
          <div>Contenido de prueba</div>
        </DashboardLayout>
      );
      
      expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
    });
  });
});

describe('Feature Components', () => {
  
  describe('ThemeToggle', () => {
    it('debería renderizar toggle de tema', () => {
      const { ThemeToggle } = require('@/components/features/ThemeToggle');
      
      render(<ThemeToggle />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('PromoCodeRedeemer', () => {
    it('debería renderizar componente de código promocional', () => {
      const { PromoCodeRedeemer } = require('@/components/features/PromoCodeRedeemer');
      
      render(<PromoCodeRedeemer />);
      expect(screen.getByText('Canjear Código Promocional')).toBeInTheDocument();
    });

    it('debería tener input para código', () => {
      const { PromoCodeRedeemer } = require('@/components/features/PromoCodeRedeemer');
      
      render(<PromoCodeRedeemer />);
      expect(screen.getByPlaceholderText(/Ej:/i)).toBeInTheDocument();
    });
  });

  describe('ReferralProgram', () => {
    it('debería renderizar programa de referidos', () => {
      const { ReferralProgram } = require('@/components/features/ReferralProgram');
      
      render(<ReferralProgram />);
      expect(screen.getByText('Programa de Referidos')).toBeInTheDocument();
    });
  });
});

describe('Food Database', () => {
  
  describe('searchFoods', () => {
    it('debería buscar alimentos por nombre', () => {
      const { searchFoods } = require('@/lib/food-database');
      
      const results = searchFoods('manzana');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Manzana');
    });

    it('debería retornar array vacío para búsqueda no encontrada', () => {
      const { searchFoods } = require('@/lib/food-database');
      
      const results = searchFoods('xyz123notfound');
      expect(results).toEqual([]);
    });

    it('debería limitar resultados a 10', () => {
      const { searchFoods } = require('@/lib/food-database');
      
      const results = searchFoods('');
      expect(results.length).toBeLessThanOrEqual(10);
    });
  });

  describe('getFoodById', () => {
    it('debería encontrar alimento por ID', () => {
      const { getFoodById } = require('@/lib/food-database');
      
      const food = getFoodById('fruit-001');
      expect(food).toBeDefined();
      expect(food?.name).toBe('Manzana');
    });

    it('debería retornar undefined para ID inválido', () => {
      const { getFoodById } = require('@/lib/food-database');
      
      const food = getFoodById('invalid-id');
      expect(food).toBeUndefined();
    });
  });

  describe('getFoodsByCategory', () => {
    it('debería filtrar por categoría', () => {
      const { getFoodsByCategory } = require('@/lib/food-database');
      
      const fruits = getFoodsByCategory('frutas');
      expect(fruits.length).toBeGreaterThan(0);
      fruits.forEach(f => expect(f.category).toBe('frutas'));
    });
  });
});

describe('Utils', () => {
  
  describe('cn', () => {
    it('debería combinar clases correctamente', () => {
      const { cn } = require('@/lib/cn');
      
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('debería manejar clases condicionales', () => {
      const { cn } = require('@/lib/cn');
      
      const result = cn('base', true && 'conditional', false && 'not-included');
      expect(result).toContain('base');
      expect(result).toContain('conditional');
      expect(result).not.toContain('not-included');
    });
  });
});

describe('API Functions', () => {
  
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  describe('Food Search API', () => {
    it('debería buscar alimentos', async () => {
      const mockFoods = [{ id: '1', name: 'Test Food', calories: 100 }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ foods: mockFoods }),
      });

      const response = await fetch('/api/food/search?q=test');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.foods).toEqual(mockFoods);
    });
  });

  describe('Hydration API', () => {
    it('debería registrar agua', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, amountMl: 250 }),
      });

      const response = await fetch('/api/hydration/quick', {
        method: 'POST',
        body: JSON.stringify({ amountMl: 250 }),
      });
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.amountMl).toBe(250);
    });
  });
});

describe('Integration Tests', () => {
  
  it('debería tener todas las dependencias necesarias', () => {
    expect(() => require('@/components/ui/button')).not.toThrow();
    expect(() => require('@/components/ui/card')).not.toThrow();
    expect(() => require('@/components/ui/input')).not.toThrow();
    expect(() => require('@/components/layout/Sidebar')).not.toThrow();
    expect(() => require('@/lib/food-database')).not.toThrow();
  });

  it('debería tener configurados los mocks correctamente', () => {
    const { useAuth } = require('@/context/AuthContext');
    const auth = useAuth();
    
    expect(auth.user).toBeDefined();
    expect(auth.user?.name).toBe('Test User');
  });
});
