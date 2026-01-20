import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, FileText, ShieldCheck, BookOpen, Users, Bell } from 'lucide-react';

const FlowOverview = () => {
  const steps = [
    { icon: <UserPlus className="w-5 h-5" />, label: 'Register' },
    { icon: <FileText className="w-5 h-5" />, label: 'Profile' },
    { icon: <ShieldCheck className="w-5 h-5 text-amber-500" />, label: 'Approval' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Courses' },
    { icon: <Users className="w-5 h-5" />, label: 'Teams' },
    { icon: <Bell className="w-5 h-5 text-indigo-400" />, label: 'Sync' },
  ];

  return (
    <section className="py-24 bg-[#020617] border-y border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8"
        >
          System Architecture
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold mb-16">High-Level Flow</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative">
           {/* Connecting Line (Desktop) */}
           <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -z-10" />

           {steps.map((step, idx) => (
             <React.Fragment key={idx}>
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="flex flex-col items-center gap-4 group"
               >
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-gray-400 shadow-2xl group-hover:border-indigo-500/50 group-hover:text-white transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                      {step.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-widest">{step.label}</span>
               </motion.div>
               {idx < steps.length - 1 && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="md:hidden w-px h-8 bg-gradient-to-b from-indigo-500/20 to-transparent"
                 />
               )}
             </React.Fragment>
           ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-gray-500 text-sm font-medium italic"
        >
            “Every step is validated. <span className="text-white not-italic font-bold">Nothing happens by accident.</span>”
        </motion.p>
      </div>
    </section>
  );
};

export default FlowOverview;
