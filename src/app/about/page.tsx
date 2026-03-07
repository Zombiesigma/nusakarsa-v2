'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Sparkles, Code, Palette, Server, Info } from 'lucide-react';

const developers = [
  {
    name: 'Elara Vance',
    role: 'Full-Stack Alchemist',
    bio: 'Memadukan logika backend dengan sihir frontend untuk menciptakan pengalaman yang mulus dan intuitif.',
    avatarId: 'dev-1',
    icon: <Code className="h-5 w-5" />
  },
  {
    name: 'Kaelen Rhys',
    role: 'UI/UX Visionary',
    bio: 'Merancang antarmuka yang tidak hanya indah secara visual, tetapi juga bercerita dan mudah digunakan.',
    avatarId: 'dev-2',
    icon: <Palette className="h-5 w-5" />
  },
  {
    name: 'Orion Valerius',
    role: 'Cloud & AI Architect',
    bio: 'Membangun fondasi infrastruktur yang kokoh dan cerdas, memastikan aplikasi berjalan cepat dan andal.',
    avatarId: 'dev-3',
    icon: <Server className="h-5 w-5" />
  },
];

export default function AboutPage() {
  return (
    <section id="page-about" className="page-section pt-28 md:pt-36">
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="h-3 w-3" /> Misi Kami
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">Tentang Nusakarsa</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Nusakarsa lahir dari sebuah mimpi sederhana: untuk membangun sebuah panggung digital di mana setiap kata memiliki makna dan setiap cerita menemukan rumahnya. Kami percaya bahwa literasi adalah jembatan menuju pemahaman, dan teknologi adalah alat untuk membangun jembatan itu. Di sini, penulis dan pembaca bertemu dalam sebuah ekosistem yang menghargai kualitas, kreativitas, dan kolaborasi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-center font-headline text-4xl md:text-5xl font-bold mb-12">Tim di Balik Layar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {developers.map((dev, index) => (
                <motion.div
                  key={dev.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                  className="bg-card p-8 rounded-[2.5rem] shadow-xl border border-border/50 text-center group flex flex-col"
                >
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <Image
                      src={PlaceHolderImages.find(p => p.id === dev.avatarId)?.imageUrl || ''}
                      alt={`Avatar of ${dev.name}`}
                      fill
                      className="rounded-full object-cover shadow-lg border-4 border-white/10 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-headline text-2xl font-bold mb-1">{dev.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                    {dev.icon}
                    <span>{dev.role}</span>
                  </div>
                  <p className="text-muted-foreground text-sm flex-grow">{dev.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
