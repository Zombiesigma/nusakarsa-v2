"use client";

import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Bell, Menu } from "lucide-react";

const Logo = () => (
    <div className="flex items-center gap-3 group" onClick={() => useAppContext().setActivePage('home')}>
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
        <span className="font-headline text-2xl font-bold tracking-tight group-hover:text-primary transition-colors cursor-pointer">Nusakarsa</span>
        <span className="hidden sm:block text-xs text-muted-foreground tracking-wide">Perpustakaan Digital</span>
      </div>
    </div>
)

const NavLink = ({ page, children }: { page: 'home' | 'explore' | 'library' | 'profile', children: React.ReactNode }) => {
    const { setActivePage } = useAppContext();
    return (
        <a href="#" className="font-medium text-sm tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors" onClick={() => setActivePage(page)}>
            {children}
        </a>
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
  const { setMenuOpen } = useAppContext();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <NavLink page="home">Beranda</NavLink>
            <NavLink page="explore">Jelajahi</NavLink>
            <NavLink page="library">Pustaka</NavLink>
            <NavLink page="profile">Profil</NavLink>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggleButton className="hidden md:flex" />
            <Button variant="ghost" size="icon" className="hidden md:flex rounded-full border border-border hover:border-primary hover:text-primary transition-all relative" aria-label="Notifikasi">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">3</span>
            </Button>
            <button className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold hidden md:block">Masuk</button>
            <Button variant="ghost" size="icon" className="flex md:hidden rounded-full border border-border hover:border-primary hover:text-primary transition-all" aria-label="Menu" onClick={() => setMenuOpen(true)}>
                <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
