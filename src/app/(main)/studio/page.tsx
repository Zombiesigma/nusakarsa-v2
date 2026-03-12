
'use client';

import { useMemo, useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, doc, deleteDoc } from 'firebase/firestore';
import type { Book } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  BookOpen, 
  Edit, 
  Trash2, 
  LayoutGrid, 
  Eye,
  Heart,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
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

export default function StudioPage() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const booksQuery = useMemo(() => (
    (firestore && currentUser) ? query(collection(firestore, 'books'), where('authorId', '==', currentUser.uid)) : null
  ), [firestore, currentUser]);
  const { data: rawBooks, isLoading: isBooksLoading, error: booksError } = useCollection<Book>(booksQuery);

  const myBooks = useMemo(() => {
    if (!rawBooks) return [];
    return [...rawBooks].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [rawBooks]);

  const handleDeleteBook = async (bookId: string) => {
    if (!firestore) return;
    setProcessingId(bookId);
    try {
      await deleteDoc(doc(firestore, 'books', bookId));
      toast({ variant: 'success', title: "Karya Dilenyapkan", description: "Jejak narasi tersebut telah dihapus selamanya dari semesta Nusakarsa." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Gagal Melenyapkan" });
    } finally {
      setProcessingId(null);
      setDeleteConfirmId(null);
    }
  };

  if (booksError) {
      return (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
              <div className="p-4 bg-destructive/10 rounded-full text-destructive"><AlertTriangle className="h-8 w-8" /></div>
              <h2 className="text-xl font-headline font-black">Gangguan Koneksi Arsip</h2>
              <p className="text-sm text-muted-foreground max-w-xs">Terjadi kesalahan saat memuat data. Silakan muat ulang halaman atau hubungi dukungan teknis.</p>
              <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">Muat Ulang Halaman</Button>
          </div>
      )
  }

  return (
    <div className="max-w-5xl mx-auto pb-32 space-y-10 px-1 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-3">
            <LayoutGrid className="h-3 w-3" /> Workspace Penulis
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tight leading-none">
            Studio <span className="text-primary italic">Nusakarsa</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 font-medium">Kelola mahakarya dan jaringan Anda.</p>
        </motion.div>
        
        <Button className="rounded-full font-black shadow-xl shadow-primary/20 h-12 md:h-14 px-8 text-xs md:text-sm uppercase tracking-widest" asChild>
            <Link href="/upload">
                <LayoutGrid className="mr-2 h-4 w-4" /> Karya Baru
            </Link>
        </Button>
      </div>

      <Tabs defaultValue="books" className="space-y-10">
        <div className="flex items-center overflow-x-auto no-scrollbar pb-2 border-b border-border/40">
            <TabsList className="bg-muted/50 p-1 rounded-full h-auto flex-shrink-0">
                <TabsTrigger value="books" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all">Karya Saya</TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="books" key="books" className="mt-0">
            {isBooksLoading ? (
                <div className="flex flex-col items-center py-20 gap-4 opacity-40">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="font-black uppercase text-[10px] tracking-widest">Sinkronisasi Arsip...</p>
                </div>
            ) : myBooks?.length === 0 ? (
                <div className="py-24 text-center bg-card/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed flex flex-col items-center gap-6">
                    <div className="p-8 bg-muted rounded-[2rem]"><BookOpen className="h-12 w-12 text-muted-foreground/30" /></div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-headline font-black">Mulai Narasi Anda</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">Anda belum memiliki draf karya. Mari ciptakan sesuatu yang luar biasa hari ini.</p>
                    </div>
                    <Button asChild className="rounded-full px-10 h-12 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                        <Link href="/upload">Buat Karya Pertama</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myBooks?.map((book, idx) => (
                        <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:-translate-y-1 transition-all duration-500 bg-card">
                                <div className="aspect-[16/9] relative overflow-hidden">
                                    <img src={book.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                        <Badge className={cn(
                                            "rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest",
                                            book.status === 'published' ? "bg-emerald-500" : book.status === 'pending_review' ? "bg-orange-500" : "bg-primary"
                                        )}>
                                            {book.status === 'published' ? 'Terbit' : book.status === 'pending_review' ? 'Moderasi' : 'Draf'}
                                        </Badge>
                                        <div className="flex gap-3 text-white">
                                            <div className="flex items-center gap-1"><Eye className="h-3 w-3" /><span className="text-[10px] font-black">{book.viewCount}</span></div>
                                            <div className="flex items-center gap-1"><Heart className="h-3 w-3" /><span className="text-[10px] font-black">{book.favoriteCount}</span></div>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-headline text-lg font-black truncate italic">"{book.title}"</h3>
                                        <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">{book.genre} • {book.type === 'poem' ? 'Puisi' : 'Buku'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Button className="w-full rounded-2xl h-12 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-95" asChild>
                                            <Link href={`/books/${book.id}/edit`}>
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
      </Tabs>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
            <AlertDialogHeader>
                <div className="mx-auto bg-rose-50 p-4 rounded-2xl w-fit mb-4"><AlertTriangle className="h-8 w-8 text-rose-500" /></div>
                <AlertDialogTitle className="font-headline text-2xl font-black text-center">Lenyapkan Karya?</AlertDialogTitle>
                <AlertDialogDescription className="text-center font-medium leading-relaxed">
                    Tindakan ini permanen. Seluruh bab, apresiasi, dan sejarah narasi dari karya ini akan hilang selamanya dari semesta Nusakarsa.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
                <AlertDialogCancel className="rounded-full h-12 flex-1 border-2 font-bold">Batal</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={() => deleteConfirmId && handleDeleteBook(deleteConfirmId)} 
                    className="rounded-full h-12 flex-1 bg-rose-500 font-black shadow-lg shadow-rose-500/20"
                    disabled={!!processingId}
                >
                    {processingId ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Lenyapkan"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
