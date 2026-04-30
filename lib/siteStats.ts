/**
 * 从后端 API 获取站点聚合统计数据（替换原静态 datasets.json 版本）
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SiteStats {
    total_datasets: number;
    total_episodes: number;
    total_frames: number;
    total_size_bytes: number;
}

export async function fetchSiteStats(): Promise<SiteStats> {
    const res = await fetch(`${BASE_URL}/datasets/stats`);
    if (!res.ok) throw new Error('Failed to fetch site stats');
    return res.json();
}

// ── 格式化工具 ────────────────────────────────────────────────────────────────

export function formatStatBytes(bytes: number): string {
    if (bytes >= 1024 ** 4) return `${(bytes / 1024 ** 4).toFixed(1).replace(/\.0$/, '')} TB`;
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(0)} GB`;
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
    return `${bytes} B`;
}

export function formatStatCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M+`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
    return `${n}+`;
}
