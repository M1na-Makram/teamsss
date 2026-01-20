import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Server, ShieldCheck, Database, ArrowDown } from 'lucide-react';

const SecurityArch = () => {
  return (
    <section className="py-24 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-6">
        
        {/* Security Header */}
        <div className="text-center mb-24">
          <motion.h2
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-3xl md:text-5xl font-bold mb-6"
          >
            Enterprise-Grade Security
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                  { icon: <Lock className="w-5 h-5"/>, text: 'Role-Based Access Control' },
                  { icon: <ShieldCheck className="w-5 h-5"/>, text: 'Middleware Validation' },
                  { icon: <Database className="w-5 h-5"/>, text: 'Secure Transactions' },
              ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300"
                  >
                      {item.icon}
                      <span className="font-semibold text-sm">{item.text}</span>
                  </motion.div>
              ))}
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h3 className="text-2xl font-bold mb-4">Architecture Overview</h3>
                <p className="text-gray-400">Scalable, stateless, and secure by design.</p>
            </div>
            
            <div className="relative">
                 {/* Connection Lines (Simulated in CSS via absolute div borders or pseudo elements if needed, but flex gap works for vertical stack) */}
                 
                 <div className="flex flex-col items-center gap-8">
                     {/* Client Layer */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-64 p-4 rounded-xl bg-[#61DAFB]/10 border border-[#61DAFB]/20 text-center"
                     >
                         <h4 className="font-bold text-[#61DAFB] mb-1">Frontend Client</h4>
                         <p className="text-xs text-gray-400">React + Tailwind</p>
                     </motion.div>

                     <ArrowDown className="w-6 h-6 text-gray-600 animate-bounce" />

                     {/* Auth Layer */}
                     <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="w-64 p-4 rounded-xl bg-[#FFCA28]/10 border border-[#FFCA28]/20 text-center"
                     >
                         <h4 className="font-bold text-[#FFCA28] mb-1">Auth & Messaging</h4>
                         <p className="text-xs text-gray-400">Firebase Auth + FCM</p>
                     </motion.div>

                      <ArrowDown className="w-6 h-6 text-gray-600 animate-bounce" />

                     {/* Server Layer */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                         transition={{ delay: 0.2 }}
                        className="w-64 p-4 rounded-xl bg-[#339933]/10 border border-[#339933]/20 text-center"
                     >
                         <h4 className="font-bold text-[#339933] mb-1">Backend Server</h4>
                         <p className="text-xs text-gray-400">Node.js + Express</p>
                     </motion.div>

                      <ArrowDown className="w-6 h-6 text-gray-600 animate-bounce" />

                     {/* Data Layer */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                         transition={{ delay: 0.3 }}
                        className="w-64 p-4 rounded-xl bg-[#336791]/10 border border-[#336791]/20 text-center"
                     >
                         <h4 className="font-bold text-[#336791] mb-1">Database</h4>
                         <p className="text-xs text-gray-400">PostgreSQL</p>
                     </motion.div>
                 </div>
            </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 md:mt-32 text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
             <div className="absolute inset-0 bg-black/20" />
             <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                     Build Academic Teams the Smart Way
                 </h2>
                 <p className="text-xl text-white/90 mb-8 font-medium">
                     No chaos. No randomness. Just structure.
                 </p>
                 <button className="px-8 py-4 bg-white text-primary font-bold text-lg rounded-full shadow-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
                     Start Now
                 </button>
             </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityArch;
