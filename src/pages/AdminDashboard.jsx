import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';
import Overview from '../components/admin/Overview';
import UsersManagement from '../components/admin/UsersManagement';
import TeamsManagement from '../components/admin/TeamsManagement';
import NotificationsPanel from '../components/admin/NotificationsPanel';
import Analytics from '../components/admin/Analytics';
import CoursesManagement from '../components/admin/CoursesManagement';
import DoctorsManagement from '../components/admin/DoctorsManagement';
import AuditLogs from '../components/admin/AuditLogs';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-white flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 lg:ml-64">
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6 pt-24 lg:pt-6">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/teams" element={<TeamsManagement />} />
            <Route path="/doctors" element={<DoctorsManagement />} />
            <Route path="/courses" element={<CoursesManagement />} />
            <Route path="/notifications" element={<NotificationsPanel />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/settings" element={
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <p className="text-gray-400">Settings panel coming soon...</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
