"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const PreferencesContext = createContext(null);

const dictionaries = {
  en: {
    home: 'Home', about: 'About', work: 'Work', writing: 'Writing', picks: 'Picks', contact: 'Contact',
    themeLight: 'Use light theme', themeDark: 'Use dark theme', language: 'Türkçe kullan',
  },
  tr: {
    home: 'Ana Sayfa', about: 'Hakkımda', work: 'Projeler', writing: 'Yazılar', picks: 'Seçtiklerim', contact: 'İletişim',
    themeLight: 'Açık temayı kullan', themeDark: 'Koyu temayı kullan', language: 'Use English',
  },
};

export function PreferencesProvider({ children }) {
  const [theme, setThemeState] = useState('dark');
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('bergaman-theme');
    const savedLocale = localStorage.getItem('bergaman-locale');
    setThemeState(savedTheme === 'light' ? 'light' : 'dark');
    setLocaleState(savedLocale === 'tr' ? 'tr' : 'en');
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('bergaman-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    localStorage.setItem('bergaman-locale', locale);
  }, [locale]);

  const setTheme = useCallback((value) => setThemeState(value === 'light' ? 'light' : 'dark'), []);
  const setLocale = useCallback((value) => setLocaleState(value === 'tr' ? 'tr' : 'en'), []);
  const t = useCallback((key) => dictionaries[locale]?.[key] || dictionaries.en[key] || key, [locale]);
  const value = useMemo(() => ({ theme, locale, setTheme, setLocale, t }), [theme, locale, setTheme, setLocale, t]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used inside PreferencesProvider');
  return context;
}

export function localizePost(post, locale) {
  if (!post || locale !== 'tr') return post;
  const translation = post.translations?.tr || post.tr || {};
  return {
    ...post,
    title: translation.title || post.titleTr || post.title,
    description: translation.description || translation.excerpt || post.descriptionTr || post.description,
    content: translation.content || post.contentTr || post.content,
  };
}
