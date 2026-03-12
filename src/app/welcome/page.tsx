'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  BookOpen, 
  PenTool, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight, 
  Instagram, 
  Twitter, 
  Github, 
  Globe, 
  Heart,
  Cpu
} from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

export default function WelcomePage() {
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden flex flex-col">
      {/* Decorative Blobs */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Main Content Area */}
      <motion.div 
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-20 px-6">
        <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-12">
          {/* Brand Reveal */}
          <motion.div
            variants={sectionVariants}
            custom={0}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-tr from-primary via-accent to-primary/80 shadow-2xl shadow-primary/20">
              <Logo className="w-24 h-24 md:w-32 md:h-32 rounded-[2.3rem] ring-4 ring-background" />
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              variants={sectionVariants}
              custom={2}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-black uppercase tracking-[0.3em] border border-primary/20"
            >
              <Cpu className="h-4 w-4 animate-pulse" /> Gerbang Imajinasi Digital
            </motion.div>
            
            <motion.h1 
              variants={sectionVariants}
              custom={3}
              className="text-5xl md:text-8xl font-headline font-black tracking-tight leading-[0.9] text-foreground drop-shadow-sm"
            >
              Nusa<span className="text-primary italic">karsa.</span>
            </motion.h1>
            
            <motion.p 
              variants={sectionVariants}
              custom={4}
              className="text-base md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic leading-relaxed px-4"
            >
              "Platform kolaboratif untuk sastrawan dan kreator digital. Ciptakan, bagikan, dan abadikan karya Anda di era baru literasi."
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            variants={sectionVariants}
            custom={5}
            className="flex flex-col sm:flex-row gap-6 w-full max-w-lg pt-4"
          >
            <Button asChild size="lg" className="flex-1 rounded-[1.25rem] h-16 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.05] hover:rotate-1 active:scale-95 transition-all group">
              <Link href="/register" className="flex items-center justify-center">
                Mulai Berkarya 
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 rounded-[1.25rem] h-16 border-2 font-black uppercase text-xs tracking-[0.2em] hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95 shadow-lg bg-card/50 backdrop-blur-md group">
              <Link href="/login" className="flex items-center justify-center">
                Masuk Kembali
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </Button>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            variants={sectionVariants}
            custom={6}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-16 border-t border-border/50"
          >
            {[
              { icon: BookOpen, title: "Literasi Digital", desc: "Arsip narasi tanpa batas." },
              { icon: PenTool, title: "Studio Kreator", desc: "Editor naskah kelas industri." },
              { icon: Heart, title: "Ruang Apresiasi", desc: "Platform puitis digital." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group p-4 rounded-3xl bg-card/50 border border-transparent hover:border-primary/20 transition-all duration-500">
                <div className="p-4 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary text-muted-foreground transition-all duration-500 shadow-sm group-hover:shadow-primary/5">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1 text-center">
                  <h4 className="font-black text-sm text-foreground/90 tracking-wider">{item.title}</h4>
                  <p className="text-xs text-muted-foreground/70 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 w-full mt-auto pt-20">
        <div className="bg-card/50 backdrop-blur-3xl border-t rounded-t-[3rem] md:rounded-t-[5rem] p-10 md:p-20 shadow-[0_-20px_100px_-20px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Brand Info */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="flex items-center gap-4">
                    <Logo className="h-14 w-14 rounded-2xl shadow-2xl ring-1 ring-primary/10" />
                    <div>
                      <h2 className="font-headline text-3xl font-black tracking-tight leading-none text-foreground">Nusakarsa</h2>
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-2">Imajinasi Digital</p>
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
                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
                  <div className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-primary">Navigasi</h4>
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
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-primary">Otoritas</h4>
                    <ul className="space-y-5">
                      {['Pusat Kendali', 'Karir Penulis', 'Keamanan'].map(item => (
                        <li key={item}>
                          <Link href="#" className="text-base font-bold text-muted-foreground hover:text-primary transition-colors">{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-8">
                  </div>
                </div>
              </div>

              {/* Copyright Bar */}
              <div className="mt-20 pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-center gap-8 opacity-40 grayscale select-none text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em]">
                  &copy; {new Date().getFullYear()} Nusakarsa.
                </p>
              </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
