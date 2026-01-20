import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Users, Star, AlertCircle, CheckCircle2, X, Shield, Calendar, UserCheck } from 'lucide-react';

const NotificationCard = ({ notification, onMarkAsRead, onAction, formatTime }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'team_request': return Users;
      case 'admin_message': return Bell;
      case 'rating': return Star;
      case 'new_team': return AlertCircle;
      case 'doctor_assignment': return Shield;
      case 'time_slot': return Calendar;
      case 'team_rejection': return X;
      default: return Bell;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'team_request': return 'from-blue-500 to-cyan-500';
      case 'admin_message': return 'from-purple-500 to-pink-500';
      case 'rating': return 'from-yellow-500 to-orange-500';
      case 'new_team': return 'from-green-500 to-emerald-500';
      case 'doctor_assignment': return 'from-indigo-500 to-blue-500';
      case 'time_slot': return 'from-cyan-500 to-blue-500';
      case 'team_rejection': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const Icon = getIcon();
  const color = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 border rounded-xl p-6 hover:border-primary/50 transition-all ${
        notification.isRead ? 'border-white/10' : 'border-primary/30 bg-primary/5'
      }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-semibold text-white">{notification.title}</h3>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
            )}
          </div>
          <p className="text-sm text-gray-400 mb-3">{notification.body}</p>
          <p className="text-xs text-gray-500">
            {formatTime ? formatTime(notification.created_at || notification.timestamp) : (notification.timestamp || notification.created_at)}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4">
            {(notification.actions || (notification.type === 'team_request' && !notification.isRead)) && (
              <>
                <button
                  onClick={() => onAction(notification.id, 'accept')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                >
                  Accept
                </button>
                <button
                  onClick={() => onAction(notification.id, 'reject')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                >
                  Reject
                </button>
              </>
            )}
            {notification.actions && notification.type !== 'team_request' && notification.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onAction(notification.id, action.type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  action.type === 'accept'
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
              >
                {action.label}
              </button>
            ))}
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="ml-auto text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
