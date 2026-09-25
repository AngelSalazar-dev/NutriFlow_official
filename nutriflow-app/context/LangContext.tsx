'use client';

import * as React from 'react';
import t, { LangCode, LANGUAGES } from '@/lib/translations';

interface LangContextValue {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  tr: (key: keyof typeof t['en']) => string;
  languages: typeof LANGUAGES;
}

const LangContext = React.createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  tr: (key) => key as string,
  languages: LANGUAGES,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<LangCode>('en');

  React.useEffect(() => {
    const stored = localStorage.getItem('nf-lang') as LangCode | null;
    if (stored && t[stored]) {
      setLangState(stored);
      applyDir(stored);
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.slice(0, 2) as LangCode;
      if (t[browserLang]) {
        setLangState(browserLang);
        applyDir(browserLang);
      }
    }
  }, []);

  const applyDir = (l: LangCode) => {
    const langDef = LANGUAGES.find(x => x.code === l);
    document.documentElement.setAttribute('dir', langDef?.dir === 'rtl' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', l);
  };

  const setLang = (l: LangCode) => {
    setLangState(l);
    applyDir(l);
    localStorage.setItem('nf-lang', l);
  };

  const tr = (key: keyof typeof t['en']): string => {
    return t[lang]?.[key] ?? t['en'][key] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, tr, languages: LANGUAGES }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = React.useContext(LangContext);
  if (context === undefined) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
}
