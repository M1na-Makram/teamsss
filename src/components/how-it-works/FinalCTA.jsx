import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-32 bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-10">
            <Sparkles className="w-4 h-4" />
            Zero Chaos. Guaranteed.
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
            Ready for Academic Teamwork <br />
            <span className="text-gradient">Without Chaos?</span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
            Structured. Approved. Communicated. Join hundreds of students already collaborating effectively.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/auth"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-gray-100 hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              to="/features"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
            >
              View Features
            </Link>
          </div>
          
          <p className="mt-12 text-sm text-gray-600 font-medium tracking-wide flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Official University Platform System
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
