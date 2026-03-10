'use client';

import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Book } from '@/lib/types';
import { BookCarousel } from '@/components/BookCarousel';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  
  const booksQuery = useMemo(() => (
    (firestore && currentUser)
    ? query(
        collection(firestore, 'books'), 
        where('status', '==', 'published')
      )
    : null
  ), [firestore, currentUser]);
  
  const { data: rawBooks, isLoading: areBooksLoading } = useCollection<Book>(booksQuery);

  const popularBooks = useMemo(() => {
    if (!rawBooks) return null;
    return [...rawBooks]
      .filter(b => b.visibility === 'public')
      .sort((a, b) => (b.favoriteCount + b.viewCount) - (a.favoriteCount + a.viewCount))
      .slice(0, 12);
  }, [rawBooks]);

  return (
    <div className="relative space-y-12 w-full max-w-7xl mx-auto pb-20">
      <header className="space-y-4">
        <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-headline font-black tracking-tight text-foreground"
        >
            Selamat Datang, <span className="text-primary italic">{currentUser?.displayName || 'Pujangga'}!</span>
        </motion.h1>
        <p className="text-muted-foreground font-medium text-lg italic opacity-60">"Setiap karsa Anda adalah awal dari sebuah mahakarya."</p>
      </header>

      <section className="space-y-10 pt-8">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-headline font-black tracking-tight flex items-center gap-3">
                Rilisan <span className="text-primary italic">Terbaru</span>
            </h2>
            <div className="h-px bg-border/50 flex-1" />
        </div>
        <BookCarousel title="" books={popularBooks} isLoading={areBooksLoading} />
      </section>

      <div className="text-center opacity-10 select-none grayscale py-20">
          <div className="flex items-center justify-center gap-3">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.6em]">Nusakarsa Digital</span>
          </div>
      </div>
    </div>
  );
}
