import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Layers, Heart, CheckCircle2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href={`/books/${book.id}`} className="group block h-full">
      <Card className="overflow-hidden transition-all duration-500 active:scale-95 border-none shadow-sm hover:shadow-2xl rounded-[2rem] h-full flex flex-col bg-card relative">
        <div className="aspect-[2/3] relative overflow-hidden">
          <Image
            src={book.coverUrl}
            alt={`Sampul ${book.title}`}
            fill
            className="object-cover bg-muted transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {book.isCompleted && (
                <div className="bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg border border-emerald-400/30">
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                    <span className="text-[7px] font-black text-white uppercase tracking-widest">Tamat</span>
                </div>
            )}
            {book.viewCount > 1000 && (
                <div className="bg-orange-500/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg border border-orange-400/30">
                    <Star className="h-2.5 w-2.5 text-white fill-current" />
                    <span className="text-[7px] font-black text-white uppercase tracking-widest">Hot</span>
                </div>
            )}
          </div>

          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-xl px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-xl">
             <Heart className="h-3 w-3 text-rose-500 fill-current" />
             <span className="text-[9px] font-black text-white">{isMounted ? new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(book.favoriteCount) : '...'}</span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <CardContent className="p-5 flex flex-col flex-grow space-y-4">
          <h3 className="font-headline text-[15px] font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 italic">
            {book.title}
          </h3>
          
          <div className="flex items-center gap-2.5">
            <div className="relative">
                <Avatar className="h-6 w-6 ring-2 ring-background shadow-md">
                  <AvatarImage src={book.authorAvatarUrl} alt={book.authorName} className="object-cover" />
                  <AvatarFallback className="text-[8px] font-black bg-primary/5 text-primary">{book.authorName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-primary rounded-full border border-background shadow-sm" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-tighter">{book.authorName}</p>
          </div>
          
          <div className="flex items-center justify-between gap-3 text-[9px] font-black text-muted-foreground/40 mt-auto pt-3 border-t border-border/30 uppercase tracking-[0.15em]">
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span>{isMounted ? new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(book.viewCount) : '...'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>{isMounted ? book.chapterCount ?? 0 : '...'} Bab</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
