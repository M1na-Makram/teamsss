import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const Comparison = () => {
  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Why Use This Platform?
          </motion.h2>
          <p className="text-gray-400">Structured. Approved. Communicated.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Traditional Way */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-white/[0.01] border border-white/5 relative group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <AlertCircle className="w-24 h-24" />
            </div>
            
            <h3 className="text-2xl font-bold mb-10 flex items-center gap-4 text-gray-500 group-hover:text-red-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              Traditional Systems
            </h3>
            
            <ul className="space-y-6">
              {[
                'Random grouping & guesswork',
                'No official admin approvals',
                'Manual, slow communication',
                'No rule enforcement',
                'Fragile spreadsheets'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-2 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* This Platform */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-indigo-500/[0.02] border border-indigo-500/20 relative group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-24 h-24 text-indigo-400" />
            </div>
            
            <h3 className="text-2xl font-bold mb-10 flex items-center gap-4 text-indigo-400">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-indigo-400" />
              </div>
              This Platform
            </h3>
            
            <ul className="space-y-6">
               {[
                'Admin-approved account access',
                'Enforced academic grouping rules',
                'Automated real-time notifications',
                'Clear accountability & doctor oversight',
                'Secure, validated database'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-white group-hover:translate-x-1 transition-transform">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-indigo-400" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-12 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs font-bold text-indigo-300 text-center uppercase tracking-widest">The Smart Choice</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
