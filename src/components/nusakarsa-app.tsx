
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Home, Search, Library, User, PenSquare, ShieldCheck, Sun, Moon } from 'lucide-react';

import { useAppContext } from "@/context/app-context";
import { BookModal } from "@/components/common/book-modal";
import { ParticleBackground } from "@/components/effects/particle-background";
import { ReadingProgressBar } from "@/components/effects/reading-progress-bar";
import { SplashScreen } from '@/components/splash-screen';
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu, 
  SidebarMenuButton,
  SidebarInset, 
  useSidebar,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';


const AppSidebar = () => {
    const { theme, toggleTheme, isLoggedIn, userData } = useAppContext();
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();

    const isWriter = userData?.role === 'penulis';
    const isAdmin = userData?.role === 'admin';

    const handleLinkClick = () => {
      setOpenMobile(false);
    }
    
    return (
        <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer" onClick={handleLinkClick}>
                  <div className="relative w-10 h-10">
                    <Image 
                      src="https://raw.githubusercontent.com/Zombiesigma/nusakarsa-assets/main/download.webp" 
                      alt="Nusakarsa Logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <span className="font-headline text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">Nusakarsa</span>
                  </div>
                </Link>
                <SidebarTrigger className="hidden md:flex" />
              </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
              <SidebarMenu>
                  <SidebarMenuButton asChild tooltip="Beranda" isActive={pathname === '/'} onClick={handleLinkClick}>
                      <Link href="/"><Home /><span>Beranda</span></Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild tooltip="Jelajahi" isActive={pathname.startsWith('/explore')} onClick={handleLinkClick}>
                      <Link href="/explore"><Search /><span>Jelajahi</span></Link>
                  </SidebarMenuButton>
                  {isLoggedIn && (
                      <>
                          <SidebarMenuButton asChild tooltip="Pustaka" isActive={pathname.startsWith('/library')} onClick={handleLinkClick}>
                              <Link href="/library"><Library /><span>Pustaka</span></Link>
                          </SidebarMenuButton>
                          <SidebarMenuButton asChild tooltip="Profil" isActive={pathname.startsWith('/profile')} onClick={handleLinkClick}>
                            <Link href="/profile"><User /><span>Profil</span></Link>
                          </SidebarMenuButton>
                      </>
                  )}
                  {isWriter && (
                       <SidebarMenuButton asChild tooltip="Studio" isActive={pathname.startsWith('/studio')} onClick={handleLinkClick}>
                            <Link href="/studio"><PenSquare /><span>Studio</span></Link>
                        </SidebarMenuButton>
                  )}
                   {isAdmin && (
                       <SidebarMenuButton asChild tooltip="Admin" isActive={pathname.startsWith('/admin')} onClick={handleLinkClick}>
                            <Link href="/admin"><ShieldCheck /><span>Admin</span></Link>
                        </SidebarMenuButton>
                  )}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuButton onClick={toggleTheme} tooltip={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}>
                    {theme === 'light' ? <Sun /> : <Moon />}
                    <span className="capitalize">{theme} Mode</span>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    );
};


export function NusakarsaApp({ children }: { children: React.ReactNode }) {
  const { modalBookId, isLoggedIn, isSplashDone } = useAppContext();
  const pathname = usePathname();
  const isReadPage = pathname.startsWith('/read/');

  return (
    <SidebarProvider defaultOpen={false}>
      <AnimatePresence>
        {!isSplashDone && <SplashScreen />}
      </AnimatePresence>
      
      {isSplashDone && (
        <>
          <AppSidebar />
          
          <SidebarInset className={cn(
            "transition-[margin-left] duration-200 ease-linear",
            isReadPage ? "md:ml-0" : "md:ml-[var(--sidebar-width-icon)] peer-data-[state=expanded]:ml-[var(--sidebar-width)]"
          )}>
            <ReadingProgressBar />
            <ParticleBackground />
            
            <Header />
            
            <main>
              {children}
            </main>

            {isLoggedIn && <MobileBottomNav />}

            {modalBookId !== null && <BookModal />}
          </SidebarInset>
        </>
      )}
    </SidebarProvider>
  );
}
