'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// UUID v4 格式检测
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();

    useEffect(() => {
        if (UUID_RE.test(id)) {
            // UUID 格式 → 后端数据集，跳转到详情页
            router.replace(`/datasets/view?id=${id}`);
        } else {
            // 旧静态 slug 已下线，跳回列表
            router.replace('/datasets');
        }
    }, [id, router]);

    return null;
}
