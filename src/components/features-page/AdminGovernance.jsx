import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Send, Users, Shield } from 'lucide-react';

const AdminGovernance = () => {
  return (
    <section id="admin" className="py-24 bg-[#020617] relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse items-center gap-20">
            {/* Visual Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1-2 relative group"
            >
                <div className="glass-card rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20" />
                    
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3 text-red-400 font-extrabold uppercase tracking-[0.2em] text-[10px] bg-red-400/10 px-3 py-1.5 rounded-full border border-red-400/20">
                          <Shield size={12} />
                          Admin Instance
                      </div>
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 shadow-inner relative group/mockup">
                      <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                        <Send size={14} className="text-red-500" />
                        Broadcast Engine
                      </h4>
                      
                      <div className="space-y-4 mb-8">
                          <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-2">Target Filter</span>
                              <div className="flex items-center gap-3 text-white text-xs font-bold">
                                  <Users size={14} className="text-red-400/50" />
                                  All Registered Students
                              </div>
                          </div>
                          <div className="h-28 bg-white/[0.01] rounded-xl border border-white/5 p-4 text-[11px] text-gray-500 font-medium italic">
                              Type secure global transmission here...
                          </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all flex items-center justify-center gap-3 shadow-2xl"
                      >
                          <Send size={14} />
                          Execute Broadcast
                      </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Administrative Control</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                  Surgical <br/>
                  <span className="text-red-500">Governance</span>
                </h2>
                
                <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
                    Total oversight across the entire academic ecosystem. Target announcements with precision—filtering by specific courses, faculties, or individual user IDs.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { icon: <Radio size={16}/>, label: 'Verified Transmissions' },
                        { icon: <Users size={16}/>, label: 'Dynamic Target Groups' },
                        { icon: <Shield size={16}/>, label: 'Persistent Audit Logs' },
                        { icon: <Send size={16}/>, label: 'Real-time Read Stats' }
                    ].map((item, idx) => (
                         <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-all group">
                             <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-red-500/50 group-hover:text-red-400 transition-colors">
                                 {item.icon}
                             </div>
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                                {item.label}
                             </span>
                         </div>
                    ))}
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdminGovernance;
