
'use client';
import { usePathname } from 'next/navigation';
import { NusakarsaApp } from '@/components/nusakarsa-app';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) {
        return <>{children}</>;
    }

    return <NusakarsaApp>{children}</NusakarsaApp>;
}
