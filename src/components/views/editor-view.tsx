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
        <section id="page-editor" className="page-section bg-bg-alt min-h-screen">
            <EditorHeader />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-28 md:pt-32">
                <form noValidate>
                    <div className="space-y-10">
                        <div>
                           <Input 
                                id="title" 
                                {...register('title')} 
                                className="w-full text-3xl md:text-4xl font-bold font-headline h-auto p-2 bg-transparent border-none rounded-none focus:ring-0 focus:border-primary !px-0 shadow-none"
                                placeholder="Judul Mahakaryamu"
                            />
                            {errors.title && <p className="text-destructive text-sm mt-2">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card border rounded-2xl">
                           <div>
                                <Label htmlFor="author" className="font-semibold">Penulis</Label>
                                <Input 
                                    id="author" 
                                    {...register('author')} 
                                    className="mt-2"
                                />
                                {errors.author && <p className="text-destructive text-sm mt-1">{errors.author.message}</p>}
                           </div>
                           <div>
                                <Label htmlFor="category" className="font-semibold">Kategori</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="mt-2">
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
                                {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
                            </div>
                        </div>

                        <div>
                            <Textarea
                                id="content"
                                {...register('content')}
                                className="min-h-[60vh] text-lg leading-relaxed p-4 md:p-6 bg-card border rounded-2xl focus-visible:ring-primary"
                                placeholder="Mulai tulis ceritamu di sini..."
                            />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
