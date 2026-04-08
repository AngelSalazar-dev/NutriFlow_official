import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!GEMINI_API_KEY) {
      console.error('[CHAT] GEMINI_API_KEY not configured');
      return NextResponse.json(
        { error: 'API de IA no configurada. Contacta al administrador.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [], conversationId } = body;

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
    const activeConvId = conversationId || crypto.randomUUID();
    console.log('[CHAT] conversationId:', conversationId, 'activeConvId:', activeConvId);

    await query(`
      INSERT INTO chat_messages (id, user_id, role, content, conversation_id, created_at)
      VALUES (?, ?, 'user', ?, ?, NOW())
    `, [userMsgId, user._id, message, activeConvId]);

    // Build prompt safely with fallbacks
    const userName = user.name || 'Usuario';
    const userAge = user.age || 25;
    const userWeight = user.weight || 70;
    const userHeight = user.height || 170;
    const userSex = user.sex || 'male';
    const userGoal = user.goal || 'maintain';
    const userActivity = user.activityLevel || 'moderate';
    const userCalorieGoal = user.calorieGoal || 2000;
    const userPlan = user.subscriptionPlan || 'free';

    const goalText = userGoal === 'lose' ? 'Perder peso' : userGoal === 'gain' ? 'Ganar músculo' : 'Mantener peso';

    const conversationContext = conversationHistory.length > 0
      ? conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
      : '(Sin historial previo)';

    const userContext = `Eres un asistente de nutrición y salud experto llamado NutriBot, integrado en NutriFlow.

Contexto del usuario:
- Nombre: ${userName}
- Edad: ${userAge} años
- Peso: ${userWeight} kg
- Altura: ${userHeight} cm
- Sexo: ${userSex}
- Objetivo: ${goalText}
- Nivel de actividad: ${userActivity}
- Calorías objetivo: ${userCalorieGoal} kcal/día
- Plan: ${userPlan}

Instrucciones:
1. Responde en español de manera clara y concisa
2. Basa tus respuestas en evidencia científica
3. Sé empático y motivador
4. Si te preguntan sobre condiciones médicas, recomienda consultar un profesional
5. Mantén las respuestas entre 3-5 párrafos máximo — NO te cortes a mitad de respuesta
6. Si la respuesta es larga, ve al punto y luego da detalles
7. Usa formato markdown cuando sea útil (listas, negritas)
8. Personaliza las respuestas con los datos del usuario
9. IMPORTANTE: Termina SIEMPRE tu respuesta de forma completa. No dejes frases inconclusas.

Historial de conversación:
${conversationContext}

Mensaje del usuario: ${message}

Respuesta de NutriBot:`;

    // Call Gemini API
    console.log('[CHAT] Calling Gemini API...');
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
          maxOutputTokens: 4096,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}));
      console.error('[CHAT] Gemini API Error:', geminiResponse.status, JSON.stringify(errorData));
      throw new Error(`Gemini API error: ${errorData?.error?.message || geminiResponse.statusText || 'Unknown error'}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('[CHAT] Gemini response received');

    // Extract response
    let assistantMessage = '';
    if (geminiData.candidates && geminiData.candidates.length > 0) {
      const candidate = geminiData.candidates[0];
      console.log('[CHAT] finishReason:', candidate.finishReason);
      console.log('[CHAT] tokenCount:', candidate.tokenCount, 'thoughtsTokenCount:', geminiData.usageMetadata?.thoughtsTokenCount);
      if (candidate.content?.parts?.[0]?.text) {
        assistantMessage = candidate.content.parts[0].text;
      } else if (candidate.finishReason === 'SAFETY') {
        assistantMessage = '⚠️ Tu mensaje fue bloqueado por las políticas de seguridad. Por favor reformula tu pregunta.';
      } else if (candidate.finishReason === 'MAX_TOKENS') {
        assistantMessage = '⚠️ La respuesta fue demasiado larga. Intenta hacer una pregunta más específica.';
      } else {
        assistantMessage = 'Lo siento, no pude generar una respuesta.';
      }
    } else {
      assistantMessage = 'Lo siento, ocurrió un error al procesar tu mensaje.';
    }

    // Save assistant response
    const assistantMsgId = crypto.randomUUID();
    await query(`
      INSERT INTO chat_messages (id, user_id, role, content, conversation_id, created_at)
      VALUES (?, ?, 'assistant', ?, ?, NOW())
    `, [assistantMsgId, user._id, assistantMessage, activeConvId]);

    // Get updated count
    const [updatedCount] = await query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE user_id = ? AND created_at >= ?',
      [user._id, fiveHoursAgo]
    ) as any[];

    const messagesUsed = updatedCount?.count || 0;
    const resetTime = new Date(now.getTime() + windowHours * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      conversationId: activeConvId,
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
    console.error('[CHAT] Error processing message:', error.message);
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
