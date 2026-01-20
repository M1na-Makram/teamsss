import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, GraduationCap } from 'lucide-react';

const SmartDiscovery = () => {
  return (
    <section id="filtering" className="py-24 bg-[#020617] relative overflow-hidden scroll-mt-20">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-20">
           {/* Visual Mockup */}
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="w-full md:w-1/2 relative group"
           >
                <div className="glass-card rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                    
                    {/* Mock Search Header */}
                    <div className="flex gap-4 mb-8">
                        <div className="flex-1 bg-slate-900/50 rounded-2xl h-12 flex items-center px-4 gap-3 text-gray-600 text-[11px] font-bold uppercase tracking-widest border border-white/5 shadow-inner">
                            <Search size={14} className="text-indigo-500/50" />
                            Search Course Context...
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg">
                            <Filter size={18} />
                        </div>
                    </div>

                     {/* Mock Results */}
                    <div className="space-y-4">
                        {[
                          { course: 'CS302 Data Science', leader: 'Dr. Sarah', capacity: '3/5' },
                          { course: 'AI401 Neural Nets', leader: 'Dr. Mike', capacity: '4/5' },
                          { course: 'SWE201 Web Dev', leader: 'Dr. Elena', capacity: '2/5' }
                        ].map((item, i) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ x: 6 }}
                              className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex justify-between items-center group/item hover:border-indigo-500/30 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover/item:text-indigo-400 transition-colors">
                                    <BookOpen size={18} />
                                  </div>
                                  <div>
                                      <div className="text-xs font-black text-white uppercase tracking-wider mb-0.5">{item.course}</div>
                                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.leader}</div>
                                  </div>
                                </div>
                                <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-[10px] font-black uppercase tracking-tighter shadow-lg">
                                    {item.capacity} Full
                                </div>
                            </motion.div>
                        ))}
                    </div>

                     {/* Floating Badge */}
                    <motion.div 
                        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-4 -right-4 bg-indigo-600 p-5 rounded-2xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] border border-white/20 z-20"
                    >
                        <div className="flex items-center gap-3 text-white">
                             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Filter className="w-4 h-4" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest">Context Engine</span>
                                <span className="text-[9px] font-medium opacity-80">Zero Irrelevant Data</span>
                             </div>
                        </div>
                    </motion.div>
                </div>
           </motion.div>

           {/* Content */}
           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="w-full md:w-1/2"
           >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <Search className="w-3.5 h-3.5" />
                  <span>Smart Filtering</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                  Find Your Team <br/>
                  <span className="text-gradient">With Precision</span>
                </h2>
                
                <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
                    Stop scrolling through generic discord links. Our engine filters by <span className="text-white">your faculty, your course, and your academic year</span> — showing only what matters to you.
                </p>

                <div className="space-y-10">
                     <div className="flex gap-6 group">
                        <div className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 group-hover:bg-indigo-500/10 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">Course-Based Context</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">Automatic grouping based on your official course enrollment. No manual searching needed.</p>
                        </div>
                     </div>

                     <div className="flex gap-6 group">
                        <div className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-cyan-400 shrink-0 group-hover:bg-cyan-500/10 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 group-hover:text-cyan-400 transition-colors">Faculty Validation</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">Strict boundaries between departments ensure team privacy and academic relevance.</p>
                        </div>
                     </div>
                </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SmartDiscovery;
