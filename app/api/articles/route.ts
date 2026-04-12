import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

// GET - Get all articles
export async function GET() {
  try {
    const user = await getCurrentUser();

    const [rows] = await query(`
      SELECT id, title, slug, summary, content, category, is_premium,
             read_time_minutes, published_at, created_at
      FROM articles
      ORDER BY published_at DESC
    `);

    const articlesList = (rows as any[]).map((row: any) => ({
      _id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.summary || '',
      content: row.content || '',
      category: row.category || 'basics',
      isVerified: !row.is_premium || user?.subscriptionPlan !== 'free',
      publishedAt: row.published_at || new Date().toISOString(),
      readTime: row.read_time_minutes || 5,
      author: row.author_name ? {
        name: row.author_name,
        credentials: row.author_credentials || '',
      } : undefined,
      coverImage: row.image_url || null,
    }));

    return NextResponse.json({
      articles: articlesList,
      userPlan: user?.subscriptionPlan || 'free',
      isPremium: user?.subscriptionPlan === 'premium' || user?.subscriptionPlan === 'pro',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ARTICLES] Error getting articles:', error);
    return NextResponse.json(
      { error: 'Error getting articles: ' + message },
      { status: 500 }
    );
  }
}
