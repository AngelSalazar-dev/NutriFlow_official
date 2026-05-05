export interface PaymentOrder {
  orderId: string;
  approveUrl?: string;
}

export interface PaymentStrategy {
  createOrder(userId: string, planId: string, amount: string, planName: string): Promise<PaymentOrder>;
  captureOrder(orderId: string): Promise<{ success: boolean; paymentId: string }>;
}

export class PayPalStrategy implements PaymentStrategy {
  private api = 'https://api-m.sandbox.paypal.com';

  private async getAccessToken() {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    const res = await fetch(`${this.api}/v1/oauth2/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials',
    });
    const data = await res.json();
    return data.access_token;
  }

  async createOrder(userId: string, planId: string, amount: string, planName: string): Promise<PaymentOrder> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.api}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: `${userId}_${planId}`,
          description: planName,
          amount: { currency_code: 'USD', value: amount }
        }],
        application_context: {
          brand_name: 'NutriFlow',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        }
      }),
    });
    const data = await res.json();
    return {
      orderId: data.id,
      approveUrl: data.links?.find((l: any) => l.rel === 'approve')?.href,
    };
  }

  async captureOrder(orderId: string): Promise<{ success: boolean; paymentId: string }> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.api}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return {
      success: data.status === 'COMPLETED',
      paymentId: data.purchase_units?.[0]?.payments?.captures?.[0]?.id || '',
    };
  }
}

export class PaymentContext {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  async createOrder(userId: string, planId: string, amount: string, planName: string) {
    return this.strategy.createOrder(userId, planId, amount, planName);
  }

  async captureOrder(orderId: string) {
    return this.strategy.captureOrder(orderId);
  }
}
