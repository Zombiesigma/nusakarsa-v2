'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, doc, getDoc, getDocs } from 'firebase/firestore';
import type { Book } from '@/lib/types';
import { Loader2, Library, X, ArrowRight, BookOpen, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-10 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setSelectedBook(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-4xl flex items-center justify-center z-[410]"
            >
              {/* Close Button UI */}
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/40 hover:text-white transition-all bg-white/10 rounded-full p-2.5 border border-white/10 z-[420] active:scale-90"
              >
                <X className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              <div className="w-full bg-[#fdfbf7] rounded-[2rem] md:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-hidden border border-white/10">
                
                {/* Left Side: Cover Image (Static) */}
                <div className="w-full md:w-2/5 aspect-[3/4] md:aspect-auto relative shrink-0">
                    <img 
                        src={selectedBook.coverUrl} 
                        className="w-full h-full object-cover" 
                        alt={selectedBook.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                </div>

                {/* Right Side: Narrative Details */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-white/50 backdrop-blur-sm shadow-inner">
                  <div className="space-y-6 md:space-y-8 max-w-lg">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-primary/40" />
                        <span className="text-primary font-black uppercase text-[8px] md:text-[10px] tracking-[0.4em] opacity-60">
                            Mahakarya Pilihan
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-headline font-black text-zinc-900 italic leading-tight tracking-tight">
                        {selectedBook.title}
                      </h2>
                      <p className="text-zinc-400 font-bold uppercase text-[10px] md:text-xs tracking-widest">
                        Oleh {selectedBook.authorName}
                      </p>
                    </div>
                    
                    <div className="h-1 w-16 bg-primary/20" />

                    <div className="max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar">
                        <p className="text-zinc-600 text-sm md:text-lg leading-relaxed italic font-serif opacity-90">
                        "{selectedBook.synopsis}"
                        </p>
                    </div>

                    <div className="pt-4 md:pt-6">
                        <Button asChild size="lg" className="rounded-full px-8 md:px-12 h-14 md:h-16 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-95 transition-all w-full md:w-auto">
                            <Link href={`/books/${selectedBook.id}/read`}>
                                Mulai Membaca <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-8 right-12 hidden lg:flex opacity-10 select-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em]">Nusakarsa Digital Literacy</span>
                  </div>
                </div>
              </div>
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
