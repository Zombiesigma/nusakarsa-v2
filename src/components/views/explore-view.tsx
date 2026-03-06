"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Category } from '@/lib/data';
import { BookCard } from '../common/book-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const CategoryPill = ({ category, activeCategory, setCategory }: { category: Category, activeCategory: Category, setCategory: (c: Category) => void }) => {
    const isActive = category === activeCategory;
    return (
        <button 
            className={cn(
                "relative px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 overflow-hidden",
                isActive 
                    ? "border-accent text-white" 
                    : "border-border bg-bg-alt text-muted-foreground hover:border-accent"
            )}
            onClick={() => setCategory(category)}
        >
            <span className="relative z-10">{category}</span>
            <span className={cn(
                "absolute inset-0 bg-accent transition-transform duration-300 origin-left z-0",
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            )}></span>
        </button>
    )
}

export function ExploreView() {
    const { books, categories } = useAppContext();
    const [activeCategory, setActiveCategory] = useState<Category>('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBooks = books.filter(book => {
        const matchesCategory = activeCategory === 'Semua' || book.category === activeCategory;
        const matchesSearch = searchQuery === '' || 
                              book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="page-explore" className="page-section pt-28 md:pt-36">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Jelajahi Koleksi</h1>
                    <p className="text-muted-foreground">Temukan buku favoritmu dari ribuan judul pilihan</p>
                </div>

                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari judul, penulis, atau genre..."
                            className="search-input w-full pl-12 pr-4 py-7 rounded-2xl text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={cn(
                                "relative overflow-hidden group px-5 py-2 rounded-full text-sm font-medium border transition-colors",
                                activeCategory === cat
                                    ? "border-accent text-accent-foreground"
                                    : "bg-bg-alt border-border text-muted-foreground hover:border-accent hover:text-accent"
                            )}
                            onClick={() => setActiveCategory(cat)}
                        >
                            <span className="relative z-10">{cat}</span>
                            {activeCategory === cat && (
                                <span className="absolute inset-0 bg-accent z-0"></span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {filteredBooks.map(book => (
                        <BookCard key={book.id} bookId={book.id} />
                    ))}
                </div>
            </div>
        </section>
    );
}
