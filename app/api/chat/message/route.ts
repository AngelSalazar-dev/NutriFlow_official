import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Mensaje vacío' },
        { status: 400 }
      );
    }

    // Verificar límite de mensajes (15 cada 5 horas para free, ilimitado premium/pro)
    const now = new Date();
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    
    const [messageCount] = await query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE user_id = ? AND created_at >= ?',
      [user._id, fiveHoursAgo]
    ) as any[];

    const messagesInWindow = messageCount?.count || 0;
    const isPremium = user.subscriptionPlan === 'premium' || user.subscriptionPlan === 'pro';
    const windowLimit = isPremium ? 9999 : 15;
    const windowHours = 5;

    if (messagesInWindow >= windowLimit) {
      // Calcular cuándo puede enviar otro mensaje
      const [oldestMessage] = await query(`
        SELECT created_at FROM chat_messages 
        WHERE user_id = ? AND created_at >= ?
        ORDER BY created_at ASC
        LIMIT 1
      `, [user._id, fiveHoursAgo]) as any[];

      let resetTime = new Date();
      if (oldestMessage && oldestMessage[0]) {
        resetTime = new Date(oldestMessage[0].created_at);
        resetTime.setHours(resetTime.getHours() + windowHours);
      }

      const hoursRemaining = Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60 * 60));
      const minutesRemaining = Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60));

      return NextResponse.json(
        {
          error: 'Límite de mensajes alcanzado',
          message: `Has alcanzado tu límite de ${windowLimit} mensajes cada ${windowHours} horas. Podrás enviar más mensajes en ${hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}${minutesRemaining % 60}min.`,
          remaining: 0,
          limit: windowLimit,
          used: messagesInWindow,
          resetTime: resetTime.toISOString(),
          hoursRemaining,
          minutesRemaining,
        },
        { status: 429 }
      );
    }

    // Guardar mensaje del usuario
    const userMsgId = crypto.randomUUID();
    await query(`
      INSERT INTO chat_messages (id, user_id, role, content, created_at)
      VALUES (?, ?, 'user', ?, NOW())
    `, [userMsgId, user._id, message]);

    // Construir prompt con contexto del usuario
    const userContext = `
Eres un asistente de nutrición y salud experto llamado NutriBot, integrado en NutriFlow.

Contexto del usuario:
- Nombre: ${user.name}
- Edad: ${user.age} años
- Peso: ${user.weight} kg
- Altura: ${user.height} cm
- Sexo: ${user.sex}
- Objetivo: ${user.goal === 'lose' ? 'Perder peso' : user.goal === 'gain' ? 'Ganar músculo' : 'Mantener peso'}
- Nivel de actividad: ${user.activityLevel}
- Calorías objetivo: ${user.calorieGoal} kcal/día
- Plan: ${user.subscriptionPlan}

Instrucciones:
1. Responde en español de manera clara y concisa
2. Basa tus respuestas en evidencia científica
3. Sé empático y motivador
4. Si te preguntan sobre condiciones médicas, recomienda consultar un profesional
5. Mantén las respuestas entre 2-4 párrafos
6. Usa formato markdown cuando sea útil (listas, negritas)
7. Personaliza las respuestas con los datos del usuario

Historial de conversación:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Mensaje del usuario: ${message}

Respuesta de NutriBot:`;

    // Llamar a Gemini API
    const geminiResponse = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: userContext
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(errorData.error?.message || 'Error en Gemini API');
    }

    const geminiData = await geminiResponse.json();
    
    // Extraer respuesta de Gemini
    let assistantMessage = '';
    if (geminiData.candidates && geminiData.candidates.length > 0) {
      assistantMessage = geminiData.candidates[0].content?.parts?.[0]?.text || 'Lo siento, no pude generar una respuesta.';
    } else {
      assistantMessage = 'Lo siento, ocurrió un error al procesar tu mensaje.';
    }

    // Guardar respuesta del asistente
    const assistantMsgId = crypto.randomUUID();
    await query(`
      INSERT INTO chat_messages (id, user_id, role, content, created_at)
      VALUES (?, ?, 'assistant', ?, NOW())
    `, [assistantMsgId, user._id, assistantMessage]);

    // Obtener conteo actualizado
    const [updatedCount] = await query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE user_id = ? AND created_at >= ?',
      [user._id, fiveHoursAgo]
    ) as any[];

    const messagesUsed = updatedCount?.count || 0;
    const resetTime = new Date(now.getTime() + windowHours * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      conversation: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage },
      ],
      usage: {
        used: messagesUsed,
        limit: windowLimit,
        remaining: Math.max(0, windowLimit - messagesUsed),
        windowHours,
        resetTime: resetTime.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { 
        error: 'Error procesando mensaje',
        message: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat/limit
 * Verificar límite de mensajes del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const now = new Date();
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    
    const [count] = await query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE user_id = ? AND created_at >= ?',
      [user._id, fiveHoursAgo]
    ) as any[];

    const messagesUsed = count?.count || 0;
    const isPremium = user.subscriptionPlan === 'premium' || user.subscriptionPlan === 'pro';
    const windowLimit = isPremium ? 9999 : 15;
    const windowHours = 5;

    // Calcular tiempo restante para reset
    let resetTime = new Date(now.getTime() + windowHours * 60 * 60 * 1000);
    
    if (messagesUsed >= windowLimit && !isPremium) {
      const [oldestMessage] = await query(`
        SELECT created_at FROM chat_messages 
        WHERE user_id = ? AND created_at >= ?
        ORDER BY created_at ASC
        LIMIT 1
      `, [user._id, fiveHoursAgo]) as any[];

      if (oldestMessage && oldestMessage[0]) {
        resetTime = new Date(oldestMessage[0].created_at);
        resetTime.setHours(resetTime.getHours() + windowHours);
      }
    }

    const timeUntilReset = resetTime.getTime() - now.getTime();
    const hoursRemaining = Math.ceil(timeUntilReset / (1000 * 60 * 60));
    const minutesRemaining = Math.ceil((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

    return NextResponse.json({
      allowed: messagesUsed < windowLimit,
      remaining: Math.max(0, windowLimit - messagesUsed),
      limit: windowLimit,
      used: messagesUsed,
      isPremium,
      windowHours,
      resetTime: resetTime.toISOString(),
      hoursRemaining,
      minutesRemaining,
    });
  } catch (error) {
    console.error('Error checking chat limit:', error);
    return NextResponse.json(
      { error: 'Error verificando límite' },
      { status: 500 }
    );
  }
}
