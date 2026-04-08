/**
 * Dynamic site statistics derived from datasets.json.
 * Keeps hero stats and any summary numbers in sync with actual data.
 */

import datasets from '@/data/datasets.json';

type Dataset = {
    id: string;
    name: string;
    size: string;       // e.g. "128 GB", "1.2 TB"
    tasks: number;
    trajectories: string; // e.g. "120K", "1.2M"
    [key: string]: unknown;
};

const data = datasets as Dataset[];

// ── helpers ──────────────────────────────────────────────────────────────────

/** Parse "128 GB" / "1.3 TB" → bytes */
function parseGB(sizeStr: string): number {
    const match = sizeStr.trim().match(/^([\d.]+)\s*(GB|TB)$/i);
    if (!match) return 0;
    const n = parseFloat(match[1]);
    return match[2].toUpperCase() === 'TB' ? n * 1024 : n;
}

/** Parse "120K" / "1.2M" → number */
function parseTraj(trajStr: string): number {
    const match = trajStr.trim().match(/^([\d.]+)\s*([KkMm]?)$/);
    if (!match) return 0;
    const n = parseFloat(match[1]);
    if (match[2].toUpperCase() === 'M') return n * 1_000_000;
    if (match[2].toUpperCase() === 'K') return n * 1_000;
    return n;
}

/** Format a byte count (in GB) back to human-readable */
function formatGB(gb: number): string {
    if (gb >= 1024) {
        const tb = gb / 1024;
        // Keep one decimal unless it's a whole number
        return `${tb % 1 === 0 ? tb.toFixed(0) : tb.toFixed(1)} TB`;
    }
    return `${Math.round(gb)} GB`;
}

/** Format trajectory count to K / M */
function formatTraj(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M+`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
    return `${n}+`;
}

// ── computed values ───────────────────────────────────────────────────────────

const totalDatasets = data.length;
const totalTasks = data.reduce((acc, d) => acc + d.tasks, 0);
const totalTrajNum = data.reduce((acc, d) => acc + parseTraj(d.trajectories), 0);
const totalGB = data.reduce((acc, d) => acc + parseGB(d.size), 0);

// ── exported stats ────────────────────────────────────────────────────────────

export const siteStats = {
    datasetsCount: totalDatasets,
    tasksCount: totalTasks,
    trajectoriesCount: totalTrajNum,
    dataVolumeGB: totalGB,

    /** Formatted values ready for display */
    formatted: {
        datasets: `${totalDatasets}+`,
        tasks: `${totalTasks}+`,
        trajectories: formatTraj(totalTrajNum),
        dataVolume: formatGB(totalGB),
    },
} as const;
