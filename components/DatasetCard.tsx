'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Layers, BarChart3 } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { datasetCardT } from '@/lib/i18n';

const tagColorMap: Record<string, string> = {
    Manipulation: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    Navigation:   'bg-emerald-50 text-emerald-600 border-emerald-200',
    Locomotion:   'bg-amber-50 text-amber-600 border-amber-200',
    Dexterous:    'bg-purple-50 text-purple-600 border-purple-200',
    Humanoid:     'bg-rose-50 text-rose-600 border-rose-200',
    Assembly:     'bg-cyan-50 text-cyan-600 border-cyan-200',
    Mobile:       'bg-teal-50 text-teal-600 border-teal-200',
    RL:           'bg-orange-50 text-orange-600 border-orange-200',
    'Real-World': 'bg-sky-50 text-sky-600 border-sky-200',
};

const coverGradients = [
    'from-indigo-100 to-purple-50',
    'from-emerald-100 to-teal-50',
    'from-rose-100 to-orange-50',
    'from-amber-100 to-yellow-50',
    'from-cyan-100 to-sky-50',
    'from-purple-100 to-pink-50',
];

type Dataset = {
    id: string;
    name: string;
    description: string;
    tags: string[];
    tasks: number;
    trajectories: string;
    size: string;
    format: string;
};

type Props = { dataset: Dataset; index: number };

export default function DatasetCard({ dataset, index }: Props) {
    const { lang } = useLang();
    const t = datasetCardT[lang];
    const gradient = coverGradients[index % coverGradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
            className="group rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
        >
            {/* Cover */}
            <div className={`h-28 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                        <polyline points="0,35 15,20 30,28 45,10 60,22 75,5 100,18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600" />
                    </svg>
                </div>
                <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
                    {dataset.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tagColorMap[tag] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>{tag}</span>
                    ))}
                </div>
                <div className="absolute bottom-3 right-4 text-xs text-slate-400 font-mono">{dataset.size}</div>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 mb-2 text-base leading-snug">{dataset.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">{dataset.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{dataset.tasks}</span>
                        <span>{t.tasks}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{dataset.trajectories}</span>
                        <span>{t.trajectories}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">{dataset.format}</span>
                    <Link href={`/datasets/${dataset.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                        {t.details}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
