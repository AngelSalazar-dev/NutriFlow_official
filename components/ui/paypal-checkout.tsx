'use client';

import * as React from 'react';

const PAYPAL_CLIENT_ID = 'Aa_d9myP4gn_LzUoiO6hHmaptmqGoPVy2rBoDiv0FwdbQZob0TYeKRPTxrPkSYv0EaqiPJqofzesvcb3';

interface PayPalCheckoutProps {
  planId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function PayPalCheckout({ planId, onSuccess, onError }: PayPalCheckoutProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [errorStatus, setErrorStatus] = React.useState<string | null>(null);

  // 1. Descargamos PayPal SDK evadiendo totalmente a Next.js (Inyección directa al DOM del Body)
  React.useEffect(() => {
    // Si ya descargó y se enlazó a window, usar directamente.
    if ((window as any).paypal && (window as any).paypal.Buttons) {
      setIsReady(true);
      return;
    }

    const scriptId = 'paypal-native-sdk';
    let timeout: NodeJS.Timeout;

    const startPolling = () => {
      let elapsed = 0;
      const interv = setInterval(() => {
        elapsed += 100;
        if ((window as any).paypal && (window as any).paypal.Buttons) {
          clearInterval(interv);
          clearTimeout(timeout);
          setIsReady(true);
        } else if (elapsed >= 10000) {
          clearInterval(interv);
          setErrorStatus('El SDK de PayPal tardó demasiado en inicializarse. Recarga la página e inténtalo de nuevo.');
        }
      }, 100);
      return interv;
    };

    // Si ya existe en el DOM por un montaje previo, solo esperar.
    if (document.getElementById(scriptId)) {
      const interv = startPolling();
      return () => clearInterval(interv);
    }

    // Crear la inyección pura al DOM (fuera del ciclo React)
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture&components=buttons`;
    script.async = true;

    script.onload = () => {
      const interv = startPolling(); // Polling seguro en vez de setTimeout fijo
      timeout = setTimeout(() => clearInterval(interv), 10000);
    };

    script.onerror = () => {
      setErrorStatus('El navegador rechazó descargar el script de PayPal. Comprueba tu conexión a Internet.');
    };

    document.body.appendChild(script);
    // No limpiamos el script al desmontar para que sobreviva navegaciones
  }, []);

  // 2. Renderizamos los botones manualmente usando la API nativa
  React.useEffect(() => {
    if (!isReady || !containerRef.current) return;

    // Limpieza para el Strict Mode (evita botones duplicados)
    containerRef.current.innerHTML = '';

    try {
      const buttons = (window as any).paypal.Buttons({
        style: { layout: 'vertical', shape: 'rect' },
        createOrder: async () => {
          const res = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ planId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Error al crear la orden');
          return data.orderId; // el ID que espera la pasarela nativa
        },
        onApprove: async (data: any) => {
          try {
            const res = await fetch('/api/payments/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ orderId: data.orderID, planId }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Error al capturar el pago');
            onSuccess();
          } catch (err: any) {
            onError(err.message || 'Error procesando el pago en nuestros servidores');
          }
        },
        onError: (err: any) => {
          console.error("PayPal native error:", err);
          onError('Error interno con la ventana de PayPal. Verifica si tienes saldo y vuelve a intentar.');
        }
      });

      if (buttons && buttons.isEligible()) {
        buttons.render(containerRef.current);
      }
    } catch (error) {
      console.error("PayPal render crash:", error);
    }
  }, [isReady, planId]); // Solo re-renderizamos si cambia el ID del plan o el status del SDK

  return (
    <div className="w-full relative min-h-[150px] flex flex-col items-center justify-center">
      {errorStatus && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200 z-20">
            <span className="font-bold text-sm mb-1">Bloqueo detectado</span>
            <span className="text-xs">{errorStatus}</span>
        </div>
      )}
      {!isReady && !errorStatus && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-500 animate-pulse">
          Conectando de forma segura con PayPal...
        </div>
      )}
      <div ref={containerRef} className="w-full relative z-10" />
    </div>
  );
}
