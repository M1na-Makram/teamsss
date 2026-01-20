import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, AlertCircle, LayoutGrid } from 'lucide-react';

const TeamsEngine = () => {
     const rules = [
        { 
          title: '1 Team / Course', 
          desc: 'Strictly enforced. A student cannot be in two teams for the same subject.',
          badge: 'Anti-Chaos'
        },
        { 
          title: 'Capacity Caps', 
          desc: 'Teams have a hard cap (max 5 members). Join requests are blocked once full.',
          badge: 'Load Balance'
        },
        { 
          title: 'Leader Autonomy', 
          desc: 'Team leaders have full control to accept or reject members based on fit.',
          badge: 'Quality Control'
        },
        { 
          title: 'Real-time Sync', 
          desc: 'Team changes reflect instantly via FCM across all member devices.',
          badge: 'Zero Latency'
        }
    ];

  return (
    <section id="teams" className="py-24 bg-[#020617] relative scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6"
          >
             Team Architecture
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8">
            The <span className="text-gradient">Team Engine</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
             Replacing human guesswork with a deterministic, rule-based formation system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rules.map((rule, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all duration-500 group relative flex flex-col"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Users className="w-20 h-20 -mr-6 -mt-6" />
                    </div>
                    
                    <div className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={24} />
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{rule.badge}</span>
                      <h3 className="text-xl font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors">{rule.title}</h3>
                    </div>
                    
                    <p className="text-gray-500 text-sm leading-relaxed font-medium flex-grow">{rule.desc}</p>
                    
                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-indigo-500/50 transition-colors">
                      <LayoutGrid className="w-3.5 h-3.5" />
                      System Rule
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TeamsEngine;
