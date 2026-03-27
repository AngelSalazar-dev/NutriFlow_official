import { NextRequest, NextResponse } from 'next/server';
import { query, rowsToObjects } from '@/lib/mysql';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const articles = await query(`
      SELECT 
        id, title, slug, summary as excerpt, content, 
        category, is_premium as isVerified,
        read_time_minutes as readTime, published_at as publishedAt
      FROM articles
      WHERE slug = ?
    `, [slug]);

    const articlesArray = rowsToObjects(articles as any);
    
    if (!articlesArray || articlesArray.length === 0) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    const article = articlesArray[0] as any;

    return NextResponse.json({
      article: {
        _id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        isVerified: article.isVerified,
        publishedAt: article.publishedAt,
        readTime: article.readTime,
      },
    });
  } catch (error: any) {
    console.error('Error getting article:', error);
    return NextResponse.json(
      { error: 'Error getting article: ' + error.message },
      { status: 500 }
    );
  }
}
