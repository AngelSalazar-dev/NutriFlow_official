'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck, Clock, ArrowLeft, Crown, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BannerAd, ArticleAd } from '@/components/ads/BannerAd';

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
  references?: string[];
  publishedAt: string;
  readTime: number;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const { isPremium } = useAuth();
  const [article, setArticle] = React.useState<Article | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  React.useEffect(() => {
    loadArticle();
  }, [params.slug]);

  const loadArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-stone-200 rounded w-3/4 mb-4 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-stone-200 rounded animate-pulse" />
            <div className="h-4 bg-stone-200 rounded w-5/6 animate-pulse" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
          <Link href="/articles">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a artículos
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Top Ad for Free Users */}
      {!isPremium && <BannerAd position="top" />}
      
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button & Actions */}
        <div className="flex justify-between items-center">
          <Link href="/articles">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleShare}
              title="Compartir"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={isBookmarked ? 'default' : 'outline'}
              size="icon"
              onClick={() => setIsBookmarked(!isBookmarked)}
              title="Guardar"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full capitalize">
              {article.category}
            </span>
            {article.isVerified && (
              <span className="flex items-center gap-1 text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <BadgeCheck className="h-4 w-4" />
                Verificado por experto
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              {article.readTime} min
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-stone-600 leading-relaxed">
            {article.excerpt}
          </p>

          {article.author && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-white rounded-xl border border-emerald-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-md">
                {article.author.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-stone-900">{article.author.name}</div>
                <div className="text-sm text-stone-500">{article.author.credentials}</div>
              </div>
              <BadgeCheck className="h-6 w-6 text-emerald-600" />
            </div>
          )}

          <div className="text-sm text-stone-500">
            Publicado el {new Date(article.publishedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="h-64 md:h-96 bg-stone-200 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content with Markdown */}
        <Card className="card-nutriflow overflow-hidden">
          <CardContent className="py-8 md:py-12 px-6 md:px-8">
            <div className="prose-nutriflow">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-6 text-stone-900" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-4 text-stone-800 mt-8 pb-2 border-b border-stone-200" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-3 text-stone-800 mt-6" {...props} />,
                  p: ({node, ...props}) => <p className="text-stone-700 leading-relaxed mb-4 text-lg" {...props} />,
                  ul: ({node, ...props}) => <ul className="mb-4 pl-6 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="mb-4 pl-6 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-stone-700" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote 
                      className="border-l-4 border-emerald-600 pl-4 italic text-stone-600 my-6 bg-emerald-50 py-2 pr-2 rounded-r-lg" 
                      {...props} 
                    />
                  ),
                  code: ({node, inline, ...props}: any) => (
                    inline 
                      ? <code className="bg-stone-100 rounded px-2 py-1 text-sm font-mono text-emerald-700" {...props} />
                      : <pre className="bg-stone-900 text-stone-100 rounded-lg p-4 my-6 overflow-x-auto"><code {...props} /></pre>
                  ),
                  strong: ({node, ...props}) => <strong className="font-bold text-stone-900" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-stone-700" {...props} />,
                  hr: ({node, ...props}) => <hr className="my-8 border-stone-200" {...props} />,
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* References */}
        {article.references && article.references.length > 0 && (
          <Card className="card-nutriflow">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-4 text-stone-900 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-emerald-700" />
                Referencias Bibliográficas
              </h3>
              <ul className="space-y-3 text-sm text-stone-600">
                {article.references.map((ref, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">{index + 1}.</span>
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* In-Article Ad for Free Users */}
        {!isPremium && (
          <ArticleAd />
        )}

        {/* Premium Upgrade CTA */}
        {!isPremium && (
          <Card className="card-premium border-emerald-300">
            <CardContent className="py-8 text-center space-y-4">
              <Crown className="h-12 w-12 text-emerald-700 mx-auto" />
              <h3 className="text-xl font-bold text-stone-900">
                ¿Disfrutas este contenido?
              </h3>
              <p className="text-stone-600">
                Actualiza a Premium para leer sin anuncios y acceder a contenido exclusivo verificado por expertos.
              </p>
              <Link href="/subscription">
                <Button className="btn-glow gap-2">
                  <Crown className="h-4 w-4" />
                  Actualizar a Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
