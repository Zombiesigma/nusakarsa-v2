
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/app-context';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2, BookUp, ImagePlus, Sparkles, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import Image from 'next/image';
import { uploadFile } from '@/lib/uploader';
import { aiBookSummary } from '@/ai/flows/ai-book-summary';

const bookCreationSchema = z.object({
  title: z.string().min(3, { message: 'Judul harus memiliki setidaknya 3 karakter.' }).max(100),
  synopsis: z.string().min(10, { message: 'Sinopsis harus memiliki setidaknya 10 karakter.' }).max(1500),
  genre: z.string().min(1, { message: 'Genre harus diisi.' }),
  type: z.enum(['book', 'poem'], { required_error: 'Tipe karya harus dipilih.' }),
  visibility: z.enum(['public', 'followers_only'], { required_error: 'Visibilitas harus dipilih.' }),
  coverImageFile: z.instanceof(File, { message: "Sampul buku diperlukan." }).refine(file => file.size < 5 * 1024 * 1024, 'Ukuran gambar maksimal 5MB.'),
});

export function NewBookView() {
  const router = useRouter();
  const { toast } = useToast();
  const { addBook, user } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Membuat karya...');
  const [preview, setPreview] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const form = useForm<z.infer<typeof bookCreationSchema>>({
    resolver: zodResolver(bookCreationSchema),
    defaultValues: {
      title: '',
      synopsis: '',
      genre: 'Fiksi',
      type: 'book',
      visibility: 'public',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue('coverImageFile', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const generateAiSummary = async () => {
      const title = form.getValues('title');
      if(!title) {
          toast({
              variant: 'destructive',
              title: 'Judul diperlukan',
              description: 'Harap masukkan judul buku sebelum menghasilkan sinopsis.',
          });
          return;
      }
      setIsAiLoading(true);
      try {
          const result = await aiBookSummary({
              title,
              author: user?.displayName || 'Author Tidak Dikenal',
          });
          form.setValue('synopsis', result.summary, { shouldValidate: true });
          toast({
              title: 'Sinopsis Dihasilkan AI',
              description: 'Sinopsis telah berhasil dibuat.',
          })
      } catch (error) {
          toast({
              variant: 'destructive',
              title: 'Gagal Menghasilkan Sinopsis',
              description: 'Terjadi kesalahan saat mencoba menghasilkan sinopsis.',
          });
      } finally {
          setIsAiLoading(false);
      }
  }

  const onSubmit = async (values: z.infer<typeof bookCreationSchema>) => {
    setIsLoading(true);
    
    try {
      setLoadingMessage('Mengunggah sampul...');
      const coverUrl = await uploadFile(values.coverImageFile, `covers/${user?.uid}/${values.title.replace(/\s+/g, '_')}`);
      
      setLoadingMessage('Membuat draf...');
      const newBookData = {
          title: values.title,
          synopsis: values.synopsis,
          genre: values.genre,
          type: values.type,
          visibility: values.visibility,
          coverUrl: coverUrl,
      };

      const newBookId = await addBook(newBookData);

      if (newBookId) {
        toast({
          title: 'Karya Berhasil Dibuat!',
          description: `"${values.title}" telah ditambahkan ke studio Anda.`,
        });
        router.push(`/studio/editor/${newBookId}`);
      } else {
         throw new Error("Gagal mendapatkan ID buku baru.");
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Karya',
        description: error.message || 'Terjadi kesalahan yang tidak diketahui.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/studio">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Studio
                    </Link>
                </Button>
            </div>
            <Card className="border-none shadow-2xl rounded-[2rem]">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl font-bold flex items-center gap-3">
                        <BookUp className="h-8 w-8 text-primary" />
                        Buat Karya Baru
                    </CardTitle>
                    <CardDescription>
                        Isi detail mahakarya Anda. Anda dapat mengubahnya lagi nanti di editor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 flex flex-col items-center">
                                <FormField
                                    control={form.control}
                                    name="coverImageFile"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="cover-upload" className="cursor-pointer">
                                                <div className="aspect-[3/4] w-60 rounded-xl bg-muted border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors relative overflow-hidden">
                                                    {preview ? (
                                                        <Image src={preview} alt="Pratinjau sampul" fill className="object-cover" />
                                                    ) : (
                                                        <>
                                                            <ImagePlus className="h-10 w-10 mb-2" />
                                                            <span className="text-sm font-semibold">Unggah Sampul</span>
                                                        </>
                                                    )}
                                                </div>
                                            </FormLabel>
                                            <FormControl>
                                                <Input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </FormControl>
                                            <FormMessage className="text-center" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Judul Karya</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: Senja di Pelupuk Mata" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel>Sinopsis</FormLabel>
                                        <Button type="button" variant="ghost" size="sm" onClick={generateAiSummary} disabled={isAiLoading} className="text-xs text-primary hover:text-primary">
                                            {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Wand2 className="h-4 w-4 mr-2" />}
                                            Buatkan AI
                                        </Button>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Deskripsikan secara singkat tentang apa karya Anda."
                                            className="resize-none"
                                            {...form.register('synopsis')}
                                        />
                                    </FormControl>
                                    <FormMessage {...form.formState.errors.synopsis} />
                                </FormItem>
                                
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipe Karya</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih tipe karya" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="book">Buku (Novel)</SelectItem>
                                                        <SelectItem value="poem">Puisi</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="genre"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Genre</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Contoh: Fiksi Ilmiah, Romansa" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <FormField
                                    control={form.control}
                                    name="visibility"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Visibilitas</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                                >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                    <RadioGroupItem value="public" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                    Publik (Dapat dilihat semua orang)
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                    <RadioGroupItem value="followers_only" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                    Pengikut Saja (Hanya dapat dilihat oleh pengikut Anda)
                                                    </FormLabel>
                                                </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" size="lg" className="rounded-full px-10 font-bold" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isLoading ? loadingMessage : 'Lanjut ke Editor'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
