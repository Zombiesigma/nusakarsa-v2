
"use client";

import { useAppContext } from "@/context/app-context";
import { Header } from "./layout/header";
import { MobileBottomNav } from "./layout/mobile-bottom-nav";
import { MobileSideMenu } from "./layout/mobile-side-menu";
import { BookModal } from "./common/book-modal";
import { ParticleBackground } from "./effects/particle-background";
import { ReadingProgressBar } from "./effects/reading-progress-bar";
import { Loader2 } from "lucide-react";

export function NusakarsaApp({ children }: { children: React.ReactNode }) {
  const { modalBookId, isLoggedIn, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <ReadingProgressBar />
      <ParticleBackground />
      <MobileSideMenu />
      
      <Header />
      
      <main>
        {children}
      </main>

      {isLoggedIn && <MobileBottomNav />}

      {modalBookId !== null && <BookModal />}
    </>
  );
}
