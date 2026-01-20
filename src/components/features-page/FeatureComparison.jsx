import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Check } from 'lucide-react';

const FeatureComparison = () => {
    const comparison = [
        { feature: 'Team Formation', old: 'Manual (Excel/Paper)', new: 'Automated & Validated', status: 'Enforced' },
        { feature: 'Communication', old: 'Scattered Emails', new: 'In-App + WhatsApp Sync', status: 'Real-time' },
        { feature: 'Validation', old: 'None (Honor System)', new: 'Strict Rule Enforcement', status: 'Deterministic' },
        { feature: 'Admin Oversight', old: 'Zero Visibility', new: 'Real-time Dashboard', status: 'Total Control' },
    ];

  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6"
          >
              Market Comparison
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8">
            Why Choose <span className="text-gradient">TeamSync?</span>
          </h2>
        </div>
        
        {/* Table/Card Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-card rounded-[3rem] border border-white/10 backdrop-blur-xl overflow-hidden mb-32 shadow-2xl"
        >
            <div className="grid grid-cols-3 p-8 border-b border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest text-gray-500">
                <div>Metric</div>
                <div className="text-red-400/80 flex items-center gap-2"><X size={14} className="shrink-0" /> Traditional</div>
                <div className="text-indigo-400 flex items-center gap-2"><Check size={14} className="shrink-0" /> TeamSync</div>
            </div>
            {comparison.map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 p-8 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-white text-sm uppercase tracking-wide">{row.feature}</div>
                      <span className="text-[10px] font-medium text-gray-600 italic">Core Property</span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium self-center">{row.old}</div>
                    <div className="self-center">
                      <div className="text-white font-bold text-sm mb-1">{row.new}</div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-tighter">
                        {row.status}
                      </span>
                    </div>
                </div>
            ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto p-16 rounded-[3rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 shadow-2xl relative overflow-hidden group"
        >
            <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
              Ready to Reclaim <br/>
              <span className="text-gradient">Academic Sanity?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-12 font-medium max-w-xl mx-auto italic">
              “Stop managing teams manually. Use a system that enforces structure by default.”
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/auth" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl hover:shadow-indigo-500/50 flex items-center justify-center gap-3 group/btn">
                  Start Registration
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link to="/how-it-works" className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] border border-white/10 transition-all flex items-center justify-center gap-3">
                  See the Flow
              </Link>
            </div>
        </motion.div>

      </div>
    </section>
  );
};

export default FeatureComparison;
