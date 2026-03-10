'use client';

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, query, doc, writeBatch, updateDoc, where, deleteDoc, getDoc, getDocs, serverTimestamp, addDoc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Users, 
  ShieldCheck, 
  BookCopy, 
  Megaphone, 
  CheckCircle2, 
  Trash2, 
  Flame, 
  ChevronRight,
  PenTool,
  Activity,
  ShieldAlert,
  FileText,
  Music2,
  Smartphone,
  MapPin
} from "lucide-react";
import type { AuthorRequest, Book, User as AppUser } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateBookPdf } from "@/app/actions/pdf-generator";

export default function AdminPage() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: adminProfile, isLoading: isAdminChecking } = useDoc<AppUser>(
    (firestore && currentUser) ? doc(firestore, 'users', currentUser.uid) : null
  );

  const isAdmin = adminProfile?.role === 'admin';

  const authorRequestsQuery = useMemo(() => (
    (firestore && currentUser && isAdmin) ? collection(firestore, 'authorRequests') : null
  ), [firestore, currentUser, isAdmin]);
  const { data: rawAuthorRequests, isLoading: areAuthorRequestsLoading } = useCollection<AuthorRequest>(authorRequestsQuery);
  
  const authorRequests = useMemo(() => (
    rawAuthorRequests?.filter(r => r.status === 'pending') || []
  ), [rawAuthorRequests]);

  const pendingBooksQuery = useMemo(() => (
    (firestore && currentUser && isAdmin) ? query(collection(firestore, 'books'), where('status', '==', 'pending_review')) : null
  ), [firestore, currentUser, isAdmin]);
  const { data: pendingBooks, isLoading: areBooksLoading } = useCollection<Book>(pendingBooksQuery);
  
  const usersQuery = useMemo(() => (
    (firestore && currentUser && isAdmin) ? collection(firestore, 'users') : null
  ), [firestore, currentUser, isAdmin]);
  const { data: users, isLoading: areUsersLoading } = useCollection<AppUser>(usersQuery);

  const stats = useMemo(() => {
    if (!users) return { total: 0, admins: 0, penulis: 0, pembaca: 0 };
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      penulis: users.filter(u => u.role === 'penulis').length,
      pembaca: users.filter(u => u.role === 'pembaca').length,
    }
  }, [users]);

  const handleApproveAuthor = async (request: AuthorRequest) => {
    if (!firestore) return;
    setProcessingId(request.id);
    try {
      const batch = writeBatch(firestore);
      const requestRef = doc(firestore, 'authorRequests', request.id);
      batch.update(requestRef, { status: 'approved' });
      
      const userRef = doc(firestore, 'users', request.userId);
      batch.update(userRef, { 
        role: 'penulis',
        phoneNumber: request.phoneNumber || '',
        domicile: request.domicile || '',
      });
      
      await batch.commit();
      toast({ 
        variant: 'success', 
        title: "Pujangga Resmi Terdaftar", 
        description: `${request.name} sekarang adalah seorang penulis resmi.` 
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menyetujui" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveBook = async (bookId: string, bookTitle: string) => {
    if (!firestore) return;
    setProcessingId(bookId);
    try {
      const bookRef = doc(firestore, 'books', bookId);
      const bookSnap = await getDoc(bookRef);
      if (!bookSnap.exists()) return;
      
      const bookData = bookSnap.data() as Book;
      const pdfUrl = await generateBookPdf(bookId);

      const batch = writeBatch(firestore);
      batch.update(bookRef, { status: 'published', fileUrl: pdfUrl });

      const allUsersSnap = await getDocs(collection(firestore, 'users'));
      allUsersSnap.forEach((userDoc) => {
          if (userDoc.id !== bookData.authorId) {
              const notificationRef = doc(collection(firestore, `users/${userDoc.id}/notifications`));
              batch.set(notificationRef, {
                  type: 'broadcast',
                  text: `Mahakarya baru telah terbit: "${bookData.title}" oleh ${bookData.authorName}`,
                  link: `/books/${bookId}`,
                  actor: {
                      uid: bookData.authorId,
                      displayName: bookData.authorName,
                      photoURL: bookData.authorAvatarUrl,
                  },
                  read: false,
                  createdAt: serverTimestamp(),
              });
          }
      });

      await batch.commit();
      toast({ variant: 'success', title: "Karya Resmi Terbit" });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menyetujui" });
    } finally {
      setProcessingId(null);
    }
  };

  if (isAdminChecking) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-bold uppercase tracking-[0.4em] text-[10px]">Otoritas Verifikasi...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-8 md:space-y-10 pb-20 w-full overflow-x-hidden px-1">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-3">
            <ShieldCheck className="h-3 w-3" /> Dashboard Otoritas Nusakarsa
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tight leading-none">
            Pusat <span className="text-primary italic">Kendali</span>
          </h1>
        </motion.div>
        
        <div className="grid grid-cols-2 md:flex gap-2">
            <Button variant="outline" className="rounded-full font-bold shadow-sm h-11 md:h-12 px-4 md:px-6 text-xs md:text-sm" asChild>
                <Link href="/admin/broadcast"><Megaphone className="mr-2 h-4 w-4" /> Siaran</Link>
            </Button>
            <Button variant="outline" className="rounded-full font-bold shadow-sm h-11 md:h-12 px-4 md:px-6 text-xs md:text-sm" asChild>
                <Link href="/admin/music"><Music2 className="mr-2 h-4 w-4" /> Musik</Link>
            </Button>
            <Button className="rounded-full font-bold shadow-lg h-11 md:h-12 px-4 md:px-6 text-xs md:text-sm" asChild>
                <Link href="/admin/users"><Users className="mr-2 h-4 w-4" /> Anggota</Link>
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8 border-none shadow-xl rounded-[2rem] bg-indigo-950 text-white overflow-hidden relative">
            <CardHeader className="p-6 md:p-8 border-b border-white/5">
                <CardTitle className="text-xl md:text-2xl font-headline font-black flex items-center gap-3">
                    <Activity className="h-5 w-5 text-indigo-400" /> Statistik Komunitas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300/50">Total Anggota</p>
                        <p className="text-2xl md:text-4xl font-black">{areUsersLoading ? '...' : stats.total}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300/50">Pujangga Resmi</p>
                        <p className="text-2xl md:text-4xl font-black">{stats.penulis}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300/50">Pembaca Setia</p>
                        <p className="text-2xl md:text-4xl font-black">{stats.pembaca}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300/50">Tim Otoritas</p>
                        <p className="text-2xl md:text-4xl font-black">{stats.admins}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="md:col-span-4 border-none shadow-xl rounded-[2rem] bg-card p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-primary/5 text-primary w-fit"><ShieldCheck className="h-5 w-5" /></div>
                <h3 className="text-lg font-bold font-headline">Status Integritas</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground">Basis Data</span>
                        <span className="text-emerald-600">Terhubung</span>
                    </div>
                </div>
            </div>
        </Card>
      </div>

      <Tabs defaultValue="authors" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-full h-auto">
            <TabsTrigger value="authors" className="rounded-full px-6 py-2 text-xs font-bold transition-all">
                Penulis {authorRequests.length > 0 && <span className="ml-1.5 bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{authorRequests.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="books" className="rounded-full px-6 py-2 text-xs font-bold transition-all">
                Karya {pendingBooks && pendingBooks.length > 0 && <span className="ml-1.5 bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{pendingBooks.length}</span>}
            </TabsTrigger>
        </TabsList>

        <TabsContent value="authors">
            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-muted/30 border-b p-6 md:p-8">
                    <CardTitle className="text-lg md:text-2xl font-headline font-black">Permintaan Pujangga</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-6 font-black uppercase text-[9px] tracking-widest">Identitas</TableHead>
                                <TableHead className="font-black uppercase text-[9px] tracking-widest">Kontak</TableHead>
                                <TableHead className="text-right px-6 font-black uppercase text-[9px] tracking-widest">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areAuthorRequestsLoading ? (
                                <TableRow><TableCell colSpan={3} className="h-32 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
                            ) : authorRequests.length === 0 ? (
                                <TableRow><TableCell colSpan={3} className="h-48 text-center font-bold text-sm opacity-30">Semua Permintaan Diproses</TableCell></TableRow>
                            ) : authorRequests.map(request => (
                                <TableRow key={request.id}>
                                    <TableCell className="px-6 py-4">
                                        <p className="font-black text-sm">{request.name}</p>
                                        <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase"><MapPin className="h-2.5 w-2.5" /> {request.domicile}</div>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        <p className="flex items-center gap-1.5 font-medium"><Smartphone className="h-3 w-3" /> {request.phoneNumber}</p>
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <Button size="sm" onClick={() => handleApproveAuthor(request)} disabled={!!processingId} className="rounded-full text-[10px]">Setuju</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="books">
            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-muted/30 border-b p-6 md:p-8">
                    <CardTitle className="text-lg md:text-2xl font-headline font-black">Moderasi Mahakarya</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-6 font-black uppercase text-[9px] tracking-widest">Info Karya</TableHead>
                                <TableHead className="font-black uppercase text-[9px] tracking-widest">Penulis</TableHead>
                                <TableHead className="text-right px-6 font-black uppercase text-[9px] tracking-widest">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areBooksLoading ? (
                                <TableRow><TableCell colSpan={3} className="h-32 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
                            ) : pendingBooks?.length === 0 ? (
                                <TableRow><TableCell colSpan={3} className="h-48 text-center opacity-30 font-bold text-sm">Tidak ada antrean.</TableCell></TableRow>
                            ) : pendingBooks?.map(book => (
                                <TableRow key={book.id}>
                                    <TableCell className="px-6 py-4">
                                        <p className="font-black text-xs italic">"{book.title}"</p>
                                        <Badge variant="outline" className="text-[7px] uppercase mt-1">{book.genre}</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-[10px]">{book.authorName}</TableCell>
                                    <TableCell className="text-right px-6">
                                        <Button size="sm" onClick={() => handleApproveBook(book.id, book.title)} disabled={!!processingId} className="rounded-full text-[10px]">Terbitkan</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
