'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Sparkles, 
  BookOpen, 
  PenTool, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight, 
  Instagram, 
  Twitter, 
  Github, 
  Globe, 
  Heart
} from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import GridMotion from '@/components/welcome/GridMotion';
import ScrollVelocity from '@/components/welcome/ScrollVelocity';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function WelcomePage() {
  useAuthRedirect();

  const bookCovers = PlaceHolderImages.filter(img => img.id.startsWith('book-cover-')).map(img => img.imageUrl);
  
  const motionItems = [
    bookCovers[0],
    bookCovers[1],
    <div key='jsx-item-1' className="text-primary font-black uppercase text-[10px] tracking-widest px-4 text-center">Nusakarsa</div>,
    bookCovers[2],
    <div key='jsx-item-2' className="text-white/20 font-black italic text-xl px-4 text-center">Daya Cipta</div>,
    bookCovers[3],
    <div key='jsx-item-3' className="text-primary/40 font-black uppercase text-[10px] tracking-[0.5em] px-4 text-center">Akar Karsa</div>,
    bookCovers[4],
    bookCovers[5],
    <div key='jsx-item-4' className="text-white/10 text-4xl font-headline px-4 text-center">Pujangga</div>,
    bookCovers[6],
    bookCovers[7],
    bookCovers[0],
    bookCovers[1],
    bookCovers[2],
    bookCovers[3],
    bookCovers[4],
    bookCovers[5],
    bookCovers[6],
    bookCovers[7],
    bookCovers[0],
    <div key='jsx-item-5' className="text-primary font-black uppercase text-[10px] tracking-widest px-4 text-center">Nusa</div>,
    bookCovers[1],
    <div key='jsx-item-6' className="text-primary font-black uppercase text-[10px] tracking-widest px-4 text-center">Karsa</div>,
    bookCovers[2],
    bookCovers[3],
    bookCovers[4],
    bookCovers[5],
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden flex flex-col">
      {/* Background Cinematic */}
      <div className="fixed inset-0 z-0 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
        <GridMotion items={motionItems} gradientColor="rgba(0,0,0,0.8)" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-20 px-6 bg-gradient-to-b from-background/60 via-transparent to-background/80 min-h-[90vh]">
        <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-12">
          {/* Brand Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-tr from-primary via-accent to-primary shadow-2xl">
              <Logo className="w-24 h-24 md:w-32 md:h-32 rounded-[2.3rem] ring-4 ring-background" />
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.3em] border border-primary/20 backdrop-blur-md"
            >
              <Leaf className="h-3.5 w-3.5 animate-bounce" /> Akar Karsa, Daya Cipta Bangsa
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-8xl font-headline font-black tracking-tight leading-[0.9] text-foreground drop-shadow-2xl"
            >
              Nusa<span className="text-primary italic">karsa.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-base md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic leading-relaxed px-4"
            >
              "Ruang kolaborasi kreatif di mana setiap kehendak hati tumbuh menjadi mahakarya puitis yang melintasi batas zaman."
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 w-full max-w-lg pt-4"
          >
            <Button asChild size="lg" className="flex-1 rounded-[1.25rem] h-16 font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_50px_-12px_rgba(var(--primary),0.5)] bg-gradient-to-r from-primary to-accent border-none hover:scale-[1.05] hover:rotate-1 active:scale-95 transition-all group overflow-hidden">
              <Link href="/register" className="flex items-center justify-center">
                Mulai Berkarya 
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 rounded-[1.25rem] h-16 border-2 border-primary/20 font-black uppercase text-xs tracking-[0.2em] hover:bg-primary/5 hover:border-primary transition-all active:scale-95 shadow-xl bg-background/50 backdrop-blur-md group">
              <Link href="/login" className="flex items-center justify-center">
                Masuk Kembali
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </Button>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-16 border-t border-border/50"
          >
            {[
              { icon: BookOpen, title: "Literasi Digital", desc: "Arsip narasi tanpa batas." },
              { icon: PenTool, title: "Studio Penulis", desc: "Editor naskah industri pro." },
              { icon: Sparkles, title: "Karsa Estetik", desc: "Ruang apresiasi puitis." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group">
                <div className="p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-inner group-hover:shadow-primary/5">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-[11px] uppercase tracking-widest">{item.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Kinetic Velocity Text */}
      <div className="relative z-10 w-full overflow-hidden bg-background/40 backdrop-blur-sm border-y border-border/50">
        <ScrollVelocity 
          texts={['AKAR KARSA • DAYA CIPTA BANGSA', 'MAHAKARYA ABADI • NUSAKARSA']} 
          velocity={50}
          className="custom-scroll-text"
        />
      </div>

      {/* Premium Footer Full-Width */}
      <footer className="relative z-10 w-full mt-auto pt-20">
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        
        <div className="relative">
          <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl border-t border-white/20 dark:border-white/5 rounded-t-[3rem] md:rounded-t-[5rem] p-10 md:p-20 shadow-[0_-20px_100px_-20px_rgba(0,0,0,0.2)]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Brand Info */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="flex items-center gap-4">
                    <Logo className="h-14 w-14 rounded-2xl shadow-2xl ring-1 ring-primary/10" />
                    <div>
                      <h2 className="font-headline text-3xl font-black tracking-tight leading-none">Nusakarsa</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mt-2">Daya Cipta Bangsa</p>
                    </div>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium italic max-w-sm">
                    "Melestarikan akar kreativitas melalui teknologi, membangun peradaban sastra digital yang abadi dan bermartabat."
                  </p>
                  <div className="flex items-center gap-5 pt-4">
                    {[
                      { icon: Instagram, href: '#' },
                      { icon: Twitter, href: '#' },
                      { icon: Github, href: 'https://github.com/Zombiesigma' },
                      { icon: Globe, href: 'https://www.gunturpadilah.web.id/' }
                    ].map((social, i) => (
                      <a 
                        key={i} 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-500 shadow-sm border border-transparent hover:border-primary/20"
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-12 lg:gap-8">
                  <div className="space-y-8">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Navigasi</h4>
                    <ul className="space-y-5">
                      {['Eksplorasi', 'Panduan', 'Tentang'].map(item => (
                        <li key={item}>
                          <Link href={`/${item.toLowerCase()}`} className="text-base font-bold text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                            {item} <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-8">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Otoritas</h4>
                    <ul className="space-y-5">
                      {['Pusat Kendali', 'Karir Penulis', 'Keamanan'].map(item => (
                        <li key={item}>
                          <Link href="#" className="text-base font-bold text-muted-foreground hover:text-primary transition-colors">{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Copyright Bar */}
              <div className="mt-20 pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-center gap-8 opacity-40 grayscale select-none text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                  &copy; {new Date().getFullYear()} Nusakarsa. Dikelola dengan karsa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
