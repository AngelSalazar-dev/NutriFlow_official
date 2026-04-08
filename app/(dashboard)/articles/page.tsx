'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Clock, ArrowRight, Crown } from 'lucide-react';
import Link from 'next/link';
import { BannerAd, ArticleAd, SponsoredCard } from '@/components/ads/BannerAd';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  isVerified: boolean;
  author?: {
    name: string;
    credentials: string;
  };
  publishedAt: string;
  readTime: number;
}

export default function ArticlesPage() {
  const { isPremium } = useAuth();
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      } else {
        console.error('[ARTICLES] Failed to load articles:', response.status);
        setArticles([]);
      }
    } catch (error) {
      console.error('[ARTICLES] Error loading articles:', error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Top Banner Ad for Free Users */}
      {!isPremium && <BannerAd position="top" />}
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Artículos</h1>
          <p className="text-stone-500">
            Aprende sobre nutrición, ejercicio y hábitos saludables
            {!isPremium && (
              <span className="ml-2 text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded">
                Con anuncios
              </span>
            )}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <React.Fragment key={article._id}>
              <Card className="flex flex-col h-full hover:shadow-md transition-shadow card-nutriflow">
                {article.coverImage && (
                  <div className="h-48 bg-stone-200 rounded-t-xl overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded capitalize">
                      {article.category}
                    </span>
                    {article.isVerified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        <BadgeCheck className="h-3 w-3" />
                        Verificado
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-stone-600 line-clamp-3">{article.excerpt}</p>
                  {article.author && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-medium">{article.author.name}</span>
                      <span>•</span>
                      <span>{article.author.credentials}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href={`/articles/${article.slug}`} className="w-full">
                    <Button variant="outline" className="w-full gap-2">
                      Leer artículo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Insert sponsored card after every 3 articles for free users */}
              {!isPremium && (index + 1) % 3 === 0 && (
                <SponsoredCard />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* In-Article Ad */}
        {!isPremium && articles.length > 0 && (
          <ArticleAd />
        )}

        {articles.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center text-stone-500">
              <p>No hay artículos disponibles</p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-stone-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-stone-200 rounded w-1/2 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-stone-200 rounded animate-pulse" />
                    <div className="h-3 bg-stone-200 rounded w-5/6 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
