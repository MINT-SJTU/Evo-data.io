'use client';

/**
 * OssDatasetVisualizer
 * 用于预览存储在 OSS 上的 LeRobot 数据集（episode_0）：
 * - 多摄像头视频播放（同步，带进度条/拖拽 seek）
 * - 轨迹参数折线图（来自预处理的 trajectory.json，帧指示线随视频同步）
 */

import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    Activity,
    AlertCircle,
    Film,
    Loader2,
    Pause,
    Play,
    RotateCcw,
} from 'lucide-react';
import { getPreviewInfo, PreviewInfo } from '@/lib/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAxisNames(feature: { shape: number[]; names?: unknown }): string[] {
    const n = feature.names;
    if (!n) return Array.from({ length: feature.shape?.[0] ?? 1 }, (_, i) => `dim_${i}`);
    if (Array.isArray(n)) return n as string[];
    if (typeof n === 'object' && n !== null && 'motors' in n)
        return (n as { motors: string[] }).motors;
    return Array.from({ length: feature.shape?.[0] ?? 1 }, (_, i) => `dim_${i}`);
}

/** 将 trajectory rows 中的向量列展开为每帧每个维度的值 */
function flattenTrajectory(
    rows: Record<string, unknown>[],
    features: PreviewInfo['features']
): { data: Record<string, number>[]; seriesKeys: string[]; seriesLabels: string[] } {
    const seriesKeys: string[] = [];
    const seriesLabels: string[] = [];

    // 收集所有需要展开的 feature（非图像，shape[0] > 0）
    const vectorFeatures: Array<{ key: string; names: string[] }> = [];
    for (const [featKey, feat] of Object.entries(features)) {
        if (!feat.shape || feat.shape.length === 0) continue;
        if (featKey.includes('image') || featKey.includes('pixel')) continue;
        const names = getAxisNames(feat);
        vectorFeatures.push({ key: featKey, names });
    }

    // 生成 series key 列表（使用 Set 去重，避免同名维度产生重复 key）
    const seenKeys = new Set<string>();
    for (const { key, names } of vectorFeatures) {
        for (const name of names) {
            let sk = `${key}/${name}`;
            // 若已存在，追加 feature 前缀确保唯一
            if (seenKeys.has(sk)) {
                sk = `${key}/${name}__${key.split('.').pop()}`;
            }
            seenKeys.add(sk);
            seriesKeys.push(sk);
            seriesLabels.push(`${key.replace('observation.', '').replace('state', 'obs')}.${name}`);
        }
    }

    // 展开每一帧（用与 seriesKeys 相同的去重 key）
    const data: Record<string, number>[] = rows.map((row, i) => {
        const record: Record<string, number> = { frame: i };
        const seenKeysInRow = new Set<string>();
        for (const { key, names } of vectorFeatures) {
            const val = row[key];
            if (Array.isArray(val)) {
                names.forEach((name, j) => {
                    let sk = `${key}/${name}`;
                    if (seenKeysInRow.has(sk)) sk = `${key}/${name}__${key.split('.').pop()}`;
                    seenKeysInRow.add(sk);
                    record[sk] = typeof val[j] === 'number' ? val[j] : 0;
                });
            } else if (typeof val === 'number') {
                let sk = `${key}/${names[0]}`;
                if (seenKeysInRow.has(sk)) sk = `${key}/${names[0]}__${key.split('.').pop()}`;
                seenKeysInRow.add(sk);
                record[sk] = val;
            }
        }
        return record;
    });

    return { data, seriesKeys, seriesLabels };
}

// ─── VideoPlayer ─────────────────────────────────────────────────────────────

function VideoPlayer({
    src, label, isPlaying, onProgress, currentFrame, fps,
}: {
    src: string;
    label: string;
    isPlaying: boolean;
    onProgress?: (frame: number) => void;
    currentFrame: number;
    fps: number;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        if (isPlaying) v.play().catch(() => { });
        else v.pause();
    }, [isPlaying]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const handler = () => {
            if (onProgress) onProgress(Math.floor(v.currentTime * fps));
        };
        v.addEventListener('timeupdate', handler);
        return () => v.removeEventListener('timeupdate', handler);
    }, [fps, onProgress]);

    return (
        <div className="relative rounded-xl overflow-hidden bg-black">
            <video
                ref={videoRef}
                src={src}
                className="w-full aspect-video object-contain"
                muted
                playsInline
                loop
            />
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                {label}
            </div>
        </div>
    );
}

// ─── TrajectoryChart ─────────────────────────────────────────────────────────

function TrajectoryChart({
    data,
    seriesKeys,
    seriesLabels,
    currentFrame,
    title,
}: {
    data: Record<string, number>[];
    seriesKeys: string[];
    seriesLabels: string[];
    currentFrame: number;
    title: string;
}) {
    if (seriesKeys.length === 0 || data.length === 0) return null;

    return (
        <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="frame" tick={{ fontSize: 10 }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10 }} width={40} tickLine={false} />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                            labelFormatter={(v) => `Frame ${v}`}
                        />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                        <ReferenceLine x={currentFrame} stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 2" />
                        {seriesKeys.map((sk, i) => (
                            <Line
                                key={sk}
                                type="monotone"
                                dataKey={sk}
                                name={seriesLabels[i]}
                                stroke={COLORS[i % COLORS.length]}
                                dot={false}
                                strokeWidth={1.5}
                                isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OssDatasetVisualizer({ datasetId }: { datasetId: string }) {
    const [info, setInfo] = useState<PreviewInfo | null>(null);
    const [trajectoryRows, setTrajectoryRows] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);

    // Load preview-info
    useEffect(() => {
        getPreviewInfo(datasetId)
            .then(setInfo)
            .catch((e) => setError(e.message || '加载预览信息失败'))
            .finally(() => setLoading(false));
    }, [datasetId]);

    // Load trajectory.json
    useEffect(() => {
        if (!info?.trajectory_url) return;
        fetch(info.trajectory_url)
            .then((r) => r.json())
            .then(setTrajectoryRows)
            .catch(() => { /* trajectory not available */ });
    }, [info?.trajectory_url]);

    const handleProgress = useCallback((frame: number) => {
        setCurrentFrame(frame);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">加载预览中...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 py-10 text-slate-500">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm">{error}</span>
            </div>
        );
    }

    if (!info) return null;

    const cameras = Object.entries(info.video_urls);
    const hasVideos = cameras.length > 0;
    const hasTrajectory = trajectoryRows.length > 0;

    // 展开轨迹数据
    const { data: chartData, seriesKeys, seriesLabels } = hasTrajectory
        ? flattenTrajectory(trajectoryRows as Record<string, unknown>[], info.features)
        : { data: [], seriesKeys: [], seriesLabels: [] };

    // 按 feature 前缀分组
    const featureGroups: Record<string, { keys: string[]; labels: string[] }> = {};
    seriesKeys.forEach((sk, i) => {
        const prefix = sk.split('/')[0].replace('observation.', '').split('.')[0];
        if (!featureGroups[prefix]) featureGroups[prefix] = { keys: [], labels: [] };
        featureGroups[prefix].keys.push(sk);
        featureGroups[prefix].labels.push(seriesLabels[i]);
    });

    return (
        <div className="space-y-8">
            {/* ── 视频区域 ── */}
            {hasVideos && (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Film className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-sm font-semibold text-slate-700">
                            Episode 0 — {cameras.length} 个摄像头视角
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">{info.fps} fps · {info.total_frames} 帧</span>
                    </div>

                    {/* 摄像头网格：1-2 列 */}
                    <div className={`grid gap-3 ${cameras.length === 1 ? 'grid-cols-1 max-w-2xl' : cameras.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                        {cameras.map(([cam, url]) => (
                            <VideoPlayer
                                key={cam}
                                src={url}
                                label={cam}
                                isPlaying={isPlaying}
                                onProgress={handleProgress}
                                currentFrame={currentFrame}
                                fps={info.fps}
                            />
                        ))}
                    </div>

                    {/* 播放控制 */}
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            onClick={() => setIsPlaying((p) => !p)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {isPlaying ? '暂停' : '播放'}
                        </button>
                        <button
                            onClick={() => { setIsPlaying(false); setCurrentFrame(0); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            重置
                        </button>
                        <span className="text-xs text-slate-400 font-mono ml-2">
                            帧 {currentFrame} / {info.total_frames}
                        </span>
                    </div>
                </div>
            )}

            {/* ── 轨迹图区域 ── */}
            {hasTrajectory && Object.keys(featureGroups).length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-sm font-semibold text-slate-700">Episode 0 轨迹数据</h3>
                        <span className="text-xs text-slate-400">{chartData.length} 帧</span>
                    </div>
                    {Object.entries(featureGroups).map(([prefix, { keys, labels }]) => (
                        <TrajectoryChart
                            key={prefix}
                            data={chartData}
                            seriesKeys={keys}
                            seriesLabels={labels}
                            currentFrame={currentFrame}
                            title={prefix}
                        />
                    ))}
                </div>
            )}

            {!hasVideos && !hasTrajectory && (
                <p className="text-sm text-slate-400 py-8 text-center">暂无预览内容</p>
            )}
        </div>
    );
}
