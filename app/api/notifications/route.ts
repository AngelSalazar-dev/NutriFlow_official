import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

const WATER_REMINDERS = [
  { hour: 10, title: '💧 Recuerda hidratarte', message: 'Llevas un rato activo. Un vaso de agua ahora te mantiene enfocado.' },
  { hour: 13, title: '💧 Hora de beber agua', message: 'Antes del almuerzo, toma un vaso de agua. Ayuda a la digestión.' },
  { hour: 16, title: '💧 Pausa para hidratarte', message: 'Ya es tarde, asegúrate de ir alcanzando tu meta de agua hoy.' },
  { hour: 19, title: '💧 Última llamada de agua', message: 'Antes de que termine el día, completa tu meta de hidratación.' },
];

const DAILY_TIPS = [
  { title: '💧 Hidratación', message: 'Recuerda beber al menos 2 litros de agua hoy. La deshidratación puede causar fatiga y reducir tu rendimiento.' },
  { title: '🥩 Proteínas', message: 'Intenta consumir 1.6-2.2g de proteína por kg de peso corporal. Es clave para mantener y construir músculo.' },
  { title: '😴 Descanso', message: 'Dormir 7-9 horas es fundamental para la recuperación muscular y el control del apetito.' },
  { title: '🚶 Actividad', message: 'Caminar 30 minutos al día puede aumentar tu gasto calórico sin fatiga excesiva.' },
  { title: '🥦 Fibra', message: 'Incluye verduras en cada comida. La fibra te mantiene saciado y mejora tu digestión.' },
  { title: '⏰ Horarios', message: 'Comer a horas regulares ayuda a tu metabolismo y evita atracones por hambre excesiva.' },
  { title: '🧘 Estrés', message: 'El estrés crónico eleva el cortisol, lo que puede dificultar la pérdida de grasa. Toma 5 min para respirar.' },
  { title: '🍎 Frutas', message: 'Las frutas son ricas en vitaminas y antioxidantes. Intenta comer 2-3 porciones al día.' },
  { title: '🏋️ Fuerza', message: 'El entrenamiento de fuerza 3 veces por semana es la mejor forma de mantener tu masa muscular.' },
  { title: '📊 Seguimiento', message: 'Registrar lo que comes te hace más consciente de tus hábitos. ¡Sigue así!' },
  { title: '🥑 Grasas saludables', message: 'Aguacate, frutos secos y aceite de oliva son esenciales para tus hormonas. No las elimines.' },
  { title: '🍳 Desayuno', message: 'Un desayuno rico en proteína (huevos, yogur griego) te mantiene saciado hasta el almuerzo.' },
  { title: '🧠 Mente', message: 'La alimentación consciente (mindful eating) te ayuda a disfrutar más y comer menos sin esfuerzo.' },
  { title: '💪 Progreso', message: 'No te obsesiones con la báscula. Mide tu progreso con fotos, medidas y cómo te queda la ropa.' },
  { title: '🥤 Evita calorías líquidas', message: 'Refrescos, jugos y alcohol suman calorías sin saciarte. Prefiere agua, té o café negro.' },
  { title: '🔄 Variedad', message: 'Rotar tus alimentos evita deficiencias nutricionales y hace tu dieta más placentera.' },
  { title: '🏃 Cardio', message: '150 min de cardio moderado por semana mejora tu salud cardiovascular y quema calorías extra.' },
  { title: '📏 Porciones', message: 'Usa platos más pequeños. Tu cerebro percibe el mismo volumen pero con menos comida.' },
  { title: '🌙 Cena ligera', message: 'Una cena ligera 2-3 horas antes de dormir mejora la calidad de tu sueño.' },
  { title: '🎯 Metas', message: 'Establece metas semanales pequeñas. Son más alcanzables y te mantienen motivado.' },
  { title: '🥜 Snacks inteligentes', message: 'Ten a mano snacks saludables: nueces, yogur, frutas. Evita la tentación de comida chatarra.' },
  { title: '🧂 Sal', message: 'Reduce el sodio para evitar retención de líquidos. Usa especias y hierbas para dar sabor.' },
  { title: '🍽️ Mastica bien', message: 'Comer despacio y masticar bien mejora la digestión y te hace sentir lleno antes.' },
  { title: '🌈 Colores', message: 'Un plato colorido significa variedad de nutrientes. Incluye diferentes verduras y frutas.' },
  { title: '📱 Registra', message: 'Tomar foto de tus comidas te ayuda a ser más consciente de lo que consumes.' },
  { title: '🤝 Social', message: 'Compartir metas de salud con amigos o familia te mantiene accountable y motivado.' },
  { title: '🧊 Agua fría', message: 'Beber agua fría puede aumentar ligeramente tu metabolismo mientras tu cuerpo la calienta.' },
  { title: '🏆 Recompensas', message: 'Celebra tus logros (no con comida). Una película, un baño relajante, tiempo de hobby.' },
  { title: '📈 Consistencia', message: 'No busques perfección, busca consistencia. Un 80% bien hecho es mejor que 100% un día.' },
  { title: '🌟 Motivación', message: 'Recuerda POR QUÉ empezaste. Tu salud es la mejor inversión que puedes hacer.' },
  { title: '💡 Consejo extra', message: 'Prepara tu comida del día siguiente la noche anterior. Así evitas decisiones impulsivas con hambre.' },
];

// GET - Get notifications only (no auto-creation)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Get unread notifications
    const [unreadRows] = await query(`
      SELECT id, type, title, message, is_read,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as createdAt
      FROM notifications
      WHERE user_id = ? AND is_read = FALSE
      ORDER BY created_at DESC
      LIMIT 20
    `, [user._id]) as any[];

    return NextResponse.json({
      notifications: unreadRows || [],
      unreadCount: (unreadRows || []).length,
    });
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Error:', error.message);
    return NextResponse.json(
      { error: 'Error obteniendo notificaciones' },
      { status: 500 }
    );
  }
}

// POST - Create daily notification OR Mark notification as read (or all)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAll, createDaily, createWaterReminder } = body;

    // Smart water reminder
    if (createWaterReminder) {
      const now = new Date();
      const currentHour = now.getHours();

      // Only send during active hours: 9am - 8pm
      if (currentHour < 9 || currentHour > 20) {
        return NextResponse.json({ success: true, created: false, reason: 'outside_hours' });
      }

      // Check how much water logged today
      const todayStr = now.toISOString().split('T')[0];
      const [waterLogs] = await query(
        'SELECT COALESCE(SUM(amount_ml), 0) as total_ml FROM water_logs WHERE user_id = ? AND log_date = ?',
        [user._id, todayStr]
      ) as any[];
      const totalWater = Number(waterLogs?.[0]?.total_ml || 0);
      const waterGoal = 2500; // default 2.5L

      // Don't remind if goal already met
      if (totalWater >= waterGoal) {
        return NextResponse.json({ success: true, created: false, reason: 'goal_met', totalWater });
      }

      // Check if a water reminder was already sent today at this hour window
      const reminderWindow = Math.floor(currentHour / 3);
      const [existingReminders] = await query(
        `SELECT COUNT(*) as cnt FROM notifications 
         WHERE user_id = ? AND type = 'water_reminder' AND DATE(created_at) = CURDATE()`,
        [user._id]
      ) as any[];
      const remindersToday = Number(existingReminders?.[0]?.cnt || 0);

      // Max 3 water reminders per day, spaced out
      if (remindersToday >= 3) {
        return NextResponse.json({ success: true, created: false, reason: 'max_reminders', count: remindersToday });
      }

      // Pick the appropriate reminder based on current hour
      let reminder = WATER_REMINDERS[0];
      for (const r of WATER_REMINDERS) {
        if (currentHour >= r.hour) reminder = r;
      }

      // Add water progress context
      const progress = Math.round((totalWater / waterGoal) * 100);
      const msgWithProgress = `${reminder.message} (${totalWater}ml / ${waterGoal}ml — ${progress}%)`;

      // Check if this exact reminder was already sent in the last 2 hours
      const [recentReminders] = await query(
        `SELECT id FROM notifications WHERE user_id = ? AND type = 'water_reminder' 
         AND created_at > DATE_SUB(NOW(), INTERVAL 2 HOUR)`,
        [user._id]
      ) as any[];
      if (recentReminders && recentReminders.length > 0) {
        return NextResponse.json({ success: true, created: false, reason: 'too_recent' });
      }

      // Create the reminder
      const notifId = crypto.randomUUID();
      await query(
        `INSERT INTO notifications (id, user_id, type, title, message, is_read)
         VALUES (?, ?, 'water_reminder', ?, ?, FALSE)`,
        [notifId, user._id, reminder.title, msgWithProgress]
      );

      return NextResponse.json({ success: true, created: true, totalWater, progress });
    }

    // Create daily tip notification
    if (createDaily) {
      const dayOfMonth = new Date().getDate();
      const tip = DAILY_TIPS[(dayOfMonth - 1) % DAILY_TIPS.length];

      // Check if today's notification already exists for this user
      const [existing] = await query(
        `SELECT id FROM notifications WHERE user_id = ? AND type = 'daily_tip' 
         AND DATE(created_at) = CURDATE()`,
        [user._id]
      ) as any[];

      if (existing && existing.length > 0) {
        return NextResponse.json({ success: true, created: false, message: 'Already exists' });
      }

      // Generate UUID since TiDB Cloud doesn't support DEFAULT (UUID())
      const notifId = crypto.randomUUID();
      await query(
        `INSERT INTO notifications (id, user_id, type, title, message, is_read) 
         VALUES (?, ?, 'daily_tip', ?, ?, FALSE)`,
        [notifId, user._id, tip.title, tip.message]
      );

      return NextResponse.json({ success: true, created: true });
    }

    if (markAll) {
      const [result] = await query(
        'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
        [user._id]
      ) as any[];
      return NextResponse.json({ success: true, updated: (result as any).affectedRows });
    }

    if (notificationId) {
      await query(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
        [notificationId, user._id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Error:', error.message);
    return NextResponse.json(
      { error: 'Error procesando notificación' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all notifications OR delete single notification
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Try to parse body for single notification delete
    try {
      const body = await request.json();
      if (body.notificationId) {
        await query(
          'DELETE FROM notifications WHERE id = ? AND user_id = ?',
          [body.notificationId, user._id]
        );
        return NextResponse.json({ success: true, deleted: body.notificationId });
      }
    } catch {
      // No body, proceed with clear all
    }

    await query('DELETE FROM notifications WHERE user_id = ?', [user._id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Error clearing:', error.message);
    return NextResponse.json(
      { error: 'Error limpiando notificaciones' },
      { status: 500 }
    );
  }
}
