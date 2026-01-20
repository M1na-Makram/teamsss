import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, X } from 'lucide-react';

const ApprovalPendingModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-500/30">
                <Clock className="w-10 h-10 text-amber-500" />
              </div>

              <h2 className="text-3xl font-black text-white mb-4 italic tracking-tight uppercase">Verification Required</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Your academic identity is currently being verified by our administration team. 
                Full access to team creation and joining will be granted once your profile is approved.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex items-start gap-4 text-left">
                <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-white mb-1">Standard Security Protocol</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        To ensure a safe collaborative environment, every student must be manually approved. This usually takes less than 24 hours.
                    </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/40"
              >
                Acknowledge & Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApprovalPendingModal;
