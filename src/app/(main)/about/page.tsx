'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Globe, PenTool, Cpu, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ProfileCard from '@/components/ProfileCard';

const architects = [
    {
        name: "Guntur Padilah",
        role: "Lead Full-stack Developer",
        handle: "gunturpadilah",
        avatar: "https://raw.githubusercontent.com/Zombiesigma/nusakarsa-assets/main/IMG-20251221-WA0058.jpg",
        glow: "rgba(66, 70, 25, 0.6)",
        gradient: "linear-gradient(145deg, #424619 0%, #a3b18a 100%)"
    },
    {
        name: "Khalid Ar-Rahman",
        role: "Systems Architect",
        handle: "khalid_ar",
        avatar: "https://picsum.photos/seed/khalid/600/800",
        glow: "rgba(49, 27, 146, 0.6)",
        gradient: "linear-gradient(145deg, #311b92 0%, #5c6bc0 100%)"
    },
    {
        name: "Nursyifa Aeni",
        role: "Creative Director",
        handle: "syifa_aeni",
        avatar: "https://picsum.photos/seed/syifa/600/800",
        glow: "rgba(190, 24, 93, 0.6)",
        gradient: "linear-gradient(145deg, #be185d 0%, #f472b6 100%)"
    }
];

const technologies = [
    { title: "TypeScript", desc: "Bahasa pemrograman dengan sistem tipe yang kuat untuk kode yang lebih aman, cepat, dan terstruktur.", icon: "https://svgl.app/library/typescript.svg" },
    { title: "Firebase", desc: "Infrastruktur Cloud Google yang menjamin keamanan data dan sinkronisasi real-time mahakarya.", icon: "https://svgl.app/library/firebase.svg" },
    { title: "Tailwind CSS", desc: "Sistem desain modern untuk antarmuka yang presisi, elegan, dan sepenuhnya responsif.", icon: "https://svgl.app/library/tailwindcss.svg" }
];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-24 md:space-y-32 pb-32 relative overflow-x-hidden w-full px-1 pt-6">
      <div className="absolute top-0 right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none animate-pulse" />
      
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 py-12 md:py-20"
      >
        <div className="flex justify-center mb-8">
            <div className="relative p-4 md:p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl shadow-primary/10 group overflow-hidden border border-border/50 ring-1 ring-primary/5">
                <Logo className="w-16 h-16 md:w-24 md:h-20 transition-transform duration-700 group-hover:scale-110" />
            </div>
        </div>
        <div className="space-y-6 max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
                <Cpu className="h-3.5 w-3.5" /> Evolusi Literasi Digital
            </div>
            <h1 className="text-4xl md:text-7xl font-headline font-black text-foreground leading-[1.1] tracking-tight">
                Menghidupkan Jiwa <br/> Lewat <span className="text-primary italic underline decoration-primary/10">Teknologi.</span>
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground leading-relaxed font-medium italic px-2 max-w-2xl mx-auto">
                "Nusakarsa bukan sekadar platform, ia adalah rumah bagi imajinasi murni di mana setiap karsa tumbuh menjadi mahakarya abadi."
            </p>
        </div>
      </motion.section>

      <section className="space-y-12">
        <div className="flex items-center gap-4 px-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 flex items-center gap-3 whitespace-nowrap">
                <Globe className="h-4 w-4 text-primary" /> Fondasi Platform
            </h2>
            <div className="h-px bg-border/50 flex-1" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            {[
                { icon: Cpu, title: "Teknologi Terdepan", desc: "Menggunakan infrastruktur cloud modern untuk memastikan setiap detik pengalaman sastra Anda terasa magis dan aman.", color: "text-emerald-500" },
                { icon: Zap, title: "Inspirasi Tanpa Batas", desc: "Kami membangun antarmuka yang bebas gangguan agar kreativitas Anda dapat mengalir dengan murni dari hati.", color: "text-orange-500" }
            ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md rounded-[2.5rem] p-8 h-full flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500 border border-white/10 relative overflow-hidden">
                        <div className={cn("p-5 rounded-2xl bg-muted/50 mb-8 transition-all group-hover:bg-primary group-hover:text-white shadow-inner relative z-10", item.color)}>
                            <item.icon className="h-8 w-8 md:h-10 md:w-10" />
                        </div>
                        <h3 className="text-xl font-black mb-3 uppercase tracking-tight">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-xs md:text-sm font-medium">{item.desc}</p>
                    </Card>
                </motion.div>
            ))}
        </div>
      </section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="space-y-12 px-4">
        <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 flex items-center gap-3 whitespace-nowrap">
                <PenTool className="h-4 w-4 text-primary" /> Tim Arsitek
            </h2>
            <div className="h-px bg-border/50 flex-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
            {architects.map((dev, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex justify-center"
                >
                    <ProfileCard 
                        name={dev.name}
                        title={dev.role}
                        handle={dev.handle}
                        status="Active"
                        avatarUrl={dev.avatar}
                        behindGlowColor={dev.glow}
                        innerGradient={dev.gradient}
                        enableTilt={true}
                        behindGlowEnabled={true}
                        contactText="Profil Arsitek"
                        className="w-full"
                    />
                </motion.div>
            ))}
        </div>
      </motion.section>

      <section className="space-y-16 px-4">
        <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tight">Kekuatan di Balik <span className="text-primary italic underline decoration-primary/10">Sistem.</span></h2>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                Nusakarsa dibangun dengan tumpukan teknologi modern untuk memastikan setiap detik pengalaman sastra Anda terasa magis, cepat, dan aman.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {technologies.map((tech, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                    <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm rounded-[2rem] p-8 text-center border border-white/5 group h-full">
                        <div className="h-12 w-12 md:h-16 md:w-16 relative mb-8 mx-auto transition-all duration-700 group-hover:scale-110 drop-shadow-lg">
                            <Image src={tech.icon} alt={tech.title} fill className="object-contain" />
                        </div>
                        <h4 className="font-black text-xs md:text-sm mb-3 uppercase tracking-[0.1em] text-foreground">{tech.title}</h4>
                        <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed font-medium">{tech.desc}</p>
                    </Card>
                </motion.div>
            ))}
        </div>
      </section>

      <div className="text-center space-y-6 opacity-40 select-none grayscale pb-16">
          <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Nusakarsa Digital</span>
          </div>
      </div>
    </div>
  );
}
