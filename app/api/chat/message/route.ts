import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';

// GET - Get chat limit for today
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const db = await getDb();
    const messageCount = await db.collection('chat_messages').countDocuments({
      userId: user._id,
      role: 'user',
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const limit = user.subscriptionPlan === 'free' ? 5 : -1; // -1 = unlimited
    const remaining = limit === -1 ? -1 : Math.max(0, limit - messageCount);

    return NextResponse.json({
      allowed: user.subscriptionPlan !== 'free' || messageCount < limit,
      remaining,
      limit: limit === -1 ? 'Unlimited' : limit,
      used: messageCount,
    });
  } catch (error) {
    console.error('Error getting chat limit:', error);
    return NextResponse.json(
      { error: 'Error getting chat limit' },
      { status: 500 }
    );
  }
}

// POST - Send a chat message
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    // Check limit for free users
    if (user.subscriptionPlan === 'free') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const db = await getDb();
      const messageCount = await db.collection('chat_messages').countDocuments({
        userId: user._id,
        role: 'user',
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      if (messageCount >= 5) {
        return NextResponse.json(
          {
            error: 'Has alcanzado el límite de 5 mensajes diarios. Actualiza a Premium para mensajes ilimitados.',
          },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    // Save user message
    await db.collection('chat_messages').insertOne({
      userId: user._id,
      role: 'user',
      content,
      date: now,
      createdAt: now,
    });

    // Generate AI response (simplified - in production, call actual AI API)
    const aiResponse = generateAIResponse(content, user);

    // Save AI response
    await db.collection('chat_messages').insertOne({
      userId: user._id,
      role: 'assistant',
      content: aiResponse,
      date: now,
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { error: 'Error processing message' },
      { status: 500 }
    );
  }
}

// Simple AI response generator (replace with actual AI API in production)
function generateAIResponse(message: string, user: any): string {
  const lowerMessage = message.toLowerCase();

  // Nutrition-related responses
  if (lowerMessage.includes('calorías') || lowerMessage.includes('calorias')) {
    return `Las calorías que necesitas dependen de tu objetivo. Según tu perfil, tu gasto energético diario (TDEE) es de aproximadamente ${user.tdee} calorías. Para ${user.goal === 'lose' ? 'perder peso' : user.goal === 'gain' ? 'ganar masa' : 'mantener peso'}, deberías consumir alrededor de ${user.calorieGoal} calorías al día.`;
  }

  if (lowerMessage.includes('proteína') || lowerMessage.includes('proteina')) {
    return `La proteína es esencial para mantener y construir músculo. Según tu peso de ${user.weight}kg, deberías consumir alrededor de ${user.proteinGoal}g de proteína al día. Buenas fuentes incluyen: pollo, pescado, huevos, legumbres, y lácteos.`;
  }

  if (lowerMessage.includes('carbohidrato') || lowerMessage.includes('carbs')) {
    return `Los carbohidratos son tu principal fuente de energía. Tu objetivo diario es de aproximadamente ${user.carbGoal}g. Prioriza carbohidratos complejos como arroz integral, avena, quinoa, y vegetales.`;
  }

  if (lowerMessage.includes('grasa') || lowerMessage.includes('grasas')) {
    return `Las grasas saludables son importantes para la salud hormonal. Tu objetivo es de aproximadamente ${user.fatGoal}g al día. Incluye aguacate, frutos secos, aceite de oliva, y pescado azul.`;
  }

  if (lowerMessage.includes('agua') || lowerMessage.includes('hidratación') || lowerMessage.includes('hidratacion')) {
    return `La hidratación es clave para el rendimiento y la salud. Intenta beber al menos 2 litros de agua al día (8 vasos de 250ml). Más si haces ejercicio o hace calor.`;
  }

  if (lowerMessage.includes('ejercicio') || lowerMessage.includes('entrenar')) {
    return `El ejercicio regular es esencial para la salud. Combina entrenamiento de fuerza (3-5 días/semana) con cardio (2-3 días/semana). Como usuario ${user.subscriptionPlan}, tienes acceso ${user.subscriptionPlan === 'free' ? 'limitado al módulo de ejercicio. Actualiza a Premium para acceso completo.' : 'completo al módulo de ejercicio para registrar tus rutinas.'}`;
  }

  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
    return `¡Hola! Soy tu asistente de nutrición de NutriFlow. ¿En qué puedo ayudarte hoy con tu alimentación o salud?`;
  }

  if (lowerMessage.includes('gracias')) {
    return `¡De nada! Estoy aquí para ayudarte en tu camino hacia una vida más saludable. ¿Tienes otra pregunta?`;
  }

  // Default response
  return `Entiendo tu pregunta sobre "${message}". Como asistente de nutrición, te recomiendo enfocarte en mantener un balance adecuado de macronutrientes según tus objetivos. Tu perfil indica que necesitas ${user.calorieGoal} calorías diarias con ${user.proteinGoal}g de proteína, ${user.carbGoal}g de carbohidratos y ${user.fatGoal}g de grasas. ¿Hay algo más específico en lo que pueda ayudarte?`;
}
