import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'EvoData — Robotics Data Platform',
    description:
        'A next-generation data platform for robotics and embodied AI. Explore, download, and contribute high-quality datasets for robot learning.',
    keywords: ['robotics', 'embodied AI', 'dataset', 'robot learning', 'reinforcement learning'],
    openGraph: {
        title: 'EvoData — Robotics Data Platform',
        description: 'A next-generation data platform for robotics and embodied AI.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className="bg-[#0B0F19] text-slate-200 antialiased">
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
