import { notFound } from 'next/navigation';
import datasetsJson from '@/data/datasets.json';
import DatasetDetailClient from './DatasetDetailClient';

export function generateStaticParams() {
    return datasetsJson.map((d) => ({ id: d.id }));
}

export default async function DatasetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dataset = datasetsJson.find((d) => d.id === id);
    if (!dataset) notFound();
    return <DatasetDetailClient dataset={dataset} />;
}
