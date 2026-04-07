'use client';

import { motion } from 'framer-motion';
import { BookOpen, Code2, Terminal, Plug, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const comingSoonFeatures = [
    {
        icon: BookOpen,
        title: 'Getting Started Guide',
        description: 'Step-by-step tutorial to set up EvoData and access your first dataset.',
    },
    {
        icon: Code2,
        title: 'API Reference',
        description: 'Complete API documentation for programmatic dataset access and management.',
    },
    {
        icon: Terminal,
        title: 'CLI Tools',
        description: 'Command-line interface for dataset download, upload, and management.',
    },
    {
        icon: Plug,
        title: 'Framework Integrations',
        description: 'Ready-to-use integrations for LeRobot, TensorFlow Datasets, and PyTorch.',
    },
];

export default function GuidePage() {
    return (
        <div className="pt-16 bg-[#0B0F19] min-h-screen flex flex-col">
            <section className="flex-1 relative px-6 md:px-12 lg:px-20 py-20 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 mx-auto">
                            <BookOpen className="w-8 h-8 text-indigo-400" />
                        </div>
                        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            Documentation
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-5">
                            Guide & <span className="gradient-text">Documentation</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-amber-400 mb-4">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">Coming Soon</span>
                        </div>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                            Comprehensive documentation and guides for the EvoData platform are currently in progress.
                            They will be available alongside Phase 2 of the platform launch.
                        </p>
                    </motion.div>

                    {/* Features preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
                        {comingSoonFeatures.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                    <f.icon className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 mb-1 text-sm">{f.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sneak peek code block */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="rounded-2xl bg-slate-900/60 border border-slate-700/50 overflow-hidden mb-12"
                    >
                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/60 bg-slate-900/80">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <span className="text-xs text-slate-600 font-mono ml-2">example_usage.py</span>
                            </div>
                            <span className="text-xs text-slate-600">Sneak Peek</span>
                        </div>
                        <pre className="p-6 text-sm font-mono overflow-x-auto text-slate-400 leading-relaxed">
                            <span className="text-slate-600"># Coming in Phase 2 — API preview{'\n'}</span>
                            <span className="text-violet-400">import</span>
                            <span className="text-slate-300"> evodata{'\n\n'}</span>
                            <span className="text-slate-600"># Load a dataset directly{'\n'}</span>
                            <span className="text-slate-300">dataset = evodata.</span>
                            <span className="text-cyan-400">load</span>
                            <span className="text-slate-300">(</span>
                            <span className="text-emerald-400">&quot;robomanip-1m&quot;</span>
                            <span className="text-slate-300">){'\n\n'}</span>
                            <span className="text-slate-600"># Stream trajectories{'\n'}</span>
                            <span className="text-violet-400">for</span>
                            <span className="text-slate-300"> episode </span>
                            <span className="text-violet-400">in</span>
                            <span className="text-slate-300"> dataset.</span>
                            <span className="text-cyan-400">stream</span>
                            <span className="text-slate-300">(batch_size=</span>
                            <span className="text-amber-400">32</span>
                            <span className="text-slate-300">):{'\n'}</span>
                            <span className="text-slate-300">    train(episode){'\n\n'}</span>
                            <span className="text-slate-600"># Or use with PyTorch DataLoader{'\n'}</span>
                            <span className="text-slate-300">loader = dataset.</span>
                            <span className="text-cyan-400">to_dataloader</span>
                            <span className="text-slate-300">(framework=</span>
                            <span className="text-emerald-400">&quot;pytorch&quot;</span>
                            <span className="text-slate-300">)</span>
                        </pre>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center"
                    >
                        <p className="text-slate-500 text-sm mb-5">
                            Want to stay updated? Reach out to us or watch our GitHub repository.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="mailto:contact@evo-data.io"
                                className="group inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 text-sm hover:shadow-lg hover:shadow-indigo-500/25"
                            >
                                Contact Us
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <Link
                                href="/datasets"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 font-semibold rounded-xl transition-all duration-200 text-sm"
                            >
                                Browse Datasets
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
