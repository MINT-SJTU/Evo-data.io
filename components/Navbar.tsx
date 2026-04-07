'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Database, GitFork, Mail } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Datasets', href: '/datasets' },
    { label: 'Guide', href: '/guide' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-black/20'
                    : 'bg-transparent'
            )}
        >
            <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative">
                        <Database className="w-6 h-6 text-indigo-400 group-hover:text-cyan-400 transition-colors duration-300" />
                        <div className="absolute inset-0 blur-sm bg-indigo-500/40 group-hover:bg-cyan-500/40 transition-colors duration-300 rounded-full" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        <span className="gradient-text">Evo</span>
                        <span className="text-slate-200">Data</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={clsx(
                                        'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'text-indigo-400'
                                            : 'text-slate-400 hover:text-slate-200'
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Right side actions */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="mailto:contact@evo-data.io"
                        className="text-slate-400 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-slate-800/50"
                        title="Contact"
                    >
                        <Mail className="w-4 h-4" />
                    </a>
                    <a
                        href="https://github.com/MINT-SJTU"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-slate-800/50"
                        title="GitHub"
                    >
                        <GitFork className="w-4 h-4" />
                    </a>
                    <Link
                        href="/datasets"
                        className="ml-1 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30"
                    >
                        Explore Data
                    </Link>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden p-2 text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-800/60"
                    >
                        <div className="px-6 py-4 flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={clsx(
                                        'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                        pathname === link.href
                                            ? 'text-indigo-400 bg-indigo-500/10'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex items-center gap-3 px-4 pt-3 border-t border-slate-800/60 mt-2">
                                <a href="mailto:contact@evo-data.io" className="text-slate-400 hover:text-cyan-400 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </a>
                                <a href="https://github.com/MINT-SJTU" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200 transition-colors">
                                    <GitFork className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
