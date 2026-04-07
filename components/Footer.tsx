'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Mail, GitFork, ExternalLink, Heart } from 'lucide-react';

const footerLinks = [
    {
        title: 'Platform',
        links: [
            { label: 'Home', href: '/' },
            { label: 'Datasets', href: '/datasets' },
            { label: 'About', href: '/about' },
            { label: 'Guide', href: '/guide' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Documentation', href: '/guide' },
            { label: 'Data Format', href: '/guide' },
            { label: 'API Reference', href: '/guide' },
            { label: 'Changelog', href: '/about' },
        ],
    },
    {
        title: 'Community',
        links: [
            { label: 'GitHub', href: 'https://github.com/MINT-SJTU', external: true as const },
            { label: 'Contact Us', href: 'mailto:contact@evo-data.io', external: true as const },
            { label: 'MINT Lab', href: 'https://github.com/MINT-SJTU', external: true as const },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-slate-800/60 bg-[#0A0A0F]">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
                            <div className="relative">
                                <Database className="w-6 h-6 text-indigo-400" />
                                <div className="absolute inset-0 blur-sm bg-indigo-500/40 rounded-full" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                <span className="gradient-text">Evo</span>
                                <span className="text-slate-200">Data</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            A next-generation open data platform for robotics and embodied AI research.
                            Empowering the community with high-quality, standardized datasets.
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            <a
                                href="https://github.com/MINT-SJTU"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-all duration-200"
                            >
                                <GitFork className="w-4 h-4" />
                                GitHub
                            </a>
                            <a
                                href="mailto:contact@evo-data.io"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-all duration-200"
                            >
                                <Mail className="w-4 h-4" />
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                                {group.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        {('external' in link) ? (
                                            <a
                                                href={link.href}
                                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200 group"
                                            >
                                                {link.label}
                                                {link.href.startsWith('http') && (
                                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}
                                            </a>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-800/40 max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-slate-600 text-xs">
                    © {new Date().getFullYear()} EvoData · MINT Lab, SJTU. All rights reserved.
                </p>
                <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <span>Built with</span>
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>for Robotics AI</span>
                </div>
            </div>
        </footer>
    );
}
