import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import ProfileCompletionPage from './pages/ProfileCompletionPage';
import TeamsPage from './pages/TeamsPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import NotificationsPage from './pages/NotificationsPage';
import DoctorDashboard from './pages/DoctorDashboard';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Route protection components
const ProtectedRoute = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-gray-400 font-medium">Authenticating...</p>
      </div>
  );

  if (!currentUser) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Profile Completion Gate
  // Only redirect if they haven't completed profile AND aren't already on the setup page
  if (userData && !userData.profile_completed && location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { userData, loading } = useAuth();
  
  if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
  );

  if (userData?.role !== 'admin') {
      console.warn('Access denied: User is not an admin', userData?.role);
      return <Navigate to="/" replace />;
  }

  return children;
};

const DoctorRoute = ({ children }) => {
  const { userData, loading } = useAuth();
  
  if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
  );

  if (userData?.role !== 'doctor' && userData?.role !== 'admin') {
      console.warn('Access denied: User is not a doctor', userData?.role);
      return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary selection:text-white font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected Routes */}
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileCompletionPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Doctor Routes */}
            <Route path="/doctor/*" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
