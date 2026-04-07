'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, HardDrive, Tag, Download, FileCode, Scale, Bot, ListChecks, Info } from 'lucide-react';
import datasetsJson from '@/data/datasets.json';

const tagColors: Record<string, string> = {
    'RL': 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    'Manipulation': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    'Simulation': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    'Real-World': 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    'Navigation': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    'Bimanual': 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    'Language-Conditioned': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    'Embodied AI': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    'Sim-to-Real': 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    'Benchmark': 'bg-red-500/10 text-red-300 border-red-500/20',
    'Domain Randomization': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    'Dexterous': 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20',
    'Grasping': 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    'Tactile': 'bg-lime-500/10 text-lime-300 border-lime-500/20',
    'RGB-D': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    'Locomotion': 'bg-green-500/10 text-green-300 border-green-500/20',
    'Legged Robot': 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    'Terrain': 'bg-stone-500/10 text-stone-300 border-stone-500/20',
    'Humanoid': 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    'Whole-Body': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    'Teleoperation': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    'MoCap': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
};

interface Dataset {
    id: string;
    name: string;
    description: string;
    size: string;
    tasks: number;
    trajectories: string;
    tags: string[];
    cover: string;
    robot: string;
    format: string;
    license: string;
}

export default function DatasetDetailClient({ dataset }: { dataset: Dataset }) {
    const metadata = [
        { icon: HardDrive, label: 'Size', value: dataset.size },
        { icon: ListChecks, label: 'Tasks', value: dataset.tasks.toString() },
        { icon: Bot, label: 'Robot', value: dataset.robot },
        { icon: FileCode, label: 'Format', value: dataset.format },
        { icon: Scale, label: 'License', value: dataset.license },
        { icon: Info, label: 'Trajectories', value: dataset.trajectories },
    ];

    return (
        <div className="pt-16 bg-[#0B0F19] min-h-screen">
            <div className="px-6 md:px-12 lg:px-20 py-12 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <Link
                        href="/datasets"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Datasets
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex flex-wrap gap-2 mb-4">
                                {dataset.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${tagColors[tag] ?? 'bg-slate-700/50 text-slate-400 border-slate-600/30'}`}
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{dataset.name}</h1>
                            <p className="text-slate-400 text-base leading-relaxed mb-8">{dataset.description}</p>

                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-cyan-600/15 border border-slate-700/50 aspect-video flex items-center justify-center mb-8">
                                <div className="text-slate-600 text-sm">Dataset Preview Coming Soon</div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60">
                                    <h2 className="font-bold text-slate-200 mb-3 text-sm uppercase tracking-widest">About this Dataset</h2>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {dataset.description} This dataset is designed for training and evaluating robot learning policies.
                                        It includes diverse scenarios and environmental conditions to improve policy generalization.
                                    </p>
                                </div>
                                <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-300 mb-1">Download Coming in Phase 2</p>
                                            <p className="text-xs text-amber-400/60">
                                                Dataset download functionality is planned for Phase 2 of the platform.
                                                For early access, please contact us via email.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-800/50 text-slate-600 font-semibold rounded-xl border border-slate-700/40 cursor-not-allowed text-sm"
                            title="Coming in Phase 2"
                        >
                            <Download className="w-4 h-4" />
                            Download (Coming Soon)
                        </button>

                        <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-slate-800/60">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Dataset Info</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {metadata.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Icon className="w-3.5 h-3.5" />
                                            <span className="text-xs">{label}</span>
                                        </div>
                                        <span className="text-xs font-medium text-slate-300 text-right max-w-[55%]">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-slate-800/60">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Related Datasets</h3>
                            </div>
                            <div className="p-3 space-y-1">
                                {datasetsJson.filter((d) => d.id !== dataset.id).slice(0, 3).map((d) => (
                                    <Link
                                        key={d.id}
                                        href={`/datasets/${d.id}`}
                                        className="block p-2.5 rounded-lg hover:bg-slate-800/50 transition-colors group"
                                    >
                                        <p className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors line-clamp-1">{d.name}</p>
                                        <p className="text-xs text-slate-600 mt-0.5">{d.size} · {d.tasks} tasks</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
