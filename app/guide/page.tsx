'use client';

import { motion } from 'framer-motion';
import { BookOpen, Download, Layers, GitFork } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { guideT } from '@/lib/i18n';

const featureIcons = [BookOpen, GitFork, Download, Layers];

export default function GuidePage() {
    const { lang } = useLang();
    const t = guideT[lang];

    return (
        <div className="pt-16 bg-slate-50 min-h-screen">
            {/* Header */}
            <section className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24 overflow-hidden bg-white border-b border-slate-200">
                <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 40% 60%, rgba(99,102,241,0.07) 0%, transparent 60%)' }}
                />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full">
                            {t.badge}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{t.title}</h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">{t.desc}</p>
                    </motion.div>
                </div>
            </section>

            {/* WIP Notice */}
            <section className="px-6 md:px-12 lg:px-20 py-10 border-b border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-8 rounded-2xl bg-indigo-50 border border-indigo-200 text-center"
                    >
                        <p className="text-3xl mb-4">🚧</p>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{t.wipTitle}</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">{t.wipDesc}</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/datasets"
                                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
                            >
                                {t.browseDatasetsBtn}
                            </Link>
                            <a
                                href="https://github.com/MINT-SJTU"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-semibold text-sm transition-colors"
                            >
                                <GitFork className="w-4 h-4" />
                                {t.githubBtn}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Planned Features */}
            <section className="px-6 md:px-12 lg:px-20 py-16">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-black text-slate-800 mb-1">{t.featuresTitle}</h2>
                        <p className="text-slate-400 text-sm">{t.featuresSubtitle}</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {t.features.map((f, i) => {
                            const Icon = featureIcons[i];
                            return (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
                                        <Icon className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1.5">{f.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
