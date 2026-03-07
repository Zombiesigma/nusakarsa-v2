'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { LogIn, Library, BookOpen, Feather } from 'lucide-react';
import { BookCard } from '../common/book-card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Book } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function LibraryView() {
  const { isLoggedIn, bookmarkedBooks, books } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const savedBooks = useMemo(
    () => books.filter((book) => bookmarkedBooks.has(book.id) && book.status === 'published'),
    [books, bookmarkedBooks]
  );

  const continueReadingBook = useMemo(() => {
    // Placeholder logic: just take the first saved book
    return savedBooks.length > 0 ? savedBooks[0] : null;
  }, [savedBooks]);
  
  if (!isLoggedIn) {
    return (
      <section id="page-library" className="page-section pt-28 md:pt-36">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
            <LogIn className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1} />
            <h1 className="font-headline text-3xl font-bold mb-4">Pustaka Pribadi Anda</h1>
            <p className="text-muted-foreground mb-8">
              Anda harus masuk untuk melihat pustaka pribadi Anda.
            </p>
            <Button asChild className="btn-primary w-full max-w-xs mx-auto py-3 rounded-xl font-semibold">
              <Link href="/login">Masuk / Daftar</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const renderBookGrid = (bookList: Book[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {bookList.map(book => (
            <BookCard key={book.id} bookId={book.id} />
        ))}
    </div>
  );

  return (
    <section id="page-library" className="page-section pt-28 md:pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Library className="w-8 h-8 text-primary" />
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Pustaka Saya</h1>
          </div>
          
          {savedBooks.length === 0 ? (
             <div className="text-center bg-card border-2 border-dashed rounded-[2rem] p-16">
                <Library className="w-20 h-20 mx-auto text-muted-foreground/20 mb-6" strokeWidth={1}/>
                <h3 className="font-headline text-2xl font-bold">Pustaka Anda Kosong</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                    Simpan buku atau puisi yang menarik perhatian Anda untuk membacanya nanti.
                </p>
                <Button asChild className="btn-primary rounded-full px-8 h-12 font-bold">
                    <Link href="/explore">
                        Jelajahi Karya
                    </Link>
                </Button>
            </div>
          ) : (
            <>
              {continueReadingBook && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                  <h2 className="font-headline text-2xl font-bold mb-6">Lanjutkan Membaca</h2>
                  <div className="bg-card border rounded-[2rem] p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4 shrink-0">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden relative shadow-lg">
                           <Image
                            src={continueReadingBook.coverUrl}
                            alt={`Cover of ${continueReadingBook.title}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-bold text-primary uppercase tracking-widest">{continueReadingBook.genre}</p>
                          <h3 className="font-headline text-3xl font-bold mt-1">{continueReadingBook.title}</h3>
                          <p className="text-muted-foreground font-semibold text-lg">{continueReadingBook.authorName}</p>
                        </div>
                        <div className="mt-6">
                           <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-muted-foreground font-medium">Progres Baca</span>
                                <span className="font-bold text-primary">75%</span>
                           </div>
                           <Progress value={75} className="h-3"/>
                           <Button asChild className="btn-primary w-full md:w-auto mt-6 rounded-xl px-8 h-12 text-base">
                               <Link href={`/read/${continueReadingBook.id}`}>Lanjutkan</Link>
                           </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className={cn(continueReadingBook && "mt-16")}>
                 <h2 className="font-headline text-2xl font-bold mb-6">Koleksi Tersimpan</h2>
                 <Tabs defaultValue="semua" className="w-full">
                    <TabsList className="bg-muted/50 p-1.5 rounded-full h-auto mb-8">
                      <TabsTrigger value="semua" className="rounded-full px-6 py-2 text-sm font-bold transition-all">Semua</TabsTrigger>
                      <TabsTrigger value="buku" className="rounded-full px-6 py-2 text-sm font-bold transition-all flex items-center gap-2"><BookOpen className="h-4 w-4"/>Buku</TabsTrigger>
                      <TabsTrigger value="puisi" className="rounded-full px-6 py-2 text-sm font-bold transition-all flex items-center gap-2"><Feather className="h-4 w-4"/>Puisi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="semua">
                      {renderBookGrid(savedBooks)}
                    </TabsContent>
                    <TabsContent value="buku">
                      {renderBookGrid(savedBooks.filter(b => b.type === 'book'))}
                    </TabsContent>
                    <TabsContent value="puisi">
                      {renderBookGrid(savedBooks.filter(b => b.type === 'poem'))}
                    </TabsContent>
                  </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
