import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ShieldAlert, Database, Bell, CheckCircle2, ArrowDown 
} from 'lucide-react';

const VisualLogic = () => {
  const steps = [
    { 
      label: 'User Action', 
      desc: 'Join request, team creation, profile edit', 
      icon: <Zap className="w-5 h-5 text-yellow-400" /> 
    },
    { 
      label: 'Validation Layer', 
      desc: 'Checking course context & admin approval', 
      icon: <ShieldAlert className="w-5 h-5 text-red-400" /> 
    },
    { 
      label: 'Database Sync', 
      desc: 'Secure PostgreSQL update via RLS', 
      icon: <Database className="w-5 h-5 text-indigo-400" /> 
    },
    { 
      label: 'Notification Push', 
      desc: 'Firebase Cloud Messaging & Push triggers', 
      icon: <Bell className="w-5 h-5 text-green-400" /> 
    },
    { 
      label: 'User Feedback', 
      desc: 'Real-time UI update & success state', 
      icon: <CheckCircle2 className="w-5 h-5 text-indigo-400" /> 
    },
  ];

  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6"
          >
            Behind the Scenes
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">System Logic</h2>
          <p className="text-gray-400 italic">“If it’s not valid — it doesn’t happen.”</p>
        </div>

        <div className="flex flex-col items-center">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="w-full max-w-md p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-6 hover:border-white/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xl">
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-widest text-sm">{step.label}</h4>
                  <p className="text-xs text-gray-500 font-medium">{step.desc}</p>
                </div>
              </motion.div>
              
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: 40 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center py-2"
                >
                  <div className="w-px h-6 bg-gradient-to-b from-indigo-500/50 to-transparent" />
                  <ArrowDown className="w-3 h-3 text-indigo-500/50 -mt-0.5" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-16 p-8 rounded-[2rem] bg-indigo-500/[0.03] border border-indigo-500/10 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] relative z-10 transition-colors group-hover:text-indigo-400">
            Architecture: <span className="text-gray-400">Validated Event-Driven Flow</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisualLogic;
