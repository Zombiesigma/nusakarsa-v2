"use client";

import { useAppContext } from "@/context/app-context";
import { Header } from "./layout/header";
import { MobileBottomNav } from "./layout/mobile-bottom-nav";
import { MobileSideMenu } from "./layout/mobile-side-menu";
import { BookModal } from "./common/book-modal";
import { HomeView } from "./views/home-view";
import { ExploreView } from "./views/explore-view";
import { LibraryView } from "./views/library-view";
import { ProfileView } from "./views/profile-view";
import { ParticleBackground } from "./effects/particle-background";
import { ReadingProgressBar } from "./effects/reading-progress-bar";

export function NusakarsaApp() {
  const { activePage, modalBookId, isLoggedIn } = useAppContext();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'library':
        return <LibraryView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <>
      <ReadingProgressBar />
      <ParticleBackground />
      <MobileSideMenu />
      
      <Header />
      
      <main>
        {renderActivePage()}
      </main>

      {isLoggedIn && <MobileBottomNav />}

      {modalBookId !== null && <BookModal />}
    </>
  );
}
