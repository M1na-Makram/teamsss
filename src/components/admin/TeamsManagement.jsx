import React, { useState, useEffect } from 'react';
import { Search, Loader2, Users, Crown, Calendar, BookOpen, ExternalLink, Filter, Download, Info, ChevronDown, ChevronUp, FileText, AlertTriangle, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import { adminApi, coursesApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TeamsManagement = () => {
  const [teams, setTeams] = useState([]);
  const [pausedTeams, setPausedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'spam'
  const [filters, setFilters] = useState({
    course: '',
    status: 'all'
  });
  const exportTeamsPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241); // Primary
    doc.text('Academic Teams Formation Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Course: ${filters.course || 'All Registered Courses'}`, 14, 30);
    
    const tableRows = [];
    teams.forEach(team => {
        const leader = team.profiles?.name || 'Unknown';
        const members = team.members?.map(m => m.profiles?.name).join(', ') || 'Only Leader';
        tableRows.push([
            team.name,
            team.course_code,
            leader,
            members,
            `${team.members?.length}/${team.max_members}`
        ]);
    });

    const autoTable = (await import('jspdf-autotable')).default;
    
    autoTable(doc, {
        head: [['Team Name', 'Course Code', 'Leader', 'Members Roster', 'Status']],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    doc.save(`Academic_Teams_${filters.course || 'All'}.pdf`);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, coursesRes, pausedRes] = await Promise.all([
        adminApi.getAllTeams(filters),
        coursesApi.getAll(),
        adminApi.getPausedTeams()
      ]);
      setTeams(teamsRes.data || []);
      setCourses(coursesRes.data || []);
      setPausedTeams(pausedRes.data || []);
    } catch (error) {
      console.error('Error fetching teams data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleConfirmSpam = async (teamId) => {
    if (!confirm('Are you sure you want to PERMANENTLY DELETE this team as spam?')) return;
    setProcessing(true);
    try {
      const { error } = await adminApi.confirmSpam(teamId);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to confirm spam');
    } finally {
      setProcessing(false);
    }
  };

  const handleClearSpam = async (teamId) => {
    if (!confirm('Are you sure you want to clear reports and reactivate this team?')) return;
    setProcessing(true);
    try {
      const { error } = await adminApi.clearSpam(teamId);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to clear spam');
    } finally {
      setProcessing(false);
    }
  };

  const toggleExpand = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const getStatusBadge = (team) => {
    if (team.status === 'PAUSED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">Paused (Spam)</span>;
    if (team.status === 'DELETED') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 border border-red-500/30 uppercase">Deleted</span>;
    
    const memberCount = team.members?.length || 0;
    const maxMembers = team.max_members || 5;
    
    if (memberCount >= maxMembers) {
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase">Full</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase">Open</span>;
  };

  const displayTeams = activeTab === 'all' ? teams : pausedTeams;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold">Global Teams View</h2>
            <p className="text-gray-400 text-sm">Monitor all project groups across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        activeTab === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    All Teams
                </button>
                <button
                    onClick={() => setActiveTab('spam')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all relative ${
                        activeTab === 'spam' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    Spam Review
                    {pausedTeams.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-[#0a0f1c]">
                            {pausedTeams.length}
                        </span>
                    )}
                </button>
            </div>
            <button 
                onClick={exportTeamsPDF}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg text-sm font-bold uppercase tracking-widest transition-all"
            >
                <FileText className="w-4 h-4" />
                Export Course PDF
            </button>
        </div>
      </div>

      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search team name or ID..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>
            <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                    value={filters.course}
                    onChange={(e) => setFilters({...filters, course: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                    <option value="">All Courses</option>
                    {courses.map(c => <option key={c.id} value={c.code}>{c.code} - {c.name}</option>)}
                </select>
            </div>
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                    <option value="all">Any Status</option>
                    <option value="ACTIVE">Active Teams</option>
                    <option value="PAUSED">Paused Teams</option>
                    <option value="DELETED">Deleted Teams</option>
                </select>
            </div>
        </div>
      )}

      {activeTab === 'spam' && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-200">
                Teams listed here have received <strong>10 or more reports</strong> and have been automatically paused. 
                Confirming spam will delete the team, while clearing reports will reactivate it.
            </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-gray-400">Loading collective team data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] font-bold text-gray-400">
                <tr>
                  <th className="px-6 py-4">Team & Meta</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Leader</th>
                  {activeTab === 'spam' && <th className="px-6 py-4">Reports</th>}
                  {activeTab === 'all' && <th className="px-6 py-4">Members</th>}
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayTeams.length > 0 ? displayTeams.map((team) => (
                  <React.Fragment key={team.id}>
                    <tr className={`hover:bg-white/5 transition-colors group cursor-pointer ${expandedTeam === team.id ? 'bg-white/5' : ''}`} onClick={() => toggleExpand(team.id)}>
                      <td className="px-6 py-4">
                        <div>
                            <span className="block text-sm font-bold text-white group-hover:text-primary transition-colors">{team.name}</span>
                            <span className="block text-xs text-gray-500 font-mono">{team.id.substring(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 font-medium">{team.course_code}</span>
                          <span className="block text-[10px] text-gray-500 italic">{team.faculty}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Crown className="w-3 h-3 text-yellow-500" />
                            <span className="text-sm text-gray-300">{team.profiles?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      {activeTab === 'spam' && (
                        <td className="px-6 py-4">
                             <div className="flex items-center gap-2 text-red-400 font-bold">
                                <AlertTriangle className="w-4 h-4" />
                                {team.spam_count || team.reports?.count || 0} Reports
                            </div>
                        </td>
                      )}
                      {activeTab === 'all' && (
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold text-white">{team.members?.length || 0}</span>
                                <span className="text-xs text-gray-500">/ {team.max_members}</span>
                            </div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                          {getStatusBadge(team)}
                      </td>
                      <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {activeTab === 'spam' ? (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleClearSpam(team.id); }}
                                        disabled={processing}
                                        className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                                        title="Clear Spam & Reactivate"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleConfirmSpam(team.id); }}
                                        disabled={processing}
                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                        title="Confirm Spam & Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    {expandedTeam === team.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                            )}
                          </div>
                      </td>
                    </tr>
                    
                    <AnimatePresence>
                        {expandedTeam === team.id && (
                            <tr>
                                <td colSpan="6" className="px-0 py-0">
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-[#0a0f1c]/50 border-b border-primary/20"
                                    >
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Roster */}
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Users className="w-3 h-3" /> Team Roster
                                                </h4>
                                                <div className="space-y-3">
                                                    {team.members?.map((m, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                                                    {m.profiles?.name?.[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">{m.profiles?.name}</p>
                                                                    <p className="text-[10px] text-gray-500 font-mono">{m.profiles?.id}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                                    m.role === 'owner' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-primary/10 text-primary border border-primary/20'
                                                                }`}>
                                                                    {m.role === 'owner' ? 'Leader' : 'Member'}
                                                                </span>
                                                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{m.status}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Extra Info */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Info className="w-3 h-3" /> Description & Details
                                                    </h4>
                                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                                        <p className="text-sm text-gray-300 leading-relaxed italic">
                                                            "{team.description || 'No description provided for this group.'}"
                                                        </p>
                                                        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Created At</p>
                                                                <p className="text-xs text-white">{new Date(team.created_at).toLocaleString()}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Term & Faculty</p>
                                                                <p className="text-xs text-white uppercase">{team.term} • {team.faculty}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button className="flex-1 px-4 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                                                        View Full Log
                                                    </button>
                                                    <button className="flex-1 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                                                        Terminate Team
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </td>
                            </tr>
                        )}
                    </AnimatePresence>
                  </React.Fragment>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic text-sm">
                      No team formations found matching these criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsManagement;
