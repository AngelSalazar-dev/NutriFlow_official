'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck, Clock, ArrowLeft, Crown, Share2, Bookmark, Calendar, User, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BannerAd, ArticleAd } from '@/components/ads/BannerAd';
import { cn } from '@/lib/cn';
import { getArticleTranslation } from '@/lib/article-translations';
import { getArticleContentTranslation } from '@/lib/article-content-translations';

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
  const { tr, lang } = useLang();
  const [article, setArticle] = React.useState<Article | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  // Translated article for non-Spanish languages
  const translatedArticle = React.useMemo(() => {
    if (!article) return null;
    if (lang === 'es') return article;
    const t = getArticleTranslation(article.slug, lang);
    const translatedContent = getArticleContentTranslation(article.slug, lang);
    if (t.title) {
      return {
        ...article,
        title: t.title,
        excerpt: t.excerpt || article.excerpt,
        content: translatedContent || article.content,
      };
    }
    return article;
  }, [article, lang]);

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
      // In a real app we would use a toast
      alert(lang === 'es' ? 'Enlace copiado' : 'Link copied');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8 py-12 px-4">
           <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full w-24 animate-pulse" />
           <div className="space-y-4">
              <div className="h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl w-3/4 animate-pulse" />
              <div className="h-6 bg-slate-100 dark:bg-slate-900 rounded-2xl w-1/2 animate-pulse opacity-50" />
           </div>
           <div className="h-96 bg-slate-50 dark:bg-slate-900 rounded-[3rem] animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-32 px-4">
           <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-red-500" />
           </div>
           <h1 className="text-3xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tighter mb-4 capitalize">
             {tr('art_empty') || 'Artículo no hallado'}
           </h1>
           <Link href="/articles">
             <Button variant="outline" className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 font-bold gap-2">
                <ChevronLeft className="h-5 w-5" /> {tr('common_back') || 'Volver'}
             </Button>
           </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-32 pt-8 px-4">
        {/* Ad Space */}
        {!isPremium && <BannerAd position="top" />}

        {/* Navigation & Header */}
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <Link href="/articles">
                <Button variant="ghost" className="h-10 rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-emerald-600 transition-colors pl-0">
                  <ArrowLeft size={16} /> {tr('common_back') || 'Volver'}
                </Button>
              </Link>
              <div className="flex gap-2">
                 <Button variant="outline" size="icon" className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm" onClick={handleShare}>
                    <Share2 size={16} />
                 </Button>
                 <Button variant={isBookmarked ? 'default' : 'outline'} size="icon" className={cn("rounded-xl border-slate-100 dark:border-slate-800 shadow-sm", isBookmarked && "bg-emerald-500 text-white border-emerald-500")} onClick={() => setIsBookmarked(!isBookmarked)}>
                    <Bookmark size={16} />
                 </Button>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                 <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                    {article.category}
                 </div>
                 <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Clock size={14} /> {article.readTime} {tr('art_read_min') || 'min'}
                 </div>
                 {article.isVerified && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-500/20 shadow-sm">
                       <Sparkles size={14} /> {tr('art_verified') || 'Verificado'}
                    </div>
                 )}
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-[0.95]">
                 {translatedArticle?.title}
              </h1>

              <p className="text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-6 py-2">
                 {translatedArticle?.excerpt}
              </p>

              {article.author && (
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 shadow-sm group">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:rotate-6 transition-transform">
                      {article.author.name.charAt(0)}
                   </div>
                   <div className="flex-1">
                      <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{tr('dash_no_weekly_data')||'Autor'}</p>
                      <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-none">{article.author.name}</h4>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">{article.author.credentials}</p>
                   </div>
                   <BadgeCheck className="h-8 w-8 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
           </div>
        </div>

        {/* Image */}
        {article.coverImage && (
          <div className="relative h-96 md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 group">
             <img
               src={article.coverImage}
               alt={article.title}
               className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
             />
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Content */}
        <Card className="border-0 shadow-none dark:bg-transparent overflow-hidden">
           <CardContent className="p-0">
              <div className="prose-nutriflow prose-slate dark:prose-invert max-w-none">
                 <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 mb-8 tracking-tighter" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-16 mb-6 tracking-tighter border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-500/5 rounded-r-2xl" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-10 mb-4" {...props} />,
                      p: ({node, ...props}) => <p className="text-lg text-slate-600 dark:text-slate-400 leading-[1.8] mb-8 font-medium" {...props} />,
                      ul: ({node, ...props}) => <ul className="mb-8 space-y-4 list-none p-0" {...props} />,
                      ol: ({node, ...props}) => <ol className="mb-8 space-y-4 list-decimal pl-6 font-bold text-slate-900 dark:text-slate-100" {...props} />,
                      li: ({node, ...props}) => (
                        <li className="flex items-start gap-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-3 shrink-0" />
                           <span className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{props.children}</span>
                        </li>
                      ),
                      blockquote: ({node, ...props}) => (
                        <blockquote 
                          className="border-l-8 border-emerald-600 pl-8 italic text-slate-700 dark:text-slate-300 my-12 bg-slate-50 dark:bg-slate-900/50 py-8 pr-8 rounded-r-[2rem] font-serif text-2xl leading-relaxed shadow-inner" 
                          {...props} 
                        />
                      ),
                      strong: ({node, ...props}) => <strong className="font-black text-slate-900 dark:text-slate-50" {...props} />,
                    }}
                 >
                    {translatedArticle?.content}
                 </ReactMarkdown>
              </div>
           </CardContent>
        </Card>

        {/* Footer info */}
        <div className="pt-12 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-3 text-slate-400 text-sm font-bold uppercase tracking-widest">
              <Calendar size={18} className="text-emerald-500" />
              {new Date(article.publishedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
           </div>
           {!isPremium && (
             <Link href="/subscription">
               <Button className="h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black uppercase tracking-[0.2em] text-[10px] px-8 border-0 shadow-xl shadow-emerald-500/20">
                  <Crown size={16} className="mr-2" /> {tr('sub_upgrade_premium') || 'Pasar a Premium'}
               </Button>
             </Link>
           )}
        </div>

        {/* References */}
        {article.references && article.references.length > 0 && (
          <Card className="rounded-[3rem] border-2 border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/50 shadow-xl overflow-hidden mt-12">
            <CardContent className="p-10">
               <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3 uppercase tracking-tighter">
                  <Bookmark className="h-6 w-6 text-emerald-600" /> {tr('nav_history') || 'Fuentes y Referencias'}
               </h3>
               <ul className="space-y-4">
                  {article.references.map((ref, idx) => (
                    <li key={idx} className="flex items-start gap-4 group">
                       <span className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-black text-emerald-600 border border-slate-200 dark:border-slate-800 shrink-0 group-hover:scale-110 transition-transform">{idx + 1}</span>
                       <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{ref}</p>
                    </li>
                  ))}
               </ul>
            </CardContent>
          </Card>
        )}

        {/* Article Bottom Ad */}
        {!isPremium && <ArticleAd />}
      </div>
    </DashboardLayout>
  );
}
