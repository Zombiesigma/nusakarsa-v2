
"use client";

import Link from "next/link";
import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { BookCard } from "../common/book-card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LibraryView() {
    const { isLoggedIn, bookmarkedBooks, books } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return (
            <section id="page-library" className="page-section pt-28 md:pt-36">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
                    <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                        <LogIn className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1}/>
                        <h1 className="font-headline text-3xl font-bold mb-4">Pustaka Pribadi Anda</h1>
                        <p className="text-muted-foreground mb-8">
                            Anda harus masuk untuk melihat pustaka pribadi Anda.
                        </p>
                        <Button asChild className="btn-primary w-full max-w-xs mx-auto py-3 rounded-xl font-semibold">
                            <Link href="/login">
                                Masuk / Daftar
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        );
    }
    
    const savedBooks = books.filter(book => bookmarkedBooks.has(book.id));

    return (
        <section id="page-library" className="page-section pt-28 md:pt-36">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Pustaka Saya</h1>
                    <p className="text-muted-foreground">Buku yang Anda simpan akan muncul di sini.</p>
                </div>

                {savedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {savedBooks.map(book => (
                            <BookCard key={book.id} bookId={book.id} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-bg-alt rounded-2xl p-12">
                        <p className="text-muted-foreground">Anda belum menyimpan buku apapun.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
