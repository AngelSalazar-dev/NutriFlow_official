import { NextResponse } from 'next/server';
import { query, rowsToObjects } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

// GET - Get all articles
export async function GET() {
  try {
    const user = await getCurrentUser();

    const articles = await query(`
      SELECT 
        id, title, slug, summary as excerpt, content, 
        category, is_premium as isVerified,
        read_time_minutes as readTime, published_at as publishedAt,
        created_at as createdAt
      FROM articles
      ORDER BY published_at DESC
    `);

    const articlesArray = rowsToObjects(articles as any);

    return NextResponse.json({
      articles: articlesArray.map((article: any) => ({
        _id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        isVerified: !article.is_premium || user?.subscriptionPlan !== 'free',
        publishedAt: article.publishedAt,
        readTime: article.readTime,
      })),
      userPlan: user?.subscriptionPlan || 'free',
      isPremium: user?.subscriptionPlan === 'premium' || user?.subscriptionPlan === 'pro',
    });
  } catch (error: any) {
    console.error('Error getting articles:', error);
    return NextResponse.json(
      { error: 'Error getting articles: ' + error.message },
      { status: 500 }
    );
  }
}
