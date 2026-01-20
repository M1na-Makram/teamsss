import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, UsersRound, Activity, Loader2, BarChart, PieChart } from 'lucide-react';
import { adminApi } from '../../services/api';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await adminApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  const metricStats = [
    { label: 'Platform Population', value: stats.users, icon: Users, trend: '+12%', color: 'text-blue-400' },
    { label: 'Active Formations', value: stats.teams, icon: UsersRound, trend: '+5%', color: 'text-purple-400' },
    { label: 'Approval Backlog', value: stats.pendingUsers, icon: Activity, trend: '-2%', color: 'text-amber-400' },
    { label: 'Conversion Rate', value: '92%', icon: TrendingUp, trend: '+1%', color: 'text-green-400' },
  ];

  // Group distribution by course
  const distMap = stats.distribution.reduce((acc, curr) => {
    acc[curr.course_code] = (acc[curr.course_code] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Strategic Insights</h2>
        <p className="text-gray-400 text-sm">Quantifiable metrics for platform growth and engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricStats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="relative z-10">
                <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{stat.trend}</span>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" /> Course Enrollment Density
            </h3>
            <div className="space-y-6">
                {Object.entries(distMap).length > 0 ? Object.entries(distMap).slice(0, 5).map(([code, count], idx) => (
                    <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300 font-bold">{code}</span>
                            <span className="text-xs text-gray-500 font-bold">{count} Teams</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / stats.teams) * 100}%` }}
                                className="h-full bg-gradient-to-r from-primary to-accent"
                            />
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500 italic text-sm text-center py-10">Waiting for team data to visualize density.</p>
                )}
            </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <PieChart className="w-12 h-12 text-gray-600 mb-4 opacity-20" />
            <h3 className="text-lg font-bold mb-2">Audience Segmentation</h3>
            <p className="text-sm text-gray-500 max-w-xs mb-6">Advanced demographic breakdown is currently being processed by the analytics engine.</p>
            <div className="flex gap-2">
                <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Graduates</div>
                <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Undergrads</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
