"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function ProfileView() {

    return (
        <section id="page-profile" className="page-section pt-28 md:pt-36">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                    <LogIn className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1}/>
                    <h1 className="font-headline text-3xl font-bold mb-4">Akses Terbatas</h1>
                    <p className="text-muted-foreground mb-8">
                        Silakan masuk atau daftar untuk melihat profil Anda, mengelola pustaka, dan menikmati semua fitur.
                    </p>
                    <Button className="btn-primary w-full max-w-xs mx-auto py-3 rounded-xl font-semibold">
                        Masuk / Daftar
                    </Button>
                </div>
            </div>
        </section>
    );
}
