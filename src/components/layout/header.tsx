
"use client";

import Link from 'next/link';
import Image from "next/image";
import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { isLoggedIn, user } = useAppContext();
  const userAvatar = user?.photoURL || PlaceHolderImages.find(p => p.id === 'user-avatar')!.imageUrl;
  const userAvatarHint = 'user avatar';

  return (
    <header className="header">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
        </Button>
        <span className="font-bold text-lg md:hidden">Nusakarsa</span>
      </div>

      <div className="flex-1" />
      
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
            <>
                <Button variant="ghost" size="icon" className="rounded-full border border-border hover:border-primary hover:text-primary transition-all relative" aria-label="Notifikasi">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">3</span>
                </Button>
                 <Link href="/profile" className="rounded-full overflow-hidden border-2 border-border hover:border-primary transition-all">
                    <Image src={userAvatar} data-ai-hint={userAvatarHint} alt="User Avatar" width={36} height={36} className="w-9 h-9" />
                </Link>
            </>
        ) : (
            <Button asChild className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold">
                <Link href="/login">Masuk</Link>
            </Button>
        )}
      </div>
    </header>
  );
}
