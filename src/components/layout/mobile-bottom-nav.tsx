
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { Home, Search, Library, User, PenSquare } from "lucide-react";

type NavItemProps = {
    href: string;
    icon: React.ReactNode;
    label: string;
}

const NavItem = ({ href, icon, label }: NavItemProps) => {
    const pathname = usePathname();
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

    return (
        <Link 
            href={href} 
            className={cn(
                "nav-item group relative flex-1 flex flex-col items-center justify-center pt-3 pb-2 text-center transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
        >
            <div className={cn(
                "nav-icon transition-transform duration-300 ease-out",
                isActive ? "scale-110 -translate-y-1" : "group-hover:-translate-y-1"
            )}>
                {icon}
            </div>
            <span className={cn(
                "text-[11px] font-bold tracking-wide transition-all duration-300",
                isActive ? "text-primary mt-1.5" : "mt-1"
            )}>{label}</span>
             <div className={cn(
                "absolute bottom-0 h-1 w-1/2 rounded-full bg-primary transition-transform duration-300 ease-out",
                isActive ? 'scale-x-100' : 'scale-x-0'
            )}></div>
        </Link>
    )
}

export function MobileBottomNav() {
    const { userData } = useAppContext();
    const isWriter = userData?.role === 'penulis';

    return (
        <div className="mobile-bottom-nav md:hidden">
            <nav className="h-16 bg-background/90 backdrop-blur-xl border-t border-border shadow-[0_-5px_30px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex justify-around items-center h-full max-w-md mx-auto">
                    <NavItem href="/" icon={<Home className="w-6 h-6" />} label="Beranda" />
                    <NavItem href="/explore" icon={<Search className="w-6 h-6" />} label="Jelajahi" />
                    <NavItem href="/library" icon={<Library className="w-6 h-6" />} label="Pustaka" />
                    {isWriter && <NavItem href="/studio" icon={<PenSquare className="w-6 h-6" />} label="Studio" />}
                    <NavItem href="/profile" icon={<User className="w-6 h-6" />} label="Profil" />
                </div>
            </nav>
        </div>
    );
}

    