
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Loader2,
  PlusCircle,
  Pencil,
  ShieldAlert,
  Feather,
  BookOpen,
  LayoutGrid,
  Users,
  Film,
  Sparkles,
  Trash2,
  AlertTriangle,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function StudioView() {
    const { isLoggedIn, user, books, userData, loading, deleteBook } = useAppContext();
    const router = useRouter();
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, loading, router]);

    const myBooks = useMemo(() => 
        user ? [...books.filter(book => book.ownerId === user.uid)].sort((a, b) => (b.id > a.id ? 1 : -1)) : [],
    [user, books]);
    
    const isWriter = userData?.role === 'penulis';

    const handleDeleteBook = async () => {
        if (!deleteConfirmId) return;
        setIsDeleting(true);
        try {
            await deleteBook(deleteConfirmId);
        } catch (e) {
            console.error(e);
        } finally {
            setIsDeleting(false);
            setDeleteConfirmId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-black uppercase text-[10px] tracking-widest">Sinkronisasi Arsip...</p>
            </div>
        )
    }

    if (!isLoggedIn) {
        return null;
    }

    if (!isWriter) {
        return (
            <section id="page-studio" className="page-section pt-28 md:pt-36">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
                    <div className="bg-card rounded-3xl p-12 md:p-20 border border-border shadow-sm">
                        <ShieldAlert className="w-20 h-20 mx-auto text-destructive/80 mb-6" strokeWidth={1.5} />
                        <h1 className="text-3xl font-headline font-bold text-foreground">Akses Ditolak</h1>
                        <p className="text-muted-foreground mt-2 mb-8 max-w-md mx-auto">Anda tidak memiliki hak akses sebagai 'penulis' untuk melihat halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah sebuah kesalahan.</p>
                        <Button asChild size="lg" className="btn-primary rounded-xl px-8">
                            <Link href="/">Kembali ke Beranda</Link>
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="page-studio" className="page-section pt-20 md:pt-28">
            <div className="max-w-5xl mx-auto pb-32 space-y-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-3">
                        <LayoutGrid className="h-3 w-3" /> Workspace Penulis
                    </div>
                    <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight leading-none">
                        Studio <span className="text-primary italic">Nusakarsa</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-3 font-medium">Ciptakan dan kelola mahakaryamu.</p>
                    </motion.div>
                    
                    <Button className="rounded-full font-black shadow-xl shadow-primary/20 h-12 md:h-14 px-8 text-xs md:text-sm uppercase tracking-widest self-start md:self-auto" asChild>
                        <Link href="/studio/editor/new">
                            <PlusCircle className="mr-2 h-4 w-4" /> Karya Baru
                        </Link>
                    </Button>
                </div>

                <Tabs defaultValue="books" className="space-y-10">
                    <div className="flex items-center overflow-x-auto no-scrollbar pb-2 border-b border-border/40">
                        <TabsList className="bg-muted/50 p-1 rounded-full h-auto flex-shrink-0">
                            <TabsTrigger value="books" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all">Karya Saya</TabsTrigger>
                            <TabsTrigger value="team-projects" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all gap-2" disabled>
                                Proyek Tim
                            </TabsTrigger>
                            <TabsTrigger value="reels" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all" disabled>Reels</TabsTrigger>
                            <TabsTrigger value="collabs" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all gap-2" disabled>
                                Undangan
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <AnimatePresence mode="wait">
                        <TabsContent value="books" key="books" className="mt-0">
                            {myBooks.length === 0 ? (
                                <div className="py-24 text-center bg-card/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed flex flex-col items-center gap-6">
                                    <div className="p-8 bg-muted rounded-[2rem]"><Feather className="h-12 w-12 text-muted-foreground/30" /></div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-headline font-black">Mulai Narasi Anda</h3>
                                        <p className="text-muted-foreground max-w-xs mx-auto">Anda belum memiliki draf karya. Mari ciptakan sesuatu yang luar biasa hari ini.</p>
                                    </div>
                                    <Button asChild className="rounded-full px-10 h-12 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                                        <Link href="/studio/editor/new">Buat Karya Pertama</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myBooks.map((book, idx) => (
                                        <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                                            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:-translate-y-1 transition-all duration-500 bg-card">
                                                <div className="aspect-[3/4] relative overflow-hidden">
                                                    <Image 
                                                      src={book.coverImage.src} 
                                                      alt={book.title} 
                                                      width={book.coverImage.width}
                                                      height={book.coverImage.height}
                                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                                </div>
                                                <CardContent className="p-6 space-y-4">
                                                    <div>
                                                        <h3 className="font-headline text-lg font-black truncate italic">"{book.title}"</h3>
                                                        <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">{book.category}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Button className="w-full rounded-2xl h-12 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-95" asChild>
                                                            <Link href={`/studio/editor/${book.id}`}>
                                                                <Edit className="mr-2 h-3.5 w-3.5" /> Buka Editor
                                                            </Link>
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            className="w-full rounded-2xl h-12 font-black uppercase text-[10px] tracking-[0.2em] text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                            onClick={() => setDeleteConfirmId(book.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus Karya
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="team-projects" key="team-projects" className="mt-0">
                             <div className="py-24 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed flex flex-col items-center gap-6">
                                <div className="p-8 bg-background rounded-[2rem] shadow-sm"><Users className="h-12 w-12 text-muted-foreground/30" /></div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-headline font-black">Kolaborasi (Segera)</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto">Fitur untuk berkolaborasi dengan penulis lain akan segera hadir di sini.</p>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="reels" key="reels" className="mt-0">
                             <div className="py-24 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed flex flex-col items-center gap-6">
                                <div className="p-8 bg-background rounded-[2rem] shadow-sm"><Film className="h-12 w-12 text-muted-foreground/30" /></div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-headline font-black">Reels (Segera)</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto">Promosikan karyamu dengan video pendek. Fitur ini sedang dalam pengembangan.</p>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="collabs" key="collabs" className="mt-0">
                            <div className="py-24 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed flex flex-col items-center gap-6">
                                <div className="p-8 bg-background rounded-[2rem] shadow-sm"><Sparkles className="h-12 w-12 text-muted-foreground/30" /></div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-headline font-black">Undangan (Segera)</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto">Terima undangan kolaborasi dari penulis lain di sini. Segera hadir!</p>
                                </div>
                            </div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>

                <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                    <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
                        <AlertDialogHeader>
                            <div className="mx-auto bg-rose-50 p-4 rounded-2xl w-fit mb-4"><AlertTriangle className="h-8 w-8 text-rose-500" /></div>
                            <AlertDialogTitle className="font-headline text-2xl font-black text-center">Hapus Karya?</AlertDialogTitle>
                            <AlertDialogDescription className="text-center font-medium leading-relaxed">
                                Tindakan ini permanen. Seluruh data dan konten dari karya ini akan hilang selamanya dari semesta Nusakarsa.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
                            <AlertDialogCancel className="rounded-full h-12 flex-1 border-2 font-bold">Batal</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDeleteBook} 
                                className="rounded-full h-12 flex-1 bg-rose-500 font-black shadow-lg shadow-rose-500/20"
                                disabled={isDeleting}
                            >
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </section>
    );
}
