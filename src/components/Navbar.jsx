import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Bell, User, LogOut, ChevronDown, 
  Shield, Layers, LayoutDashboard, Settings, ChevronRight, UserCheck, Users 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationsApi } from '../services/api';

const Navbar = () => {
  const { currentUser, userData, signOut, unreadCount } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = userData?.role === 'admin';
  const isDoctor = userData?.role === 'doctor';
  const isApproved = isAdmin || isDoctor || userData?.approved || userData?.approval_status === 'approved';

  const navLinks = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Features', href: '/features' },
  ];

  if (currentUser) {
    // Teams always visible when logged in
    navLinks.push({ name: 'Teams', href: '/teams' });

    // Dashboard only if approved
    if (isApproved) {
      navLinks.push({ name: 'Dashboard', href: '/dashboard' });
    }

    // Doctor Dash for Doctors/Admins
    if (isDoctor || isAdmin) {
      navLinks.push({ name: 'Doctor Dash', href: '/doctor' });
    }

    // Admin Panel for Admins
    if (isAdmin) {
      navLinks.push({ name: 'Admin', href: '/admin', protected: true, important: true });
    }
  }

  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl shadow-indigo-500/10'
            : 'bg-transparent py-6'
        }`}
      >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group relative"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative w-10 h-10 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center text-white shadow-lg overflow-hidden">
              <Layers className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-300 transition-all duration-300">
            TeamSync
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
          {navLinks.map((link) => (
            (!link.protected || currentUser) && (
              <Link
                key={link.name}
                to={link.href}
                className={`px-5 py-2 text-sm font-medium transition-all rounded-full relative group ${
                  location.pathname + location.hash === link.href
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {link.name === 'Admin' && <Shield className="w-4 h-4" />}
                  {link.name === 'Teams' && <Users className="w-4 h-4" />}
                  {link.name === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                  {link.name === 'Doctor Dash' && <UserCheck className="w-4 h-4 text-indigo-400" />}
                  {link.name}
                </span>
              </Link>
            )
          ))}
        </div>

        {/* Right Section: Auth / Profile */}
        <div className="hidden md:flex items-center gap-5">
          {currentUser ? (
            <>
              {/* Notifications Bell */}
              <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors group">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0f172a] animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center font-bold text-sm text-white overflow-hidden text-center uppercase">
                    {(userData?.photo_url || currentUser?.user_metadata?.avatar_url) ? (
                      <img src={userData?.photo_url || currentUser?.user_metadata?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      currentUser.email[0]
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-semibold truncate text-white">{userData?.name || currentUser.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                        {isAdmin && <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">Admin</span>}
                        {isDoctor && <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">Doctor</span>}
                      </div>

                      <div className="py-1">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                          <LayoutDashboard className="w-4 h-4" /> My Dashboard
                        </Link>
                        {(isDoctor || isAdmin) && (
                          <Link to="/doctor" className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-400 hover:bg-indigo-400/5 transition-colors font-medium" onClick={() => setProfileDropdownOpen(false)}>
                            <UserCheck className="w-4 h-4" /> Doctor Dashboard
                          </Link>
                        )}
                        <Link to="/profile-setup" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                          <User className="w-4 h-4" /> Profile Info
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-400/5 transition-colors font-medium border-t border-white/5" onClick={() => setProfileDropdownOpen(false)}>
                            <Shield className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-white/5 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/auth" className="text-sm font-semibold bg-white text-background px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all flex items-center gap-1 group shadow-lg hover:shadow-white/20">
                Get Started
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          {currentUser && (
            <Link to="/notifications" className="relative p-1 text-gray-400">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Link>
          )}
          <button
            className="text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.nav
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0f172a] z-[70] md:hidden overflow-y-auto shadow-2xl border-l border-white/10 flex flex-col"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Close button */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <span className="text-lg font-bold text-white">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex flex-col flex-grow overflow-y-auto">
              {/* User Profile Section */}
              {currentUser && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 shrink-0"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center font-bold text-white text-xl overflow-hidden uppercase shadow-lg flex-shrink-0">
                    {(userData?.photo_url || currentUser.user_metadata?.avatar_url) ? (
                      <img src={userData?.photo_url || currentUser.user_metadata?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      currentUser.email[0]
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate">{userData?.name || currentUser.user_metadata?.full_name || 'User'}</p>
                    <p className="text-gray-400 text-sm truncate">{currentUser.email}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {isAdmin && <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">Admin</span>}
                      {isDoctor && <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">Doctor</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Access Section (logged in only) */}
              {currentUser && (
                <div className="mb-6 shrink-0">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 px-1">Quick Access</p>
                  <div className="space-y-1">
                    <Link
                      to="/profile-setup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all min-h-[48px]"
                    >
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/teams"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all min-h-[48px]"
                    >
                      <Users className="w-5 h-5 text-cyan-400" />
                      <span className="font-medium">Teams</span>
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all min-h-[48px]"
                    >
                      <Bell className="w-5 h-5 text-yellow-400" />
                      <span className="font-medium">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-white/10 mb-6 shrink-0" />

              {/* Primary Navigation */}
              <div className="flex-1 shrink-0">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 px-1">Navigation</p>
                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    (!link.protected || currentUser) && (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <Link
                          to={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-h-[48px] ${
                            location.pathname === link.href 
                              ? 'bg-primary/10 text-primary font-bold' 
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          } ${link.important ? 'text-amber-400' : ''}`}
                        >
                          {link.name === 'Admin' && <Shield className="w-5 h-5" />}
                          {link.name === 'Teams' && <Users className="w-5 h-5" />}
                          {link.name === 'Dashboard' && <LayoutDashboard className="w-5 h-5" />}
                          {link.name === 'Doctor Dash' && <UserCheck className="w-5 h-5" />}
                          {link.name === 'How It Works' && <Layers className="w-5 h-5" />}
                          {link.name === 'Features' && <Settings className="w-5 h-5" />}
                          <span className="font-medium">{link.name}</span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                        </Link>
                      </motion.div>
                    )
                  ))}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="pt-6 border-t border-white/10 mt-auto shrink-0">
                {currentUser ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium min-h-[48px]"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link 
                      to="/auth" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-gray-300 font-medium border border-white/10 rounded-xl hover:bg-white/5 transition-colors min-h-[48px] flex items-center justify-center"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/auth" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-white font-bold bg-primary rounded-xl shadow-lg hover:bg-primary/90 transition-colors min-h-[48px] flex items-center justify-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
