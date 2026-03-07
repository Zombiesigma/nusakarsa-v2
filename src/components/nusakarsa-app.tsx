
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Home, Search, Library, User, PenSquare, ShieldCheck, Sun, Moon, Info } from 'lucide-react';
import React, { useState } from 'react';

import { useAppContext } from "@/context/app-context";
import { BookModal } from "@/components/common/book-modal";
import { SplashScreen } from '@/components/splash-screen';
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { cn } from '@/lib/utils';


const AppSidebar = ({ isMobileMenuOpen, onLinkClick }: { isMobileMenuOpen: boolean, onLinkClick: () => void }) => {
    const { theme, toggleTheme, isLoggedIn, userData } = useAppContext();
    const pathname = usePathname();

    const isWriter = userData?.role === 'penulis';
    const isAdmin = userData?.role === 'admin';

    const NavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
      const isActive = href === '/' ? pathname === href : pathname.startsWith(href);
      return (
        <Link href={href} className={cn("nav-item", isActive && 'active')} onClick={onLinkClick}>
          {icon}
          <span className="sidebar:hover:opacity-100 opacity-0 transition-opacity duration-200">{label}</span>
        </Link>
      );
    };

    return (
        <aside className={cn("sidebar", isMobileMenuOpen && "open")}>
            <div className="sidebar-header">
              <Image 
                src="https://raw.githubusercontent.com/Zombiesigma/nusakarsa-assets/main/download.webp" 
                alt="Nusakarsa Logo" 
                width={40}
                height={40}
                className="sidebar-logo"
              />
              <span className="sidebar-title">Nusakarsa</span>
            </div>
            
            <nav style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '4px'}}>
                <NavLink href="/" icon={<Home />} label="Beranda" />
                <NavLink href="/explore" icon={<Search />} label="Jelajahi" />
                {isLoggedIn && (
                  <>
                    <NavLink href="/library" icon={<Library />} label="Pustaka" />
                    <NavLink href="/profile" icon={<User />} label="Profil" />
                  </>
                )}
                {isWriter && (
                    <NavLink href="/studio" icon={<PenSquare />} label="Studio" />
                )}
                {isAdmin && (
                    <NavLink href="/admin" icon={<ShieldCheck />} label="Admin" />
                )}
                <NavLink href="/about" icon={<Info />} label="Tentang Kami" />
            </nav>

            <div className="nav-item" onClick={toggleTheme}>
                {theme === 'light' ? <Sun /> : <Moon />}
                <span className="sidebar:hover:opacity-100 opacity-0 transition-opacity duration-200">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
        </aside>
    );
};


export function NusakarsaApp({ children }: { children: React.ReactNode }) {
  const { modalBookId, isLoggedIn, isSplashDone } = useAppContext();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isSplashDone && <SplashScreen />}
      </AnimatePresence>
      
      {isSplashDone && (
        <div className="relative min-h-screen w-full">
          <AppSidebar isMobileMenuOpen={isMobileMenuOpen} onLinkClick={() => setMobileMenuOpen(false)} />
          <div className={cn("sidebar-overlay", isMobileMenuOpen && "open")} onClick={() => setMobileMenuOpen(false)} />
          
          <div className="main-wrapper">
            <Header onMenuClick={() => setMobileMenuOpen(true)} />
            
            <main id="main-content">
              {children}
            </main>
          </div>

          {isLoggedIn && <MobileBottomNav />}

          {modalBookId !== null && <BookModal />}
        </div>
      )}
    </>
  );
}
