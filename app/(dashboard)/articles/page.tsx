'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Clock, ArrowRight, Crown, Sparkles, BookOpen, Search, Hash } from 'lucide-react';
import Link from 'next/link';
import { BannerAd, ArticleAd, SponsoredCard } from '@/components/ads/BannerAd';
import { cn } from '@/lib/cn';

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
  const { tr } = useLang();
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error('[ARTICLES] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4">
        {/* Banner Ad for Free Users at the very top */}
        {!isPremium && (
          <div className="pt-4">
             <BannerAd position="top" />
          </div>
        )}
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-600 to-teal-700 p-12 text-white shadow-2xl group transition-all duration-700 hover:shadow-emerald-500/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-20" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-black uppercase tracking-widest leading-none">
                <Sparkles className="h-3 w-3" /> {tr('sub_feature_expert_articles') || 'Contenido Exclusivo'}
              </div>
              <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter leading-none max-w-2xl">
                {tr('art_title') || 'Bibloteca de Salud'}
              </h1>
              <p className="text-xl text-emerald-50/80 font-medium max-w-xl leading-relaxed">
                {tr('art_subtitle') || 'Aprende los secretos de la nutrición moderna con artículos verificados por expertos.'}
              </p>
            </div>
            {!isPremium && (
              <Card className="bg-white/10 backdrop-blur-2xl border-white/20 p-6 rounded-[2.5rem] shadow-2xl text-center md:text-left min-w-[280px]">
                <Crown className="h-8 w-8 text-amber-400 mb-4 mx-auto md:mx-0" />
                <h3 className="text-white font-black mb-1 uppercase tracking-tight">{tr('sub_upgrade_premium') || 'Mejora tu plan'}</h3>
                <p className="text-sm text-emerald-50 mb-4 opacity-80">Lectura sin anuncios y contenido VIP.</p>
                <Link href="/subscription">
                  <Button className="w-full rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 font-black h-11 border-0 shadow-lg">
                    {tr('sub_get_pro') || 'Actualizar'}
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        {/* Content Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder={tr('food_search_placeholder') || 'Buscar artículos...'}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-500/50 outline-none transition-all font-bold text-slate-800 dark:text-slate-100 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           {!isPremium && (
             <div className="px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tr('art_with_ads') || 'Modo con Anuncios'}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             </div>
           )}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <React.Fragment key={article._id}>
              <Card className="flex flex-col h-full rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-500 shadow-xl group">
                <div className="h-56 relative overflow-hidden">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                       <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/50">
                       {article.category}
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    {article.isVerified && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        <BadgeCheck className="h-3.5 w-3.5" /> {tr('art_verified') || 'Verificado'}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                       <Clock className="h-3.5 w-3.5" /> {article.readTime} {tr('art_read_min') || 'min'}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-heading font-black text-slate-900 dark:text-slate-100 leading-tight group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 pb-6">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  {article.author && (
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 text-sm border-2 border-white dark:border-slate-800 shadow-sm">
                        {article.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">{article.author.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-tight line-clamp-1">{article.author.credentials}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-0 pb-8 px-6">
                  <Link href={`/articles/${article.slug}`} className="w-full">
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-100 dark:border-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 hover:border-emerald-500 transition-all font-black text-xs uppercase tracking-widest gap-2">
                      {tr('art_read_more') || 'Leer Ahora'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Ad spacing for free users */}
              {!isPremium && (index + 1) % 3 === 0 && (
                <div className="md:col-span-2 lg:col-span-1">
                   <SponsoredCard />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Ad Space */}
        {!isPremium && filteredArticles.length > 0 && (
          <div className="py-12 border-y border-slate-100 dark:border-slate-800/50">
             <ArticleAd />
          </div>
        )}

        {/* Empty State */}
        {filteredArticles.length === 0 && !isLoading && (
          <div className="py-24 text-center space-y-6">
             <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto shadow-inner">
                <Search className="h-10 w-10 text-slate-200 dark:text-slate-800" />
             </div>
             <div className="space-y-2">
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100 capitalize">{tr('art_empty') || 'No se hallaron artículos'}</p>
                <p className="text-slate-400 font-medium">Prueba con otra categoría o término de búsqueda.</p>
             </div>
             <Button variant="ghost" className="font-black text-emerald-500 hover:text-emerald-600" onClick={() => setSearchQuery('')}>
                Limpiar búsqueda
             </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="h-56 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem]" />
                <div className="space-y-3 px-4">
                  <div className="h-6 bg-slate-100 dark:bg-slate-900 rounded-full w-3/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full w-5/6" />
                  <div className="h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl w-full mt-8" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
