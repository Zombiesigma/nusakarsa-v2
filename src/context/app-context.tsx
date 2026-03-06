"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Book, Category } from '@/lib/data';
import { books as allBooks, categories as allCategories } from '@/lib/data';

type Page = 'home' | 'explore' | 'library' | 'profile';
type Theme = 'light' | 'dark';

interface AppContextType {
  activePage: Page;
  setActivePage: (page: Page) => void;
  theme: Theme;
  toggleTheme: () => void;
  isMenuOpen: boolean;
  setMenuOpen: (isOpen: boolean) => void;
  modalBookId: number | null;
  setModalBookId: (id: number | null) => void;
  
  books: Book[];
  categories: readonly Category[];
  bookmarkedBooks: Set<number>;
  toggleBookmark: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('light');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [modalBookId, setModalBookId] = useState<number | null>(null);
  const [bookmarkedBooks, setBookmarkedBooks] = useState<Set<number>>(() => new Set([1, 3, 8]));

  useEffect(() => {
    const savedTheme = localStorage.getItem('nusakarsa-theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nusakarsa-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    if (isMenuOpen || modalBookId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen, modalBookId]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);
  
  const handleSetPage = useCallback((page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  const toggleBookmark = (id: number) => {
    setBookmarkedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const value = {
    activePage,
    setActivePage: handleSetPage,
    theme,
    toggleTheme,
    isMenuOpen,
    setMenuOpen,
    modalBookId,
    setModalBookId,
    books: allBooks,
    categories: allCategories,
    bookmarkedBooks,
    toggleBookmark,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
