
"use client";

import Link from 'next/link';
import { useAppContext } from "@/context/app-context";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Star, Share2, Bookmark, BookOpen, Calendar, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookModal() {
  const { modalBookId, setModalBookId, books, bookmarkedBooks, toggleBookmark, isLoggedIn } = useAppContext();
  const book = books.find(b => b.id === modalBookId);

  if (!book) return null;

  const isBookmarked = bookmarkedBooks.has(book.id);

  const getYear = () => {
    if (book.createdAt && typeof book.createdAt.toDate === 'function') {
      return book.createdAt.toDate().getFullYear();
    }
    return new Date().getFullYear();
  }

  return (
    <Dialog open={modalBookId !== null} onOpenChange={(isOpen) => !isOpen && setModalBookId(null)}>
      <DialogContent className="p-0 max-w-lg w-[90vw] border-none bg-transparent shadow-2xl">
        <DialogTitle className="sr-only">{`Detail untuk buku ${book.title}`}</DialogTitle>
        <div className="bg-card rounded-3xl overflow-hidden">
          <div className="aspect-[4/3] md:aspect-[2/1] relative">
            <Image 
              src={book.coverUrl || `https://picsum.photos/seed/${book.id}/800/400`}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">{book.genre}</span>
              <h2 className="font-headline text-white text-2xl md:text-3xl font-bold mt-2">{book.title}</h2>
              <p className="text-white/80 text-lg">{book.authorName}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 md:gap-6 mb-6 text-sm overflow-x-auto no-scrollbar pb-2">
              <div className="flex items-center gap-1.5 shrink-0"><Star className="w-5 h-5 text-gold" fill="hsl(var(--gold))" /><span className="font-semibold">{book.favoriteCount}</span></div>
              <div className="w-px h-5 bg-border shrink-0"></div>
              <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground"><BookOpen className="w-5 h-5" /><span>{book.chapterCount} Bab</span></div>
              <div className="w-px h-5 bg-border shrink-0"></div>
              <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground"><Calendar className="w-5 h-5" /><span>{getYear()}</span></div>
            </div>
            <div className="flex items-center justify-between mb-6 p-4 bg-bg-alt rounded-xl">
              <div>
                <span className="text-2xl font-bold text-accent flex items-center gap-2">
                  <Eye className="w-6 h-6" />
                  {book.viewCount}
                </span>
                <span className="text-muted-foreground text-sm block">pembaca</span>
              </div>
              {isLoggedIn ? (
                  <Button asChild className="btn-primary px-6 py-3 rounded-xl font-semibold">
                      <Link href={`/read/${book.id}`}>Mulai Membaca</Link>
                  </Button>
              ) : (
                  <Button asChild className="btn-primary px-6 py-3 rounded-xl font-semibold">
                      <Link href="/login">Login untuk Membaca</Link>
                  </Button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleBookmark(book.id)}
                className={cn(
                  "btn-secondary flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2",
                  isBookmarked && 'border-gold text-gold'
                )}
                disabled={!isLoggedIn}
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
