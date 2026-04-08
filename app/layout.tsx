import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nutriflow.com'),
  title: {
    default: "NutriFlow — Nutrición Inteligente",
    template: "%s | NutriFlow"
  },
  description: "Plataforma digital de salud integral que combina nutrición y ejercicio físico impulsado por Inteligencia Artificial y ciencia.",
  keywords: ["nutrición", "ejercicio", "salud", "fitness", "dieta", "calorías", "IA", "rutinas"],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "NutriFlow — Nutrición Inteligente",
    description: "Plataforma digital de salud integral que combina nutrición y ejercicio físico impulsado por Inteligencia Artificial y ciencia.",
    siteName: "NutriFlow",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "NutriFlow Dashboard",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriFlow — Nutrición Inteligente",
    description: "Plataforma digital de salud integral impulsada por IA.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const isAdsenseEnabled = adsensePublisherId && adsensePublisherId !== 'ca-pub-XXXXXXXXXXXXXX';

  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Google AdSense Script optimizado para Next.js */}
        {isAdsenseEnabled && (
          <Script
            id="adsense-script"
            strategy="lazyOnload"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className="min-h-full flex flex-col font-sans transition-colors duration-300"
        suppressHydrationWarning
      >
        <div className="light">
          <NextTopLoader
            color="#10b981"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #10b981,0 0 5px #10b981"
            zIndex={1600}
          />
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
