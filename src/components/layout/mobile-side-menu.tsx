
"use client";

import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useAppContext } from "@/context/app-context";
import { Sheet, SheetContent, SheetOverlay, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sun, Moon, HelpCircle, LogIn, LogOut, User, Library, Home, Search } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from '@/lib/utils';

export function MobileSideMenu() {
    const { isMenuOpen, setMenuOpen, theme, toggleTheme, isLoggedIn, setIsLoggedIn } = useAppContext();
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar')!;
    const pathname = usePathname();

    const handleLogout = () => {
        setIsLoggedIn(false);
        setMenuOpen(false);
    }
    
    return (
        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetOverlay className="bg-black/50 backdrop-blur-sm" />
            <SheetContent side="right" className="bg-card p-0 w-[85%] max-w-sm flex flex-col">
                <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                
                {isLoggedIn ? (
                    <div className="p-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, oklch(from hsl(var(--primary)) l-0.1 h c) 100%)' }}>
                        <Image src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} alt="User Avatar" width={64} height={64} className="w-16 h-16 rounded-full object-cover border-2 border-white/50" />
                        <div>
                            <h3 className="font-bold text-lg text-primary-foreground">Pengguna Demo</h3>
                            <p className="text-primary-foreground/70 text-sm">pengguna.demo@example.com</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, oklch(from hsl(var(--primary)) l-0.1 h c) 100%)' }}>
                        <h3 className="font-bold text-lg text-primary-foreground">Gabung Nusakarsa</h3>
                        <p className="text-primary-foreground/70 text-sm mt-1 mb-4">Daftar atau masuk untuk membaca tanpa batas.</p>
                        <Button asChild className="w-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm rounded-xl" onClick={() => setMenuOpen(false)}>
                            <Link href="/login">Masuk / Daftar</Link>
                        </Button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto py-4">
                     <div className="px-6 py-3">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Navigasi</p>
                    </div>
                    <MenuItem icon={<Home className="w-5 h-5"/>} label="Beranda" href="/" active={pathname === '/'} />
                    <MenuItem icon={<Search className="w-5 h-5"/>} label="Jelajahi" href="/explore" active={pathname === '/explore'} />
                    {isLoggedIn && (
                        <>
                        <MenuItem icon={<Library className="w-5 h-5"/>} label="Pustaka" href="/library" active={pathname === '/library'} />
                        <MenuItem icon={<User className="w-5 h-5"/>} label="Profil" href="/profile" active={pathname === '/profile'} />
                        </>
                    )}

                    <div className="px-6 py-3 mt-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Preferensi</p>
                    </div>
                    <div className="flex items-center justify-between px-6 py-4 hover:bg-bg-alt/50 transition-colors cursor-pointer" onClick={toggleTheme}>
                         <div className="flex items-center gap-3.5 text-foreground">
                            {theme === 'light' ? <Sun className="w-5 h-5 text-muted-foreground"/> : <Moon className="w-5 h-5 text-muted-foreground"/>}
                            <span>Mode Gelap</span>
                         </div>
                         <div className={`w-10 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-border'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    
                    <MenuItem icon={<HelpCircle className="w-5 h-5"/>} label="Bantuan" href="#" />
                </div>
                
                {isLoggedIn && (
                    <div className="p-4 border-t border-border">
                        <Button variant="outline" className="w-full justify-center gap-2 py-3 rounded-xl font-semibold" onClick={handleLogout}>
                            <LogOut className="w-5 h-5" />
                            Keluar
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
}

const MenuItem = ({ icon, label, href, active }: MenuItemProps) => {
    const { setMenuOpen } = useAppContext();
    return (
        <Link href={href} className={cn('w-full text-left flex items-center gap-3.5 px-6 py-4 transition-colors', active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-bg-alt/50')} onClick={() => setMenuOpen(false)}>
            <span className={cn(active ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    )
}
