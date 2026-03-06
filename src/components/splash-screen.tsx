'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative w-24 h-24">
          <Image
            src="https://raw.githubusercontent.com/Zombiesigma/nusakarsa-assets/main/download.webp"
            alt="Nusakarsa Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
                Nusakarsa
            </h1>
            <p className="text-muted-foreground tracking-wide mt-1">Membuka Semesta dalam Kata</p>
        </div>
      </motion.div>
      <motion.div
          initial={{ width: 0 }}
          animate={{ width: '50%', transition: { delay: 0.8, duration: 1.2, ease: 'circOut' } }}
          className="absolute bottom-1/4 h-0.5 bg-primary"
      />
      <p className="fixed bottom-10 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
          Loading Digital Archives...
      </p>
    </motion.div>
  );
}
