import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, UserCircle, BookOpen, Search, 
  Users, ShieldCheck, CheckCircle2 
} from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { 
      title: 'Register & Login', 
      desc: 'Sign up securely using your university email via Google Auth. (Yes, no random emails allowed 😌)',
      icon: <UserPlus className="w-6 h-6" />,
      color: 'indigo'
    },
    { 
      title: 'Complete Profile', 
      desc: 'Fill in your academic details. Better profiles → better teams.',
      icon: <UserCircle className="w-6 h-6" />,
      color: 'purple'
    },
    { 
      title: 'Select Courses', 
      desc: 'Choose faculty, term, and enrolled courses to unlock relevant teams.',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'cyan'
    },
    { 
      title: 'Browse Teams', 
      desc: 'Filter by course or skills. See who’s serious — and who still hasn’t uploaded a profile photo 👀',
      icon: <Search className="w-6 h-6" />,
      color: 'blue'
    },
    { 
      title: 'Join or Create a Team', 
      desc: 'Send a request or create a team — pending admin & leader approval.',
      icon: <Users className="w-6 h-6" />,
      color: 'indigo'
    },
    { 
      title: 'Admin Review & Assignment', 
      desc: 'Admin approves teams, assigns a Doctor, and activates the project.',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'purple'
    },
    { 
      title: 'Collaborate & Submit', 
      desc: 'Track milestones, deadlines, and announcements — all in one place.',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'green'
    },
  ];

  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden bg-[#020617]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] -ml-20 -mb-20" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6"
          >
            The Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold mb-8"
          >
            From Solo to <span className="text-gradient">Squad.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            A simple, linear process to get your projects moving with zero friction.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 opacity-20 md:-translate-x-1/2" />

          <div className="flex flex-col gap-20">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className={`relative flex items-center md:justify-between group ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Connector Bubble */}
                <div className="absolute left-0 md:left-1/2 w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center z-20 md:-translate-x-1/2 transition-transform duration-500 group-hover:scale-110 shadow-2xl overflow-hidden">
                  <div className={`absolute inset-0 bg-${step.color}-500 opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="relative z-10 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20`}>
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-white/5 px-2 py-0.5 rounded-tl-lg border-t border-l border-white/10">
                    <span className="text-[10px] font-black font-mono text-gray-500">0{idx + 1}</span>
                  </div>
                </div>

                {/* Content Card */}
                <div className={`ml-28 md:ml-0 md:w-[42%] ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm group-hover:bg-white/[0.05] group-hover:border-white/10 transition-all duration-500 shadow-xl group-hover:shadow-indigo-500/5">
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Empty State for MD Layout */}
                <div className="hidden md:block md:w-[42%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
