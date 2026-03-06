
"use client";

import Image from 'next/image';
import { useAppContext } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';
import type { Book } from '@/lib/types';

interface BookCardProps {
  bookId: string;
  className?: string;
  isPriority?: boolean;
}

export function BookCard({ bookId, className, isPriority = false }: BookCardProps) {
  const { books, setModalBookId, bookmarkedBooks } = useAppContext();
  const book = books.find(b => b.id === bookId);

  if (!book) return null;

  const isBookmarked = bookmarkedBooks.has(book.id);

  return (
    <div className={cn("book-card cursor-pointer group", className)} onClick={() => setModalBookId(book.id)}>
      <div className="book-3d">
        <div className="book-3d-inner">
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg relative">
            <Image
              priority={isPriority}
              src={book.coverUrl || `https://picsum.photos/seed/${book.id}/600/800`}
              alt={`Cover of ${book.title}`}
              fill
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="book-shine"></div>
            {isBookmarked && (
              <div className="absolute top-3 right-3 w-7 h-7 bg-gold rounded-full flex items-center justify-center z-20 shadow-lg">
                <Bookmark className="w-4 h-4 text-white" fill="white"/>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-white/70 text-[10px] uppercase tracking-widest">{book.genre}</span>
              <h3 className="font-headline text-white text-base md:text-lg font-bold truncate">{book.title}</h3>
              <p className="text-white/80 text-sm">{book.authorName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
