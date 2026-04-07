'use client';

import { motion } from 'framer-motion';
import { HardDrive, Tag, Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface Dataset {
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

interface DatasetCardProps {
    dataset: Dataset;
    index: number;
}

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

const defaultTagColor = 'bg-slate-700/50 text-slate-400 border-slate-600/30';

// Gradient cover placeholders (used when image is unavailable)
const coverGradients = [
    'from-indigo-600/30 via-purple-600/20 to-cyan-600/20',
    'from-blue-600/30 via-indigo-600/20 to-violet-600/20',
    'from-violet-600/30 via-purple-600/20 to-pink-600/20',
    'from-cyan-600/30 via-teal-600/20 to-emerald-600/20',
    'from-purple-600/30 via-violet-600/20 to-indigo-600/20',
    'from-rose-600/30 via-pink-600/20 to-purple-600/20',
];

export default function DatasetCard({ dataset, index }: DatasetCardProps) {
    const gradient = coverGradients[index % coverGradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-indigo-500/40 transition-all duration-300 overflow-hidden"
        >
            {/* Cover image / gradient placeholder */}
            <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-[#0B0F19]/20" />
                {/* Abstract robot shape */}
                <div className="relative z-10 flex flex-col items-center gap-2 opacity-60">
                    <div className="w-12 h-12 rounded-xl border-2 border-white/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-md bg-white/20" />
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-6 rounded-sm bg-white/15" />
                        <div className="w-3 h-6 rounded-sm bg-white/15" />
                    </div>
                </div>
                {/* Dataset size badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-slate-300 border border-white/10">
                    <HardDrive className="w-3 h-3" />
                    {dataset.size}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors mb-1.5 line-clamp-1">
                    {dataset.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                    {dataset.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                        <div className="text-slate-500 mb-0.5">Tasks</div>
                        <div className="font-semibold text-slate-300">{dataset.tasks}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                        <div className="text-slate-500 mb-0.5">Trajectories</div>
                        <div className="font-semibold text-slate-300">{dataset.trajectories}</div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {dataset.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${tagColors[tag] ?? defaultTagColor}`}
                        >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60">
                    <Link
                        href={`/datasets/${dataset.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-all duration-200"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                        Details
                    </Link>
                    <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-600 bg-slate-800/30 rounded-lg border border-slate-800/40 cursor-not-allowed"
                        title="Coming in Phase 2"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Download
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
