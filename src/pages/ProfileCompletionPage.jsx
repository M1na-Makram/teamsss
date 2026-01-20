import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileCard from '../components/profile/ProfileCard';
import { useAuth } from '../context/AuthContext';

const ProfileCompletionPage = () => {
  const { userData, loading, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const completed = userData?.profile_completed;

  // Manual re-check if data seems missing but state isn't loading
  useEffect(() => {
      if (!loading && !userData) {
          refreshUserData();
      }
  }, [loading, userData, refreshUserData]);

  if (loading || (!userData && !completed)) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-gray-400 font-medium italic">Establishing secure connection to profile...</p>
        </div>
      );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">Profile Management</span>
          </motion.div>

          <AnimatePresence mode="wait">
            {!completed || isEditing ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
              >
                {/* Hero Text */}
                <div className="text-center mb-12">
                   <h1 className="text-4xl md:text-5xl font-bold mb-4">
                     {completed ? 'Refine Your Identity' : 'Establish Your Roster'}
                   </h1>
                   <p className="text-gray-400 text-lg">
                     {completed ? 'Ensure your academic metadata is current for team matching.' : 'Your academic profile ensures rules, validation, and notifications work properly.'}
                   </p>
                </div>

                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative">
                  {completed && (
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                    >
                      Return to Preview
                    </button>
                  )}
                  <ProfileForm onComplete={() => {
                      setIsEditing(false);
                      refreshUserData();
                  }} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                   <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Passport</h1>
                   <p className="text-gray-400 text-lg">Manage your smart identity and team participation status.</p>
                </div>
                <ProfileCard userData={userData} onEdit={() => setIsEditing(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileCompletionPage;
