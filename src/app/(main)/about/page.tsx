'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Globe, PenTool, Cpu, Zap, ShieldCheck, Instagram, Twitter, Github, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const technologies = [
    { title: "TypeScript", desc: "Bahasa pemrograman dengan sistem tipe yang kuat untuk kode yang lebih aman, cepat, dan terstruktur.", icon: "https://svgl.app/library/typescript.svg" },
    { title: "Firebase", desc: "Infrastruktur Cloud Google yang menjamin keamanan data dan sinkronisasi real-time mahakarya.", icon: "https://svgl.app/library/firebase.svg" },
    { title: "Tailwind CSS", desc: "Sistem desain modern untuk antarmuka yang presisi, elegan, dan sepenuhnya responsif.", icon: "https://svgl.app/library/tailwindcss.svg" }
];

export default function AboutPage() {
  const initialArchitects = [
    {
        name: "Khalid Ar-Rahman",
        role: "Systems Architect",
        handle: "khalid_ar",
        avatar: "/tim/cek.png",
        quote: "Membangun fondasi digital yang kokoh untuk masa depan literasi.",
    },
    {
        name: "Guntur Padilah",
        role: "Lead Full-stack Developer",
        handle: "gunturpadilah",
        avatar: "/tim/cek.png",
        quote: "Setiap baris kode adalah sebuah puisi yang menunggu untuk dibaca.",
    },
    {
        name: "Nursyifa Aeni",
        role: "Creative Director",
        handle: "syifa_aeni",
        avatar: "/tim/cek.png",
        quote: "Desain adalah jembatan sunyi antara imajinasi dan realitas.",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-24 md:space-y-32 pb-32 relative overflow-x-hidden w-full px-4 pt-6">
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

      <section className="space-y-12 px-4">
        <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 flex items-center gap-3 whitespace-nowrap">
                <PenTool className="h-4 w-4 text-primary" /> Tim Arsitek
            </h2>
            <div className="h-px bg-border/50 flex-1" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initialArchitects.map((dev, i) => (
                <motion.div
                    key={dev.handle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                >
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl h-full bg-card/50 backdrop-blur-xl flex flex-col text-center transition-all duration-500 hover:-translate-y-2">
                        <div className="relative p-8 pt-16">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36">
                                <Image 
                                    src={dev.avatar} 
                                    alt={dev.name} 
                                    fill
                                    sizes="144px"
                                    className="object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                                />
                            </div>
                        </div>
                        
                        <div className="p-8 pt-12 space-y-4 bg-background/50 rounded-t-[2rem] flex-1 flex flex-col">
                            <h3 className="font-headline text-3xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                                {dev.name}
                            </h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{dev.role}</span>
                            </div>
                            
                            <div className="relative pt-6 flex-1 flex flex-col justify-center">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-background/50" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                                <p className="text-sm text-muted-foreground leading-relaxed italic bg-background/50 p-4 rounded-xl">
                                    "{dev.quote}"
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

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
      
      <footer className="relative z-10 w-full mt-auto pt-20">
        <div className="bg-card/50 backdrop-blur-3xl border-t rounded-t-[3rem] md:rounded-t-[5rem] p-10 md:p-20 shadow-[0_-20px_100px_-20px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
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

                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
                  <div className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-primary">Navigasi</h4>
                    <ul className="space-y-5">
                      {[
                        {label: 'Eksplorasi', href: '/search'}, 
                        {label: 'Panduan', href: '/guide'},
                        {label: 'Tentang', href: '/about'}
                      ].map(item => (
                        <li key={item.label}>
                          <Link href={item.href} className="text-base font-bold text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                            {item.label} <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-primary">Otoritas</h4>
                    <ul className="space-y-5">
                      {[
                        {label: 'Pusat Kendali', href: '/admin'}, 
                        {label: 'Karir Penulis', href: '/join-author'}
                      ].map(item => (
                        <li key={item.label}>
                          <Link href={item.href} className="text-base font-bold text-muted-foreground hover:text-primary transition-colors">{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-8">
                  </div>
                </div>
              </div>

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
