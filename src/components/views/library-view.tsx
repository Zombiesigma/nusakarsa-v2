"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Book } from '@/lib/data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Library as LibraryIcon, ChevronRight } from 'lucide-react';

type LibraryTab = 'reading' | 'bookmarks' | 'finished';

export function LibraryView() {
    const { books, bookmarkedBooks, setModalBookId, setActivePage } = useAppContext();
    const [activeTab, setActiveTab] = useState<LibraryTab>('reading');

    let items: Book[] = [];
    if (activeTab === 'reading') items = books.filter(b => b.progress > 0 && b.progress < 100);
    else if (activeTab === 'bookmarks') items = books.filter(b => bookmarkedBooks.has(b.id));
    else if (activeTab === 'finished') items = books.filter(b => b.progress === 100);
    
    return (
        <section id="page-library" className="page-section pt-28 md:pt-36">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="mb-8">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2">Pustaka Saya</h1>
                    <p className="text-muted-foreground">Kelola koleksi dan riwayat bacaanmu</p>
                </div>

                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    <TabButton label="Sedang Dibaca" tab="reading" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="Tersimpan" tab="bookmarks" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="Selesai" tab="finished" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="space-y-3">
                    {items.length > 0 ? (
                        items.map(book => (
                            <div key={book.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl cursor-pointer hover:border-accent/30 transition-all" onClick={() => setModalBookId(book.id)}>
                                <Image src={book.coverImage.src} alt={book.title} width={64} height={96} data-ai-hint={book.coverImage.hint} className="w-16 h-24 rounded-lg flex-shrink-0 shadow-md object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-headline font-bold text-lg truncate">{book.title}</h3>
                                    <p className="text-muted-foreground text-sm">{book.author}</p>
                                    {book.progress > 0 && book.progress < 100 && (
                                        <div className="mt-2">
                                            <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                                <div className="h-full bg-accent rounded-full" style={{ width: `${book.progress}%` }}></div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{book.progress}% selesai</span>
                                        </div>
                                    )}
                                    {book.progress === 100 && <span className="text-xs text-teal font-medium mt-1 block">Selesai dibaca</span>}
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <LibraryIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" strokeWidth={1}/>
                            <p className="text-muted-foreground">Belum ada buku di kategori ini</p>
                            <Button className="btn-primary px-6 py-2.5 rounded-full mt-6" onClick={() => setActivePage('explore')}>Jelajahi Buku</Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

const TabButton = ({ label, tab, activeTab, setActiveTab }: { label: string, tab: LibraryTab, activeTab: LibraryTab, setActiveTab: (t: LibraryTab) => void }) => {
    const isActive = activeTab === tab;
    return (
        <button
            className={cn(
                "px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "bg-bg-alt border border-border hover:bg-primary/10"
            )}
            onClick={() => setActiveTab(tab)}
        >
            {label}
        </button>
    )
}
