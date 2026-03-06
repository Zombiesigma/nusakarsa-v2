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
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const bookSchema = z.object({
  title: z.string().min(3, "Judul harus memiliki setidaknya 3 karakter."),
  author: z.string().min(3, "Nama penulis harus memiliki setidaknya 3 karakter."),
  category: z.enum(["Novel", "Non-Fiksi", "Sastra", "Custom"]),
  content: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

export function EditorView({ bookId }: { bookId: string }) {
    const { isLoggedIn, books, addBook, updateBook } = useAppContext();
    const router = useRouter();
    const { toast } = useToast();
    const [isNew, setIsNew] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book | undefined>(undefined);

    const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<BookFormData>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: '',
            author: '',
            category: 'Custom',
            content: '',
        }
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
                toast({ variant: 'destructive', title: "Error", description: "Buku tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya." });
                router.push('/studio');
            }
        }
    }, [isLoggedIn, router, bookId, books, reset, toast]);

    const onSubmit = (data: BookFormData) => {
        setIsSaving(true);
        try {
            // Simulate network delay
            setTimeout(() => {
                if (isNew) {
                    addBook({
                        ...data,
                        year: new Date().getFullYear(),
                        pages: 0, 
                        isUserCreated: true,
                        content: data.content || '',
                    });
                    toast({ title: "Buku Dibuat!", description: `'${data.title}' telah ditambahkan ke studio Anda.` });
                } else if (currentBook) {
                    updateBook({
                        ...currentBook,
                        ...data,
                    });
                    toast({ title: "Buku Disimpan!", description: `'${data.title}' telah diperbarui.` });
                }
                router.push('/studio');
            }, 1000);
        } catch (error) {
            console.error("Failed to save book:", error);
            toast({ variant: 'destructive', title: "Error", description: "Tidak dapat menyimpan buku." });
            setIsSaving(false);
        }
    };

    if (!isLoggedIn) {
        return null;
    }
    
    const EditorHeader = () => (
        <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                     <Button variant="ghost" asChild>
                        <Link href="/studio">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Studio
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                         <span className={cn("text-sm text-muted-foreground transition-opacity", isDirty && !isSaving ? 'opacity-100' : 'opacity-0')}>
                            Perubahan belum disimpan
                         </span>
                         <Button onClick={handleSubmit(onSubmit)} className="btn-primary rounded-xl" disabled={isSaving || !isDirty}>
                            {isSaving ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-5 w-5" />
                            )}
                            {isSaving ? 'Menyimpan...' : (isNew ? 'Terbitkan' : 'Simpan')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section id="page-editor" className="page-section bg-card">
            <EditorHeader />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-28 md:pt-32">
                <form noValidate className="space-y-12">
                    <div>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="Judul Mahakaryamu..."
                            className="h-auto w-full border-0 bg-transparent p-0 text-3xl font-bold font-headline !ring-0 focus-visible:!ring-0 md:text-5xl"
                        />
                        {errors.title && <p className="mt-2 text-sm text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="flex flex-col gap-6 border-y border-border py-6 md:flex-row md:gap-8">
                        <div className="grid flex-1 gap-1.5">
                            <Label htmlFor="author" className="text-muted-foreground">
                                Penulis
                            </Label>
                            <Input
                                id="author"
                                {...register('author')}
                                className="w-full border-0 bg-transparent p-0 font-semibold !ring-0 focus-visible:!ring-0"
                            />
                            {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
                        </div>
                        <div className="grid flex-1 gap-1.5">
                            <Label htmlFor="category" className="text-muted-foreground">
                                Kategori
                            </Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full border-0 bg-transparent p-0 font-semibold !ring-0 focus:!ring-0">
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Novel">Novel</SelectItem>
                                            <SelectItem value="Non-Fiksi">Non-Fiksi</SelectItem>
                                            <SelectItem value="Sastra">Sastra</SelectItem>
                                            <SelectItem value="Custom">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Textarea
                            id="content"
                            {...register('content')}
                            className="min-h-[60vh] w-full resize-none border-none bg-transparent p-0 text-lg leading-relaxed !ring-0 focus-visible:!ring-0"
                            placeholder="Mulai tulis ceritamu di sini..."
                        />
                    </div>
                </form>
            </div>
        </section>
    );
}
