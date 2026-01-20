import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCheck, Inbox, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotificationCard from '../components/notifications/NotificationCard';
import NotificationFilters from '../components/notifications/NotificationFilters';
import NotificationPreferences from '../components/notifications/NotificationPreferences';

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'team_request',
    title: 'Team Join Request Accepted',
    body: 'Your request to join Team Alpha has been accepted by John Doe.',
    timestamp: '2 minutes ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'admin_message',
    title: 'Important: System Maintenance',
    body: 'The platform will undergo scheduled maintenance on Sunday, 2 AM - 4 AM.',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: 3,
    type: 'new_team',
    title: 'New Team Created in CS101',
    body: 'Team Gamma is now available for CS101. Check it out!',
    timestamp: '3 hours ago',
    isRead: true,
  },
  {
    id: 4,
    type: 'rating',
    title: 'Rate Your Teammates',
    body: 'Please rate your experience working with Team Alpha members.',
    timestamp: '1 day ago',
    isRead: true,
  },
  {
    id: 5,
    type: 'team_request',
    title: 'New Team Join Request',
    body: 'Alice Brown wants to join your team.',
    timestamp: '2 days ago',
    isRead: false,
    actions: [
      { type: 'accept', label: 'Accept' },
      { type: 'reject', label: 'Reject' },
    ],
  },
];

import { notificationsApi, teamsApi } from '../services/api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsApi.getNotifications();
      const parsedNotifications = (response.data || []).map(n => {
        let metadata = n.metadata;
        if (typeof metadata === 'string') {
          try {
            metadata = JSON.parse(metadata);
          } catch (e) {
            console.error('Failed to parse notification metadata:', e);
          }
        }
        // Map 'read' from DB to 'isRead' for component usage
        return { ...n, metadata, isRead: n.read };
      });
      setNotifications(parsedNotifications);
      setFilteredNotifications(parsedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // Poll every 10s while on this page
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  // Apply filters locally (or could be backend filters)
  useEffect(() => {
    let result = notifications;
    if (activeFilter === 'unread') {
      result = result.filter(n => !n.isRead);
    } else if (activeFilter !== 'all') {
      result = result.filter(n => n.type === activeFilter);
    }
    setFilteredNotifications(result);
  }, [activeFilter, notifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) return;
    try {
      await notificationsApi.deleteAll();
      setNotifications([]);
      setFilteredNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const handleAction = async (id, actionType) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    if (notification.type === 'team_request') {
      const { teamId, requesterId } = notification.metadata || {};
      if (!teamId || !requesterId) {
        alert('Could not process request: Join data missing from notification');
        console.error('Missing join data for notification:', notification);
        return;
      }

      setLoading(true);
      try {
        const status = actionType === 'accept' ? 'accepted' : 'rejected';
        await teamsApi.updateMemberStatus(teamId, requesterId, status);
        alert(`Request ${status} successfully!`);
        // Remove notification after action
        setNotifications(prev => prev.filter(n => n.id !== id));
      } catch (error) {
        console.error('Error updating member status:', error);
        alert(error.response?.data?.message || 'Failed to update member status');
      } finally {
        setLoading(false);
      }
    } else {
      console.log(`Action ${actionType} on notification ${id}`);
      // Fallback for other notification types
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
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
            <span className="text-primary font-medium">Notifications</span>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Notifications</h1>
                <p className="text-gray-400 text-lg">
                  Stay updated with your teams, admin messages, and important alerts.
                </p>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <CheckCheck className="w-5 h-5" />
                    Mark all as read
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete all
                  </button>
                </div>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-primary">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filters */}
              <NotificationFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              {/* Notifications List */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-lg" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 w-3/4 bg-white/10 rounded" />
                          <div className="h-3 w-1/2 bg-white/10 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onAction={handleAction}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white/5 border border-white/10 rounded-xl"
                >
                  <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No Notifications</h3>
                  <p className="text-gray-400">
                    {activeFilter === 'all'
                      ? "You're all caught up!"
                      : `No ${activeFilter.replace('_', ' ')} notifications`}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <NotificationPreferences />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotificationsPage;
