"use client";

import { useAppContext } from '@/context/app-context';
import React, { useState, useEffect } from 'react';

export function ParticleBackground() {
    const { theme } = useAppContext();
    const [particles, setParticles] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const createParticles = () => {
            const newParticles = Array.from({ length: 15 }).map((_, i) => {
                const size = Math.random() * 4 + 2;
                const style: React.CSSProperties = {
                    width: `${size}px`,
                    height: `${size}px`,
                    background: Math.random() > 0.5 ? 'hsl(var(--primary))' : 'hsl(var(--gold))',
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 15 + 10}s`,
                    animationDelay: `${Math.random() * 5}s`,
                };
                return <div key={i} className="particle" style={style}></div>;
            });
            setParticles(newParticles);
        };
        createParticles();
    }, [theme]); // Rerender on theme change to update colors

    return (
        <div id="particles" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles}
        </div>
    );
}
