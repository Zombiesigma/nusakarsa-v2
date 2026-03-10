'use client';

import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ProtectedLayout } from '@/components/auth/ProtectedLayout';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isImmersiveRoute = pathname?.includes('/read') ||
                           pathname?.includes('/edit');

  return (
    <ProtectedLayout>
      <div className="relative flex h-dvh w-full bg-[#fdf8f4] overflow-hidden">
        {!isImmersiveRoute && <AppSidebar />}
        
        <div className={cn(
          "flex flex-col flex-1 min-w-0 relative overflow-hidden transition-all duration-500",
          !isImmersiveRoute && "md:ml-24"
        )}>
          {!isImmersiveRoute && <Header />}
          
          <main className={cn(
            "flex-1 overflow-y-auto no-scrollbar relative",
            !isImmersiveRoute && "pb-24 md:pb-0"
          )}>
            <div className={cn(
              "relative mx-auto w-full h-full",
              !isImmersiveRoute && "container py-10 md:py-12"
            )}>
              {children}
            </div>
          </main>
          
          {!isImmersiveRoute && (
            <MobileNav />
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
