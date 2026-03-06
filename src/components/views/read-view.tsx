'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ReadView({ bookId }: { bookId: string }) {
    const { isLoggedIn, books } = useAppContext();
    const router = useRouter();
    const id = parseInt(bookId);
    const book = books.find(b => b.id === id);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        } else if (!book) {
            router.push('/');
        }
    }, [isLoggedIn, book, router]);

    if (!isLoggedIn || !book) {
        // While redirecting or if book not found
        return null;
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
                        <p className="text-muted-foreground mt-2 text-lg">oleh {book.author}</p>
                    </header>

                    <ScrollArea className="h-[60vh] pr-4 -mr-4">
                        <div className="text-lg leading-relaxed text-foreground/90">
                           {book.content ? (
                                <p style={{ whiteSpace: 'pre-wrap' }}>{book.content}</p>
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
