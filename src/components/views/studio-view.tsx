'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Feather, PlusCircle, Pencil } from 'lucide-react';
import Image from 'next/image';

export function StudioView() {
    const { isLoggedIn, books } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    const myBooks = books.filter(book => book.isUserCreated);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <section id="page-studio" className="page-section pt-28 md:pt-36">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="font-headline text-4xl md:text-5xl font-bold">Studio Penulis</h1>
                        <p className="text-muted-foreground mt-2">Ciptakan dan kelola mahakaryamu.</p>
                    </div>
                    <Button asChild size="lg" className="btn-primary rounded-xl self-start md:self-auto">
                        <Link href="/studio/editor/new">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Buat Buku Baru
                        </Link>
                    </Button>
                </div>

                {myBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {myBooks.map(book => (
                            <Link key={book.id} href={`/studio/editor/${book.id}`} className="group block studio-book-card">
                                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg relative bg-bg-alt transition-all duration-300 group-hover:shadow-primary/20 group-hover:shadow-2xl group-hover:-translate-y-2">
                                     <Image
                                        src={book.coverImage.src}
                                        alt={`Cover of ${book.title}`}
                                        width={book.coverImage.width}
                                        height={book.coverImage.height}
                                        data-ai-hint={book.coverImage.hint}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    
                                    <div className="absolute inset-0 bg-primary/0 hover:bg-black/50 transition-colors duration-300 flex items-center justify-center p-4">
                                        <div className="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-90">
                                            <Pencil className="w-8 h-8 mx-auto mb-2" />
                                            <span className="font-semibold">Edit Buku</span>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transition-transform duration-300 group-hover:translate-y-16">
                                        <h3 className="font-headline text-white text-lg font-bold truncate">{book.title}</h3>
                                        <p className="text-white/80 text-sm truncate">{book.author}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-card rounded-3xl p-12 md:p-20 border border-border shadow-sm max-w-3xl mx-auto">
                        <Feather className="w-20 h-20 mx-auto text-primary/40 mb-6" strokeWidth={1.5} />
                        <h2 className="text-3xl font-headline font-bold text-foreground">Mulai Karya Pertamamu</h2>
                        <p className="text-muted-foreground mt-2 mb-8 max-w-md mx-auto">Studio menanti. Klik tombol di bawah untuk mulai menulis dan mengubah ide menjadi cerita.</p>
                        <Button asChild size="lg" className="btn-primary rounded-xl px-8">
                            <Link href="/studio/editor/new">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Buat Buku Baru
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
