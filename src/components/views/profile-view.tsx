"use client";

import { useAppContext } from "@/context/app-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Shield, Bell, LogOut, ChevronRight } from "lucide-react";

export function ProfileView() {
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar')!;

    return (
        <section id="page-profile" className="page-section pt-28 md:pt-36">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-8 hover:border-primary/20 transition-colors">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative group">
                            <Avatar className="w-24 h-24 md:w-32 md:h-32 text-3xl md:text-4xl">
                                <AvatarImage src={userAvatar.src} alt="User Avatar" data-ai-hint={userAvatar.hint}/>
                                <AvatarFallback className="bg-gradient-to-br from-primary to-gold text-primary-foreground font-bold">NS</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="font-headline text-2xl md:text-3xl font-bold">Nusa Sakarsa</h2>
                            <p className="text-muted-foreground">nusa@nusakarsa.id</p>
                            <p className="text-sm text-muted-foreground mt-2">Bergabung sejak Januari 2024</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn-secondary px-5 py-2.5 text-sm">Edit</button>
                            <button className="btn-primary px-5 py-2.5 text-sm">Pro</button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard value="16" label="Buku Dibaca" color="primary" />
                    <StatCard value="14" label="Hari Streak" color="gold" />
                    <StatCard value="42" label="Jam Baca" color="teal" />
                    <StatCard value="8" label="Review" color="muted-foreground" />
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <h3 className="font-semibold px-6 py-4 border-b border-border">Pengaturan</h3>
                    <div className="divide-y divide-border">
                        <SettingsItem icon={<Shield />} label="Keamanan Akun" />
                        <SettingsItem icon={<Bell />} label="Notifikasi" />
                        <SettingsItem icon={<LogOut />} label="Keluar" isDestructive />
                    </div>
                </div>
            </div>
        </section>
    );
}

const StatCard = ({ value, label, color }: { value: string, label: string, color: string }) => (
    <div className={`bg-card border border-border rounded-2xl p-5 text-center hover:border-${color}/50 transition-colors cursor-pointer`}>
        <span className={`block text-3xl font-bold text-${color}`}>{value}</span>
        <span className="text-muted-foreground text-sm">{label}</span>
    </div>
);

const SettingsItem = ({ icon, label, isDestructive = false }: { icon: React.ReactNode, label: string, isDestructive?: boolean }) => (
    <button className={`w-full flex items-center justify-between px-6 py-4 hover:bg-bg-alt/50 transition-colors ${isDestructive ? "text-destructive" : ""}`}>
        <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{icon}</span>
            <span>{label}</span>
        </div>
        {!isDestructive && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </button>
);
