import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Lock, Database } from 'lucide-react';

const AuthIdentity = () => {
  return (
    <section id="auth" className="py-24 bg-[#020617] relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity Layer</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
              Authentication & <br/>
              <span className="text-gradient">Official Identity</span>
            </h2>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium italic">
              “No anonymous access. No fake profiles. <span className="text-white not-italic font-bold">Only validated students.</span>”
            </p>

            <div className="space-y-8">
              {[
                { 
                  icon: <Lock className="w-5 h-5 text-indigo-400" />, 
                  title: 'Firebase Validation', 
                  desc: 'Every login is tied to a secure Firebase UID, ensuring 100% identity certainty.' 
                },
                { 
                  icon: <UserCheck className="w-5 h-5 text-purple-400" />, 
                  title: 'Profile Lock Engine', 
                  desc: 'A structural gatekeeper — zero system actions allowed until your profile is 100% complete.' 
                },
                { 
                  icon: <Database className="w-5 h-5 text-cyan-400" />, 
                  title: 'Database Mapping', 
                  desc: 'Real-time sync between your Auth identity and official university record.' 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl group-hover:border-indigo-500/50 group-hover:scale-110 transition-all duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-widest text-sm">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
             <div className="absolute inset-0 bg-indigo-500/10 rounded-[3rem] blur-[100px] pointer-events-none group-hover:bg-indigo-500/15 transition-colors duration-700" />
             
             <div className="relative glass-card rounded-[3rem] p-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Mock Browser UI */}
                <div className="flex flex-col gap-6 max-w-sm mx-auto bg-slate-950 p-8 rounded-3xl border border-white/5 shadow-inner">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1.5 text-gray-800">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
                        </div>
                        <span className="text-[10px] font-black text-gray-700 tracking-widest">IDENTITY_CHECK_V2.0</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 animate-pulse">
                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="space-y-1">
                            <div className="h-3 w-28 bg-white/20 rounded-full" />
                            <div className="h-2 w-20 bg-white/10 rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                            <span className="text-gray-500">Firebase Auth</span>
                            <span className="text-green-400 flex items-center gap-1.5 bg-green-400/10 px-2 py-1 rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                Validated
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                            <span className="text-gray-500">Profile Status</span>
                            <span className="text-amber-500 flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Pending
                            </span>
                        </div>
                    </div>

                    {/* Action Lock Alert */}
                    <motion.div 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-300 shadow-2xl"
                    >
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">
                            System Lock: <br/>
                            <span className="text-white/60 text-[9px] lowercase font-medium">Complete profile to enable actions</span>
                        </p>
                    </motion.div>
                </div>
             </div>

             {/* Floating Badge */}
             <div className="absolute -top-6 -right-6 p-6 glass-card rounded-2xl border-white/10 shadow-2xl animate-float">
                <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-widest">Trusted Student</span>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthIdentity;
