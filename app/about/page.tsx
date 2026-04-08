'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Lock, FileX, Building2, GraduationCap, Code2, FlaskConical } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { aboutT } from '@/lib/i18n';

const problemIcons = [FileX, Lock, AlertCircle];
// Research-Driven, Open Source, 物智进化, SJTU MINT Lab
const teamTagIcons = [Building2, GraduationCap, Code2];

const statusConfig = {
    current: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
    upcoming: { color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-400' },
    planned: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
    future: { color: 'text-slate-400', bg: 'bg-slate-700/20 border-slate-700/30', dot: 'bg-slate-500' },
};
const statusKeys = ['current', 'upcoming', 'planned', 'future'] as const;

export default function AboutPage() {
    const { lang } = useLang();
    const t = aboutT[lang];

    return (
        <div className="pt-16 bg-[#0B0F19] min-h-screen">
            {/* Header */}
            <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            {t.headerBadge}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-5">
                            {t.headerTitle1}
                            <span className="gradient-text">{t.headerTitleHighlight}</span>
                            {t.headerTitle2 && <><br />{t.headerTitle2}</>}
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.headerDesc}</p>
                    </motion.div>
                </div>
            </section>

            {/* Problem */}
            <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-slate-800/40">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full">
                            {t.problemBadge}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{t.problemTitle}</h2>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">{t.problemDesc}</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {t.problems.map((p, i) => {
                            const Icon = problemIcons[i];
                            return (
                                <motion.div key={p.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <h3 className="font-bold text-slate-100 mb-2">{p.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-slate-800/40" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #0d1120 100%)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                            <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                {t.featuresBadge}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{t.featuresTitle}</h2>
                            <p className="text-slate-400 leading-relaxed mb-6">{t.featuresDesc}</p>
                        </motion.div>
                        <motion.ul initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-3">
                            {t.capabilities.map((item, i) => (
                                <motion.li key={item} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="flex items-start gap-3 text-sm">
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
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full">
                            {t.roadmapBadge}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{t.roadmapTitle}</h2>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm">{t.roadmapDesc}</p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-slate-700/30 to-transparent hidden md:block" />
                        <div className="space-y-6">
                            {t.roadmap.map((phase, i) => {
                                const key = statusKeys[i];
                                const cfg = statusConfig[key];
                                const versionLabels = ['v0', 'v1', 'v2', 'v3'];
                                const statusLabel = t.statusLabels[key];
                                return (
                                    <motion.div key={phase.title} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="relative md:pl-16">
                                        <div className={`absolute left-3.5 top-5 w-5 h-5 rounded-full border-2 hidden md:flex items-center justify-center ${key === 'current' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700 bg-slate-900'}`}>
                                            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        </div>
                                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/40">{versionLabels[i]}</span>
                                                    <h3 className="font-bold text-lg text-slate-100">{phase.title}</h3>
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                    {statusLabel}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-4">{phase.desc}</p>
                                            <ul className="flex flex-wrap gap-2">
                                                {phase.items.map((item) => (
                                                    <li key={item} className="text-xs px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/40 text-slate-400">{item}</li>
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

            {/* Team */}
            <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-slate-800/40" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #0d1120 100%)' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            {t.teamBadge}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{t.teamTitle}</h2>
                        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">{t.teamDesc}</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {t.teamTags.map((label, i) => {
                                const Icon = teamTagIcons[i];
                                return (
                                    <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-sm text-slate-400">
                                        <Icon className="w-4 h-4 text-indigo-400" />
                                        {label}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
