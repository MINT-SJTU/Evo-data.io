'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Database, Loader2, Lock, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getDataset, getDownloadUrl, formatBytes, DatasetDetail } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LangContext';
import { flattenTags, parseTags as parseTagsLib } from '@/lib/tagConfig';
import OssDatasetVisualizer from '@/components/OssDatasetVisualizer';
import { Suspense } from 'react';

// ─── Tag 渲染 ──────────────────────────────────────────────────────────────────

function getTagLabels(tagsJson: string | null): string[] {
    if (!tagsJson) return [];
    try {
        const data = parseTagsLib(tagsJson);
        return flattenTags(data).map((t) => t.displayZh || t.value);
    } catch {
        return [];
    }
}

const tagColorMap: Record<string, string> = {
    Manipulation: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    Navigation: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Locomotion: 'bg-amber-50 text-amber-600 border-amber-200',
};

// ─── Main View ─────────────────────────────────────────────────────────────────

function DatasetViewContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { user } = useAuth();
    const { lang } = useLang();
    const router = useRouter();

    const [dataset, setDataset] = useState<DatasetDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');

    useEffect(() => {
        if (!id) {
            setError('缺少数据集 ID');
            setLoading(false);
            return;
        }
        getDataset(id)
            .then(setDataset)
            .catch((e) => setError(e.message || '加载失败'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDownload = async () => {
        if (!user) {
            router.push(`/auth?next=/datasets/view?id=${id}`);
            return;
        }
        if (!dataset) return;
        setDownloading(true);
        setDownloadError('');
        try {
            const { url } = await getDownloadUrl(dataset.id, 'meta/info.json');
            window.open(url, '_blank');
        } catch (e: unknown) {
            setDownloadError((e as Error).message || '获取下载链接失败');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-32 flex justify-center items-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error || !dataset) {
        return (
            <div className="pt-32 flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
                <XCircle className="w-12 h-12 text-red-400" />
                <p className="text-slate-600 text-lg">{error || '数据集不存在'}</p>
                <Link href="/datasets" className="text-indigo-600 hover:underline text-sm">← 返回数据集列表</Link>
            </div>
        );
    }

    const tags = getTagLabels(dataset.tags);

    const infoRows = [
        { label: '大小', value: formatBytes(dataset.size_bytes) },
        { label: '轨迹数', value: dataset.total_episodes?.toString() ?? '—' },
        { label: '总帧数', value: dataset.total_frames?.toLocaleString() ?? '—' },
        { label: '版本', value: dataset.version ?? '—' },
        { label: '机器人', value: dataset.robot ?? 'Various' },
        { label: '许可证', value: dataset.license ?? 'Apache-2.0' },
        { label: '公开', value: dataset.is_public ? '是' : '否' },
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
                    返回数据集
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main */}
                    <div className="lg:col-span-2">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tagColorMap[tag] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{dataset.name}</h1>
                        <p className="text-slate-600 leading-relaxed text-base mb-8">{dataset.description ?? '暂无描述'}</p>

                        {/* Download warning */}
                        <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 flex items-start gap-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-amber-700 mb-1">使用须知</p>
                                <p className="text-xs text-amber-600/80">
                                    下载或使用本数据集即表示您同意数据集的许可证条款。请勿将数据集用于商业目的（除非许可证另有规定）。
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm mb-5">
                            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                                <Database className="w-4 h-4 text-indigo-500" />
                                数据集信息
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
                                下载 meta/info.json
                            </button>
                        ) : (
                            <Link
                                href={`/auth?next=/datasets/view?id=${id}`}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-500 font-semibold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-200"
                            >
                                <Lock className="w-4 h-4" />
                                登录后下载
                            </Link>
                        )}
                    </div>
                </div>

                {/* Preview section */}
                <div className="mt-14 border-t border-slate-200 pt-12">
                    <h2 className="text-xl font-bold text-slate-800 mb-1">轨迹预览</h2>
                    <p className="text-sm text-slate-400 mb-8">Episode 0 的多视角视频与运动轨迹参数</p>
                    {dataset.has_preview ? (
                        <OssDatasetVisualizer datasetId={dataset.id} />
                    ) : (
                        <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400 shrink-0" />
                            预览数据正在生成中，请稍后刷新页面查看…
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DatasetViewPage() {
    return (
        <Suspense fallback={
            <div className="pt-32 flex justify-center items-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        }>
            <DatasetViewContent />
        </Suspense>
    );
}
