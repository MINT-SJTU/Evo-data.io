'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Database, Zap, Shield, BarChart3, Globe, Cpu,
    ArrowRight, Play, ChevronRight,
} from 'lucide-react';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import DatasetCard from '@/components/DatasetCard';
import datasets from '@/data/datasets.json';

const features = [
    {
        icon: Database,
        title: 'Large-Scale Dataset Hosting',
        description: 'Store and serve datasets ranging from gigabytes to terabytes with optimized delivery pipelines and global CDN support.',
        gradient: 'from-indigo-500 to-blue-600',
    },
    {
        icon: Cpu,
        title: 'Robotics & RL Data Support',
        description: 'Native support for RLDS, HDF5, and ROS Bag formats. Designed specifically for robot learning and reinforcement learning workflows.',
        gradient: 'from-purple-500 to-violet-600',
    },
    {
        icon: Zap,
        title: 'Efficient Data Pipeline',
        description: 'Stream datasets directly into your training scripts. Compatible with TensorFlow Datasets, PyTorch DataLoader, and LeRobot.',
        gradient: 'from-cyan-500 to-teal-600',
    },
    {
        icon: BarChart3,
        title: 'Built-in Visualization',
        description: 'Explore trajectories, robot states, and sensor readings with interactive visualization tools directly in your browser.',
        gradient: 'from-rose-500 to-pink-600',
    },
    {
        icon: Shield,
        title: 'Open & Standardized',
        description: 'All datasets follow standardized metadata schemas. Clear licensing (CC BY, MIT, Apache) for research and commercial use.',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        icon: Globe,
        title: 'Community Driven',
        description: 'Upload your own datasets, submit benchmarks, and collaborate with the global robotics AI research community.',
        gradient: 'from-emerald-500 to-green-600',
    },
];

function SectionHeader({ badge, title, subtitle }: { badge: string; title: React.ReactNode; subtitle: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
        >
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                {badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{title}</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">{subtitle}</p>
        </motion.div>
    );
}

export default function HomePage() {
    const previewDatasets = datasets.slice(0, 3);

    return (
        <>
            {/* Hero */}
            <Hero />

            {/* Core Features Section */}
            <section className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-[#0B0F19] overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <SectionHeader
                        badge="Platform Capabilities"
                        title={<>Everything You Need for <span className="gradient-text">Robot Learning</span></>}
                        subtitle="A unified platform designed from the ground up for the unique challenges of robotics and embodied AI research."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <FeatureCard key={f.title} {...f} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Dataset Preview Section */}
            <section className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #0d1120 50%, #0B0F19 100%)' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent" />
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        badge="Featured Datasets"
                        title={<>Curated <span className="gradient-text">High-Quality</span> Datasets</>}
                        subtitle="Explore our growing collection of robotics datasets, from dexterous manipulation to legged locomotion."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {previewDatasets.map((ds, i) => (
                            <DatasetCard key={ds.id} dataset={ds} index={i} />
                        ))}
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-center mt-10"
                    >
                        <Link
                            href="/datasets"
                            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-indigo-500/40 text-slate-200 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                        >
                            View All Datasets
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Demo / Vision Section */}
            <section className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-[#0B0F19] overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                                Platform Vision
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Accelerating the <span className="gradient-text-cyan">Embodied AI</span> Revolution
                            </h2>
                            <p className="text-slate-400 text-base leading-relaxed mb-6">
                                Fragmented data is one of the biggest bottlenecks in robot learning research.
                                EvoData provides a unified, standardized, and accessible platform to break down
                                these barriers and enable faster iteration across the community.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Standardized data formats across all datasets',
                                    'One-click access from training scripts',
                                    'Community-driven dataset curation and benchmarks',
                                    'Future: real-time upload and streaming',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-slate-400">
                                        <span className="mt-1 w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex-shrink-0 flex items-center justify-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/about"
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Learn More About Our Roadmap
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Demo placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/50 aspect-video flex items-center justify-center group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-cyan-600/10" />
                                {/* Animated rings */}
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute w-32 h-32 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                                    <div className="absolute w-24 h-24 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                                    <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-7 h-7 text-indigo-400 ml-0.5" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                                    </div>
                                </div>
                                <span className="absolute top-4 left-4 text-xs text-slate-500 font-mono">demo_preview.mp4</span>
                            </div>
                            <p className="text-center text-xs text-slate-600 mt-3">Demo video coming soon</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="relative px-6 md:px-12 lg:px-20 py-20 bg-[#0d1120] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-indigo-600/10 rounded-full blur-3xl" />
                </div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                            Ready to <span className="gradient-text">Explore?</span>
                        </h2>
                        <p className="text-slate-500 mb-8 text-base">
                            Browse our curated collection of robotics datasets and start accelerating your research today.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/datasets"
                                className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                            >
                                Browse Datasets
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/about"
                                className="flex items-center gap-2 px-8 py-4 bg-transparent border border-slate-700/60 hover:border-slate-500/60 text-slate-300 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                            >
                                About the Project
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
