export const siteConfig = {
  name: 'NutriFlow',
  description: 'Plataforma Digital de Salud Integral — Nutrición + Ejercicio + IA',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og.jpg',
  links: {
    twitter: 'https://twitter.com/nutriflow',
    github: 'https://github.com/nutriflow',
  },
  keywords: ['nutrición', 'ejercicio', 'salud', 'fitness', 'IA', 'calorías'],
  author: 'NutriFlow Team',
  metadata: {
    title: {
      default: 'NutriFlow — Nutrición Inteligente',
      template: '%s | NutriFlow',
    },
    description: 'Controla tu alimentación, ejercicio y bienestar con una plataforma diseñada científicamente para tu éxito.',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  },
};

export type SiteConfig = typeof siteConfig;
