'use client';
import { usePathname } from 'next/navigation';
import { NusakarsaApp } from '@/components/nusakarsa-app';
import { AppProvider } from '@/context/app-context';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isEditorPage = pathname.startsWith('/studio/editor/');
    const isAdminPage = pathname.startsWith('/admin');
    const isReadPage = pathname.startsWith('/read/');

    if (isAuthPage || isAdminPage || isEditorPage || isReadPage) {
        return <AppProvider>{children}</AppProvider>;
    }

    return <AppProvider><NusakarsaApp>{children}</NusakarsaApp></AppProvider>;
}
