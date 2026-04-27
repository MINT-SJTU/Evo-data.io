'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Download, AlertTriangle, Database, Loader2, Lock } from 'lucide-react'; import datasetsJson from '@/data/datasets.json';
import DatasetCard from '@/components/DatasetCard';
import DatasetVisualizer from '@/components/DatasetVisualizer';
import { useLang } from '@/lib/LangContext';
import { detailT } from '@/lib/i18n';
import { useAuth } from '@/lib/AuthContext';
import { getDownloadUrl } from '@/lib/api';

type Dataset = {
    id: string;
    name: string;
    description: string;
    tags: string[];
    tasks: number;
    trajectories: string;
    size: string;
    format: string;
    license?: string;
    robot?: string;
    hf_id?: string | null;
};

type Props = { dataset: Dataset };

const tagColorMap: Record<string, string> = {
    Manipulation: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    Navigation: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Locomotion: 'bg-amber-50 text-amber-600 border-amber-200',
    Dexterous: 'bg-purple-50 text-purple-600 border-purple-200',
    Humanoid: 'bg-rose-50 text-rose-600 border-rose-200',
    Assembly: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    Mobile: 'bg-teal-50 text-teal-600 border-teal-200',
    RL: 'bg-orange-50 text-orange-600 border-orange-200',
    'Real-World': 'bg-sky-50 text-sky-600 border-sky-200',
};

export default function DatasetDetailClient({ dataset }: Props) {
    const { lang } = useLang();
    const t = detailT[lang];
    const { user } = useAuth();
    const router = useRouter();
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');

    const relatedDatasets = (datasetsJson as Dataset[])
        .filter((d) => d.id !== dataset.id && d.tags.some((tag) => dataset.tags.includes(tag)))
        .slice(0, 3);

    const handleDownload = async () => {
        if (!user) {
            router.push('/auth?next=/datasets/' + dataset.id);
            return;
        }
        setDownloading(true);
        setDownloadError('');
        try {
            // 下载整个数据集的 meta/info.json 作为入口（实际可做批量签名）
            const { url } = await getDownloadUrl(dataset.id, 'meta/info.json');
            window.open(url, '_blank');
        } catch (e: unknown) {
            setDownloadError((e as Error).message || '获取下载链接失败');
        } finally {
            setDownloading(false);
        }
    };

    const infoRows = [
        { label: t.labels.Size, value: dataset.size },
        { label: t.labels.Tasks, value: dataset.tasks.toString() },
        { label: t.labels.Trajectories, value: dataset.trajectories },
        { label: t.labels.Format, value: dataset.format },
        { label: t.labels.Robot, value: dataset.robot ?? 'Various' },
        { label: t.labels.License, value: dataset.license ?? 'Apache-2.0' },
    ];

    return (
        <div className="pt-16 bg-slate-50 min-h-screen">
            <div className="px-6 md:px-10 lg:px-16 py-10 max-w-screen-xl mx-auto">
                {/* Back */}
                <Link
                    href="/datasets"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-600 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t.back}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {dataset.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tagColorMap[tag] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{dataset.name}</h1>
                            <p className="text-slate-600 leading-relaxed text-base mb-8">{dataset.description}</p>

                            <h2 className="text-xl font-bold text-slate-800 mb-3">{t.about}</h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">{dataset.description}{t.aboutSuffix}</p>

                            {/* Download warning */}
                            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 flex items-start gap-4">
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-700 mb-1">{t.warningTitle}</p>
                                    <p className="text-xs text-amber-600/80">{t.warningDesc}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm mb-5">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                                    <Database className="w-4 h-4 text-indigo-500" />
                                    {t.infoTitle}
                                </h3>
                                <dl className="space-y-3">
                                    {infoRows.map(({ label, value }) => (
                                        <div key={label} className="flex items-start justify-between text-sm gap-3">
                                            <dt className="text-slate-400 shrink-0">{label}</dt>
                                            <dd className="text-slate-700 font-semibold text-right font-mono text-xs">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            {downloadError && (
                                <p className="text-xs text-red-500 mb-3 px-1">{downloadError}</p>
                            )}

                            {user ? (
                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60 transition border border-indigo-600"
                                >
                                    {downloading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Download className="w-4 h-4" />
                                    }
                                    {t.downloadBtn}
                                </button>
                            ) : (
                                <Link
                                    href={`/auth?next=/datasets/${dataset.id}`}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-500 font-semibold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-200"
                                >
                                    <Lock className="w-4 h-4" />
                                    登录后下载
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* ── Trajectory Preview Section ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-14 border-t border-slate-200 pt-12"
                >
                    <h2 className="text-xl font-bold text-slate-800 mb-1">{t.previewTitle}</h2>
                    <p className="text-sm text-slate-400 mb-6">{t.previewDesc}</p>

                    {dataset.hf_id ? (
                        <DatasetVisualizer hfId={dataset.hf_id} totalEpisodes={undefined} />
                    ) : (
                        <p className="text-sm text-slate-400 bg-slate-100 border border-slate-200 rounded-xl px-5 py-4">
                            {t.previewNoHF}
                        </p>
                    )}
                </motion.div>

                {/* Related */}
                {relatedDatasets.length > 0 && (
                    <div className="mt-14 border-t border-slate-200 pt-12">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{t.relatedTitle}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedDatasets.map((d, i) => (
                                <DatasetCard key={d.id} dataset={{
                                    id: d.id,
                                    name: d.name,
                                    description: d.description ?? null,
                                    tags: Array.isArray(d.tags) ? (() => {
                                        // 将旧格式 string[] 转换为 JSON 对象字符串
                                        const robotOptions = ['SO100', 'SO101', 'Piper', 'UR5', 'Franka-Panda', 'xArm6', 'Franka'];
                                        const taskOptions = ['工业生产装配', '商业零售与陈列', '酒店服务', '食品与餐饮', '家庭生活', '医疗助理', '专业科研', '教育场景'];
                                        const obj: Record<string, string | string[]> = {};
                                        const others: string[] = [];
                                        for (const t of d.tags) {
                                            if (robotOptions.some(r => t.startsWith(r.split('-')[0]))) obj.robot_type = t;
                                            else if (taskOptions.includes(t)) obj.task_type = t;
                                            else others.push(t);
                                        }
                                        if (others.length) obj.other = others;
                                        return JSON.stringify(obj);
                                    })() : (d.tags ?? null),
                                    is_public: true,
                                    version: '1.0',
                                    total_episodes: typeof d.tasks === 'number' ? d.tasks : null,
                                    total_frames: null,
                                    size_bytes: null,
                                    robot: d.robot ?? null,
                                    license: d.license ?? 'Unknown',
                                    has_preview: false,
                                    created_at: '',
                                    owner_phone: null,
                                }} index={i} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
