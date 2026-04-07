import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PromoCodeRedeemer } from '@/components/features/PromoCodeRedeemer';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/context/AuthContext';

// Mock fetch
global.fetch = jest.fn();

function renderWithProviders(component: React.ReactElement) {
  return render(
    <ToastProvider>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ToastProvider>
  );
}

describe('PromoCodeRedeemer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithProviders(<PromoCodeRedeemer />);
    
    expect(screen.getByText('Canjear Código Promocional')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej: BETA100/i)).toBeInTheDocument();
    expect(screen.getByText('Validar')).toBeInTheDocument();
  });

  it('shows validation error for empty code', async () => {
    renderWithProviders(<PromoCodeRedeemer />);
    
    const validateButton = screen.getByText('Validar');
    expect(validateButton).toBeDisabled();
  });

  it('validates a valid code', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        valid: true,
        plan: 'premium',
        duration: '1 months',
        usesRemaining: 'Ilimitados',
      }),
    });

    renderWithProviders(<PromoCodeRedeemer />);
    
    const input = screen.getByPlaceholderText(/Ej: BETA100/i);
    fireEvent.change(input, { target: { value: 'BETA100' } });
    
    const validateButton = screen.getByText('Validar');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Código válido')).toBeInTheDocument();
    });
  });

  it('shows error for invalid code', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Código inválido o expirado',
      }),
    });

    renderWithProviders(<PromoCodeRedeemer />);
    
    const input = screen.getByPlaceholderText(/Ej: BETA100/i);
    fireEvent.change(input, { target: { value: 'INVALID' } });
    
    const validateButton = screen.getByText('Validar');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Código inválido o expirado')).toBeInTheDocument();
    });
  });
});
