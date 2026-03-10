'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

/**
 * Menggunakan dynamic import untuk TargetCursor di sini,
 * karena ProtectionProvider adalah Client Component yang aman untuk ssr: false.
 */
const TargetCursor = dynamic(() => import('@/components/ui/TargetCursor'), { 
  ssr: false 
});

/**
 * ProtectionProvider memberikan lapisan keamanan tambahan untuk mencegah 
 * penyalinan konten dan pengambilan aset secara tidak sah.
 */
export function ProtectionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Memblokir Menu Klik Kanan (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Memblokir Shortcut Keyboard Umum untuk Copy & Inspect
    const handleKeyDown = (e: KeyboardEvent) => {
      // Memblokir Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+Shift+I, F12
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'a')) ||
        (e.metaKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'a')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.key === 'F12')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Memblokir Penyeretan Gambar (Image Dragging)
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <>
      <TargetCursor 
        spinDuration={3}
        hideDefaultCursor={true}
        parallaxOn={true}
        hoverDuration={0.2}
      />
      {children}
    </>
  );
}
