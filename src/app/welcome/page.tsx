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
  Heart,
  Cpu
} from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import ScrollVelocity from '@/components/welcome/ScrollVelocity';

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
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden flex flex-col">
      {/* Background Futuristic */}
      <div className="fixed inset-0 z-0 opacity-70">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:36px_36px] opacity-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_30%,transparent_100%)]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
          <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-slate-950 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-cyan-500/10 blur-[200px] rounded-full animate-pulse" />
      </div>

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
            <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-tr from-cyan-500 via-blue-500 to-cyan-400 shadow-2xl shadow-cyan-500/20">
              <Logo className="w-24 h-24 md:w-32 md:h-32 rounded-[2.3rem] ring-4 ring-slate-900" />
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              variants={sectionVariants}
              custom={2}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 text-cyan-400 text-xs md:text-sm font-black uppercase tracking-[0.3em] border border-cyan-400/20 backdrop-blur-md"
            >
              <Cpu className="h-4 w-4 animate-pulse" /> Gerbang Imajinasi Digital
            </motion.div>
            
            <motion.h1 
              variants={sectionVariants}
              custom={3}
              className="text-5xl md:text-8xl font-headline font-black tracking-tight leading-[0.9] text-white drop-shadow-2xl"
            >
              Nusa<span className="text-cyan-400 italic">karsa.</span>
            </motion.h1>
            
            <motion.p 
              variants={sectionVariants}
              custom={4}
              className="text-base md:text-xl text-slate-400 font-medium max-w-2xl mx-auto italic leading-relaxed px-4"
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
            <Button asChild size="lg" className="flex-1 rounded-[1.25rem] h-16 font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_50px_-12px_rgba(0,255,255,0.3)] bg-cyan-400 text-slate-900 border-none hover:bg-cyan-300 hover:scale-[1.05] hover:rotate-1 active:scale-95 transition-all group">
              <Link href="/register" className="flex items-center justify-center">
                Mulai Berkarya 
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 rounded-[1.25rem] h-16 border-2 border-cyan-400/20 font-black uppercase text-xs tracking-[0.2em] text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all active:scale-95 shadow-xl bg-slate-900/50 backdrop-blur-md group">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-16 border-t border-cyan-400/10"
          >
            {[
              { icon: BookOpen, title: "Literasi Digital", desc: "Arsip narasi tanpa batas." },
              { icon: PenTool, title: "Studio Kreator", desc: "Editor naskah kelas industri." },
              { icon: Sparkles, title: "Ruang Apresiasi", desc: "Ekosistem puitis digital." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group p-4 rounded-3xl bg-slate-900/50 border border-transparent hover:border-cyan-400/20 transition-all duration-500">
                <div className="p-4 rounded-2xl bg-slate-800/80 group-hover:bg-cyan-400/10 group-hover:text-cyan-400 text-slate-400 transition-all duration-500 shadow-inner group-hover:shadow-cyan-500/5">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1 text-center">
                  <h4 className="font-black text-sm text-white/90 tracking-wider">{item.title}</h4>
                  <p className="text-xs text-slate-400/70 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Kinetic Velocity Text */}
      <div className="relative z-10 w-full overflow-hidden bg-slate-950/80 backdrop-blur-sm border-y border-cyan-400/10">
        <ScrollVelocity 
          texts={['PLATFORM KREATIF DIGITAL', 'CIPTAKAN KARYA ABADI']} 
          velocity={-30}
          className="text-cyan-400"
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full mt-auto pt-20">
        <div className="bg-slate-950/50 backdrop-blur-3xl border-t border-cyan-400/10 rounded-t-[3rem] md:rounded-t-[5rem] p-10 md:p-20 shadow-[0_-20px_100px_-20px_rgba(0,0,0,0.2)]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Brand Info */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="flex items-center gap-4">
                    <Logo className="h-14 w-14 rounded-2xl shadow-2xl ring-1 ring-cyan-500/10" />
                    <div>
                      <h2 className="font-headline text-3xl font-black tracking-tight leading-none text-white">Nusakarsa</h2>
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400/60 mt-2">Imajinasi Digital</p>
                    </div>
                  </div>
                  <p className="text-base md:text-lg text-slate-400 leading-relaxed font-medium italic max-w-sm">
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
                        className="h-12 w-12 rounded-2xl bg-cyan-400/5 flex items-center justify-center text-slate-400 hover:bg-cyan-400 hover:text-slate-900 transition-all duration-500 shadow-sm border border-transparent hover:border-cyan-400/20"
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
                  <div className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-cyan-400">Navigasi</h4>
                    <ul className="space-y-5">
                      {['Eksplorasi', 'Panduan', 'Tentang'].map(item => (
                        <li key={item}>
                          <Link href={`/${item.toLowerCase()}`} className="text-base font-bold text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center group">
                            {item} <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-cyan-400">Otoritas</h4>
                    <ul className="space-y-5">
                      {['Pusat Kendali', 'Karir Penulis', 'Keamanan'].map(item => (
                        <li key={item}>
                          <Link href="#" className="text-base font-bold text-slate-400 hover:text-cyan-400 transition-colors">{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-cyan-500/5 border border-cyan-400/10 shadow-inner relative overflow-hidden group">
                      <Sparkles className="absolute -top-4 -right-4 h-20 w-20 text-cyan-400/10 group-hover:scale-150 transition-transform duration-1000" />
                      <p className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                        <Heart className="h-4 w-4 fill-current" /> Kontribusi
                      </p>
                      <p className="text-base font-bold leading-relaxed text-slate-400/80 italic">
                        Mari bersama merawat ekosistem literasi bangsa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copyright Bar */}
              <div className="mt-20 pt-10 border-t border-cyan-400/10 flex flex-col md:flex-row items-center justify-center gap-8 opacity-40 grayscale select-none text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em]">
                  &copy; {new Date().getFullYear()} Nusakarsa. Dikelola dengan karsa.
                </p>
              </div>
            </div>
          </div>
      </footer>
    </div>
  );
}
