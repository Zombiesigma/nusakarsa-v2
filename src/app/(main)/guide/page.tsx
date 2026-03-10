'use client';

import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  PenTool, 
  Users, 
  ShieldCheck, 
  HelpCircle,
  MessageCircle,
  Share2,
  Zap,
  Maximize2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function GuidePage() {
  const sections = [
    {
      id: "reader",
      icon: BookOpen,
      title: "Panduan Untuk Pembaca",
      description: "Jelajahi ribuan imajinasi dengan kenyamanan maksimal.",
      color: "text-blue-500",
      bg: "bg-blue-500/5",
      content: [
        { 
          q: "Bagaimana cara menemukan karya yang tepat?", 
          a: "Gunakan fitur 'Eksplorasi' di Beranda untuk melihat tren mingguan, atau gunakan bilah pencarian cerdas di bagian atas. Anda bisa mencari berdasarkan judul, genre, atau langsung mencari nama pujangga favorit Anda." 
        },
        { 
          q: "Personalisasi pengalaman membaca", 
          a: "Saat berada di dalam halaman baca, klik ikon 'Settings' di header. Anda dapat menyesuaikan ukuran huruf agar nyaman di mata dan beralih antara Mode Terang atau Mode Gelap." 
        },
        { 
          q: "Sistem Favorit & Koleksi", 
          a: "Menekan ikon 'Hati' pada detail buku akan menyimpan karya tersebut ke dalam tab 'Favorit' di profil Anda." 
        }
      ]
    },
    {
      id: "author",
      icon: PenTool,
      title: "Karir Sebagai Penulis",
      description: "Dari draf pertama hingga menjadi pujangga ternama.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/5",
      content: [
        { 
          q: "Manajemen Draf & Auto-save", 
          a: "Setiap bab yang Anda tulis akan disimpan secara otomatis setiap 15 detik ke Cloud." 
        },
        { 
          q: "Export ke PDF Profesional", 
          a: "Setelah karya Anda disetujui untuk terbit, sistem NusaKarsa akan menghasilkan file PDF dengan format premium yang siap dibagikan." 
        }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 md:space-y-16 pb-32 overflow-x-hidden">
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 pt-6 px-4"
      >
        <div className="mx-auto relative mb-6">
            <div className="relative bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl text-primary w-fit mx-auto ring-1 ring-primary/10">
                <HelpCircle className="h-10 w-10 md:h-12 md:w-12" />
            </div>
        </div>
        <div className="space-y-3">
            <h1 className="text-3xl md:text-6xl font-headline font-black tracking-tight leading-tight">
                Pusat <span className="text-primary italic underline decoration-primary/20">Bantuan</span> NusaKarsa
            </h1>
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-sm md:text-lg leading-relaxed px-2">
                Panduan lengkap untuk menavigasi ekosistem literasi digital modern—dari teks puitis hingga karya tulis lainnya.
            </p>
        </div>
      </motion.section>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 px-4">
        {[
            { icon: Maximize2, label: "Zen Mode", color: "text-indigo-500", bg: "bg-indigo-500/5" },
            { icon: ShieldCheck, label: "Eksport PDF", color: "text-emerald-500", bg: "bg-emerald-500/5" },
            { icon: Zap, label: "AI Helper", color: "text-orange-500", bg: "bg-orange-500/5" },
        ].map((item, i) => (
            <Card key={i} className="border-none shadow-xl bg-card/50 backdrop-blur-sm rounded-[1.5rem] p-4 md:p-6 flex flex-col items-center gap-3 group">
                <div className={cn("p-3 rounded-xl md:rounded-2xl", item.bg, item.color)}>
                    <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 text-center">{item.label}</p>
            </Card>
        ))}
      </div>

      <section className="space-y-8 md:space-y-10">
        <div className="flex items-center gap-4 px-6">
            <h2 className="text-lg md:text-2xl font-headline font-black tracking-tight whitespace-nowrap">Kategori <span className="text-primary">Eksplorasi</span></h2>
            <div className="h-px bg-border flex-1" />
        </div>

        <div className="grid gap-6 px-4">
            {sections.map((section, idx) => (
            <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
            >
                <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem] bg-card/50 backdrop-blur-md border border-white/10">
                    <CardHeader className="p-5 md:p-8 bg-muted/20 border-b">
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className={cn("p-3.5 md:p-4 rounded-[1.25rem] shadow-xl shrink-0", section.bg, section.color)}>
                                <section.icon className="h-6 w-6 md:h-7 md:w-7" />
                            </div>
                            <div>
                                <CardTitle className="font-headline text-lg md:text-2xl font-black">{section.title}</CardTitle>
                                <CardDescription className="font-medium text-[11px] md:text-sm mt-0.5">{section.description}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-10">
                        <Accordion type="single" collapsible className="w-full">
                            {section.content.map((item, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-b-border/30 last:border-0">
                                    <AccordionTrigger className="text-left font-black text-sm md:text-lg hover:no-underline group py-4 px-2">
                                        <span className="group-hover:text-primary transition-colors flex items-center gap-2.5">
                                            <div className="h-1 w-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors shrink-0" />
                                            {item.q}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed text-[13px] md:text-base font-medium pt-2 pb-6 pl-5 border-l-2 border-primary/10 ml-2 italic">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </motion.div>
            ))}
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="px-4"
      >
        <Card className="bg-background border-2 border-primary/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-center space-y-8 md:space-y-10 overflow-hidden relative shadow-2xl">
            <div className="relative z-10 space-y-4">
                <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-4 md:mb-6">
                    <MessageCircle className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="font-headline text-2xl md:text-4xl font-black leading-tight">Masih Punya Pertanyaan?</h3>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-lg font-medium px-2">Tim moderasi kami selalu siap sedia membantu perjalanan sastra Anda setiap harinya.</p>
            </div>

            <div className="relative z-10 flex justify-center items-center">
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 md:px-10 h-12 md:h-14 font-black text-[11px] md:text-sm uppercase tracking-widest border-2 hover:bg-primary/5 w-full sm:w-auto">
                    <Link href="/about"><Users className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Hubungi Tim</Link>
                </Button>
            </div>
        </Card>
      </motion.div>
    </div>
  );
}
