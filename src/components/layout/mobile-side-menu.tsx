"use client";

import { useAppContext } from "@/context/app-context";
import { Sheet, SheetContent, SheetOverlay, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sun, Moon, HelpCircle, LogIn } from "lucide-react";

export function MobileSideMenu() {
    const { isMenuOpen, setMenuOpen, theme, toggleTheme } = useAppContext();
    
    return (
        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetOverlay className="bg-black/50 backdrop-blur-sm" />
            <SheetContent side="right" className="bg-card p-0 w-[85%] max-w-sm flex flex-col">
                <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, oklch(from hsl(var(--primary)) l-0.1 h c) 100%)' }}>
                    <h3 className="font-bold text-lg text-primary-foreground">Gabung Nusakarsa</h3>
                    <p className="text-primary-foreground/70 text-sm mt-1 mb-4">Daftar atau masuk untuk membaca tanpa batas.</p>
                    <Button className="w-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm rounded-xl">
                        Masuk / Daftar
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-6 py-3">
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
                    <Button className="btn-primary w-full justify-center gap-2 py-3 rounded-xl font-semibold">
                        <LogIn className="w-5 h-5" />
                        Masuk
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

const MenuItem = ({ icon, label, onClick }: MenuItemProps) => (
    <button className="w-full text-left flex items-center gap-3.5 px-6 py-4 text-foreground hover:bg-bg-alt/50 transition-colors" onClick={onClick}>
        <span className="text-muted-foreground">{icon}</span>
        <span>{label}</span>
    </button>
)
