
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Book, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function StudioView() {
    const { isLoggedIn, books, setModalBookId } = useAppContext();
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
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="font-headline text-4xl md:text-5xl font-bold">My Writing Studio</h1>
                        <p className="text-muted-foreground mt-2">Create and manage your literary works.</p>
                    </div>
                    <Button asChild className="btn-primary rounded-xl">
                        <Link href="/studio/editor/new">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create New Book
                        </Link>
                    </Button>
                </div>

                {myBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {myBooks.map(book => (
                            <div key={book.id} className="group">
                                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg relative bg-bg-alt cursor-pointer" onClick={() => setModalBookId(book.id)}>
                                     <Image
                                        src={book.coverImage.src}
                                        alt={`Cover of ${book.title}`}
                                        width={book.coverImage.width}
                                        height={book.coverImage.height}
                                        data-ai-hint={book.coverImage.hint}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                                        <h3 className="font-headline text-white text-lg font-bold truncate">{book.title}</h3>
                                        <p className="text-white/80 text-sm">{book.author}</p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="w-full mt-2 rounded-lg">
                                    <Link href={`/studio/editor/${book.id}`}>Edit</Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-bg-alt rounded-2xl p-20 border border-dashed">
                        <Book className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1} />
                        <h2 className="text-xl font-bold text-foreground">Your studio is empty</h2>
                        <p className="text-muted-foreground mt-2 mb-6">Start your writing journey by creating your first book.</p>
                        <Button asChild className="btn-primary rounded-xl">
                            <Link href="/studio/editor/new">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create First Book
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
