"use client";

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from "@/context/app-context";
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BookCard } from '../common/book-card';
import type { Book } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import ScrollVelocity from '@/components/effects/scroll-velocity';

const ParallaxHeroBooks = () => {
    const { books, loading } = useAppContext();

    const heroBooks = useMemo(() => {
        return books.filter(b => b.status === 'published').slice(0, 5);
    }, [books]);

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

    if (loading && heroBooks.length === 0) {
        return (
            <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (heroBooks.length === 0) return null;

    return (
        <div className="relative h-[500px] md:h-[600px] opacity-0 animate-fade-up [animation-delay:0.3s]">
             {/* Book 1 - Centerpiece */}
            {heroBooks[0] && (
                <div className="book-parallax absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 md:w-60 animate-float z-20" style={{animationDelay: '0.2s'}} data-depth="0.1">
                    <BookCard bookId={heroBooks[0].id} isPriority />
                </div>
            )}
            {/* Book 2 - Top Left */}
            {heroBooks[1] && (
                <div className="book-parallax absolute top-0 left-[15%] w-36 md:w-40 animate-float-alt z-10" data-depth="0.4">
                    <BookCard bookId={heroBooks[1].id} isPriority />
                </div>
            )}
             {/* Book 3 - Bottom Right */}
            {heroBooks[2] && (
                <div className="book-parallax absolute bottom-0 right-[15%] w-40 md:w-48 animate-float z-10" style={{animationDelay: '0.5s'}} data-depth="0.5">
                    <BookCard bookId={heroBooks[2].id} isPriority />
                </div>
            )}
            {/* Book 4 - Top Right */}
            {heroBooks[3] && (
                <div className="book-parallax absolute top-12 right-0 w-32 md:w-36 animate-float-alt z-0 opacity-80" data-depth="0.7">
                    <BookCard bookId={heroBooks[3].id} />
                </div>
            )}
            {/* Book 5 - Bottom Left */}
            {heroBooks[4] && (
                <div className="book-parallax absolute bottom-12 left-0 w-32 md:w-36 animate-float z-0 opacity-80" style={{animationDelay: '0.3s'}} data-depth="0.6">
                    <BookCard bookId={heroBooks[4].id} />
                </div>
            )}
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
    
    const featuredBooks = useMemo(() => {
        return books
            .filter(b => b.status === 'published')
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 4);
    }, [books]);

    return (
        <>
            <div className="hero-bg relative pt-32 md:pt-40 pb-20 md:pb-32" id="heroSection">
                <div className="px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <div className="opacity-0 animate-fade-up inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                <span className="text-primary font-semibold text-sm tracking-wide">{books.filter(b => b.status === 'published').length}+ Karya Terbit</span>
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

            <div className="py-16 md:py-24 space-y-16">
                 <ScrollVelocity 
                    texts={['Jelajahi Dunia Literasi', 'Karya Tulis Berkualitas', 'Baca Kapan Saja & Dimana Saja']}
                    velocity={25}
                    className="font-headline italic text-foreground/10"
                />

                <div className="px-4 sm:px-6 lg:px-8">
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

const LoggedInHomeView = () => {
    const { books, user } = useAppContext();

    const newReleaseBooks = useMemo(() => {
        return books
            .filter(b => b.status === 'published')
            .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
            .slice(0, 5);
    }, [books]);
    
    const trendingBooks = useMemo(() => {
        return books
            .filter(b => b.status === 'published')
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 5);
    }, [books]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-24 pt-28 md:pt-36 space-y-16">
            <h1 className="font-headline text-5xl font-bold">Selamat Datang, {user?.displayName || 'Kawan'}!</h1>
            
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
