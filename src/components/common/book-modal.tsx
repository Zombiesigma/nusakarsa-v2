"use client";

import { useAppContext } from "@/context/app-context";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Star, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookModal() {
  const { modalBookId, setModalBookId, books, bookmarkedBooks, toggleBookmark } = useAppContext();
  const book = books.find(b => b.id === modalBookId);

  if (!book) return null;

  const isBookmarked = bookmarkedBooks.has(book.id);

  return (
    <Dialog open={modalBookId !== null} onOpenChange={(isOpen) => !isOpen && setModalBookId(null)}>
      <DialogContent className="p-0 max-w-lg w-[90vw] border-none bg-transparent shadow-2xl">
        <div className="bg-card rounded-3xl overflow-hidden">
          <div className="aspect-[4/3] md:aspect-[2/1] relative">
            <Image 
              src={book.coverImage.src} 
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              data-ai-hint={book.coverImage.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">{book.category}</span>
              <h2 className="font-headline text-white text-2xl md:text-3xl font-bold mt-2">{book.title}</h2>
              <p className="text-white/80 text-lg">{book.author}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 md:gap-6 mb-6 text-sm">
              <div className="flex items-center gap-1.5"><Star className="w-5 h-5 text-gold" fill="hsl(var(--gold))" /><span className="font-semibold">{book.rating}</span></div>
              <div className="w-px h-5 bg-border"></div>
              <div className="text-muted-foreground">{book.pages} halaman</div>
              <div className="w-px h-5 bg-border"></div>
              <div className="text-muted-foreground">{book.year}</div>
            </div>
            <div className="flex items-center justify-between mb-6 p-4 bg-bg-alt rounded-xl">
              <div>
                <span className="text-2xl font-bold text-accent">{book.readers}</span>
                <span className="text-muted-foreground text-sm block">pembaca</span>
              </div>
              <button className="btn-primary px-6 py-3 rounded-xl font-semibold">Mulai Baca</button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleBookmark(book.id)}
                className={cn(
                  "btn-secondary flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2",
                  isBookmarked && 'border-gold text-gold'
                )}
              >
                <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
                {isBookmarked ? 'Tersimpan' : 'Simpan'}
              </button>
              <button className="btn-secondary flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
