import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { currentUser, userData, loading } = useAuth(); // Import useAuth from context

  if (loading) return null; // Or a smaller loader
  if (currentUser) {
      if (userData?.profile_completed) return <Navigate to="/teams" replace />;
      return <Navigate to="/profile-setup" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
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
            <span className="text-primary font-medium">Authentication</span>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Access the Platform</h1>
            <p className="text-gray-400 text-lg">Secure academic collaboration starts here.</p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'login'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'register'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <LoginForm key="login" />
              ) : (
                <RegisterForm key="register" />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-gray-500 mt-8"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </motion.p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthPage;
