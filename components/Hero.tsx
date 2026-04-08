'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { heroT } from '@/lib/i18n';
import { siteStats } from '@/lib/siteStats';

function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const colors = ['#6366f1', '#a855f7', '#22d3ee', '#818cf8'];
        type Particle = { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; color: string };
        const particles: Particle[] = Array.from({ length: 80 }, () => ({
            x: Math.random() * width, y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.1,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = 'rgba(99,102,241,0.04)';
            ctx.lineWidth = 1;
            const gs = 60;
            for (let x = 0; x < width; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
            for (let y = 0; y < height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
                ctx.fill();
            });

            animFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(animFrameId); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Hero() {
    const { lang } = useLang();
    const t = heroT[lang];

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0B0F19]">
            <HeroCanvas />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center gap-6">
                    <motion.div variants={itemVariants}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            {t.badge}
                        </span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight">
                        <span className="text-white">{t.title1}</span>
                        <br />
                        <span className="gradient-text">{t.title2}</span>
                        <br />
                        <span className="text-white">{t.title3}</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                        {t.subtitle}
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-8 py-2">
                        {[
                            siteStats.formatted.datasets,
                            siteStats.formatted.trajectories,
                            siteStats.formatted.dataVolume,
                            siteStats.formatted.tasks,
                        ].map((value, i) => (
                            <div key={t.statLabels[i]} className="flex flex-col items-center">
                                <span className="text-2xl md:text-3xl font-black gradient-text">{value}</span>
                                <span className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{t.statLabels[i]}</span>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mt-2">
                        <Link
                            href="/datasets"
                            className="group flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                        >
                            {t.cta1}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/about"
                            className="group flex items-center gap-2 px-7 py-3.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 hover:border-slate-600/60 text-slate-200 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <Play className="w-4 h-4 text-cyan-400" />
                            {t.cta2}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 6, 0] }}
                transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
            >
                <span className="text-xs uppercase tracking-widest">{t.scroll}</span>
                <ChevronDown className="w-4 h-4" />
            </motion.div>
        </section>
    );
}
