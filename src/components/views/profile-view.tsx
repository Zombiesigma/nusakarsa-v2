'use client';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Star, BookOpen, BarChart3, ShieldCheck, PenSquare, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';

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

  if (!isLoggedIn || !user) {
    return (
      <section id="page-profile" className="page-section pt-28 md:pt-36">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
            <LogIn className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1} />
            <h1 className="font-headline text-3xl font-bold mb-4">Akses Terbatas</h1>
            <p className="text-muted-foreground mb-8">Anda harus masuk untuk melihat profil Anda.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">
          <div className="bg-bg-alt p-4 rounded-xl">
            <BookOpen className="w-6 h-6 mx-auto text-primary mb-2" />
            <span className="text-2xl font-bold">{writerStats.totalWorks}</span>
            <p className="text-sm text-muted-foreground">Total Karya</p>
          </div>
          <div className="bg-bg-alt p-4 rounded-xl">
            <BarChart3 className="w-6 h-6 mx-auto text-teal mb-2" />
            <span className="text-2xl font-bold">{writerStats.totalViews.toLocaleString('id-ID')}</span>
            <p className="text-sm text-muted-foreground">Total Pembaca</p>
          </div>
          <div className="bg-bg-alt p-4 rounded-xl">
            <Star className="w-6 h-6 mx-auto text-gold mb-2" />
            <span className="text-2xl font-bold">{writerStats.totalFavorites.toLocaleString('id-ID')}</span>
            <p className="text-sm text-muted-foreground">Total Favorit</p>
          </div>
        </div>
      );
    }

    // Default for 'pembaca' and 'admin'
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">
        <div className="bg-bg-alt p-4 rounded-xl">
          <BookOpen className="w-6 h-6 mx-auto text-primary mb-2" />
          <span className="text-2xl font-bold">16</span>
          <p className="text-sm text-muted-foreground">Buku Dibaca</p>
        </div>
        <div className="bg-bg-alt p-4 rounded-xl">
          <Star className="w-6 h-6 mx-auto text-gold mb-2" />
          <span className="text-2xl font-bold">4.6</span>
          <p className="text-sm text-muted-foreground">Rata-rata Rating</p>
        </div>
        <div className="bg-bg-alt p-4 rounded-xl">
          <BarChart3 className="w-6 h-6 mx-auto text-teal mb-2" />
          <span className="text-2xl font-bold">14</span>
          <p className="text-sm text-muted-foreground">Reading Streak</p>
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    const role = userData?.role;
    return (
      <div className="mt-8 space-y-3">
        {role === 'penulis' && (
          <Button asChild size="lg" className="w-full rounded-xl font-bold h-12">
            <Link href="/studio">
              <PenSquare className="mr-2 h-4 w-4" /> Buka Studio
            </Link>
          </Button>
        )}
        {role === 'admin' && (
          <Button asChild size="lg" className="w-full rounded-xl font-bold h-12 bg-destructive hover:bg-destructive/90">
            <Link href="/admin">
              <ShieldCheck className="mr-2 h-4 w-4" /> Buka Panel Otoritas
            </Link>
          </Button>
        )}
        <Button variant="outline" className="w-full rounded-xl h-12" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2" />
          Keluar
        </Button>
      </div>
    );
  };

  return (
    <section id="page-profile" className="page-section pt-28 md:pt-36">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-card border border-border rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Image src={userAvatar} data-ai-hint={userAvatarHint} alt="User Avatar" width={128} height={128} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg" />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-2">
                <h1 className="font-headline text-3xl sm:text-4xl font-bold">{user.displayName || 'Pengguna Baru'}</h1>
                {renderRoleBadge()}
              </div>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              <p className="text-sm text-muted-foreground/80 font-medium mt-2">Anggota Sejak {new Date(user.metadata.creationTime || Date.now()).getFullYear()}</p>
            </div>
          </div>
          {renderStats()}
          {renderActionButtons()}
        </div>
      </div>
    </section>
  );
}
