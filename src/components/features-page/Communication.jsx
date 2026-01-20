import React from 'react';
import { motion } from 'framer-motion';
import { BellRing, MessageSquare, Zap } from 'lucide-react';

const Communication = () => {
  return (
    <section id="notifications" className="py-24 bg-[#020617] relative scroll-mt-20">
      <div className="container mx-auto px-6 text-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6"
        >
            Real-Time Sync
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-extrabold mb-8">
          Communication <span className="text-gradient">Without Chaos</span>
        </h2>
        
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-20 font-medium">
            We ensure you never miss a critical update. Whether it's a new team invitation or an admin announcement — stay in the loop.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {/* Card 1: In-App */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="glass-card p-10 rounded-[2.5rem] hover:border-indigo-500/30 transition-all duration-500 group text-left relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <BellRing className="w-24 h-24 -mr-8 -mt-8" />
                </div>
                <div className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                    <BellRing size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">In-App Alerts</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">Real-time red-dot notifications for every relevant action. Persistent and reliable history within the dashboard.</p>
             </motion.div>

             {/* Card 2: WhatsApp */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="glass-card p-10 rounded-[2.5rem] hover:border-green-500/30 transition-all duration-500 group text-left relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-green-500/[0.01] group-hover:bg-green-500/[0.03] transition-colors" />
                <div className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-green-400 mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                    <MessageSquare size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">WhatsApp Sync</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">Automated messages sent directly to your phone. Get instant links to join WhatsApp groups upon team acceptance.</p>
             </motion.div>

             {/* Card 3: Push */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="glass-card p-10 rounded-[2.5rem] hover:border-amber-500/30 transition-all duration-500 group text-left relative overflow-hidden"
             >
                <div className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-amber-500 mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                    <Zap size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-500 transition-colors">Instant Push</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">Powered by FCM. Get alerted even when the app is closed. Essential for time-sensitive join requests.</p>
             </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Communication;
