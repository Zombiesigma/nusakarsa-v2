'use client';
import { usePathname } from 'next/navigation';
import { NusakarsaApp } from '@/components/nusakarsa-app';
import { AppProvider } from '@/context/app-context';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isEditorPage = pathname.startsWith('/studio/editor/');
    const isAdminPage = pathname.startsWith('/admin');
    
    // These pages have their own full-screen layout and don't need the standard app shell (Header, MobileNav, etc.)
    if (isAuthPage || isEditorPage || isAdminPage) {
        return <AppProvider>{children}</AppProvider>;
    }

    // All other pages get the full app shell via NusakarsaApp
    return (
        <AppProvider>
            <NusakarsaApp>{children}</NusakarsaApp>
        </AppProvider>
    );
}
