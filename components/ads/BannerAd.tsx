'use client';

import { useAuth } from '@/context/AuthContext';
import { Crown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Children } from 'react';

interface BannerAdProps {
  position?: 'top' | 'bottom' | 'between' | 'sidebar';
  className?: string;
}

/**
 * Google AdSense Banner Component
 * Shows non-intrusive ads for free users
 */
export function BannerAd({ position = 'bottom', className = '' }: BannerAdProps) {
  const { isPremium } = useAuth();
  const [adVisible, setAdVisible] = useState(true);

  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }

  // Ad configuration based on position
  const positionClasses = {
    top: 'sticky top-16 z-40 border-b',
    bottom: 'fixed bottom-0 left-0 right-0 z-40 border-t',
    between: 'my-8 border-y',
    sidebar: 'sticky top-20',
  };

  const handleClose = () => {
    setAdVisible(false);
    // Log ad dismissal for analytics
    if (typeof window !== 'undefined') {
      localStorage.setItem('ad-dismissed', Date.now().toString());
    }
  };

  if (!adVisible) {
    return null;
  }

  return (
    <div
      className={`
        bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100
        py-3 px-4
        ${positionClasses[position]}
        ${className}
      `}
      role="complementary"
      aria-label="Advertisement"
    >
      <div className="container-nutriflow flex items-center justify-between gap-4">
        {/* Ad Label */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-stone-400 uppercase tracking-wider bg-stone-200 px-2 py-1 rounded">
            Publicidad
          </span>
          
          {/* Google AdSense Placeholder */}
          <div className="hidden sm:block">
            <div 
              className="w-[728px] h-[90px] bg-stone-200 rounded-lg flex items-center justify-center border-2 border-dashed border-stone-300"
              aria-label="Google AdSense Banner"
            >
              <span className="text-stone-400 text-sm">
                Google AdSense - Banner 728x90
              </span>
            </div>
          </div>
          
          {/* Mobile Ad Size */}
          <div className="sm:hidden">
            <div 
              className="w-[320px] h-[50px] bg-stone-200 rounded-lg flex items-center justify-center border-2 border-dashed border-stone-300"
              aria-label="Google AdSense Mobile Banner"
            >
              <span className="text-stone-400 text-xs">
                Google AdSense - 320x50
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="text-stone-400 hover:text-stone-600 transition-colors p-1"
          aria-label="Close ad"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * In-Article Ad Component
 * Shows between paragraphs in articles
 */
export function ArticleAd() {
  const { isPremium } = useAuth();

  if (isPremium) {
    return null;
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl border-2 border-dashed border-stone-200">
      <div className="text-center space-y-4">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
          Publicidad
        </span>
        
        {/* Google AdSense In-Article */}
        <div 
          className="w-full max-w-2xl mx-auto h-[250px] bg-stone-200 rounded-lg flex items-center justify-center border-2 border-dashed border-stone-300"
          aria-label="Google AdSense In-Article"
        >
          <span className="text-stone-400 text-sm">
            Google AdSense - In-Article Ad
          </span>
        </div>

        {/* Upgrade Prompt */}
        <div className="pt-4 border-t border-stone-200">
          <p className="text-sm text-stone-600 mb-3">
            ¿Cansado de los anuncios?
          </p>
          <Link href="/subscription">
            <div className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">
              <Crown className="h-4 w-4" />
              Actualizar a Premium - Sin anuncios
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Sponsored Content Card
 * Shows sponsored articles in the feed
 */
export function SponsoredCard() {
  return (
    <div className="card-nutriflow overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 to-white">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-amber-700 bg-amber-200 px-2 py-1 rounded">
            Contenido Patrocinado
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-stone-900 mb-2">
          Tu marca aquí
        </h3>
        
        <p className="text-sm text-stone-600 mb-4">
          Anuncia tu producto o servicio a miles de usuarios comprometidos con su salud.
        </p>

        <div 
          className="w-full h-[200px] bg-stone-200 rounded-lg flex items-center justify-center border-2 border-dashed border-stone-300"
          aria-label="Sponsored Content Placeholder"
        >
          <span className="text-stone-400 text-sm">
            Espacio Publicitario
          </span>
        </div>

        <div className="mt-4 text-center text-xs text-stone-500">
          Google AdSense - Sponsored Content
        </div>
      </div>
    </div>
  );
}

/**
 * Ad Wrapper Component
 * Manages ad display frequency and positioning
 */
export function AdWrapper({ 
  children, 
  adInterval = 3 
}: { 
  children: React.ReactNode;
  adInterval?: number;
}) {
  const { isPremium } = useAuth();
  const childrenArray = Children.toArray(children);

  if (isPremium) {
    return <>{children}</>;
  }

  const elementsWithAds = [];

  for (let i = 0; i < childrenArray.length; i++) {
    elementsWithAds.push(childrenArray[i]);

    // Insert ad after every N elements
    if ((i + 1) % adInterval === 0 && i < childrenArray.length - 1) {
      elementsWithAds.push(<ArticleAd key={`ad-${i}`} />);
    }
  }

  return <>{elementsWithAds}</>;
}

export default BannerAd;
