'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, doc, getDoc, getDocs } from 'firebase/firestore';
import type { Book } from '@/lib/types';
import { Loader2, Library, X, ArrowRight, BookOpen, Sparkles, Heart, Eye, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

// Palette warna punggung buku yang organik
const SPINE_COLORS = [
  "#3E2723", "#5D4037", "#1A237E", "#1B5E20", "#B71C1C", 
  "#4A148C", "#004D40", "#BF360C", "#311B92", "#0D47A1"
];

export default function LibraryPage() {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    if (!firestore || !currentUser) return;

    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const favsRef = collection(firestore, `users/${currentUser.uid}/favorites`);
        const q = query(favsRef, orderBy('addedAt', 'desc'));
        const snap = await getDocs(q);
        
        const bookPromises = snap.docs.map(async (d) => {
          const bookRef = doc(firestore, 'books', d.id);
          const bookSnap = await getDoc(bookRef);
          if (bookSnap.exists()) {
            return { id: bookSnap.id, ...bookSnap.data() } as Book;
          }
          return null;
        });

        const results = await Promise.all(bookPromises);
        setFavorites(results.filter((b): b is Book => b !== null));
      } catch (err) {
        console.error("Error fetching library:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [firestore, currentUser]);

  const shelfGroups = useMemo(() => {
    const groups: Book[][] = [];
    const booksPerShelf = 8;
    for (let i = 0; i < favorites.length; i += booksPerShelf) {
      groups.push(favorites.slice(i, i + booksPerShelf));
    }
    return groups;
  }, [favorites]);

  return (
    <div className="max-w-6xl mx-auto pb-32 space-y-12 px-4 pt-6 min-h-screen">
      <header className="text-center space-y-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Library className="h-4 w-4" /> Koleksi Pribadi
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight leading-none italic text-foreground">Pustaka <span className="text-primary">Saya.</span></h1>
          <p className="text-muted-foreground font-medium italic mt-2">"Arsip karsa yang menanti untuk kembali disapa."</p>
        </motion.div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-40">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="font-black uppercase text-[10px] tracking-[0.4em]">Menyusun Rak Kayu...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-32 text-center space-y-8 opacity-30">
          <div className="p-10 bg-muted rounded-[3rem] w-fit mx-auto shadow-inner">
            <Library className="h-20 w-20" />
          </div>
          <div className="space-y-2">
            <p className="font-headline text-2xl font-black italic text-foreground">Rak Masih Hening.</p>
            <p className="text-xs font-bold uppercase tracking-widest px-10">Simpan mahakarya ke favorit untuk mengisi pustaka Anda.</p>
          </div>
          <Button asChild className="rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
            <Link href="/">Cari Inspirasi</Link>
          </Button>
        </div>
      ) : (
        <div className="bookshelf-container space-y-20 perspective-[2000px]">
          {shelfGroups.map((group, gIdx) => (
            <div key={gIdx} className="relative group/shelf">
              {/* Shelf Space */}
              <div className="flex items-end gap-0.5 px-4 pb-6 relative z-10 min-h-[220px]">
                {group.map((book, bIdx) => {
                  const spineColor = SPINE_COLORS[(gIdx * 8 + bIdx) % SPINE_COLORS.length];
                  const randomHeight = 160 + ((gIdx + bIdx) % 5) * 10;
                  
                  return (
                    <motion.div 
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: bIdx * 0.05 }}
                      className="book-wrapper group/book cursor-pointer relative preserve-3d transition-all duration-500 hover:-translate-y-6"
                      onClick={() => setSelectedBook(book)}
                    >
                      {/* Book Spine */}
                      <div 
                        className="w-[30px] md:w-[45px] rounded-sm relative flex items-center justify-center shadow-[2px_10px_20px_rgba(0,0,0,0.3)] border-l border-white/10"
                        style={{ backgroundColor: spineColor, height: `${randomHeight}px` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                        <span 
                          className="spine-title font-headline text-[8px] md:text-[11px] font-black text-white/90 uppercase tracking-widest vertical-rl rotate-180 truncate h-[85%] px-1"
                        >
                          {book.title}
                        </span>
                        
                        {/* Book Edge Effect (Depth) */}
                        <div 
                          className="absolute right-[-15px] top-0 w-[15px] h-full origin-left rotate-y-90 brightness-[0.6] filter shadow-inner"
                          style={{ backgroundColor: spineColor }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Shelf Plank (The wood) */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-[#8D6E63] via-[#5D4037] to-[#3E2723] rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-0">
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10" />
                <div className="absolute bottom-[-15px] left-0 right-0 h-[15px] bg-[#2D1B18] origin-top -rotate-x-90" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Immersive Modal View */}
      <AnimatePresence>
        {selectedBook && (
          <div
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Blurred background */}
              <Image
                src={selectedBook.coverUrl}
                alt={`Latar belakang ${selectedBook.title}`}
                fill
                className="object-cover blur-3xl scale-125 brightness-50"
              />
              <div className="absolute inset-0 bg-black/70" />
            </motion.div>

            {/* Main modal content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl bg-card/50 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-12">
                {/* Cover on the left */}
                <div className="md:col-span-4">
                  <div className="relative aspect-[2/3] m-8 md:m-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40">
                    <Image
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, 30vw"
                    />
                  </div>
                </div>
                
                {/* Details on the right */}
                <div className="md:col-span-8 p-8 md:p-12 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black tracking-widest uppercase text-[9px] shadow-sm">
                        {selectedBook.genre}
                      </Badge>
                      <h2 className="font-headline text-4xl font-black tracking-tight text-foreground italic">
                        {selectedBook.title}
                      </h2>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        OLEH {selectedBook.authorName}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center border-y border-border/50 py-4">
                      {[
                        { label: 'Dilihat', value: selectedBook.viewCount, icon: Eye },
                        { label: 'Disukai', value: selectedBook.favoriteCount, icon: Heart },
                        { label: 'Bab', value: selectedBook.chapterCount, icon: Layers },
                      ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <stat.icon className="h-5 w-5 text-primary/60 mb-1.5" />
                          <span className="font-black text-lg tracking-tighter">
                            {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(stat.value)}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-widest">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-4">
                      {selectedBook.synopsis}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                      <Link href={`/books/${selectedBook.id}/read`}>
                        <BookOpen className="mr-2 h-5 w-5" />
                        Mulai Baca
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-widest border-2 hover:bg-primary/5 hover:text-primary transition-all active:scale-95">
                      <Link href={`/books/${selectedBook.id}`}>
                        Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute -top-4 -right-4 md:top-6 md:right-6 h-12 w-12 rounded-full bg-background border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 hover:rotate-90 transition-all z-20"
              >
                <X className="h-6 w-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-90 { transform: rotateY(90deg); }
        .rotate-y-180 { transform: rotateY(180deg); }
        .rotate-x-90 { transform: rotateX(90deg); }
        .backface-hidden { backface-visibility: hidden; }
        .vertical-rl { writing-mode: vertical-rl; }
        
        .book-wrapper:hover .book-spine {
            box-shadow: 10px 15px 30px rgba(0,0,0,0.4);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
