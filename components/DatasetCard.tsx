'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Layers, BarChart3 } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { datasetCardT } from '@/lib/i18n';
import { DatasetListItem, formatBytes, getThumbnailUrl } from '@/lib/api';
import { parseTags, flattenTags } from '@/lib/tagConfig';

// category key → Tailwind color classes
const categoryColorMap: Record<string, string> = {
    robot_type: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    task_type: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    other: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200',
    data_type: 'bg-amber-50 text-amber-600 border-amber-200',
    data_format: 'bg-cyan-50 text-cyan-600 border-cyan-200',
};

const coverGradients = [
    'from-indigo-100 to-purple-50',
    'from-emerald-100 to-teal-50',
    'from-rose-100 to-orange-50',
    'from-amber-100 to-yellow-50',
    'from-cyan-100 to-sky-50',
    'from-purple-100 to-pink-50',
];

// UUID v4 格式检测（后端数据集 ID）
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = { dataset: DatasetListItem; index: number };

export default function DatasetCard({ dataset, index }: Props) {
    const { lang } = useLang();
    const t = datasetCardT[lang];
    const gradient = coverGradients[index % coverGradients.length];
    const [imgError, setImgError] = useState(false);

    // 解析 JSON 结构化 tags
    const tagsData = parseTags(dataset.tags);
    const tagList = flattenTags(tagsData);
    const sizeStr = formatBytes(dataset.size_bytes);

    // UUID 格式 → 后端 API 数据集，路由到 /datasets/view?id=
    const isBackendDataset = UUID_RE.test(dataset.id);
    const detailHref = isBackendDataset
        ? `/datasets/view?id=${dataset.id}`
        : `/datasets/${dataset.id}`;

    // 是否展示缩略图
    const showThumbnail = isBackendDataset && dataset.has_preview && dataset.thumbnail_path && !imgError;
    const thumbnailSrc = isBackendDataset ? getThumbnailUrl(dataset.id) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
            className="group rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
        >
            {/* Cover */}
            <div className={`h-36 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                {showThumbnail && thumbnailSrc ? (
                    <img
                        src={thumbnailSrc}
                        alt={dataset.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                            <polyline points="0,35 15,20 30,28 45,10 60,22 75,5 100,18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600" />
                        </svg>
                    </div>
                )}
                {/* Tag overlay */}
                <div className="absolute bottom-2 left-3 flex flex-wrap gap-1">
                    {tagList.slice(0, 2).map((item) => (
                        <span
                            key={item.category.key + ':' + item.value}
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium backdrop-blur-sm ${categoryColorMap[item.category.key] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}
                        >
                            {lang === 'en' ? item.displayEn : item.displayZh}
                        </span>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 mb-1.5 text-base leading-snug">{dataset.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{dataset.description ?? '暂无描述'}</p>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{dataset.total_episodes ?? '—'}</span>
                        <span>{t.tasks}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{dataset.total_frames?.toLocaleString() ?? '—'}</span>
                        <span>{t.trajectories}</span>
                    </div>
                    {sizeStr && sizeStr !== 'Unknown' && (
                        <span className="font-mono text-slate-400">{sizeStr}</span>
                    )}
                    <Link href={detailHref} className="ml-auto inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                        {t.details}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
