'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Book, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BookCarousel } from '@/components/BookCarousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, BookOpen, Crown, PenTool, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  
  const booksQuery = useMemo(() => (
    (firestore && currentUser)
    ? query(
        collection(firestore, 'books'), 
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      )
    : null
  ), [firestore, currentUser]);

  const usersQuery = useMemo(() => (
    (firestore && currentUser)
    ? query(
        collection(firestore, 'users'),
        where('role', '==', 'penulis'),
        orderBy('followers', 'desc'),
        limit(10)
      )
    : null
  ), [firestore, currentUser]);
  
  const { data: rawBooks, isLoading: areBooksLoading } = useCollection<Book>(booksQuery);
  const { data: featuredAuthors, isLoading: areAuthorsLoading } = useCollection<User>(usersQuery);
  const { data: userProfile } = useDoc<User>(
    (firestore && currentUser) ? doc(firestore, 'users', currentUser.uid) : null
  );
  
  const isAuthor = userProfile?.role === 'penulis' || userProfile?.role === 'admin';

  const popularBooks = useMemo(() => {
    if (!rawBooks) return [];
    return [...rawBooks]
      .filter(b => b.visibility === 'public')
      .sort((a, b) => (b.favoriteCount + b.viewCount) - (a.favoriteCount + a.viewCount))
      .slice(0, 12);
  }, [rawBooks]);

  const newFantasyBooks = useMemo(() => {
    if (!rawBooks) return [];
    return rawBooks.filter(b => 
      b.visibility === 'public' && 
      (b.genre.toLowerCase().includes('fantasi') || b.genre.toLowerCase().includes('sci-fi'))
    ).slice(0, 12);
  }, [rawBooks]);

  return (
    <div className="w-full text-foreground">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] md:h-screen flex items-center justify-center text-center overflow-hidden bg-background">
        <Image
          src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop"
          alt="Perpustakaan megah"
          fill
          className="object-cover object-center brightness-[0.3] scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-10 space-y-8 max-w-4xl px-4">
          <h1 className="text-5xl md:text-8xl font-headline font-black tracking-tight text-white drop-shadow-2xl">
            Gerbang Menuju Ribuan <span className="text-primary italic">Imajinasi</span>
          </h1>
          <p className="text-base md:text-xl text-white/80 font-medium max-w-2xl mx-auto italic leading-relaxed">
            Nusakarsa adalah panggung digital di mana setiap kata memiliki kekuatan untuk membangun dunia baru. Temukan, baca, dan ciptakan mahakarya abadi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Button asChild size="lg" className="h-14 px-10 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
              <Link href="/search">Jelajahi Karya</Link>
            </Button>
            {isAuthor && (
              <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-full font-black text-sm uppercase tracking-widest bg-white/5 border-white/20 text-white backdrop-blur-md hover:bg-white/10 transition-all active:scale-95">
                <Link href="/studio">Buka Studio</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Main Content Sections */}
      <div className="bg-background relative z-10">
        <div className="container mx-auto px-6 py-20 md:py-32 space-y-24 md:space-y-32">
          
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-headline font-black tracking-tight flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" /> Populer Minggu Ini
              </h2>
              <div className="h-px bg-border/50 flex-1" />
            </div>
            <BookCarousel books={popularBooks} isLoading={areBooksLoading} />
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-headline font-black tracking-tight flex items-center gap-3">
                <Crown className="h-6 w-6 text-primary" /> Pujangga Unggulan
              </h2>
              <div className="h-px bg-border/50 flex-1" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {areAuthorsLoading ? (
                Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex flex-col items-center gap-3 animate-pulse"><div className="h-24 w-24 rounded-full bg-muted"/><div className="h-4 w-24 rounded-full bg-muted"/></div>)
              ) : (
                featuredAuthors?.map(author => (
                  <Link key={author.id} href={`/profile/${author.username}`} className="flex flex-col items-center gap-4 text-center group">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg group-hover:ring-4 ring-primary/20 transition-all duration-300">
                      <AvatarImage src={author.photoURL} className="object-cover"/>
                      <AvatarFallback className="bg-primary/10 text-primary font-black">{author.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{author.displayName}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">@{author.username}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
          
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-headline font-black tracking-tight flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" /> Fantasi & Fiksi Ilmiah
              </h2>
              <div className="h-px bg-border/50 flex-1" />
            </div>
            <BookCarousel books={newFantasyBooks} isLoading={areBooksLoading} />
          </section>

          {!isAuthor && (
            <section className="py-16">
              <div className="bg-gradient-to-r from-primary/90 to-accent/90 rounded-[3rem] p-12 md:p-20 text-center flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-4">
                  <h3 className="text-3xl md:text-5xl font-headline font-black text-white drop-shadow-xl">Siap Membangun Duniamu?</h3>
                  <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed italic">
                    Setiap penulis adalah arsitek semesta. Bergabunglah dengan para pujangga Nusakarsa dan mulailah perjalanan sastra Anda hari ini.
                  </p>
                </div>
                <Button variant="secondary" size="lg" asChild className="relative z-10 h-16 px-12 rounded-full font-black text-sm uppercase tracking-widest text-primary shadow-2xl hover:scale-105 transition-transform active:scale-95">
                  <Link href="/join-author">
                    <PenTool className="mr-3" /> Jadi Penulis Resmi
                  </Link>
                </Button>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
