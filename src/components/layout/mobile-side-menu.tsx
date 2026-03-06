"use client";

import { useAppContext } from "@/context/app-context";
import { Sheet, SheetContent, SheetOverlay, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bookmark, Shield, Bell, Sun, Moon, HelpCircle, LogOut } from "lucide-react";

export function MobileSideMenu() {
    const { isMenuOpen, setMenuOpen, setActivePage, theme, toggleTheme } = useAppContext();

    const handleNavigate = (page: 'home' | 'explore' | 'library' | 'profile') => {
        setActivePage(page);
        setMenuOpen(false);
    }
    
    return (
        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetOverlay className="bg-black/50 backdrop-blur-sm" />
            <SheetContent side="right" className="bg-card p-0 w-[85%] max-w-sm flex flex-col">
                <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <div className="p-6" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, oklch(from hsl(var(--primary)) l-0.1 h c) 100%)' }}>
                    <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                           <AvatarFallback className="bg-primary/20 text-xl font-bold text-primary-foreground">NS</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-lg text-primary-foreground">Nusa Sakarsa</h3>
                            <p className="text-primary-foreground/70 text-sm">nusa@nusakarsa.id</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <MenuItem icon={<User className="w-5 h-5"/>} label="Profil Saya" onClick={() => handleNavigate('profile')} />
                    <MenuItem icon={<Bookmark className="w-5 h-5"/>} label="Tersimpan" onClick={() => handleNavigate('library')} />
                    <MenuItem icon={<Shield className="w-5 h-5"/>} label="Keamanan" />
                    <MenuItem icon={<Bell className="w-5 h-5"/>} label="Notifikasi" badgeCount={3} />
                    
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
                    
                    <MenuItem icon={<HelpCircle className="w-5 h-5"/>} label="Bantuan" />
                </div>
                
                <div className="p-4 border-t border-border">
                    <Button variant="outline" className="w-full justify-center gap-2 py-6 rounded-xl font-semibold">
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    badgeCount?: number;
    onClick?: () => void;
}

const MenuItem = ({ icon, label, badgeCount, onClick }: MenuItemProps) => (
    <button className="w-full text-left flex items-center gap-3.5 px-6 py-4 text-foreground hover:bg-bg-alt/50 transition-colors" onClick={onClick}>
        <span className="text-muted-foreground">{icon}</span>
        <span>{label}</span>
        {badgeCount && (
            <span className="ml-auto px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">{badgeCount}</span>
        )}
    </button>
)
