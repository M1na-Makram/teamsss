import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, PlusCircle, UserCheck, AlertTriangle } from 'lucide-react';

const LogicFilter = () => {
  const [activeTab, setActiveTab] = useState('logic');

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Built with Rules — Not Random Logic
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Strict constraints ensure fairness. Real-time validation keeps everything in check.
          </motion.p>
        </div>

        {/* Logic Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
           {/* Card 1 */}
           <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/5 p-6 rounded-2xl"
           >
              <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Constraint Enforcement</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      One team per course per user
                  </li>
                  <li className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                       Max 5 members per team
                  </li>
              </ul>
           </motion.div>
           
           {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/5 p-6 rounded-2xl"
           >
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                  <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Role-Based Access</h3>
               <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      Leaders can manage requests
                  </li>
                  <li className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                       Members must be accepted
                  </li>
              </ul>
           </motion.div>

           {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/5 p-6 rounded-2xl"
           >
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center mb-4">
                  <Filter className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">SQL-Backed Validation</h3>
               <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Atomic transactions
                  </li>
                  <li className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                       Real-time consistency
                  </li>
              </ul>
           </motion.div>
        </div>

        {/* Smart Filtering Mockup */}
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#1e293b] rounded-xl border border-white/10 shadow-2xl overflow-hidden max-w-5xl mx-auto"
            >
                {/* Mockup Header */}
                <div className="bg-[#0f172a] p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search teams..." 
                                className="w-full bg-[#1e293b] text-sm text-gray-300 pl-9 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-primary" 
                                disabled
                            />
                        </div>
                         <div className="h-8 w-px bg-white/10 hidden md:block" />
                         <div className="flex gap-2">
                             <span className="px-3 py-1.5 bg-primary/20 text-primary text-xs font-semibold rounded-md border border-primary/30">Fall 2025</span>
                             <span className="px-3 py-1.5 bg-white/5 text-gray-400 text-xs font-semibold rounded-md border border-white/10">Computer Science</span>
                         </div>
                    </div>
                    
                    <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors opacity-50 cursor-not-allowed" disabled>
                        <PlusCircle className="w-4 h-4" />
                        Create Team
                    </button>
                </div>
                
                {/* Mockup Body */}
                <div className="p-6 grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border border-white/5 bg-white/[0.02] p-4 rounded-lg flex items-center justify-between hover:bg-white/[0.05] transition-colors cursor-default">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                                     T{i}
                                 </div>
                                 <div>
                                     <h4 className="font-semibold text-sm">Team Alpha-{i}</h4>
                                     <p className="text-xs text-gray-500">CS-10{i} • 3/5 Members</p>
                                 </div>
                             </div>
                             <button className="text-xs font-medium text-primary hover:text-primary/80">
                                 Request Join
                             </button>
                        </div>
                    ))}
                </div>
            </motion.div>
            
            <div className="absolute bottom-10 left-0 right-0 text-center z-20">
                <p className="text-gray-400 italic">Interactive Team Setup Mockup</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default LogicFilter;
