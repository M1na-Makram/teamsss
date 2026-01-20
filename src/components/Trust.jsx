import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Users, BellOff } from 'lucide-react';

const Trust = () => {
  const problems = [
    {
      icon: <Users className="w-6 h-6 text-red-400" />,
      title: 'Random Team Creation',
      desc: 'Students forming teams without constraints leads to unbalanced skill sets and unfair advantages.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-orange-400" />,
      title: 'No Validation or Control',
      desc: 'Zero oversight on who joins which team, resulting in conflicts and rule violations.',
    },
    {
      icon: <BellOff className="w-6 h-6 text-yellow-400" />,
      title: 'Missed Deadlines',
      desc: 'Important announcements get lost in email chains, causing students to miss critical updates.',
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Why This Platform Exists
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Managing academic teams manually is a nightmare. <span className="text-gray-200 font-semibold">We replace chaos with code.</span>
          </motion.p>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 -mx-6 md:mx-0 px-6 md:px-0 scrollbar-hide">
          {problems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[85vw] md:min-w-0 snap-center p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-white/10 text-center relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10" />
             <h3 className="text-2xl md:text-3xl font-bold mb-4">
                The Solution
             </h3>
             <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                "This platform replaces chaos with structured, validated academic teamwork."
             </p>
             <div className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Problem Solved</span>
                </div>
             </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Trust;
