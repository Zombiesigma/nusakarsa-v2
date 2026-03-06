"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from "@/context/app-context";
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BookCard } from '../common/book-card';
import type { Book as BookType } from '@/lib/data';

// Logged-out view
const ParallaxHeroBooks = () => {
    useEffect(() => {
        const hero = document.getElementById('heroSection');
        if (!hero) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const books = document.querySelectorAll('.book-parallax') as NodeListOf<HTMLElement>;
            books.forEach(book => {
                const depth = parseFloat(book.dataset.depth || '0.1');
                const moveX = x * depth;
                const moveY = y * depth;
                book.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        };

        hero.addEventListener('mousemove', handleMouseMove);
        return () => hero.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative h-[450px] md:h-[550px] opacity-0 animate-fade-up [animation-delay:0.3s]">
            <div className="book-parallax absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 md:w-64 animate-float" data-depth="0.3">
                <BookCard bookId={1} isPriority />
            </div>
            <div className="book-parallax absolute top-8 left-0 w-36 md:w-44 animate-float-alt" data-depth="0.6">
                 <BookCard bookId={2} isPriority />
            </div>
            <div className="book-parallax absolute bottom-8 right-0 w-40 md:w-48 animate-float" data-depth="0.5">
                 <BookCard bookId={3} isPriority />
            </div>
        </div>
    );
};

const RevealWrapper = ({ children, delay }: { children: React.ReactNode, delay?: string }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div ref={ref} className={cn('reveal', inView && 'visible')} style={{ transitionDelay: delay }}>
            {children}
        </div>
    );
};


const LoggedOutHomeView = () => {
    const { books } = useAppContext();
    const featuredBooks = books.slice(0, 4);

    return (
        <>
            <div className="hero-bg relative pt-32 md:pt-40 pb-20 md:pb-32" id="heroSection">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <div className="opacity-0 animate-fade-up inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                <span className="text-primary font-semibold text-sm tracking-wide">12,500+ Buku Tersedia</span>
                            </div>
                            
                            <h1 className="opacity-0 animate-fade-up [animation-delay:0.1s] font-headline text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-8">
                                Membuka<br/><span className="italic text-accent">Semesta</span><br/>dalam Kata
                            </h1>
                            
                            <p className="opacity-0 animate-fade-up [animation-delay:0.2s] text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Platform ebook Indonesia dengan koleksi terlengkap. Dari sastra klasik hingga bestseller kontemporer.
                            </p>
                            
                            <div className="opacity-0 animate-fade-up [animation-delay:0.3s] flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button asChild className="btn-primary px-8 py-4">
                                    <Link href="/register">Mulai Sekarang, Gratis!</Link>
                                </Button>
                                <Button asChild variant="link" className="text-foreground">
                                    <Link href="/login">Sudah punya akun? Masuk</Link>
                                </Button>
                            </div>
                        </div>
                        <ParallaxHeroBooks />
                    </div>
                </div>
            </div>

            <div className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <RevealWrapper>
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <span className="text-primary font-semibold tracking-widest uppercase text-sm">Paling Diminati</span>
                                <h2 className="font-headline text-3xl md:text-5xl font-bold mt-2">Trending Minggu Ini</h2>
                            </div>
                            <Button asChild variant="outline" className="hidden md:flex rounded-full text-sm font-semibold">
                                <Link href="/explore">Lihat Semua</Link>
                            </Button>
                        </div>
                    </RevealWrapper>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {featuredBooks.map((book, i) => (
                           <RevealWrapper key={book.id} delay={`${i * 0.1}s`}>
                                <BookCard bookId={book.id} />
                           </RevealWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};


// Logged-in view
const ContinueReading = ({ books }: { books: BookType[] }) => {
    const booksWithProgress = books.filter(b => b.progress > 0 && b.progress < 100).slice(0, 3);

    if (booksWithProgress.length === 0) return null;

    return (
        <div>
            <h2 className="font-headline text-3xl font-bold mb-6">Lanjutkan Membaca</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {booksWithProgress.map(book => {
                    const img = book.coverImage;
                    return (
                        <div key={book.id} className="bg-card border border-border rounded-3xl p-6 hover:border-accent/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <Image data-ai-hint={img.hint} src={img.src} alt={book.title} width={64} height={96} className="w-16 h-24 rounded-lg flex-shrink-0 object-cover shadow-md" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-headline font-bold truncate">{book.title}</h4>
                                    <p className="text-muted-foreground text-sm">{book.author}</p>
                                    <div className="mt-2">
                                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-accent rounded-full" style={{ width: `${book.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">{book.progress}% selesai</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const LoggedInHomeView = () => {
    const { books } = useAppContext();
    const newReleaseBooks = books.filter(b => b.year >= new Date().getFullYear() - 5).slice(0, 5);
    const trendingBooks = books.filter(b => b.trending).slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-28 md:pt-36 space-y-16">
            <h1 className="font-headline text-5xl font-bold">Selamat Datang, Pengguna!</h1>
            <ContinueReading books={books} />

            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">Rilisan Terbaru</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {newReleaseBooks.map(book => (
                      <BookCard key={book.id} bookId={book.id} />
                  ))}
              </div>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">Trending</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {trendingBooks.map(book => (
                      <BookCard key={book.id} bookId={book.id} />
                  ))}
              </div>
            </div>
        </div>
    );
};

export function HomeView() {
    const { isLoggedIn } = useAppContext();
    
    return (
        <section id="page-home" className="page-section">
            {isLoggedIn ? <LoggedInHomeView /> : <LoggedOutHomeView />}
        </section>
    );
}
