
"use client";

import { useAppContext } from "@/context/app-context";
import { Header } from "./layout/header";
import { MobileBottomNav } from "./layout/mobile-bottom-nav";
import { MobileSideMenu } from "./layout/mobile-side-menu";
import { BookModal } from "./common/book-modal";
import { ParticleBackground } from "./effects/particle-background";
import { ReadingProgressBar } from "./effects/reading-progress-bar";
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './splash-screen';
import { usePathname } from "next/navigation";

export function NusakarsaApp({ children }: { children: React.ReactNode }) {
  const { modalBookId, isLoggedIn, isSplashDone } = useAppContext();
  const pathname = usePathname();
  const isReadPage = pathname.startsWith('/read/');

  return (
    <>
      <AnimatePresence>
        {!isSplashDone && <SplashScreen />}
      </AnimatePresence>
      
      {isSplashDone && (
        <>
          <ReadingProgressBar />
          <ParticleBackground />
          <MobileSideMenu />
          
          {!isReadPage && <Header />}
          
          <main>
            {children}
          </main>

          {isLoggedIn && <MobileBottomNav />}

          {modalBookId !== null && <BookModal />}
        </>
      )}
    </>
  );
}
