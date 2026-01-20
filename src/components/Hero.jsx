import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MessageSquare, ShieldCheck, Zap, Layers, Cpu, Globe, Database, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const techBadges = [
    { name: 'Firebase', icon: <Database className="w-4 h-4" color="#FFCA28" /> },
    { name: 'React', icon: <Layers className="w-4 h-4" color="#61DAFB" /> },
    { name: 'PostgreSQL', icon: <Database className="w-4 h-4" color="#336791" /> },
    { name: 'FCM', icon: <Smartphone className="w-4 h-4" color="#FFCA28" /> },
    { name: 'Node.js', icon: <Cpu className="w-4 h-4" color="#339933" /> },
  ];

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#020617]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px]" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-8 group cursor-default"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">
              Intelligence, Not Randomness
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            Academic Teams.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 drop-shadow-sm">
              Organized. Approved.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            A smart platform that forms academic teams with <span className="text-white">real rules</span>, <span className="text-indigo-400">admin approval</span>, and zero chaos.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20"
          >
            <Link 
              to="/auth"
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#how-it-works"
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              How It Works
            </a>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            variants={itemVariants}
            className="pt-12 border-t border-white/5"
          >
            <p className="text-[10px] text-gray-500 mb-8 uppercase tracking-[0.3em] font-black">
              Enterprise Ready Architecture
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-50 hover:opacity-100 transition-opacity duration-700">
              {techBadges.map((tech) => (
                <div key={tech.name} className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-default group">
                   <div className="group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                   </div>
                   <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{tech.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating 3D Elements Placeholder */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-10 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-2xl rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl"
          >
            <ShieldCheck className="w-10 h-10 text-indigo-400/50" />
          </motion.div>
          <motion.div 
            animate={{ 
              y: [0, 25, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-2xl"
          >
            <Zap className="w-12 h-12 text-cyan-400/30" />
          </motion.div>
      </div>
    </section>
  );
};

export default Hero;
