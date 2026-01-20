import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, CheckCircle2, Clock, UserPlus, BookOpen, AlertTriangle, ShieldAlert, GraduationCap, Layers } from 'lucide-react';
import { teamsApi } from '../../services/api';
import ConfirmDialog from '../common/ConfirmDialog';

const TeamCard = ({ team, onJoin, userTeams = [], isBlocked = false }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const memberCount = team.memberCount ?? team.member_count ?? team.members?.length ?? 0;
  const maxMembers = team.maxMembers ?? team.max_members ?? 5;
  
  const isFull = memberCount >= maxMembers;
  const isOwner = team.userStatus === 'owner';
  const isAlreadyMember = team.userStatus === 'accepted' || isOwner || userTeams.includes(team.id);
  const isPending = team.userStatus === 'pending';
  const hasTeamInCourse = userTeams.some(t => t.course === team.course && t.id !== team.id);
  
  const canJoin = !isFull && !isAlreadyMember && !isPending && !hasTeamInCourse && !isOwner && !isBlocked;

  // Get course name - prefer course_data if available
  const courseName = team.course_data?.name || team.courseName || team.course || team.course_code || 'Unknown Course';
  const courseCode = team.course_code || team.course || '';
  
  // Get group and section info
  const lectureGroup = team.lecture_group || team.lectureGroup || team.student_group;
  const sectionNum = team.section;
  const faculty = team.faculty || '';
  const specialization = team.specialization || '';

  const handleReportClick = (e) => {
    e.stopPropagation();
    if (hasReported || isReporting) return;
    setReportModalOpen(true);
  };

  const handleConfirmReport = async () => {
    setIsReporting(true);
    try {
      await teamsApi.reportTeam(team.id);
      setHasReported(true);
    } catch (error) {
      console.error('Failed to report team:', error);
    } finally {
      setIsReporting(false);
    }
  };

  const getStatusBadge = () => {
    if (isBlocked) return { text: 'Blocked', color: 'bg-red-500/20 text-red-500 border-red-500/30' };
    if (isFull) return { text: 'Full', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (team.status === 'pending') return { text: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { text: 'Open', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
  };

  const status = getStatusBadge();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`group relative rounded-2xl p-[1px] overflow-hidden ${isBlocked ? 'opacity-70 grayscale' : ''}`}
      >
        {/* Moving Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative h-full bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/5 group-hover:border-primary/30 transition-colors shadow-xl group-hover:shadow-primary/20">
          
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/30 transition-all duration-500" />

          <div className="relative z-10 flex flex-col h-full">
              {/* 1. Team Name (Header) */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2 truncate">
                        {team.name}
                        {isBlocked && <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />}
                    </h3>
                </div>
                
                {/* Status Badge & Report Button */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${status.color}`}>
                        {status.text}
                    </div>
                    <button 
                        onClick={handleReportClick}
                        disabled={hasReported || isReporting}
                        className={`p-2 rounded-xl border transition-all duration-300 group/report ${
                            hasReported 
                                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                                : 'bg-white/5 border-white/10 text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30'
                        }`}
                        title="Report as Spam"
                    >
                        <AlertTriangle className="w-4 h-4 transition-transform group-hover/report:scale-110" />
                    </button>
                </div>
              </div>

              {/* 2. Course Name (Prominent) */}
              <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{courseName}</p>
                    {courseCode && courseCode !== courseName && (
                      <p className="text-xs text-gray-400">{courseCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Faculty / Specialization */}
              {(faculty || specialization) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {faculty && (
                    <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-xs text-gray-300">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                      {faculty}
                    </span>
                  )}
                  {specialization && (
                    <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-xs text-gray-300">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      {specialization}
                    </span>
                  )}
                </div>
              )}

              {/* 4. Group (Lecture) & Section */}
              <div className="flex gap-2 mb-4">
                {lectureGroup && (
                  <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-xs font-medium text-gray-400">
                    Group {lectureGroup}
                  </span>
                )}
                {sectionNum && (
                  <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-xs font-medium text-gray-400">
                    Section {sectionNum}
                  </span>
                )}
              </div>

              {/* 5. Leader Info */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/[0.07] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Crown className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Team Lead</span>
                      <span className="text-sm text-white font-bold truncate">{team.leaderName || team.leader_name || team.leader?.name || 'Unknown'}</span>
                  </div>
              </div>

              {/* Members Progress */}
              <div className="mt-auto mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>Capacity</span>
                      </div>
                      <span className="font-bold text-white">
                          {memberCount} <span className="text-gray-500">/ {maxMembers}</span>
                      </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(memberCount / maxMembers) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full relative ${isFull ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-primary via-indigo-400 to-cyan-400'}`}
                      >
                          <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                      </motion.div>
                  </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => canJoin && onJoin(team)}
                disabled={!canJoin}
                className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group/btn ${
                    canJoin
                    ? 'bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                    {isOwner ? <><Crown className="w-5 h-5" /> You are Leader</> :
                    isAlreadyMember ? <><CheckCircle2 className="w-5 h-5" /> Member</> :
                    isPending ? <><Clock className="w-5 h-5 animate-pulse" /> Pending...</> :
                    hasTeamInCourse ? <><Clock className="w-5 h-5" /> Limit Reached</> :
                    isFull ? <><Users className="w-5 h-5" /> Full</> :
                    isBlocked ? <><ShieldAlert className="w-5 h-5" /> Blocked</> :
                    <><UserPlus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" /> Join Now</>}
                </span>
              </button>
          </div>
        </div>
      </motion.div>

      {/* Report Confirmation Modal */}
      <ConfirmDialog
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onConfirm={handleConfirmReport}
        title="⚠️ Report Team"
        message={
          <>
            <p className="mb-4">Are you sure you want to report this team?</p>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-sm">
              <p className="font-bold mb-2">Warning:</p>
              <p>If your report is valid, the team will be reviewed.</p>
              <p className="mt-2">If the report is false or abusive, your account may be monitored and may receive restrictions or a temporary ban.</p>
            </div>
          </>
        }
        confirmText="Report Team"
        cancelText="Cancel"
        isDangerous={true}
      />
    </>
  );
};

export default TeamCard;
