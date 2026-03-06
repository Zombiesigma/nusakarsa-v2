"use client";

import { useState, useEffect } from 'react';

export function ReadingProgressBar() {
    const [width, setWidth] = useState(0);

    const updateReadingProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        setWidth(Math.max(0, Math.min(100, progress)));
    };

    useEffect(() => {
        window.addEventListener('scroll', updateReadingProgress);
        return () => window.removeEventListener('scroll', updateReadingProgress);
    }, []);

    return (
        <div 
            className="fixed top-0 left-0 h-[3px] z-[1000] transition-all duration-100 ease-linear"
            style={{ 
                width: `${width}%`,
                background: 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--gold)))'
            }}
        />
    );
}
