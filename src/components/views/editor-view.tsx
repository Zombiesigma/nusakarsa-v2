
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAppContext } from '@/context/app-context';
import type { Book } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const bookSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  author: z.string().min(3, "Author name must be at least 3 characters."),
  category: z.enum(["Novel", "Non-Fiksi", "Sastra", "Custom"]),
  content: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

export function EditorView({ bookId }: { bookId: string }) {
    const { isLoggedIn, books, addBook, updateBook } = useAppContext();
    const router = useRouter();
    const { toast } = useToast();
    const [isNew, setIsNew] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book | undefined>(undefined);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<BookFormData>({
        resolver: zodResolver(bookSchema)
    });

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        if (bookId === 'new') {
            setIsNew(true);
            reset({ title: '', author: 'Pengguna Demo', category: 'Custom', content: '' });
        } else {
            const id = parseInt(bookId);
            const bookToEdit = books.find(b => b.id === id);
            if (bookToEdit && bookToEdit.isUserCreated) {
                setCurrentBook(bookToEdit);
                reset(bookToEdit);
            } else {
                // Book not found or not editable, redirect
                toast({ variant: 'destructive', title: "Error", description: "Book not found or you don't have permission to edit it." });
                router.push('/studio');
            }
        }
    }, [isLoggedIn, router, bookId, books, reset, toast]);

    const onSubmit = (data: BookFormData) => {
        try {
            if (isNew) {
                addBook({
                    ...data,
                    year: new Date().getFullYear(),
                    pages: 0, 
                    isUserCreated: true,
                    content: data.content || '',
                });
                toast({ title: "Book Created!", description: `'${data.title}' has been added to your studio.` });
            } else if (currentBook) {
                updateBook({
                    ...currentBook,
                    ...data,
                });
                toast({ title: "Book Saved!", description: `'${data.title}' has been updated.` });
            }
            router.push('/studio');
        } catch (error) {
            console.error("Failed to save book:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not save the book." });
        }
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <section id="page-editor" className="page-section pt-28 md:pt-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-between items-center mb-8">
                        <Button variant="ghost" asChild>
                            <Link href="/studio">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Studio
                            </Link>
                        </Button>
                        <h1 className="font-headline text-3xl font-bold">
                            {isNew ? 'Create New Book' : 'Edit Book'}
                        </h1>
                        <Button type="submit" className="btn-primary rounded-xl">
                            <Save className="mr-2 h-5 w-5" />
                            {isNew ? 'Create Book' : 'Save Changes'}
                        </Button>
                    </div>
                    
                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" {...register('title')} className="mt-1" />
                                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" {...register('author')} className="mt-1" />
                                {errors.author && <p className="text-destructive text-sm mt-1">{errors.author.message}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Novel">Novel</SelectItem>
                                            <SelectItem value="Non-Fiksi">Non-Fiksi</SelectItem>
                                            <SelectItem value="Sastra">Sastra</SelectItem>
                                            <SelectItem value="Custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                {...register('content')}
                                className="mt-1 min-h-[50vh]"
                                placeholder="Start writing your masterpiece..."
                            />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
