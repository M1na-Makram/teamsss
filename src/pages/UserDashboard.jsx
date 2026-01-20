import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Settings, LogOut, Trash2, 
  Check, X, Crown, Shield, MessageSquare, 
  ChevronRight, Layout, AlertCircle, Loader2, BookOpen, Inbox, Search
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { teamsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import EditTeamModal from '../components/teams/EditTeamModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AlertModal from '../components/common/AlertModal';

const UserDashboard = () => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [myTeams, setMyTeams] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); 
  const [confirmConfig, setConfirmConfig] = useState({ 
    isOpen: false, title: '', message: '', onConfirm: null, isDangerous: false 
  });
  const [alertConfig, setAlertConfig] = useState({ 
    isOpen: false, title: '', message: '', type: 'info' 
  });

  useEffect(() => {
    if (currentUser) {
        fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [teamsRes, requestsRes] = await Promise.all([
        teamsApi.getMyTeams(),
        teamsApi.getPendingRequests()
      ]);
      setMyTeams(teamsRes.data || []);
      setPendingRequests(requestsRes.data || []);
      
      // Auto-select logic
      if (teamsRes.data && teamsRes.data.length > 0) {
          const owned = teamsRes.data.find(t => t.userRole === 'owner');
          handleSelectTeam(owned?.id || teamsRes.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = async (teamId) => {
    try {
        const res = await teamsApi.getTeamDetails(teamId);
        setSelectedTeam(res.data);
    } catch (error) {
        console.error('Error selecting team:', error);
    }
  };

  const handleMemberAction = async (teamId, targetUserId, status) => {
    setActionLoading(`${targetUserId}-${status}`);
    try {
        await teamsApi.updateMemberStatus(teamId, targetUserId, status);
        // Refresh detail and pending list
        await handleSelectTeam(teamId);
        const reqRes = await teamsApi.getPendingRequests();
        setPendingRequests(reqRes.data || []);
    } catch (error) {
        setAlertConfig({
            isOpen: true,
            title: 'Action Failed',
            message: error.message,
            type: 'error'
        });
    } finally {
        setActionLoading(null);
    }
  };

  const handleLeaveTeam = (teamId) => {
    setConfirmConfig({
        isOpen: true,
        title: 'Leave Team',
        message: 'Are you sure you want to leave this team? You will lose access to team resources.',
        isDangerous: true,
        onConfirm: async () => {
            setActionLoading(`leave-${teamId}`);
            try {
                await teamsApi.leaveTeam(teamId);
                // Refresh local list
                setMyTeams(prev => prev.filter(t => t.id !== teamId));
                setSelectedTeam(null);
                // If left the last team, fetch to show "No Teams" state properly
                if (myTeams.length <= 1) fetchDashboardData();
            } catch (error) {
                setAlertConfig({
                    isOpen: true,
                    title: 'Leave Failed',
                    message: error.message || 'Unknown error',
                    type: 'error'
                });
                console.error('LeaveTeam Error:', error);
            } finally {
                setActionLoading(null);
            }
        }
    });
  };

  const handleUpdateTeam = async (formData) => {
    setActionLoading(`update-${selectedTeam.id}`);
    try {
        await teamsApi.updateTeam(selectedTeam.id, formData);
        await handleSelectTeam(selectedTeam.id);
        const teamsRes = await teamsApi.getMyTeams();
        setMyTeams(teamsRes.data);
        setIsEditModalOpen(false);
        setAlertConfig({
            isOpen: true,
            title: 'Success',
            message: 'Team details updated successfully.',
            type: 'success'
        });
    } catch (error) {
        setAlertConfig({
            isOpen: true,
            title: 'Update Failed',
            message: error.message,
            type: 'error'
        });
    } finally {
        setActionLoading(null);
    }
  };

  const handleDeleteTeam = (teamId) => {
    setConfirmConfig({
        isOpen: true,
        title: 'Delete Team',
        message: 'Are you sure you want to delete this team? This action cannot be undone and all team data will be lost.',
        isDangerous: true,
        onConfirm: async () => {
             setActionLoading(`delete-${teamId}`);
            try {
                await teamsApi.deleteTeam(teamId);
                setMyTeams(prev => prev.filter(t => t.id !== teamId));
                setSelectedTeam(null);
                if (myTeams.length <= 1) fetchDashboardData();
            } catch (error) {
                setAlertConfig({
                    isOpen: true,
                    title: 'Delete Failed',
                    message: error.message,
                    type: 'error'
                });
            } finally {
                setActionLoading(null);
            }
        }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-gray-400 animate-pulse">Synchronizing your dashboard...</p>
        </div>
      </div>
    );
  }

  // GAATE: If user has no teams and no pending memberships, show Cta
  if (myTeams.length === 0 && !loading) {
      return (
          <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-[#020617] px-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md w-full text-center bg-white/5 border border-white/10 rounded-3xl p-12"
                >
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30">
                        <Users className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">No Active Teams</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        You don't belong to any teams yet. Start by joining an existing team or create your own to begin collaborating!
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link to="/teams" className="w-full py-4 bg-primary hover:bg-primary/90 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/40 flex items-center justify-center gap-2">
                            <Search className="w-5 h-5" />
                            Browse Available Teams
                        </Link>
                        <button onClick={() => navigate('/teams')} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all">
                            Create Your First Team
                        </button>
                    </div>
                </motion.div>
            </div>
            <Footer />
          </>
      );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 bg-[#020617]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar: My Teams */}
            <div className="lg:w-80 flex-shrink-0">
                <div className="flex items-center gap-3 mb-6">
                    <Layout className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold">Manage Collaboration</h2>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 pl-1">My Active Teams</h3>
                        <div className="space-y-2">
                           {myTeams.map(team => (
                               <button
                                 key={team.id}
                                 onClick={() => handleSelectTeam(team.id)}
                                 className={`w-full flex flex-col p-3.5 rounded-xl transition-all text-left group border ${
                                    selectedTeam?.id === team.id 
                                    ? 'bg-primary/15 border-primary/40' 
                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                 }`}
                               >
                                   <div className="flex items-center justify-between mb-1.5">
                                       <span className="font-bold text-sm truncate group-hover:text-primary transition-colors">{team.name}</span>
                                       {team.userRole === 'owner' && <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />}
                                   </div>
                                   <div className="flex items-center gap-2 text-[10px] font-medium">
                                       <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300 uppercase">{team.course_code}</span>
                                       <span className={`capitalize ${team.userStatus === 'accepted' ? 'text-green-400' : 'text-amber-400'}`}>
                                           {team.userStatus}
                                       </span>
                                   </div>
                               </button>
                           ))}
                        </div>
                    </div>

                    {pendingRequests.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 shadow-lg">
                            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {pendingRequests.length} New Request{pendingRequests.length > 1 ? 's' : ''}
                            </h3>
                            <div className="space-y-3">
                                {pendingRequests.slice(0, 3).map(req => (
                                    <div key={req.id} className="text-xs p-3 bg-black/30 rounded-xl border border-white/5">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-bold text-white truncate">{req.profiles?.name}</p>
                                            <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{req.team?.course_code}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 truncate">Applied to {req.team?.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Link to="/teams" className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-sm font-bold group">
                        <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Explore More Teams
                    </Link>
                </div>
            </div>

            {/* Main Content: Team Details & Management */}
            <div className="flex-1 min-w-0">
                {selectedTeam ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                        {/* Header Profile */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="h-40 bg-gradient-to-r from-primary/30 to-accent/30 flex items-end p-8 relative">
                                <div className="absolute top-4 right-4 flex gap-2">
                                     {selectedTeam.created_by === userData?.id ? (
                                        <>
                                            <button 
                                                onClick={() => setIsEditModalOpen(true)}
                                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/10"
                                                title="Team Settings"
                                            >
                                                <Settings className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTeam(selectedTeam.id)} 
                                                className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all backdrop-blur-md border border-red-500/20"
                                            >
                                                {actionLoading === `delete-${selectedTeam.id}` ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                            </button>
                                        </>
                                     ) : (
                                        <button 
                                            onClick={() => handleLeaveTeam(selectedTeam.id)}
                                            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all backdrop-blur-md border border-red-500/20 text-xs font-bold flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Leave Team
                                        </button>
                                     )}
                                </div>
                                <div className="flex items-center gap-6 w-full translate-y-8">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent p-1 shadow-2xl shrink-0">
                                        <div className="w-full h-full bg-[#0f172a] rounded-[1.4rem] flex items-center justify-center">
                                            <Users className="w-12 h-12 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-3xl font-black text-white truncate drop-shadow-lg">{selectedTeam.name}</h1>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                                                <BookOpen className="w-4 h-4" />
                                                {selectedTeam.course_code}
                                            </span>
                                            <span className="text-gray-400 text-sm font-medium">• {selectedTeam.faculty} • {selectedTeam.term}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pt-16">
                               <div className="flex flex-col md:flex-row gap-8 justify-between">
                                    <div className="max-w-xl">
                                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Goal & Description</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed italic">
                                            "{selectedTeam.description || 'Collaboratively working on course projects and achieving academic excellence.'}"
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center md:items-end justify-center shrink-0">
                                        <div className="text-center md:text-right">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Capacity</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-black text-white">{selectedTeam.members?.filter(m => m.status === 'accepted' || m.role === 'owner').length}</span>
                                                <span className="text-gray-500 font-bold">/ {selectedTeam.max_members}</span>
                                            </div>
                                            <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary" 
                                                    style={{ width: `${(selectedTeam.members?.filter(m => m.status === 'accepted' || m.role === 'owner').length / selectedTeam.max_members) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                               </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Members List */}
                            <div className="xl:col-span-2 space-y-6">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold flex items-center gap-3">
                                            <Users className="w-6 h-6 text-primary" />
                                            Active Roster
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedTeam.members?.filter(m => m.status === 'accepted' || m.role === 'owner').map(member => (
                                            <div key={member.profiles?.id || member.user_id} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all group relative overflow-hidden">
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-black text-primary overflow-hidden border border-white/10">
                                                        {member.profiles?.photo_url ? (
                                                            <img src={member.profiles.photo_url} className="w-full h-full object-cover" />
                                                        ) : (member.profiles?.name?.[0] || 'U')}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-sm truncate text-white">{member.profiles?.name}</p>
                                                            {member.role === 'owner' && <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500/20" />}
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 font-medium truncate">ID: {member.profiles?.student_id || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                
                                                {selectedTeam.created_by === userData?.id && member.role !== 'owner' && (
                                                    <button 
                                                      onClick={() => handleMemberAction(selectedTeam.id, member.user_id, 'removed')} 
                                                      className="p-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all hover:bg-red-500/10 rounded-xl relative z-20"
                                                      disabled={actionLoading === `${member.user_id}-removed`}
                                                    >
                                                        {actionLoading === `${member.user_id}-removed` ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pending Requests Section for Owner */}
                            <div className="space-y-8">
                                {selectedTeam.created_by === userData?.id ? (
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] pointer-events-none" />
                                        <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                                            <UserPlus className="w-6 h-6 text-accent" />
                                            Join Requests
                                        </h3>

                                        <div className="space-y-4">
                                            {selectedTeam.members?.filter(m => m.status === 'pending').length > 0 ? (
                                                selectedTeam.members?.filter(m => m.status === 'pending').map(req => (
                                                    <div key={req.profiles?.id || req.user_id} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                                                        <div className="flex items-center gap-4 mb-5">
                                                            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shrink-0 border border-accent/20">
                                                                <MessageSquare className="w-6 h-6" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-black text-white truncate">{req.profiles?.name}</p>
                                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: {req.profiles?.student_id}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                              onClick={() => handleMemberAction(selectedTeam.id, req.user_id, 'accepted')}
                                                              disabled={actionLoading === `${req.user_id}-accepted`}
                                                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/20 text-green-400 rounded-xl text-xs font-black hover:bg-green-500/30 transition-all disabled:opacity-50 border border-green-500/20"
                                                            >
                                                                {actionLoading === `${req.user_id}-accepted` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-4 h-4" />}
                                                                Approve
                                                            </button>
                                                            <button 
                                                              onClick={() => handleMemberAction(selectedTeam.id, req.user_id, 'rejected')}
                                                              disabled={actionLoading === `${req.user_id}-rejected`}
                                                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/20 text-red-400 rounded-xl text-xs font-black hover:bg-red-500/30 transition-all disabled:opacity-50 border border-red-500/20"
                                                            >
                                                                {actionLoading === `${req.user_id}-rejected` ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-4 h-4" />}
                                                                Decline
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-10 opacity-40">
                                                    <Inbox className="w-12 h-12 mx-auto mb-3" />
                                                    <p className="text-sm font-medium">No pending requests</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10 rounded-3xl p-8 shadow-xl">
                                        <h3 className="font-black text-sm uppercase tracking-widest mb-4 text-primary">Member Status</h3>
                                        <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 rounded-2xl">
                                             <Shield className="w-6 h-6 text-green-400" />
                                             <div>
                                                 <p className="text-sm font-bold">You are a confirmed member</p>
                                                 <p className="text-[10px] text-gray-500">Collaborating since {new Date(selectedTeam.created_at).toLocaleDateString()}</p>
                                             </div>
                                        </div>
                                        <button 
                                          onClick={() => handleLeaveTeam(selectedTeam.id)}
                                          disabled={actionLoading === `leave-${selectedTeam.id}`}
                                          className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading === `leave-${selectedTeam.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                            Terminate Membership
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-12 text-center shadow-inner">
                        <div className="w-24 h-24 bg-primary/15 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/20 animate-bounce">
                            <Shield className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-3xl font-black mb-3">Management Portal</h2>
                        <p className="text-gray-400 max-w-sm font-medium leading-relaxed">Select one of your teams from the sidebar to view detailed roster, manage applications, or update settings.</p>
                    </div>
                )}
            </div>

          </div>
        </div>
      </div>
      <Footer />

      <EditTeamModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleUpdateTeam}
        loading={actionLoading === `update-${selectedTeam?.id}`}
        team={selectedTeam}
      />

      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDangerous={confirmConfig.isDangerous}
      />

      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </>
  );
};

export default UserDashboard;
