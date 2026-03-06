
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Book, Category } from '@/lib/data';
import { books as allBooks, categories as allCategories } from '@/lib/data';

type Theme = 'light' | 'dark';

interface AppContextType {
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
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [modalBookId, setModalBookId] = useState<number | null>(null);
  const [bookmarkedBooks, setBookmarkedBooks] = useState<Set<number>>(() => new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('nusakarsa-theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }

    const loggedInStatus = localStorage.getItem('nusakarsa-isLoggedIn') === 'true';
    if (loggedInStatus) {
      setIsLoggedIn(true);
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
  
  const handleLogin = (status: boolean) => {
    setIsLoggedIn(status);
    localStorage.setItem('nusakarsa-isLoggedIn', status.toString());
  };

  const value = {
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
    isLoggedIn,
    setIsLoggedIn: handleLogin,
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
