

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Book, Category } from '@/lib/data';
import { categories as allCategories } from '@/lib/data';
import { useUser, useCollection, useDoc } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, writeBatch, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { initialBooks } from '@/lib/data';


type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  isMenuOpen: boolean;
  setMenuOpen: (isOpen: boolean) => void;
  modalBookId: string | null;
  setModalBookId: (id: string | null) => void;
  
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'rating' | 'readers' | 'trending' | 'progress' | 'coverImage' | 'ownerId'>) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;

  categories: readonly Category[];
  bookmarkedBooks: Set<string>;
  toggleBookmark: (id: string) => void;
  isLoggedIn: boolean;
  user: any; // Consider using a more specific type for the user
  loading: boolean; // Add a loading state
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [modalBookId, setModalBookId] = useState<string | null>(null);

  // Firebase integration
  const { user, loading: userLoading } = useUser();
  const isLoggedIn = !!user;
  const firestore = useFirestore();

  const booksCollectionRef = collection(firestore, 'books');
  const { data: books, loading: booksLoading } = useCollection(booksCollectionRef);
  
  const userDocRef = user ? doc(firestore, `users/${user.uid}`) : null;
  const { data: userData, loading: userDataLoading } = useDoc(userDocRef);
  
  const bookmarkedBooks = userData?.bookmarks ? new Set(userData.bookmarks) : new Set<string>();

  // Seed initial books if the books collection is empty
  useEffect(() => {
    if (isLoggedIn && !booksLoading && Array.isArray(books) && books.length === 0) {
        const batch = writeBatch(firestore);
        initialBooks.forEach(book => {
            const newBookRef = doc(booksCollectionRef);
            batch.set(newBookRef, { ...book, ownerId: null }); // Public books
        });
        batch.commit().catch(console.error);
    }
  }, [isLoggedIn, books, booksLoading, firestore, booksCollectionRef]);

  // Create user document for new users
  useEffect(() => {
      if (user && !userDataLoading && userData === null) {
          const newUserDocRef = doc(firestore, `users/${user.uid}`);
          setDoc(newUserDocRef, { bookmarks: [] }).catch(console.error);
      }
  }, [user, userData, userDataLoading, firestore]);

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

  const toggleBookmark = async (id: string) => {
    if (!userDocRef) return;
    const newSet = new Set(bookmarkedBooks);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    await updateDoc(userDocRef, { bookmarks: Array.from(newSet) });
  };

  const addBook = async (newBookData: Omit<Book, 'id' | 'rating' | 'readers' | 'trending' | 'progress' | 'coverImage'| 'ownerId'>) => {
    if (!user) throw new Error("User not authenticated");
    const newBook: Omit<Book, 'id'> = {
        ...newBookData,
        ownerId: user.uid,
        rating: 0,
        readers: "0",
        trending: false,
        progress: 0,
        isUserCreated: true,
        coverImage: {
          src: `https://picsum.photos/seed/${new Date().getTime()}/600/800`,
          width: 600,
          height: 800,
          hint: 'abstract texture'
        },
    };
    await addDoc(booksCollectionRef, newBook);
  };

  const updateBook = async (updatedBook: Book) => {
      if (!user) throw new Error("User not authenticated");
      const bookRef = doc(firestore, 'books', updatedBook.id);
      await updateDoc(bookRef, { ...updatedBook });
  };
  
  const deleteBook = async (bookId: string) => {
    if (!user) throw new Error("User not authenticated");
    const bookRef = doc(firestore, 'books', bookId);
    await deleteDoc(bookRef);
  };

  const value = {
    theme,
    toggleTheme,
    isMenuOpen,
    setMenuOpen,
    modalBookId,
    setModalBookId,
    books: books as Book[] || [],
    addBook,
    updateBook,
    deleteBook,
    categories: allCategories,
    bookmarkedBooks,
    toggleBookmark,
    isLoggedIn,
    user,
    loading: userLoading || booksLoading || userDataLoading,
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
