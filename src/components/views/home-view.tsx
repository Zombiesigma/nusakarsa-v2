"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useAppContext } from "@/context/app-context";
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Book, Library } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookCard } from '../common/book-card';

const ParallaxHeroBooks = () => {
    const heroMainImg = PlaceHolderImages.find(p => p.id === 'hero-main')!;
    const heroSide1Img = PlaceHolderImages.find(p => p.id === 'hero-side1')!;
    const heroSide2Img = PlaceHolderImages.find(p => p.id === 'hero-side2')!;

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

export function HomeView() {
    const { setActivePage, books } = useAppContext();
    const trendingBooks = books.filter(b => b.trending).slice(0, 4);
    const currentlyReadingImg = PlaceHolderImages.find(p => p.id === 'currently-reading-cover')!;

    return (
        <section id="page-home" className="page-section">
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
                                <button className="btn-primary px-8 py-4" onClick={() => setActivePage('explore')}>
                                    Mulai Membaca
                                </button>
                                <button className="btn-secondary px-8 py-4 flex items-center justify-center gap-2" onClick={() => setActivePage('library')}>
                                    <Library className="w-5 h-5" />
                                    Pustaka Saya
                                </button>
                            </div>
                        </div>
                        <ParallaxHeroBooks />
                    </div>
                </div>
            </div>

            <div className="py-12 bg-bg-alt">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <RevealWrapper>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="rounded-3xl p-6 text-white relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, oklch(from hsl(var(--primary)) l-0.1 h c) 100%)' }}>
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white/70 text-sm font-medium">Reading Streak</span>
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <span className="text-5xl font-bold transition-transform group-hover:scale-110 inline-block">14</span>
                                        <span className="text-white/70 mb-2">hari berturut</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-3xl p-6 hover:border-accent/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-muted-foreground text-sm font-medium">Sedang Dibaca</span>
                                    <span className="text-accent text-sm font-semibold">3 buku</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Image data-ai-hint={currentlyReadingImg.hint} src={currentlyReadingImg.src} alt="Currently reading book cover" width={currentlyReadingImg.width} height={currentlyReadingImg.height} className="w-16 h-24 rounded-lg flex-shrink-0 object-cover shadow-md" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-headline font-bold truncate">Laskar Pelangi</h4>
                                        <p className="text-muted-foreground text-sm">Andrea Hirata</p>
                                        <div className="mt-2">
                                            <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                                <div className="h-full bg-accent rounded-full" style={{ width: "44%" }}></div>
                                            </div>
                                            <span className="text-xs text-muted-foreground mt-1">44% selesai</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-3xl p-6 hover:border-gold/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-muted-foreground text-sm font-medium">Target 2025</span>
                                    <span className="text-gold text-sm font-semibold">24 buku</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="relative w-20 h-20">
                                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                            <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--border))" strokeWidth="6"/>
                                            <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--gold))" strokeWidth="6" strokeDasharray="220" strokeDashoffset="77" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xl font-bold">65%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-medium">16 dari 24 buku</p>
                                        <p className="text-muted-foreground text-sm">8 buku lagi!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealWrapper>
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
                            <Button variant="outline" className="hidden md:flex rounded-full text-sm font-semibold" onClick={() => setActivePage('explore')}>
                                Lihat Semua
                            </Button>
                        </div>
                    </RevealWrapper>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {trendingBooks.map((book, i) => (
                           <RevealWrapper key={book.id} delay={`${i * 0.1}s`}>
                                <BookCard bookId={book.id} />
                           </RevealWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
