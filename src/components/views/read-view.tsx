
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Chapter } from '@/lib/types';
import { useFirestore } from '@/firebase';

export function ReadView({ bookId }: { bookId: string }) {
    const { isLoggedIn, books } = useAppContext();
    const router = useRouter();
    const firestore = useFirestore();
    const book = books.find(b => b.id === bookId);

    const chaptersQuery = useMemo(() => 
        (firestore && bookId) ? query(collection(firestore, 'books', bookId, 'chapters'), orderBy('order', 'asc')) : null
    , [firestore, bookId]);
    
    const { data: chapters, loading: chaptersLoading } = useCollection(chaptersQuery);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        } else if (!book && books.length > 0) { // check books are loaded
             // Wait for books to load, then redirect if still not found
             setTimeout(() => {
                const updatedBook = books.find(b => b.id === bookId);
                if (!updatedBook) {
                    router.push('/');
                }
            }, 1000);
        }
    }, [isLoggedIn, book, router, bookId, books]);

    if (!isLoggedIn || !book) {
        return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    
    if (book.status !== 'published') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center text-center p-6">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h2 className="text-2xl font-bold font-headline">Karya Belum Terbit</h2>
                <p className="text-muted-foreground mt-2 max-w-sm">Konten untuk buku ini belum dipublikasikan dan tidak dapat dibaca saat ini.</p>
                <Button variant="ghost" asChild className="mt-6">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Beranda
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <section id="page-read" className="page-section pt-24 md:pt-28">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="flex justify-between items-center mb-6">
                    <Button variant="ghost" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>
                
                <div className="bg-card p-6 sm:p-8 md:p-12 rounded-2xl border border-border shadow-sm">
                    <header className="text-center mb-8 border-b border-border pb-8">
                        <h1 className="font-headline text-3xl md:text-4xl font-bold">{book.title}</h1>
                        <p className="text-muted-foreground mt-2 text-lg">oleh {book.authorName}</p>
                    </header>

                    <ScrollArea className="h-[60vh] pr-4 -mr-4">
                        <div className="text-lg leading-relaxed text-foreground/90 prose dark:prose-invert max-w-none">
                           {chaptersLoading ? (
                                <div className="flex items-center justify-center pt-16">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                           ) : chapters && chapters.length > 0 ? (
                                <div className="space-y-8">
                                    {(chapters as Chapter[]).map(chapter => (
                                        <article key={chapter.id}>
                                            <h2 className="font-headline text-2xl font-bold mb-4 text-center">{chapter.title}</h2>
                                            <p style={{ whiteSpace: 'pre-wrap' }}>{chapter.content}</p>
                                        </article>
                                    ))}
                                </div>
                           ) : (
                                <div className="text-center flex flex-col items-center justify-center h-full pt-16">
                                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground">Konten untuk buku ini belum tersedia.</p>
                                </div>
                           )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </section>
    );
}
