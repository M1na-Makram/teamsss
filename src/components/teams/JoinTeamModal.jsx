import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, AlertCircle } from 'lucide-react';

const JoinTeamModal = ({ team, isOpen, onClose, onConfirm, loading }) => {
  if (!team) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Join Team</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Team Info */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg mb-2">{team?.name || 'Unnamed Team'}</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Course: <span className="text-white">{team?.course || 'N/A'}</span></p>
                  <p>Leader: <span className="text-white">{team?.leaderName || team?.leader_name || team?.leader?.name || 'Unknown'}</span></p>
                  <p>Members: <span className="text-white">
                    {team?.memberCount ?? team?.member_count ?? team?.members?.length ?? 0} / {team?.maxMembers ?? team?.max_members ?? 5}
                  </span></p>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-semibold mb-1">What happens next?</p>
                  <ul className="space-y-1 text-blue-300/80">
                    <li>• Your request will be sent to the team leader</li>
                    <li>• You'll receive a notification when accepted</li>
                    <li>• WhatsApp alert will be sent automatically</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(team)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-primary/50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Confirm Join
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JoinTeamModal;
