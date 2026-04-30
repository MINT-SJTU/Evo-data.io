'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mail, GitFork, Languages, LogIn, LogOut, Settings, Upload, User } from 'lucide-react';
import clsx from 'clsx';
import { useLang } from '@/lib/LangContext';
import { navT } from '@/lib/i18n';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { lang, toggle } = useLang();
    const { user, logout } = useAuth();
    const t = navT[lang];

    // Paths that use a light (white) background
    const isLight = pathname.startsWith('/datasets') || pathname.startsWith('/guide') || pathname.startsWith('/about') || pathname.startsWith('/upload') || pathname.startsWith('/auth');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        router.push('/');
    };

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isLight
                    ? 'bg-white border-b border-slate-200 shadow-sm'
                    : scrolled
                        ? 'bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-black/20'
                        : 'bg-transparent'
            )}
        >
            <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative w-20 h-10 flex-shrink-0">
                        <Image src="/logo/EvoMind1.png" alt="EvoMind Logo" fill className="object-contain" priority loading="eager" />
                    </div>
                    <div className="relative w-8 h-8 flex-shrink-0 opacity-70">
                        <Image src="/logo/SJTU.png" alt="SJTU Logo" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        <span className="gradient-text">Evo</span>
                        <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>Data</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-1">
                    {t.links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={clsx(
                                        'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                                        isLight
                                            ? isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                                            : isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className={clsx(
                                                'absolute inset-0 rounded-lg border',
                                                isLight
                                                    ? 'bg-indigo-50 border-indigo-200'
                                                    : 'bg-indigo-500/10 border-indigo-500/20'
                                            )}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Right side actions */}
                <div className="hidden md:flex items-center gap-2">
                    <button
                        onClick={toggle}
                        className={clsx(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
                            isLight
                                ? 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                                : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:bg-slate-700/50 hover:border-indigo-500/40 hover:text-slate-200'
                        )}
                        title="Switch language"
                    >
                        <Languages className="w-3.5 h-3.5" />
                        {lang === 'en' ? '中文' : 'EN'}
                    </button>
                    <a
                        href="mailto:contact@evo-data.io"
                        className={clsx(
                            'transition-colors p-2 rounded-lg',
                            isLight
                                ? 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                                : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50'
                        )}
                        title="Contact"
                    >
                        <Mail className="w-4 h-4" />
                    </a>
                    <a
                        href="https://github.com/MINT-SJTU"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={clsx(
                            'transition-colors p-2 rounded-lg',
                            isLight
                                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        )}
                        title="GitHub"
                    >
                        <GitFork className="w-4 h-4" />
                    </a>

                    {/* 上传入口 */}
                    {user && (
                        <Link
                            href="/upload"
                            className={clsx(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
                                isLight
                                    ? 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                                    : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                            )}
                        >
                            <Upload className="w-3.5 h-3.5" />
                            上传
                        </Link>
                    )}

                    {/* 用户状态 */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={clsx(
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
                                    isLight
                                        ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                                        : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                                )}
                            >
                                <User className="w-3.5 h-3.5" />
                                {user.phone.slice(0, 3)}****{user.phone.slice(7)}
                            </button>
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50"
                                    >
                                        <Link
                                            href="/upload"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Upload className="w-4 h-4 text-slate-400" />
                                            上传数据集
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Settings className="w-4 h-4 text-slate-400" />
                                            账户设置
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            退出登录
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            href="/auth"
                            className="ml-1 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            登录
                        </Link>
                    )}
                </div>

                {/* Mobile: lang toggle + menu button */}
                <div className="md:hidden flex items-center gap-2">
                    <button
                        onClick={toggle}
                        className={clsx(
                            'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                            isLight
                                ? 'border-slate-200 bg-slate-50 text-slate-500'
                                : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                        )}
                    >
                        <Languages className="w-3.5 h-3.5" />
                        {lang === 'en' ? '中文' : 'EN'}
                    </button>
                    <button
                        className={clsx('p-2 transition-colors', isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200')}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className={clsx(
                            'md:hidden backdrop-blur-xl border-b',
                            isLight
                                ? 'bg-white border-slate-200'
                                : 'bg-[#0B0F19]/95 border-slate-800/60'
                        )}
                    >
                        <div className="px-6 py-4 flex flex-col gap-1">
                            {t.links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={clsx(
                                        'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                        isLight
                                            ? pathname === link.href
                                                ? 'text-indigo-600 bg-indigo-50'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                            : pathname === link.href
                                                ? 'text-indigo-400 bg-indigo-500/10'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className={clsx('flex items-center gap-3 px-4 pt-3 border-t mt-2', isLight ? 'border-slate-200' : 'border-slate-800/60')}>
                                <a href="mailto:contact@evo-data.io" className={isLight ? 'text-slate-400 hover:text-indigo-600' : 'text-slate-400 hover:text-cyan-400'}>
                                    <Mail className="w-4 h-4" />
                                </a>
                                <a href="https://github.com/MINT-SJTU" target="_blank" rel="noopener noreferrer" className={isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'}>
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
