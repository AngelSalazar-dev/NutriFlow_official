export interface AIResponse {
  text: string;
  provider: string;
}

export interface AIService {
  generateResponse(prompt: string): Promise<AIResponse>;
}

export class GeminiService implements AIService {
  private apiKey: string;
  private url: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('Gemini API Key missing');

    const response = await fetch(`${this.url}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Gemini Error: ${error?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    
    return { text, provider: 'Gemini' };
  }
}

export class GroqService implements AIService {
  private apiKey: string;
  private model: string = 'llama-3.3-70b-versatile';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('Groq API Key missing');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2048
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Groq Error: ${error?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return { text: data.choices?.[0]?.message?.content || '', provider: 'Groq' };
  }
}

export class OpenRouterService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'openrouter/free') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('OpenRouter API Key missing');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://nutriflow.app',
        'X-Title': 'NutriFlow',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2048
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter Error: ${error?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return { text: data.choices?.[0]?.message?.content || '', provider: 'OpenRouter' };
  }
}

export class AIManager {
  private services: Map<string, AIService> = new Map();

  constructor() {
    // Register services
    if (process.env.GEMINI_API_KEY) {
      this.services.set('gemini', new GeminiService(process.env.GEMINI_API_KEY));
    }
    
    const groqKey = process.env.GROQ_API_KEY || "";
    const orKey = process.env.OPENROUTER_API_KEY || "";
    const orModel = process.env.OPENROUTER_MODEL || "openrouter/free";

    if (groqKey) {
      this.services.set('groq', new GroqService(groqKey));
    }
    if (orKey) {
      this.services.set('openrouter', new OpenRouterService(orKey, orModel));
    }
  }

  async generate(prompt: string, preferredProvider?: string): Promise<AIResponse> {
    // If a specific provider is requested and exists, try it first
    if (preferredProvider && this.services.has(preferredProvider)) {
      try {
        console.log(`[AI] Attempting generation with preferred provider: ${preferredProvider}`);
        return await this.services.get(preferredProvider)!.generateResponse(prompt);
      } catch (err) {
        console.error(`[AI] Preferred provider ${preferredProvider} failed, falling back...`, err);
      }
    }

    // Fallback logic
    const priority = ['gemini', 'groq', 'openrouter'];
    let lastError: any;

    for (const key of priority) {
      const service = this.services.get(key);
      if (!service) continue;

      try {
        console.log(`[AI] Attempting generation with ${key}...`);
        return await service.generateResponse(prompt);
      } catch (err) {
        console.error(`[AI] ${key} failed:`, err);
        lastError = err;
        continue;
      }
    }

    throw new Error(`All AI services failed. Last error: ${lastError?.message}`);
  }
}
