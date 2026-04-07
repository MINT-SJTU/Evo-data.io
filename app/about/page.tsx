'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Lock, FileX, Rocket, Package, Upload, BarChart2, Users } from 'lucide-react';

const problems = [
    {
        icon: FileX,
        title: 'Dataset Scarcity',
        description: 'High-quality labeled robotics datasets are extremely scarce and difficult to obtain, limiting research progress.',
    },
    {
        icon: Lock,
        title: 'Difficult Access',
        description: 'Existing datasets are scattered across institutions with inconsistent access methods, making reproducibility a challenge.',
    },
    {
        icon: AlertCircle,
        title: 'Lack of Standardization',
        description: 'Incompatible formats and metadata schemas force researchers to spend weeks on data wrangling instead of research.',
    },
];

const capabilities = [
    'Standardized dataset hosting with unified metadata schema',
    'Support for RLDS, HDF5, ROS Bag, and other common formats',
    'Direct integration with popular training frameworks',
    'Built-in trajectory visualization and data exploration tools',
    'Versioned datasets with full provenance tracking',
    'Open licensing with clear terms for research and commercial use',
    'Community-driven dataset curation and quality control',
    'Benchmarking suite for policy evaluation',
];

const roadmap = [
    {
        version: 'v0',
        title: 'Static Showcase',
        status: 'current',
        description: 'Static website showcasing the platform vision, dataset previews, and project roadmap.',
        items: ['Landing page with platform overview', 'Dataset catalog with mock data', 'Design system & component library'],
    },
    {
        version: 'v1',
        title: 'Dataset Browsing',
        status: 'upcoming',
        description: 'Full dataset browsing and search functionality with real data.',
        items: ['Real dataset metadata API', 'Full-text search & filtering', 'Dataset detail pages', 'Preview & visualization'],
    },
    {
        version: 'v2',
        title: 'Upload & Download',
        status: 'planned',
        description: 'Enable the community to upload and download datasets with proper authentication.',
        items: ['User authentication system', 'Dataset upload pipeline', 'Chunked download with resume', 'Alibaba Cloud OSS integration'],
    },
    {
        version: 'v3',
        title: 'Benchmark & Community',
        status: 'future',
        description: 'Community features and benchmark evaluation platform.',
        items: ['Benchmark leaderboards', 'Community dataset contributions', 'Policy evaluation tools', 'API access tokens'],
    },
];

const statusConfig = {
    current: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400', label: 'In Progress' },
    upcoming: { color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-400', label: 'Upcoming' },
    planned: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400', label: 'Planned' },
    future: { color: 'text-slate-400', bg: 'bg-slate-700/20 border-slate-700/30', dot: 'bg-slate-500', label: 'Future' },
};

export default function AboutPage() {
    return (
        <div className="pt-16 bg-[#0B0F19] min-h-screen">
            {/* Page header */}
            <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            About the Project
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-5">
                            Building the <span className="gradient-text">Data Foundation</span>
                            <br />for Embodied AI
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            EvoData is an open data platform developed at MINT Lab, SJTU. Our mission is to
                            democratize access to high-quality robotics datasets and accelerate the development
                            of intelligent embodied systems.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Background / Problem */}
            <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-slate-800/40">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full">
                            The Problem
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Why Does This Platform Exist?
                        </h2>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">
                            Robot learning research faces unique data challenges that existing platforms are not designed to address.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {problems.map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60"
                            >
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                                    <p.icon className="w-5 h-5 text-rose-400" />
                                </div>
                                <h3 className="font-bold text-slate-100 mb-2">{p.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Capabilities */}
            <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-slate-800/40" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #0d1120 100%)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                Platform Features
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">What EvoData Offers</h2>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                A comprehensive data infrastructure platform purpose-built for the robotics and embodied AI research community.
                            </p>
                        </motion.div>
                        <motion.ul
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-3"
                        >
                            {capabilities.map((item, i) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    className="flex items-start gap-3 text-sm"
                                >
                                    <span className="mt-1 w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex-shrink-0 flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    </span>
                                    <span className="text-slate-400">{item}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                </div>
            </section>

            {/* Roadmap */}
            <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-slate-800/40 bg-[#0B0F19]">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full">
                            Development Roadmap
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Building Towards a Full Platform</h2>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm">From static showcase to a full-featured data ecosystem for the robotics community.</p>
                    </motion.div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-slate-700/30 to-transparent hidden md:block" />

                        <div className="space-y-6">
                            {roadmap.map((phase, i) => {
                                const cfg = statusConfig[phase.status as keyof typeof statusConfig];
                                return (
                                    <motion.div
                                        key={phase.version}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="relative md:pl-16"
                                    >
                                        {/* Timeline dot */}
                                        <div className={`absolute left-3.5 top-5 w-5 h-5 rounded-full border-2 hidden md:flex items-center justify-center ${cfg.dot === 'bg-emerald-400' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700 bg-slate-900'}`}>
                                            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        </div>

                                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/40">
                                                        {phase.version}
                                                    </span>
                                                    <h3 className="font-bold text-lg text-slate-100">{phase.title}</h3>
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-4">{phase.description}</p>
                                            <ul className="flex flex-wrap gap-2">
                                                {phase.items.map((item) => (
                                                    <li key={item} className="text-xs px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/40 text-slate-400">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team / Lab */}
            <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-slate-800/40" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #0d1120 100%)' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            Our Team
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Built at MINT Lab, SJTU</h2>
                        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">
                            EvoData is developed by the MINT Lab at Shanghai Jiao Tong University,
                            a research group focused on robot learning, manipulation intelligence, and embodied AI.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                { icon: Rocket, label: 'Research-Driven' },
                                { icon: Package, label: 'Open Source' },
                                { icon: Upload, label: 'Community First' },
                                { icon: Users, label: 'SJTU MINT Lab' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-sm text-slate-400">
                                    <Icon className="w-4 h-4 text-indigo-400" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
