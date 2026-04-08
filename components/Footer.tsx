'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, GitFork, ExternalLink, Heart } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { footerT } from '@/lib/i18n';

export default function Footer() {
    const { lang } = useLang();
    const t = footerT[lang];

    return (
        <footer className="border-t border-slate-800/60 bg-[#0A0A0F]">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4 w-fit group">
                            <div className="relative w-24 h-12 flex-shrink-0">
                                <Image src="/logo/EvoMind1.png" alt="EvoData" fill className="object-contain" />
                            </div>
                            {/* <span className="text-xs text-slate-600">EvoMind Tech</span> */}
                            <span className="font-bold text-lg tracking-tight">
                                <span className="gradient-text">Evo</span>
                                <span className="text-slate-200">Data</span>
                            </span>
                        </Link>

                        {/* SJTU logo */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative w-8 h-8 flex-shrink-0 opacity-60">
                                <Image src="/logo/SJTU.png" alt="SJTU" fill className="object-contain" />
                            </div>
                            <span className="text-xs text-slate-600">EvoMind Tech · MINT Lab, SJTU</span>
                        </div>

                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                            {t.desc}
                        </p>
                        <div className="flex items-center gap-3">
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

                    {/* Link groups */}
                    {t.groups.map((group) => (
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
                                            <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200">
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
                    © {new Date().getFullYear()} {t.copyright}
                </p>
                <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <span>{t.builtWith}</span>
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>{t.forRobotics}</span>
                </div>
            </div>
        </footer>
    );
}
