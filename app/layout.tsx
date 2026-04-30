import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LangProvider } from '@/lib/LangContext';
import { AuthProvider } from '@/lib/AuthContext';

export const metadata: Metadata = {
    title: 'EvoData — Real-Robot RL Data Platform',
    description:
        'An open data platform for real-robot reinforcement learning. Discover, access, and contribute high-quality real-robot trajectory datasets.',
    keywords: ['robotics', 'reinforcement learning', 'real robot', 'sim-to-real', 'dataset', 'robot learning', 'embodied AI'],
    icons: {
        icon: '/logo/EvoMind0.png',
        shortcut: '/logo/EvoMind0.png',
        apple: '/logo/EvoMind0.png',
    },
    openGraph: {
        title: 'EvoData — Real-Robot RL Data Platform',
        description: 'An open data platform for real-robot reinforcement learning.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
            <body className="bg-[#0B0F19] text-slate-200 antialiased">
                <LangProvider>
                    <AuthProvider>
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </AuthProvider>
                </LangProvider>
            </body>
        </html>
    );
}
