'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Database } from 'lucide-react';
import DatasetCard from '@/components/DatasetCard';
import datasetsJson from '@/data/datasets.json';

const allTags = ['All', 'RL', 'Manipulation', 'Navigation', 'Locomotion', 'Humanoid', 'Simulation', 'Real-World', 'Benchmark', 'Dexterous'];

export default function DatasetsPage() {
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState('All');

    const filtered = datasetsJson.filter((ds) => {
        const matchesSearch =
            ds.name.toLowerCase().includes(search.toLowerCase()) ||
            ds.description.toLowerCase().includes(search.toLowerCase()) ||
            ds.robot.toLowerCase().includes(search.toLowerCase());
        const matchesTag = activeTag === 'All' || ds.tags.includes(activeTag);
        return matchesSearch && matchesTag;
    });

    return (
        <div className="pt-16 bg-[#0B0F19] min-h-screen">
            {/* Page header */}
            <section className="relative px-6 md:px-12 lg:px-20 py-20 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            Dataset Catalog
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                            Explore <span className="gradient-text">Datasets</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                            Browse our curated collection of robotics and embodied AI datasets.
                            All datasets are standardized and ready for integration into your training pipeline.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="sticky top-16 z-30 px-6 md:px-12 lg:px-20 py-4 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/60">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search datasets, robots, formats..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/50 hover:border-slate-600/50 focus:border-indigo-500/50 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Tag filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <SlidersHorizontal className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1.5">
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(tag)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${activeTag === tag
                                            ? 'bg-indigo-600 text-white border border-indigo-500'
                                            : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:border-slate-600/60 hover:text-slate-300'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Dataset Grid */}
            <section className="px-6 md:px-12 lg:px-20 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Database className="w-4 h-4" />
                            <span>
                                <span className="text-slate-300 font-semibold">{filtered.length}</span> datasets found
                            </span>
                        </div>
                        <div className="text-xs text-slate-600 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/30">
                            Download available in Phase 2
                        </div>
                    </div>

                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((ds, i) => (
                                <DatasetCard key={ds.id} dataset={ds} index={i} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 text-slate-600"
                        >
                            <Database className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium text-slate-500">No datasets match your search</p>
                            <p className="text-sm mt-1">Try a different keyword or remove the tag filter.</p>
                            <button
                                onClick={() => { setSearch(''); setActiveTag('All'); }}
                                className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Clear filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
