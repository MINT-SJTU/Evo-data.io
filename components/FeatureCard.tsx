'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
    index: number;
}

export default function FeatureCard({ icon: Icon, title, description, gradient, index }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden cursor-default"
        >
            {/* Background glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className={clsx('absolute inset-0 bg-gradient-to-br opacity-5 rounded-2xl', gradient)} />
            </div>

            {/* Top border accent */}
            <div className={clsx('absolute top-0 left-0 right-0 h-px bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500', gradient)} />

            {/* Icon */}
            <div className={clsx(
                'relative w-12 h-12 rounded-xl flex items-center justify-center mb-5',
                'bg-gradient-to-br',
                gradient,
                'bg-opacity-10'
            )}>
                <div className={clsx('absolute inset-0 rounded-xl bg-gradient-to-br opacity-15', gradient)} />
                <Icon className="w-6 h-6 text-white relative z-10" />
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2.5 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">{description}</p>
        </motion.div>
    );
}
