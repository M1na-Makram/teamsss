import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileIncompleteModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
        >
          {/* Header Image/Icon Section */}
          <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h3>
            <p className="text-slate-400 mb-8">
              To maintain a high-quality academic environment, we require all users to complete their profile before creating or joining teams.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  onClose();
                  navigate('/profile-setup');
                }}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
              >
                Complete Profile Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>

          {/* Warning Flag */}
          <div className="bg-amber-500/10 border-t border-slate-800 p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-200/80 text-left">
              This step ensures you're matched with the right academic partners.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileIncompleteModal;
