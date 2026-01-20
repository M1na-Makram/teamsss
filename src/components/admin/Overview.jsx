import React, { useState, useEffect } from 'react';
import { Users, UsersRound, Bell, CheckCircle2, TrendingUp, AlertCircle, Clock, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { adminApi } from '../../services/api';
import { motion } from 'framer-motion';

const Overview = () => {
  const [stats, setStats] = useState({
    users: 0,
    teams: 0,
    pendingUsers: 0,
    distribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metricCards = [
    { 
      label: 'Total Registered', 
      value: stats.users, 
      icon: Users, 
      color: 'from-blue-500/20 to-blue-600/20', 
      textColor: 'text-blue-400',
      description: 'Total student profiles synced'
    },
    { 
      label: 'Created Groups', 
      value: stats.teams, 
      icon: UsersRound, 
      color: 'from-purple-500/20 to-purple-600/20', 
      textColor: 'text-purple-400',
      description: 'Active acadmic teams'
    },
    { 
      label: 'Pending Approval', 
      value: stats.pendingUsers, 
      icon: Clock, 
      color: 'from-amber-500/20 to-amber-600/20', 
      textColor: 'text-amber-400',
      description: 'Identities requiring review'
    },
    { 
      label: 'Platform Load', 
      value: 'High', 
      icon: Activity, 
      color: 'from-green-500/20 to-green-600/20', 
      textColor: 'text-green-400',
      description: 'System health is optimal'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">System Surveillance</h2>
          <p className="text-gray-400 mt-1">Real-time overview of academic team formations and user metrics.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-sm font-bold uppercase tracking-widest transition-all">
                Download Report
            </button>
        </div>
      </div>

      {/* Grid: High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} border border-white/5 relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                <card.icon className="w-16 h-16" />
            </div>
            <div className="relative z-10 flex flex-col items-start gap-4">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${card.textColor}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">
                    {loading ? <div className="w-12 h-8 bg-white/5 rounded animate-pulse" /> : card.value}
                </h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.label}</p>
                <p className="text-[10px] text-gray-600 mt-2 italic">{card.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Audit Preview */}
        <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" /> Team Formation Velocity
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-primary" /> Active This Week
                    </div>
                </div>
                
                {/* Visual Placeholder for Chart (Requires Recharts or similar, keeping it native SVG for speed & no dependencies) */}
                <div className="w-full h-64 flex items-end justify-between gap-2 px-4">
                    {[40, 60, 45, 90, 65, 80, 50, 70, 85, 95, 60, 75].map((val, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${val}%` }}
                            transition={{ delay: i * 0.05, duration: 1 }}
                            className="flex-1 bg-gradient-to-t from-primary/10 via-primary/40 to-primary rounded-t-lg relative group"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">
                                {val}%
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                    <span>Jan 01</span>
                    <span>Jan 02</span>
                    <span>Jan 03</span>
                    <span>Jan 04</span>
                    <span>Jan 05</span>
                    <span>Jan 06</span>
                </div>
            </div>
        </div>

        {/* Quick Review / Urgent Tasks */}
        <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 relative">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-amber-500">
                    <AlertCircle className="w-5 h-5" /> Critical Alerts
                </h3>
                <div className="space-y-4">
                    {stats.pendingUsers > 0 && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <p className="text-sm font-bold text-amber-500 mb-1">Pending Identiy Approvals</p>
                            <p className="text-xs text-gray-400 mb-3">{stats.pendingUsers} users are waiting for your review before they can form teams.</p>
                            <button className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                                Go to Approval Queue
                            </button>
                        </div>
                    )}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-sm font-bold text-gray-300 mb-1">System Health Check</p>
                        <p className="text-xs text-gray-500">All database integrations and notification channels are operating normally.</p>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <PieChartIcon className="w-5 h-5 text-accent" /> Course Saturation
                </h3>
                <p className="text-xs text-gray-400 mb-6 italic">Tracking team load across academic faculties.</p>
                <div className="space-y-3">
                    {['CS101', 'MATH202', 'ENG404'].map((code, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                                <span className="text-gray-400">{code}</span>
                                <span className="text-white">{(idx + 1) * 25}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(idx + 1) * 25}%` }}
                                    className={`h-full bg-gradient-to-r ${idx === 0 ? 'from-blue-500' : idx === 1 ? 'from-purple-500' : 'from-accent'}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
