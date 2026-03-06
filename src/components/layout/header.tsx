
"use client";

import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Bell, Menu, User } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const Logo = () => (
    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 text-primary" viewBox="0 0 40 40" fill="none" stroke="currentColor">
          <rect x="6" y="6" width="24" height="28" rx="2" strokeWidth="2"/>
          <path d="M10 6V34" strokeWidth="2"/>
          <path d="M34 10L30 14V26L34 30V10Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="20" r="5" className="stroke-current text-gold" strokeWidth="1.5"/>
          <circle cx="20" cy="20" r="2" className="fill-current text-gold"/>
        </svg>
      </div>
      <div>
        <span className="font-headline text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">Nusakarsa</span>
        <span className="hidden sm:block text-xs text-muted-foreground tracking-wide">Perpustakaan Digital</span>
      </div>
    </Link>
)

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} className={cn(
            "font-medium text-sm tracking-wide uppercase hover:text-primary transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
        )}>
            {children}
        </Link>
    )
}

const ThemeToggleButton = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useAppContext();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full border border-border hover:border-primary hover:text-primary transition-all", className)}
      aria-label="Ganti tema"
      onClick={toggleTheme}
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </Button>
  );
};

export function Header() {
  const { setMenuOpen, isLoggedIn, user, userData } = useAppContext();
  const userAvatar = user?.photoURL || PlaceHolderImages.find(p => p.id === 'user-avatar')!.imageUrl;
  const userAvatarHint = 'user avatar';
  const isWriter = userData?.role === 'penulis';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          
          <div className="hidden lg:flex items-center gap-10">
            <NavLink href="/">Beranda</NavLink>
            <NavLink href="/explore">Jelajahi</NavLink>
            {isLoggedIn && (
                <>
                    <NavLink href="/library">Pustaka</NavLink>
                    {isWriter && <NavLink href="/studio">Studio</NavLink>}
                    <NavLink href="/profile">Profil</NavLink>
                </>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggleButton className="hidden md:flex" />
            {isLoggedIn ? (
                <>
                    <Button variant="ghost" size="icon" className="hidden md:flex rounded-full border border-border hover:border-primary hover:text-primary transition-all relative" aria-label="Notifikasi">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">3</span>
                    </Button>
                     <Link href="/profile" className="hidden md:block rounded-full overflow-hidden border-2 border-border hover:border-primary transition-all">
                        <Image src={userAvatar} data-ai-hint={userAvatarHint} alt="User Avatar" width={36} height={36} className="w-9 h-9" />
                    </Link>
                </>
            ) : (
                <Button asChild className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold hidden md:block">
                    <Link href="/login">Masuk</Link>
                </Button>
            )}

            <Button variant="ghost" size="icon" className="flex lg:hidden rounded-full border border-border hover:border-primary hover:text-primary transition-all" aria-label="Menu" onClick={() => setMenuOpen(true)}>
                <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
