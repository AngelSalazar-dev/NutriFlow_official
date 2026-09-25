import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyJWT } from '@/lib/auth-mysql';

async function getUserFromRequest(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(/session=([^;]+)/);
  const token = sessionMatch ? sessionMatch[1] : null;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload?.userId) return null;

  const userId = payload.userId as string;
  const [rows] = await query(`SELECT id, email, name, subscription_plan FROM users WHERE id = ? LIMIT 1`, [userId]);
  const users = Array.isArray(rows) ? rows : [rows];
  if (!users || users.length === 0) return null;

  const u = users[0] as any;
  return { _id: u.id, email: u.email, name: u.name, subscriptionPlan: u.subscription_plan };
}

/**
 * GET /api/chat/conversations
 * List or load conversations
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    // List conversations
    if (!action || action === 'list') {
      const convsResult = await query(`
        SELECT
          cm.conversation_id as id,
          DATE_FORMAT(MAX(cm.created_at), '%Y-%m-%dT%H:%i:%sZ') as updatedAt,
          DATE_FORMAT(MIN(cm.created_at), '%Y-%m-%dT%H:%i:%sZ') as createdAt,
          COUNT(*) as messageCount,
          SUBSTRING(MAX(CASE WHEN cm.role = 'user' THEN cm.content END), 1, 80) as lastMessage,
          JSON_UNQUOTE(JSON_EXTRACT(MAX(COALESCE(cm.context_snapshot, '{}')), '$.title')) as title
        FROM chat_messages cm
        WHERE cm.user_id = ? AND cm.conversation_id IS NOT NULL
        GROUP BY cm.conversation_id
        ORDER BY MAX(cm.created_at) DESC
        LIMIT 50
      `, [user._id]) as any[];

      // query() returns [rows, fields], extract rows
      const convs = Array.isArray(convsResult[0]) ? convsResult[0] : convsResult;

      console.log('[CHAT] List conversations: found', convs.length, 'for user', user._id);

      const conversations = convs
        .filter((c: any) => c.id && c.id !== 'null' && c.id !== 'undefined')
        .map((c: any) => ({
          id: String(c.id),
          updatedAt: String(c.updatedAt || ''),
          createdAt: String(c.createdAt || ''),
          messageCount: typeof c.messageCount === 'bigint' ? Number(c.messageCount) : (Number(c.messageCount) || 0),
          lastMessage: String(c.lastMessage || ''),
          title: c.title || null,
        }));

      return NextResponse.json({ conversations });
    }

    // Load specific conversation
    if (action === 'load') {
      const convId = searchParams.get('conversationId');
      if (!convId) {
        return NextResponse.json({ error: 'conversationId requerido' }, { status: 400 });
      }

      const msgsResult = await query(`
        SELECT id, role, content, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at
        FROM chat_messages
        WHERE user_id = ? AND conversation_id = ?
        ORDER BY created_at ASC
      `, [user._id, convId]) as any[];

      const msgs = Array.isArray(msgsResult[0]) ? msgsResult[0] : msgsResult;

      console.log('[CHAT] Load conversation:', convId, '- found', msgs.length, 'messages');

      const messages = msgs.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.created_at,
      }));

      return NextResponse.json({ messages });
    }

    // Delete conversation
    if (action === 'delete') {
      const convId = searchParams.get('conversationId');
      if (!convId) {
        return NextResponse.json({ error: 'conversationId requerido' }, { status: 400 });
      }

      await query(
        'DELETE FROM chat_messages WHERE user_id = ? AND conversation_id = ?',
        [user._id, convId]
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error in conversation API:', error);
    return NextResponse.json(
      { error: 'Error en conversaciones' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/chat/conversations
 * Update conversation (rename, etc.)
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, title } = body;

    if (!conversationId || !title) {
      return NextResponse.json({ error: 'conversationId y title requeridos' }, { status: 400 });
    }

    // Update context_snapshot on all messages in this conversation
    await query(`
      UPDATE chat_messages
      SET context_snapshot = JSON_SET(
        COALESCE(context_snapshot, '{}'),
        '$.title', ?
      )
      WHERE user_id = ? AND conversation_id = ?
    `, [title, user._id, conversationId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error renaming conversation:', error);
    return NextResponse.json(
      { error: 'Error renombrando conversación' },
      { status: 500 }
    );
  }
}
