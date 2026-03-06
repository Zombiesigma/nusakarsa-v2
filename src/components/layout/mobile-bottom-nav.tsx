
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Home, Search, Library, User } from "lucide-react";

type NavItemProps = {
    href: string;
    icon: React.ReactNode;
    label: string;
}

const NavItem = ({ href, icon, label }: NavItemProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={cn("nav-item flex flex-col items-center justify-center py-2 px-4", isActive && "active")}>
            <div className="nav-icon transition-transform">{icon}</div>
            <span className="text-[10px] mt-1 font-medium">{label}</span>
        </Link>
    )
}

export function MobileBottomNav() {
    return (
        <nav className="mobile-bottom-nav md:hidden glass border-t border-border">
            <div className="flex justify-around items-center h-16">
                <NavItem href="/" icon={<Home className="w-6 h-6" />} label="Beranda" />
                <NavItem href="/explore" icon={<Search className="w-6 h-6" />} label="Jelajahi" />
                <NavItem href="/library" icon={<Library className="w-6 h-6" />} label="Pustaka" />
                <NavItem href="/profile" icon={<User className="w-6 h-6" />} label="Profil" />
            </div>
        </nav>
    );
}
