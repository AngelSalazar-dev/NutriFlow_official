import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const [rows] = await query(
      `SELECT id, title, slug, summary, content, category, is_premium,
              read_time_minutes, published_at
       FROM articles WHERE slug = ?`,
      [slug]
    );

    const row = (rows as any[])[0];

    if (!row) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      article: {
        _id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.summary || '',
        content: row.content || '',
        category: row.category || 'basics',
        isVerified: !!row.is_premium,
        publishedAt: row.published_at || new Date().toISOString(),
        readTime: row.read_time_minutes || 5,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ARTICLE] Error getting article:', error);
    return NextResponse.json(
      { error: 'Error getting article: ' + message },
      { status: 500 }
    );
  }
}
