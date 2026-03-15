'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  PenTool, 
  ArrowRight, 
  ChevronRight, 
  Instagram, 
  Twitter, 
  Github, 
  Globe, 
  Cpu,
  Users,
  Layers,
  Quote
} from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
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

  const welcomeBg = PlaceHolderImages.find(img => img.id === 'welcome-background')?.imageUrl || 'https://files.catbox.moe/tvbr0s.png';
  const featureStudioImg = PlaceHolderImages.find(img => img.id === 'feature-studio')?.imageUrl || 'https://picsum.photos/seed/studio/800/600';
  const featureExploreImg = PlaceHolderImages.find(img => img.id === 'feature-explore')?.imageUrl || 'https://picsum.photos/seed/explore/800/600';
  const featureCommunityImg = PlaceHolderImages.find(img => img.id === 'feature-community')?.imageUrl || 'https://picsum.photos/seed/community/800/600';
  const testimonial1Img = PlaceHolderImages.find(img => img.id === 'testimonial-1')?.imageUrl || 'https://picsum.photos/seed/test1/100/100';
  const testimonial2Img = PlaceHolderImages.find(img => img.id === 'testimonial-2')?.imageUrl || 'https://picsum.photos/seed/test2/100/100';
  const testimonial3Img = PlaceHolderImages.find(img => img.id === 'testimonial-3')?.imageUrl || 'https://picsum.photos/seed/test3/100/100';

  const features = [
      {
        icon: PenTool,
        title: "Studio Penulis Modern",
        description: "Editor canggih dengan auto-save, manajemen bab yang intuitif, dan kemampuan ekspor ke PDF profesional. Fokus pada cerita Anda, kami urus sisanya.",
        imageUrl: featureStudioImg,
        imageHint: "writing desk",
        color: "text-emerald-500",
        bg: "bg-emerald-500/5",
      },
      {
        icon: BookOpen,
        title: "Pengalaman Membaca Imersif",
        description: "Nikmati setiap karya dengan antarmuka bebas gangguan. Atur tema, ukuran font, dan dengarkan musik latar pilihan penulis untuk pengalaman yang tak terlupakan.",
        imageUrl: featureExploreImg,
        imageHint: "library bookshelf",
        color: "text-blue-500",
        bg: "bg-blue-500/5",
      },
      {
        icon: Users,
        title: "Komunitas Sastra Digital",
        description: "Terhubung dengan para pujangga dan pembaca lain. Beri apresiasi, tinggalkan ulasan, dan bangun reputasi Anda di semesta literasi Nusakarsa.",
        imageUrl: featureCommunityImg,
        imageHint: "community discussion",
        color: "text-purple-500",
        bg: "bg-purple-500/5",
      },
  ];

  const testimonials = [
      {
          name: 'Andrea Hirata',
          role: 'Penulis Laskar Pelangi',
          avatar: testimonial1Img,
          avatarHint: 'author portrait',
          quote: '"Nusakarsa adalah angin segar bagi dunia literasi. Sebuah panggung digital yang memberikan penulis kebebasan penuh untuk berekspresi dan terhubung dengan pembaca secara otentik."'
      },
      {
          name: 'Dee Lestari',
          role: 'Penulis Supernova',
          avatar: testimonial2Img,
          avatarHint: 'creative writer',
          quote: '"Platform ini memahami denyut nadi seorang penulis. Dari editor hingga sistem umpan baliknya, semuanya dirancang untuk mengalirkan kreativitas tanpa hambatan teknis."'
      },
      {
          name: 'Eka Kurniawan',
          role: 'Penulis Cantik Itu Luka',
          avatar: testimonial3Img,
          avatarHint: 'person reading',
          quote: '"Melihat sebuah platform lokal yang berani mendobrak tradisi dan memberikan ruang bagi karya-karya eksperimental adalah sebuah harapan baru. Nusakarsa adalah masa depan sastra digital Indonesia."'
      }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden flex flex-col">
      <main className="flex-1">
        <motion.section 
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full flex flex-col items-center justify-center py-20 md:py-32 px-6"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden">
              <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  poster={welcomeBg}
              >
                  <source src="/bg-video/bg.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="relative max-w-4xl w-full flex flex-col items-center text-center space-y-12">
            
            <motion.div
              variants={sectionVariants}
              custom={0}
              className="relative"
            >
              <div className="absolute -inset-8 bg-background/30 blur-3xl rounded-full animate-pulse" />
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
                "Platform untuk para penulis dan sastrawan. Kami percaya setiap karya berhak untuk dibaca, dan setiap suara layak untuk didengar."
              </motion.p>
            </div>

            <motion.div 
              variants={sectionVariants}
              custom={5}
              className="flex flex-col sm:flex-row gap-6 w-full max-w-lg pt-4"
            >
              <Button asChild size="lg" className="sm:flex-1 rounded-[1.25rem] h-16 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.05] hover:rotate-1 active:scale-95 transition-all group">
                <Link href="/register" className="flex items-center justify-center">
                  Gabung Gratis
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="sm:flex-1 rounded-[1.25rem] h-16 border-2 font-black uppercase text-xs tracking-[0.2em] hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95 shadow-lg bg-card/50 backdrop-blur-md group">
                <Link href="/login" className="flex items-center justify-center">
                  Masuk
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        <section className="max-w-6xl mx-auto py-20 md:py-32 px-6 space-y-24">
          <div className="text-center space-y-4">
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-black uppercase tracking-[0.3em] border border-primary/20">
                <Layers className="h-4 w-4" /> Pilar Utama
              </div>
            </motion.div>
            <motion.h2 variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="text-4xl md:text-6xl font-headline font-black tracking-tight leading-tight">
              Dibangun untuk <span className="text-primary italic">Penulis.</span>
            </motion.h2>
            <motion.p variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="text-base md:text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
              Nusakarsa adalah ekosistem yang dirancang untuk setiap tahap perjalanan sastra Anda, dari draf pertama hingga karya yang diterbitkan.
            </motion.p>
          </div>

          <div className="space-y-20">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={sectionVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, amount: 0.3 }}
                className={cn("grid md:grid-cols-2 gap-12 md:gap-16 items-center", index % 2 !== 0 && "md:grid-flow-row-dense")}
              >
                <div className={cn("relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border-4 border-background", index % 2 !== 0 && "md:col-start-2")}>
                  <Image src={feature.imageUrl} alt={feature.title} fill className="object-cover" data-ai-hint={feature.imageHint} sizes="50vw" />
                </div>
                <div className="space-y-5">
                  <div className={cn("p-4 rounded-2xl w-fit shadow-lg", feature.bg, feature.color)}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-headline font-black tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-20 md:py-32 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-xs md:text-sm font-black uppercase tracking-[0.3em] border border-accent/20">
                  Suara Komunitas
                </div>
              </motion.div>
              <motion.h2 variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="text-4xl md:text-6xl font-headline font-black tracking-tight leading-tight">
                Dipercaya oleh Para <span className="text-accent italic">Maestro.</span>
              </motion.h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div key={i} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                  <Card className="p-8 h-full rounded-3xl bg-card/80 backdrop-blur-md border-none shadow-xl">
                    <Quote className="h-8 w-8 text-primary/20 mb-6" />
                    <p className="text-muted-foreground italic leading-relaxed mb-8">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.avatarHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-black">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-40 px-6">
          <motion.div 
            variants={sectionVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight leading-tight">
              Siap Menjadi Bagian dari <span className="text-primary italic">Revolusi Sastra?</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Jangan biarkan idemu hanya tersimpan di dalam draf. Wujudkan, bagikan, dan bangun koneksi. Bergabunglah dengan ribuan penulis lain hari ini.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="rounded-2xl h-20 px-16 font-black uppercase text-base tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-105 transition-transform duration-300">
                <Link href="/register">Daftar Gratis</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 w-full mt-auto">
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

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-8">
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
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-primary">Legal</h4>
                    <ul className="space-y-5">
                      {[
                        {label: 'Karir Penulis', href: '/join-author'},
                        {label: 'Kebijakan Privasi', href: '/privacy'},
                        {label: 'Ketentuan Layanan', href: '/terms'}
                      ].map(item => (
                        <li key={item.label}>
                          <Link href={item.href} className="text-base font-bold text-muted-foreground hover:text-primary transition-colors">{item.label}</Link>
                        </li>
                      ))}
                    </ul>
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
