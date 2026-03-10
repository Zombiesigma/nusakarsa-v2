
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useUser, useCollection, useDoc } from '@/firebase';
import { collection, query, where, limit, doc, writeBatch, increment, serverTimestamp, orderBy } from 'firebase/firestore';
import type { User, Book, Follow } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookCard } from '@/components/BookCard';
import { 
  UserPlus, 
  Edit, 
  Loader2, 
  UserMinus, 
  Sparkles, 
  CheckCircle2, 
  X,
  BookOpen,
  Users,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FollowsSheet } from '@/components/profile/FollowsSheet';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent 
} from '@/components/ui/dialog';

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);
  const [sheetState, setSheetState] = useState<{open: boolean; type: 'followers' | 'following'}>({ open: false, type: 'followers' });

  const normalizedUsername = useMemo(() => params.username?.toLowerCase().replace(/[^a-z0-9_]/g, ''), [params.username]);

  const userQuery = useMemo(() => (
    (firestore && normalizedUsername)
      ? query(collection(firestore, 'users'), where('username', '==', normalizedUsername), limit(1)) 
      : null
  ), [firestore, normalizedUsername]);
  
  const { data: users, isLoading: isUserLoading } = useCollection<User>(userQuery);
  const user = users?.[0];
  const isOwnProfile = user?.uid === currentUser?.uid;

  const followingRef = useMemo(() => (firestore && currentUser && user && !isOwnProfile) ? doc(firestore, 'users', currentUser.uid, 'following', user.uid) : null, [firestore, currentUser, user, isOwnProfile]);
  const { data: followingDoc } = useDoc<Follow>(followingRef);

  useEffect(() => { setIsFollowing(!!followingDoc); }, [followingDoc]);

  const publishedBooksQuery = useMemo(() => (firestore && user) ? query(collection(firestore, 'books'), where('authorId', '==', user.uid), where('status', '==', 'published'), orderBy('createdAt', 'desc')) : null, [firestore, user]);
  const { data: publishedBooks, isLoading: areBooksLoading } = useCollection<Book>(publishedBooksQuery);

  const handleFollow = async () => {
    if (!firestore || !currentUser || !user || isOwnProfile) return;
    setIsTogglingFollow(true);
    try {
        const batch = writeBatch(firestore);
        const followRef = doc(firestore, 'users', currentUser.uid, 'following', user.uid);
        const followerRef = doc(firestore, 'users', user.uid, 'followers', currentUser.uid);
        
        if (isFollowing) {
            batch.delete(followRef);
            batch.delete(followerRef);
            batch.update(doc(firestore, 'users', currentUser.uid), { following: increment(-1) });
            batch.update(doc(firestore, 'users', user.uid), { followers: increment(-1) });
        } else {
            batch.set(followRef, { userId: currentUser.uid, followedAt: serverTimestamp() });
            batch.set(followerRef, { userId: user.uid, followedAt: serverTimestamp() });
            batch.update(doc(firestore, 'users', currentUser.uid), { following: increment(1) });
            batch.update(doc(firestore, 'users', user.uid), { followers: increment(1) });
            
            const notifRef = doc(collection(firestore, `users/${user.uid}/notifications`));
            batch.set(notifRef, {
                type: 'follow',
                text: `${currentUser.displayName} mulai mengikuti Anda.`,
                link: `/profile/${currentUser.displayName?.toLowerCase().replace(/\s+/g, '')}`,
                actor: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName!,
                    photoURL: currentUser.photoURL!,
                },
                read: false,
                createdAt: serverTimestamp()
            });
        }
        await batch.commit();
        toast({ title: isFollowing ? "Berhenti mengikuti" : "Mulai mengikuti" });
    } catch(e) {
        toast({ variant: 'destructive', title: "Gagal" });
    } finally { setIsTogglingFollow(false); }
  };

  if (isUserLoading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Membuka Gulungan Takdir...</p>
    </div>
  );
  if (!user) notFound();

  return (
    <div className="max-w-7xl mx-auto pb-32 space-y-12 px-4 md:px-10">
      <FollowsSheet 
        userId={user.uid} 
        type={sheetState.type} 
        open={sheetState.open} 
        onOpenChange={(o) => setSheetState(prev => ({...prev, open: o}))} 
      />

      <div className="relative">
        {/* Banner Cinematic Area */}
        <div className="h-48 md:h-80 w-full rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-primary via-accent/40 to-indigo-500/30 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-10 md:gap-16 px-6 md:px-16 -mt-16 md:-mt-24 relative z-10">
            {/* LEFT COLUMN: Profile Sidebar */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="relative mb-6 p-1.5 rounded-full bg-background ring-8 ring-background shadow-2xl">
                        <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-background shadow-inner cursor-pointer" onClick={() => setIsPhotoPreviewOpen(true)}>
                            <AvatarImage src={user.photoURL} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary text-4xl md:text-6xl font-black italic">{user.displayName[0]}</AvatarFallback>
                        </Avatar>
                        {(user.role === 'penulis' || user.role === 'admin') && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2.5 rounded-full shadow-2xl ring-4 ring-background">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tight leading-tight">{user.displayName}</h1>
                        <p className="text-xs md:text-sm font-black text-primary uppercase tracking-[0.3em] opacity-60">@{user.username}</p>
                    </div>

                    <div className="mt-8 p-6 md:p-8 rounded-[2rem] bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl w-full">
                        <p className="text-sm md:text-base font-medium italic text-muted-foreground/80 leading-relaxed">
                            "{user.bio || "Seorang penjelajah imajinasi di semesta Nusakarsa kawan."}"
                        </p>
                        
                        <div className="mt-8 pt-8 border-t border-border/30 space-y-4">
                            {user.domicile && (
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    <span>{user.domicile}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                <span>Pujangga {user.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-8">
                        {isOwnProfile ? (
                            <Button className="w-full rounded-2xl h-14 font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all" asChild>
                                <Link href="/settings"><Edit className="mr-3 h-4 w-4" /> Kelola Profil</Link>
                            </Button>
                        ) : (
                            <Button 
                                className={cn(
                                    "w-full rounded-2xl h-14 font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95", 
                                    isFollowing ? "bg-muted text-foreground border-border" : "bg-primary text-white shadow-primary/20"
                                )} 
                                onClick={handleFollow} 
                                disabled={isTogglingFollow}
                            >
                                {isTogglingFollow ? <Loader2 className="h-4 w-4 animate-spin" /> : isFollowing ? <UserMinus className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                {isFollowing ? 'Berhenti Ikuti' : 'Mulai Ikuti'}
                            </Button>
                        )}
                    </div>
                </div>
            </aside>

            {/* RIGHT COLUMN: Content & Stats */}
            <main className="flex-1 space-y-12 pb-20">
                {/* Stats Dashboard */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 bg-card/30 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                    <div className="flex flex-col items-center justify-center space-y-1 md:space-y-2 border-r border-border/30">
                        <div className="p-2 rounded-xl bg-primary/5 text-primary mb-1"><Layers className="h-4 w-4" /></div>
                        <p className="font-black text-2xl md:text-4xl tracking-tighter">{publishedBooks?.length || 0}</p>
                        <p className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.2em] opacity-40">Mahakarya</p>
                    </div>
                    <button 
                        onClick={() => setSheetState({ open: true, type: 'followers' })} 
                        className="flex flex-col items-center justify-center space-y-1 md:space-y-2 border-r border-border/30 hover:bg-primary/5 rounded-2xl transition-all"
                    >
                        <div className="p-2 rounded-xl bg-emerald-500/5 text-emerald-600 mb-1"><Users className="h-4 w-4" /></div>
                        <p className="font-black text-2xl md:text-4xl tracking-tighter">{new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(user.followers || 0)}</p>
                        <p className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.2em] opacity-40">Pengikut</p>
                    </button>
                    <button 
                        onClick={() => setSheetState({ open: true, type: 'following' })} 
                        className="flex flex-col items-center justify-center space-y-1 md:space-y-2 hover:bg-primary/5 rounded-2xl transition-all"
                    >
                        <div className="p-2 rounded-xl bg-indigo-500/5 text-indigo-600 mb-1"><Sparkles className="h-4 w-4" /></div>
                        <p className="font-black text-2xl md:text-4xl tracking-tighter">{user.following || 0}</p>
                        <p className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.2em] opacity-40">Mengikuti</p>
                    </button>
                </div>

                {/* Published Works Grid */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary"><BookOpen className="h-5 w-5" /></div>
                        <h2 className="text-xl md:text-3xl font-headline font-black tracking-tight">Arsip <span className="text-primary italic">Karsa.</span></h2>
                        <div className="h-px bg-border/50 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                        {areBooksLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-[2rem]" />
                            ))
                        ) : publishedBooks?.length === 0 ? (
                            <div className="col-span-full py-20 text-center opacity-30 italic font-medium">
                                Belum ada mahakarya yang dipublikasikan kawan.
                            </div>
                        ) : (
                            publishedBooks?.map((b, idx) => (
                                <motion.div 
                                    key={b.id} 
                                    initial={{ opacity: 0, scale: 0.95 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <BookCard book={b} />
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
      </div>

      <Dialog open={isPhotoPreviewOpen} onOpenChange={setIsPhotoPreviewOpen}>
        <DialogContent className="max-w-none w-screen h-[100dvh] p-0 border-none bg-black/95 flex items-center justify-center rounded-none z-[300]">
            <button onClick={() => setIsPhotoPreviewOpen(false)} className="absolute top-10 right-10 text-white hover:text-primary transition-colors h-12 w-12 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                <X className="h-7 w-7" />
            </button>
            <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={user.photoURL} 
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-3xl shadow-2xl ring-1 ring-white/10" 
                alt="" 
            />
        </DialogContent>
      </Dialog>
    </div>
  )
}
