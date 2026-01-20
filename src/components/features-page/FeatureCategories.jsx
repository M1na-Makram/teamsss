import React from 'react';
import { motion } from 'framer-motion';

const FeatureCategories = () => {
    const categories = [
        { id: 'auth', label: 'Identity' },
        { id: 'teams', label: 'Team Engine' },
        { id: 'filtering', label: 'Discovery' },
        { id: 'notifications', label: 'Sync' },
        { id: 'admin', label: 'Governance' },
        { id: 'security', label: 'Security' }
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for sticky nav
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

  return (
    <div className="sticky top-20 z-40 py-6 bg-[#020617]/80 backdrop-blur-xl border-y border-white/5 mb-16 shadow-2xl">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-start md:justify-center gap-3 md:gap-6 min-w-max">
                {categories.map((cat, idx) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => scrollToSection(cat.id)}
                        className="px-5 py-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/10 transition-all text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                        {cat.label}
                    </motion.button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default FeatureCategories;
