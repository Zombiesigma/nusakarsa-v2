"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import type { Book } from '@/lib/types';
import { useUser, useCollection, useDoc } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, writeBatch, setDoc, DocumentData, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { v4 as uuidv4 } from 'uuid';

export const categories = ["Semua", "Novel", "Non-Fiksi", "Sastra", "Puisi", "Fiksi Ilmiah", "Romansa"] as const;
export type Category = typeof categories[number];

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  modalBookId: string | null;
  setModalBookId: (id: string | null) => void;
  
  books: Book[];
  addBook: (bookDetails: {
    title: string;
    synopsis: string;
    genre: string;
    type: 'book' | 'poem';
    visibility: 'public' | 'followers_only';
    coverUrl: string;
  }) => Promise<string | undefined>;
  updateBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;

  categories: readonly Category[];
  bookmarkedBooks: Set<string>;
  toggleBookmark: (id: string) => void;
  isLoggedIn: boolean;
  user: any; // Consider using a more specific type for the user
  userData: DocumentData | null;
  loading: boolean; // Add a loading state
  isSplashDone: boolean;
  setMenuOpen: (isOpen: boolean) => void; // Dummy for compatibility
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [modalBookId, setModalBookId] = useState<string | null>(null);
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Firebase integration
  const { user, loading: userLoading } = useUser();
  const isLoggedIn = !!user;
  const firestore = useFirestore();

  const booksCollectionRef = useMemo(() => firestore ? collection(firestore, 'books') : null, [firestore]);
  const { data: booksData, loading: booksLoading } = useCollection(booksCollectionRef);
  const books = useMemo(() => (booksData as Book[] || []), [booksData]);
  
  const userDocRef = useMemo(() => (firestore && user) ? doc(firestore, `users/${user.uid}`) : null, [firestore, user]);
  const { data: userData, loading: userDataLoading } = useDoc(userDocRef);
  
  const bookmarkedBooks = useMemo(() => userData?.bookmarks ? new Set(userData.bookmarks) : new Set<string>(), [userData]);

  const loading = userLoading || booksLoading || userDataLoading;

  // This effect runs once on mount to set a minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500); // Minimum splash time: 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // This effect checks both loading status and minimum time before hiding the splash screen
  useEffect(() => {
    if (!loading && minTimeElapsed) {
      setIsSplashDone(true);
    }
  }, [loading, minTimeElapsed]);

  // Create user document for new users
  useEffect(() => {
    if (user && !userLoading && !userDataLoading && userData === null && firestore) {
      const newUserDocRef = doc(firestore, `users/${user.uid}`);
      
      const newUserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Pengguna Baru',
        photoURL: user.photoURL || `https://picsum.photos/seed/${user.uid}/128/128`,
        role: 'pembaca', // Default role for any new user document
        username: user.displayName?.replace(/\s+/g, '').toLowerCase() || user.email?.split('@')[0] || `user${Date.now()}`,
        bio: '',
        followers: [],
        following: [],
        bookmarks: [],
        createdAt: serverTimestamp(),
      };

      setDoc(newUserDocRef, newUserProfile).catch(err => {
        console.error("Failed to create user document:", err);
      });
    }
  }, [user, userLoading, userData, userDataLoading, firestore]);

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
    if (modalBookId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [modalBookId]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleBookmark = (id: string) => {
    if (!userDocRef) return;
    const newSet = new Set(bookmarkedBooks);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    const updatedData = { bookmarks: Array.from(newSet) };
    updateDoc(userDocRef, updatedData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const addBook = async (bookDetails: {
    title: string;
    synopsis: string;
    genre: string;
    type: 'book' | 'poem';
    visibility: 'public' | 'followers_only';
    coverUrl: string;
  }) => {
    if (!user || !booksCollectionRef || !userData) {
        console.error("User not authenticated or books collection not ready.");
        return;
    }

    const newBook: Omit<Book, 'id' | 'createdAt' | 'updatedAt'> = {
        ...bookDetails,
        authorId: user.uid,
        authorName: user.displayName || 'Penulis Baru',
        authorPhotoUrl: user.photoURL || '',
        status: 'draft',
        isCompleted: false,
        viewCount: 0,
        favoriteCount: 0,
        chapterCount: 0,
    };

    try {
        const docRef = await addDoc(booksCollectionRef, {
          ...newBook,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        if (!firestore) throw new Error("Firestore not initialized");

        const chapterCollectionRef = collection(firestore, 'books', docRef.id, 'chapters');
        
        const initialContent = "Mulai tulis...";

        const batch = writeBatch(firestore);
        const newChapterDoc = doc(chapterCollectionRef);
        batch.set(newChapterDoc, {
            title: bookDetails.type === 'poem' ? `BAIT 1` : `Bab 1`,
            content: initialContent,
            order: 1,
            createdAt: serverTimestamp()
        });
        
        batch.update(docRef, { chapterCount: 1 });

        await batch.commit();
        
        return docRef.id;
    } catch(serverError: any) {
        const permissionError = new FirestorePermissionError({
            path: booksCollectionRef.path,
            operation: 'create',
            requestResourceData: newBook,
        });
        errorEmitter.emit('permission-error', permissionError);
        return undefined;
    }
  };

  const updateBook = (updatedBook: Book) => {
      if (!user || !firestore) {
          console.error("User not authenticated");
          return;
      }
      const bookRef = doc(firestore, 'books', updatedBook.id);
      const { id, ...bookData } = updatedBook;
      updateDoc(bookRef, { ...bookData, updatedAt: serverTimestamp() })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: bookRef.path,
                operation: 'update',
                requestResourceData: bookData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };
  
  const deleteBook = (bookId: string) => {
    if (!user || !firestore) {
        console.error("User not authenticated");
        return;
    }
    const bookRef = doc(firestore, 'books', bookId);
    deleteDoc(bookRef)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: bookRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const value = {
    theme,
    toggleTheme,
    modalBookId,
    setModalBookId,
    books: books,
    addBook,
    updateBook,
    deleteBook,
    categories,
    bookmarkedBooks,
    toggleBookmark,
    isLoggedIn,
    user,
    userData,
    loading,
    isSplashDone,
    setMenuOpen: () => {}, // Dummy function for compatibility
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
