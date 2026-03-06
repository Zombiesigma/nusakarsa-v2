
"use client";

import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Star, BookOpen, BarChart3 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

export function ProfileView() {
    const { isLoggedIn, user } = useAppContext();
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
    }

    if (!isLoggedIn || !user) {
        return (
            <section id="page-profile" className="page-section pt-28 md:pt-36">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
                    <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                        <LogIn className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1}/>
                        <h1 className="font-headline text-3xl font-bold mb-4">Akses Terbatas</h1>
                        <p className="text-muted-foreground mb-8">
                           Anda harus masuk untuk melihat profil Anda.
                        </p>
                        <Button asChild className="btn-primary w-full max-w-xs mx-auto py-3 rounded-xl font-semibold">
                           <Link href="/login">Masuk / Daftar</Link>
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="page-profile" className="page-section pt-28 md:pt-36">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="bg-card border border-border rounded-3xl p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <Image src={userAvatar} data-ai-hint={userAvatarHint} alt="User Avatar" width={128} height={128} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg" />
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="font-headline text-3xl sm:text-4xl font-bold">{user.displayName || 'Pengguna Baru'}</h1>
                            <p className="text-muted-foreground mt-1">{user.email}</p>
                            <p className="text-sm text-primary font-medium mt-2">Anggota Sejak {new Date(user.metadata.creationTime).getFullYear()}</p>
                        </div>
                    </div>
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
                    <Button variant="outline" className="w-full mt-8 rounded-xl" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 mr-2" />
                        Keluar
                    </Button>
                </div>
            </div>
        </section>
    );
}
