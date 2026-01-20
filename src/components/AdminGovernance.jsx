import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Lock, CheckCircle2, AlertCircle, Fingerprint } from 'lucide-react';

const AdminGovernance = () => {
  const cards = [
    {
      title: 'Official Team Validation',
      desc: 'Every team is vetted by university administrators before being allowed to start.',
      icon: <Fingerprint className="w-8 h-8 text-indigo-400" />,
    },
    {
      title: 'Doctor Assignment',
      desc: 'Qualified faculty members are officially assigned to oversee your project progress.',
      icon: <UserCheck className="w-8 h-8 text-cyan-400" />,
    },
    {
      title: 'Zero Ghost Teams',
      desc: 'Automated cleanup of inactive teams. We ensure every group is real and active.',
      icon: <ShieldCheck className="w-8 h-8 text-purple-400" />,
    },
  ];

  return (
    <section id="admin" className="py-32 relative overflow-hidden bg-[#020617]">
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
            >
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Governance & Security</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight"
            >
              No Admin Approval? <br />
              <span className="text-gradient">No Team.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl"
            >
              We don't do randomness. Our platform ensures that every project team meets university standards through a rigorous approval flow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-gray-300 font-medium">Projects are validated before activation.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-gray-300 font-medium">Doctors assigned officially. No more guessing.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-gray-300 font-medium">Admins sleep better. Students panic less.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Visuals (Interactive Cards) */}
          <div className="lg:w-1/2 relative pr-10 pb-10">
            <div className="grid gap-6">
              {cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  whileHover={{ x: -10, scale: 1.02 }}
                  className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-md shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center shadow-inner group-hover:border-white/10 transition-colors">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{card.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating Notification Mockup */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-64 p-4 rounded-2xl bg-indigo-600 border border-indigo-500 shadow-2xl z-20 pointer-events-none"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">System Approval</p>
                  <p className="text-xs font-bold text-white">Team "CyberNexus" Approved</p>
                </div>
              </div>
              <p className="text-[10px] text-indigo-100/70">Dr. Sarah Jenkins has been assigned as your project supervisor.</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AdminGovernance;
