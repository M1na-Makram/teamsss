import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, Users, Inbox, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterPanel from '../components/teams/FilterPanel';
import TeamCard from '../components/teams/TeamCard';
import TeamSkeleton from '../components/teams/TeamSkeleton';
import JoinTeamModal from '../components/teams/JoinTeamModal';
import CreateTeamModal from '../components/teams/CreateTeamModal';
import ProfileIncompleteModal from '../components/modals/ProfileIncompleteModal';
import ApprovalPendingModal from '../components/modals/ApprovalPendingModal';
import AlertModal from '../components/common/AlertModal';
import { useAuth } from '../context/AuthContext';
import { teamsApi, coursesApi } from '../services/api';
import SEO from '../components/common/SEO';

const TeamsPage = () => {
  const { currentUser, userData } = useAuth();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    course: '',
    faculty: '',
    specialization: '',
    group: ''
  });
  const [dbFaculties, setDbFaculties] = useState([]);
  const [dbCourses, setDbCourses] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [userTeams, setUserTeams] = useState([]);
  const [alertConfig, setAlertConfig] = useState({ 
    isOpen: false, title: '', message: '', type: 'info' 
  });

  const isDoctor = userData?.role === 'doctor';
  const isAdmin = userData?.role === 'admin';

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await teamsApi.getTeams(filters);
      setTeams(response.data);
      setFilteredTeams(response.data);
      
      // Update userTeams to accurately reflect which teams the user is in (accepted)
      const joinedTeams = response.data
        .filter(t => t.userStatus === 'accepted')
        .map(t => ({ id: t.id, course: t.course }));
      setUserTeams(joinedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [filters, currentUser?.id]);

  // Fetch faculties and courses on mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [facultiesRes, coursesRes] = await Promise.all([
          coursesApi.getFaculties(),
          coursesApi.getAll()
        ]);
        setDbFaculties(facultiesRes.data || []);
        setDbCourses(coursesRes.data || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchFilterData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      course: '',
      faculty: '',
      specialization: '',
      group: ''
    });
  };

  // Helper to check if user is approved (handles both boolean and status string)
  const isUserApproved = () => {
    if (userData?.role === 'admin') return true;
    if (userData?.role === 'doctor') return true; // Doctors are pre-approved by admin
    if (userData?.approved === true) return true;
    if (userData?.approval_status === 'approved') return true;
    return false;
  };



  const handleJoinClick = (team) => {
    if (isDoctor) return; // Doctors can't join
    if (!userData?.profile_completed) {
      setProfileModalOpen(true);
      return;
    }
    if (!isUserApproved()) {
      setApprovalModalOpen(true);
      return;
    }
    setSelectedTeam(team);
    setJoinModalOpen(true);
  };

  const handleJoinConfirm = async (team) => {
    setActionLoading(true);
    try {
      await teamsApi.joinTeam(team.id);
      await fetchTeams();
    } catch (error) {
      console.error('Error joining team:', error);
      const msg = error.message || error.response?.data?.message || 'Failed to join team';
      setAlertConfig({
        isOpen: true,
        title: 'Join Failed',
        message: msg,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setJoinModalOpen(false);
      setSelectedTeam(null);
    }
  };

  const handleCreateTeam = async (formData) => {
    setActionLoading(true);
    try {
      await teamsApi.createTeam(formData);
      await fetchTeams();
      setCreateModalOpen(false);
      setAlertConfig({
        isOpen: true,
        title: 'Success',
        message: 'Team created successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating team:', error);
      setAlertConfig({
        isOpen: true,
        title: 'Creation Failed',
        message: error.response?.data?.message || 'Failed to create team',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Discover Academic Teams"
        description="Browse and join academic teams for your courses. Real-time filtering, skill matching, and secure team requests."
      />
      <Navbar />
      <div className="min-h-screen pt-20 pb-12 relative overflow-hidden bg-[#020617]">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-blob filter mix-blend-multiply" />
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000 filter mix-blend-multiply" />
          <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000 filter mix-blend-multiply" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-400 mb-8"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">Teams</span>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 relative"
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/10 blur-[80px] -z-10 rounded-full pointer-events-none" />
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">Discover & Manage</span> 
              <br />
              <span className="text-gradient">Academic Teams</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Experience the next generation of collaborative learning. 
              <span className="text-white font-medium"> Structured, validated, and automated.</span>
            </p>

            {(!isDoctor && !isAdmin) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!userData?.profile_completed) {
                    setProfileModalOpen(true);
                  } else if (!isUserApproved()) {
                    setApprovalModalOpen(true);
                  } else {
                    setCreateModalOpen(true);
                  }
                }}
                className="group relative px-8 py-4 bg-primary rounded-2xl font-bold text-white shadow-2xl shadow-primary/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                    <Plus className="w-6 h-6" />
                    Create Your Team
                </span>
              </motion.button>
            )}
            {(isDoctor || isAdmin || userData?.role === 'staff') && (
               <div className="glass px-8 py-4 rounded-2xl inline-block border-primary/20">
                  <p className="text-primary font-bold flex items-center gap-3">
                    <Shield className="w-6 h-6 animate-pulse" />
                    Supervisory Access Granted
                  </p>
               </div>
            )}
          </motion.div>

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            faculties={dbFaculties}
            courses={dbCourses}
          />

          {/* Teams Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <TeamSkeleton key={i} />)}
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onJoin={handleJoinClick}
                  userTeams={userTeams}
                  isBlocked={team.userStatus === 'rejected' || team.userStatus === 'REJECTED' || team.userStatus === 'BLOCKED'}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Teams Found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters{!isDoctor && ' or create a new team'}</p>
              {!isDoctor && (
                <button
                  onClick={() => {
                    if (!userData?.profile_completed) {
                      setProfileModalOpen(true);
                    } else {
                      setCreateModalOpen(true);
                    }
                  }}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-primary/50"
                >
                  <Plus className="w-5 h-5" />
                  Create Team
                </button>
              )}
            </motion.div>
          )}

          {/* Bottom CTA */}
          {!loading && filteredTeams.length > 0 && !isDoctor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16 text-center bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12"
            >
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Can't find your team?</h2>
              <p className="text-gray-400 mb-6">Create one instantly and become the leader</p>
              <button
                onClick={() => {
                  if (!userData?.profile_completed) {
                    setProfileModalOpen(true);
                  } else {
                    setCreateModalOpen(true);
                  }
                }}
                className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-lg font-semibold text-lg transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-primary/50"
              >
                <Plus className="w-5 h-5" />
                Create Team
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <JoinTeamModal
        team={selectedTeam}
        isOpen={joinModalOpen}
        onClose={() => {
          setJoinModalOpen(false);
          setSelectedTeam(null);
        }}
        onConfirm={handleJoinConfirm}
        loading={actionLoading}
      />

      <CreateTeamModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreateTeam}
        loading={actionLoading}
      />

      <ProfileIncompleteModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <ApprovalPendingModal 
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
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

export default TeamsPage;
