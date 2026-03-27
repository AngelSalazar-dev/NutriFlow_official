'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Crown, AlertCircle } from 'lucide-react';

interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  date: string;
}

export default function ChatPage() {
  const { user, isPremium, checkChatLimit } = useAuth();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [chatLimit, setChatLimit] = React.useState<{ allowed: boolean; remaining: number; limit: number; used: number } | null>(null);

  React.useEffect(() => {
    loadChatLimit();
  }, []);

  const loadChatLimit = async () => {
    try {
      const limit = await checkChatLimit();
      setChatLimit(limit);
    } catch (error) {
      console.error('Error loading chat limit:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const userMessage = input.trim();
      setInput('');

      // Add user message to UI
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userMessage, date: new Date().toISOString() },
      ]);

      // Send to API
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMessage }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error,
            date: new Date().toISOString(),
          },
        ]);
        await loadChatLimit();
        return;
      }

      if (!response.ok) {
        throw new Error('Error sending message');
      }

      const data = await response.json();

      // Add AI response to UI
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response, date: new Date().toISOString() },
      ]);

      await loadChatLimit();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
          date: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Chat con IA</h1>
          <p className="text-stone-500">Tu asistente personal de nutrición</p>
        </div>

        {/* Chat Limit Info */}
        {!isPremium && chatLimit && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    Límite diario: {chatLimit.used} de {chatLimit.limit} mensajes usados
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {chatLimit.remaining === 0
                      ? 'Has alcanzado tu límite. Actualiza a Premium para mensajes ilimitados.'
                      : `${chatLimit.remaining} mensajes restantes hoy`}
                  </p>
                </div>
                {!isPremium && (
                  <a href="/subscription">
                    <Button size="sm" variant="default">
                      <Crown className="h-4 w-4 mr-1" />
                      Premium
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-700" />
              Asistente NutriFlow
            </CardTitle>
            <CardDescription>
              Pregúntame sobre nutrición, calorías, macronutrientes o hábitos saludables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Comienza una conversación con tu asistente de nutrición</p>
                  <p className="text-sm mt-2">
                    Ejemplos: "¿Cuántas calorías debo consumir?", "¿Qué es mejor para ganar músculo?"
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 text-stone-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-stone-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading || !!(chatLimit && !chatLimit.allowed)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim() || !!(chatLimit && !chatLimit.allowed)}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
