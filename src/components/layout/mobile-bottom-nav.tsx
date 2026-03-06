"use client";

import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { Home, Search, Library, User } from "lucide-react";

type NavItemProps = {
    page: 'home' | 'explore' | 'library' | 'profile';
    icon: React.ReactNode;
    label: string;
}

const NavItem = ({ page, icon, label }: NavItemProps) => {
    const { activePage, setActivePage } = useAppContext();
    const isActive = activePage === page;

    return (
        <button className={cn("nav-item flex flex-col items-center justify-center py-2 px-4", isActive && "active")} onClick={() => setActivePage(page)}>
            <div className="nav-icon transition-transform">{icon}</div>
            <span className="text-[10px] mt-1 font-medium">{label}</span>
        </button>
    )
}

export function MobileBottomNav() {
    return (
        <nav className="mobile-bottom-nav md:hidden glass border-t border-border">
            <div className="flex justify-around items-center h-16">
                <NavItem page="home" icon={<Home className="w-6 h-6" />} label="Beranda" />
                <NavItem page="explore" icon={<Search className="w-6 h-6" />} label="Jelajahi" />
                <NavItem page="library" icon={<Library className="w-6 h-6" />} label="Pustaka" />
                <NavItem page="profile" icon={<User className="w-6 h-6" />} label="Profil" />
            </div>
        </nav>
    );
}
