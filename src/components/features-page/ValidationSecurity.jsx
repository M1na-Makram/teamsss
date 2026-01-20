import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, FileKey, Server } from 'lucide-react';

const ValidationSecurity = () => {
    const layers = [
        { 
          icon: <Lock className="w-6 h-6 text-indigo-400" />, 
          title: 'Middleware Context', 
          desc: 'Every request creates a secure session verified against database roles in real-time.' 
        },
        { 
          icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />, 
          title: 'Hybrid RBAC', 
          desc: 'Dual-layer role protection (Firebase + Supabase) ensures zero-trust access control.' 
        },
        { 
          icon: <FileKey className="w-6 h-6 text-amber-500" />, 
          title: 'Identity Gate', 
          desc: 'Incomplete profiles are blocked at the router level. Structural integrity by design.' 
        },
        { 
          icon: <Server className="w-6 h-6 text-purple-400" />, 
          title: 'SQL Constraints', 
          desc: 'Hard-coded database indices prevent duplicate teams and invalid course mapping.' 
        }
    ];

  return (
    <section id="security" className="py-24 bg-[#020617] relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8"
            >
                Security Protocol
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
              Validation at <br/>
              <span className="text-gradient">Every Step</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                We believe in <span className="text-white">Secure by Default</span>. Security isn't an afterthought — it's baked into every API call and database transaction.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {layers.map((layer, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-10 rounded-[2.5rem] text-center group hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                    
                    <div className="w-20 h-20 mx-auto bg-slate-900 border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all duration-500 shadow-2xl relative z-10">
                        {layer.icon}
                    </div>
                    
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 group-hover:text-indigo-400 transition-colors relative z-10">{layer.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium relative z-10">{layer.desc}</p>
                </motion.div>
            ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">
            Protocols: <span className="text-gray-500">Firebase Auth + Supabase RLS + Custom Middleware</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValidationSecurity;
