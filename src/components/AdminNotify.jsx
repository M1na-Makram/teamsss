import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const AdminNotify = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-6">
                <Bell className="w-4 h-4" />
                <span>Real-Time Updates</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
               Never Miss a <br/> Critical Update
             </h2>
             <p className="text-lg text-gray-400 mb-8 leading-relaxed">
               Whether it's a team invitation, a deadline reminder, or an admin announcement, you'll know instantly via our multi-channel notification system.
             </p>

             <ul className="space-y-4 mb-8">
               {[
                 'Instant Push Notifications via FCM',
                 'Automated WhatsApp Alerts for Urgent Actions',
                 'In-App Notification Center with History',
                 'Persistent Red-Dot Indicators'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-gray-300">
                   <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                   {item}
                 </li>
               ))}
             </ul>
             
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 max-w-sm">
                  <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                      <h4 className="font-semibold text-sm text-white">New Whatsapp Message</h4>
                      <p className="text-xs text-gray-400">TeamSync: Your join request to Team Alpha was accepted!</p>
                  </div>
              </div>
          </motion.div>

          {/* Admin Dashboard Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 blur-2xl rounded-3xl" />
              
              <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                   <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                           <Shield className="w-5 h-5 text-primary" />
                           <span className="font-bold text-gray-200">Admin Governance Console</span>
                       </div>
                       <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-red-500/50" />
                           <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                           <div className="w-3 h-3 rounded-full bg-green-500/50" />
                       </div>
                   </div>

                   <div className="p-6 space-y-6">
                       {/* Control Panel Mockup */}
                       <div>
                           <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Announcement Target</label>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                               <button className="px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg text-center">All Students</button>
                               <button className="px-3 py-2 bg-white/5 text-gray-400 text-xs font-semibold rounded-lg text-center hover:bg-white/10">Faculty Only</button>
                               <button className="px-3 py-2 bg-white/5 text-gray-400 text-xs font-semibold rounded-lg text-center hover:bg-white/10">Single Team</button>
                           </div>
                       </div>

                       <div>
                           <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Message Content</label>
                           <div className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-300">
                               Reminder: Final team validation deadline is tomorrow at 5 PM. All pending teams will be dissolved.
                           </div>
                       </div>

                       <div className="flex items-center justify-between pt-2">
                           <div className="flex items-center gap-2 text-xs text-gray-500">
                               <CheckCircle2 className="w-3 h-3" />
                               Validating with Backend...
                           </div>
                           <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                               <Send className="w-4 h-4" />
                               Broadcast Now
                           </button>
                       </div>
                   </div>
                   
                   {/* Footer status */}
                   <div className="bg-black/20 p-3 text-center border-t border-white/5">
                       <p className="text-xs text-gray-500 font-mono">System Status: All Services Operational • Database: Connected</p>
                   </div>
              </div>
          </motion.div>
        
        </div>
      </div>
    </section>
  );
};

export default AdminNotify;
