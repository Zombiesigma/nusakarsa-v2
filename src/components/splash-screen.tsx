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
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="relative w-24 h-24 mb-4"
        >
          <Image
            src="https://raw.githubusercontent.com/Zombiesigma/nusakarsa-assets/main/download.webp"
            alt="Nusakarsa Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        
        <div className="text-center overflow-hidden">
            <motion.h1
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1, transition: { delay: 0.5, duration: 0.7, ease: 'circOut' } }}
                className="font-headline text-4xl font-bold tracking-tight"
            >
                Nusakarsa
            </motion.h1>
        </div>
        <div className="text-center overflow-hidden">
            <motion.p
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1, transition: { delay: 0.7, duration: 0.7, ease: 'circOut' } }}
                className="text-muted-foreground tracking-wide mt-1"
            >
                Membuka Semesta dalam Kata
            </motion.p>
        </div>
      </div>
      
      <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { delay: 1.0, duration: 1.0, ease: 'circOut' } }}
          className="absolute bottom-1/4 h-0.5 w-1/3 bg-primary"
      />
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.5 } }}
        className="fixed bottom-10 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50"
      >
          Loading Digital Archives...
      </motion.p>
    </motion.div>
  );
}
