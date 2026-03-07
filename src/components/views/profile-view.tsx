'use client';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Star, BookOpen, BarChart3, ShieldCheck, PenSquare, User as UserIcon, Settings, Heart, Eye, FileText } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProfileView() {
  const { isLoggedIn, user, userData, books } = useAppContext();
  const userAvatar = user?.photoURL || PlaceHolderImages.find(p => p.id === 'user-avatar')!.imageUrl;
  const userAvatarHint = 'user avatar';
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const writerStats = useMemo(() => {
    if (!user || !books || userData?.role !== 'penulis') {
      return { totalWorks: 0, totalViews: 0, totalFavorites: 0 };
    }
    const myBooks = books.filter(b => b.authorId === user.uid);
    const totalViews = myBooks.reduce((sum, book) => sum + (book.viewCount || 0), 0);
    const totalFavorites = myBooks.reduce((sum, book) => sum + (book.favoriteCount || 0), 0);
    return {
      totalWorks: myBooks.length,
      totalViews,
      totalFavorites,
    };
  }, [user, books, userData]);

  const myPublishedBooks = useMemo(() => {
    if (userData?.role !== 'penulis' || !user) return [];
    return books
      .filter(b => b.authorId === user.uid && b.status === 'published')
      .sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [books, user, userData]);

  if (!isLoggedIn || !user) {
    return (
      <section id="page-profile" className="page-section pt-28 md:pt-36">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
            <LogIn className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1} />
            <h1 className="font-headline text-3xl font-bold mb-4">Profil Terproteksi</h1>
            <p className="text-muted-foreground mb-8">Anda harus masuk untuk melihat halaman ini.</p>
            <Button asChild className="btn-primary w-full max-w-xs mx-auto py-3 rounded-xl font-semibold">
              <Link href="/login">Masuk / Daftar</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const renderRoleBadge = () => {
    if (!userData?.role) return null;
    const role = userData.role;

    const roleConfig = {
      admin: {
        label: 'Otoritas',
        icon: <ShieldCheck className="h-3 w-3" />,
        className: 'bg-destructive/10 text-destructive border-destructive/20',
      },
      penulis: {
        label: 'Pujangga',
        icon: <PenSquare className="h-3 w-3" />,
        className: 'bg-primary/10 text-primary border-primary/20',
      },
      pembaca: {
        label: 'Pembaca',
        icon: <UserIcon className="h-3 w-3" />,
        className: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
      },
    };

    const config = roleConfig[role];
    if (!config) return null;

    return (
      <Badge className={`rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest gap-2 ${config.className}`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const renderStats = () => {
    if (userData?.role === 'penulis') {
      return (
        <Card className="rounded-[2rem] border-none shadow-xl bg-indigo-950 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-indigo-300/60">Statistik Industri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl"><BookOpen className="h-5 w-5 text-indigo-300" /></div>
              <div>
                <p className="text-2xl font-black">{writerStats.totalWorks}</p>
                <p className="text-xs font-bold text-indigo-300/60">Total Karya</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl"><BarChart3 className="h-5 w-5 text-indigo-300" /></div>
              <div>
                <p className="text-2xl font-black">{writerStats.totalViews.toLocaleString('id-ID')}</p>
                <p className="text-xs font-bold text-indigo-300/60">Total Pembaca</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl"><Star className="h-5 w-5 text-indigo-300" /></div>
              <div>
                <p className="text-2xl font-black">{writerStats.totalFavorites.toLocaleString('id-ID')}</p>
                <p className="text-xs font-bold text-indigo-300/60">Total Favorit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    // Placeholder for other roles
    return (
      <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-muted-foreground">Aktivitas Saya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm"><BookOpen className="h-4 w-4 text-primary" /> <strong>16</strong> Buku Dibaca</div>
            <div className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 text-gold" /> <strong>4.6</strong> Rata-rata Rating</div>
            <div className="flex items-center gap-3 text-sm"><BarChart3 className="h-4 w-4 text-teal" /> <strong>14</strong> Hari Reading Streak</div>
          </CardContent>
        </Card>
    );
  };
  
  return (
    <section id="page-profile" className="page-section pt-28 md:pt-36">
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-28 space-y-6">
              <Card className="text-center rounded-[2rem] border-none shadow-xl">
                <CardContent className="p-8">
                  <Image src={userAvatar} data-ai-hint={userAvatarHint} alt="User Avatar" width={128} height={128} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-lg mx-auto mb-6 border-4 border-card" />
                  <div className="space-y-2">
                    <h1 className="font-headline text-2xl md:text-3xl font-bold">{user.displayName || 'Pengguna Baru'}</h1>
                    {renderRoleBadge()}
                    <p className="text-sm text-muted-foreground pt-2">{user.email}</p>
                    <p className="text-sm text-muted-foreground/80 font-medium">Anggota Sejak {new Date(user.metadata.creationTime || Date.now()).getFullYear()}</p>
                  </div>
                </CardContent>
              </Card>

              {renderStats()}

              <div className="space-y-2">
                {userData?.role === 'penulis' && (
                  <Button asChild size="lg" className="w-full rounded-xl font-bold h-12">
                    <Link href="/studio"><PenSquare className="mr-2 h-4 w-4" /> Buka Studio</Link>
                  </Button>
                )}
                {userData?.role === 'admin' && (
                  <Button asChild size="lg" className="w-full rounded-xl font-bold h-12 bg-destructive hover:bg-destructive/90">
                    <Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" /> Buka Panel Otoritas</Link>
                  </Button>
                )}
                <Button variant="outline" className="w-full rounded-xl h-12" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-2" />
                  Keluar
                </Button>
              </div>

            </div>
          </aside>

          <main className="lg:col-span-8 xl:col-span-9">
            <Tabs defaultValue="karya" className="w-full">
              <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                <TabsList className="bg-muted/50 p-1.5 rounded-full h-auto mb-8 w-max">
                  {userData?.role === 'penulis' && <TabsTrigger value="karya" className="rounded-full px-6 py-2 text-sm font-bold transition-all">Karya Diterbitkan</TabsTrigger>}
                  <TabsTrigger value="aktivitas" className="rounded-full px-6 py-2 text-sm font-bold transition-all">Aktivitas</TabsTrigger>
                  <TabsTrigger value="pengaturan" className="rounded-full px-6 py-2 text-sm font-bold transition-all">Pengaturan</TabsTrigger>
                </TabsList>
              </div>

              {userData?.role === 'penulis' && (
                <TabsContent value="karya">
                   <div className="space-y-6">
                    {myPublishedBooks.length > 0 ? myPublishedBooks.map(book => (
                      <Card key={book.id} className="rounded-[2rem] overflow-hidden shadow-lg border-none">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-40 shrink-0">
                            <Image src={book.coverUrl} alt={book.title} width={160} height={240} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                               <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">{book.genre}</p>
                               <h3 className="font-headline text-2xl font-bold italic">"{book.title}"</h3>
                            </div>
                            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5"><Eye className="h-4 w-4"/> {book.viewCount.toLocaleString('id-ID')}</div>
                                <div className="flex items-center gap-1.5"><Heart className="h-4 w-4"/> {book.favoriteCount.toLocaleString('id-ID')}</div>
                                <div className="flex items-center gap-1.5"><FileText className="h-4 w-4"/> {book.chapterCount} Bab</div>
                            </div>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Button asChild className="rounded-xl"><Link href={`/read/${book.id}`}>Baca Sekarang</Link></Button>
                                <Button asChild variant="outline" className="rounded-xl"><Link href={`/studio/editor/${book.id}`}>Kelola</Link></Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )) : (
                      <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed">
                        <h3 className="font-bold text-lg">Belum Ada Karya Diterbitkan</h3>
                        <p className="text-muted-foreground text-sm">Karya yang sudah Anda publikasikan akan muncul di sini.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="aktivitas">
                <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed">
                  <h3 className="font-bold text-lg">Segera Hadir</h3>
                  <p className="text-muted-foreground text-sm">Jejak aktivitas digital Anda akan muncul di sini.</p>
                </div>
              </TabsContent>
              <TabsContent value="pengaturan">
                 <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed">
                  <h3 className="font-bold text-lg">Segera Hadir</h3>
                  <p className="text-muted-foreground text-sm">Pengaturan profil dan preferensi akan tersedia di sini.</p>
                </div>
              </TabsContent>
            </Tabs>
          </main>

        </div>
      </div>
    </section>
  );
}
