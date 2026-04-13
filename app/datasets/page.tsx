'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import datasetsJson from '@/data/datasets.json';
import DatasetCard from '@/components/DatasetCard';
import { useLang } from '@/lib/LangContext';
import { datasetsT } from '@/lib/i18n';

export default function DatasetsPage() {
    const { lang } = useLang();
    const t = datasetsT[lang];

    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return datasetsJson.filter((d) => {
            const matchSearch = !q || d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
            const matchTag = !activeTag || d.tags.includes(activeTag);
            return matchSearch && matchTag;
        });
    }, [search, activeTag]);

    const allRawTags = ['Manipulation', 'Navigation', 'Locomotion', 'Dexterous', 'Humanoid', 'Assembly', 'Mobile', 'RL', 'Real-World'];

    return (
        <div className="pt-16 bg-slate-50 min-h-screen">
            {/* Header */}
            <section className="relative px-6 md:px-12 lg:px-20 py-16 md:py-20 overflow-hidden bg-white border-b border-slate-200">
                <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, rgba(99,102,241,0.07) 0%, transparent 60%)' }}
                />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full">
                            {t.badge}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            {t.title1}<span className="text-indigo-600">{t.titleHighlight}</span>
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">{t.desc}</p>
                    </motion.div>
                </div>
            </section>

            {/* Filter bar */}
            <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm px-6 md:px-12 lg:px-20 py-3.5">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
                        <button
                            onClick={() => setActiveTag('')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${!activeTag ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}
                        >
                            {t.allLabel}
                        </button>
                        {allRawTags.map((rawTag, i) => {
                            const label = t.tags[i] ?? rawTag;
                            return (
                                <button
                                    key={rawTag}
                                    onClick={() => setActiveTag(rawTag === activeTag ? '' : rawTag)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${activeTag === rawTag ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="px-6 md:px-12 lg:px-20 py-10">
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-slate-400 mb-6">{filtered.length} {t.found}</p>
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((dataset, i) => (
                                <DatasetCard key={dataset.id} dataset={dataset} index={i} />
                            ))}
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                            <p className="text-4xl mb-4">🔍</p>
                            <p className="text-slate-500">{t.noResults}</p>
                            <p className="text-sm text-slate-400 mt-1">{t.noResultsHint}</p>
                            <button
                                onClick={() => { setSearch(''); setActiveTag(''); }}
                                className="mt-4 text-sm text-indigo-600 hover:underline"
                            >
                                {t.clearFilters}
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
