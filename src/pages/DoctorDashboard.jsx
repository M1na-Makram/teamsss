import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { doctorApi } from '../services/api';
import { 
    Users, Calendar, FileText, Clock, Search, Filter, 
    ChevronRight, ChevronDown, CheckCircle2, AlertCircle, 
    Download, Loader2, BookOpen, Layers, UserCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../components/Navbar';

const DoctorDashboard = () => {
    const { userData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('relevant'); // 'relevant' (direct) or 'courses' (all in my courses)
    const [teams, setTeams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Time Slot Modal
    const [showScheduler, setShowScheduler] = useState(false);
    const [scheduleConfig, setScheduleConfig] = useState({
        startTime: '',
        durationPerTeam: 20,
        selectedTeamIds: []
    });

    const [selectedCourse, setSelectedCourse] = useState(null);
    
    useEffect(() => {
        fetchData();
    }, [viewMode]);

    // When viewMode changes, reset selectedCourse
    useEffect(() => {
        setSelectedCourse(null);
    }, [viewMode]);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('Fetching doctor data for mode:', viewMode);
            let response;
            if (viewMode === 'relevant') {
                response = await doctorApi.getMyAssignedTeams();
            } else {
                response = await doctorApi.getTeamsByCourses();
            }
            
            console.log('Doctor Data Response:', response);
            if (response.error) {
                console.error('Supabase Error:', response.error);
                alert(`Error loading data: ${response.error.message}`);
            }
            
            setTeams(response.data || []);
            
            // Extract unique courses for filtering/tabs
            const uniqueCourses = [...new Set((response.data || []).map(t => t.course_code))];
            setCourses(uniqueCourses);
        } catch (error) {
            console.error('Unexpected error fetching doctor data:', error);
            alert('An unexpected error occurred while fetching your teams.');
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (scheduleConfig.selectedTeamIds.length === 0) {
                alert('Please select at least one team.');
                return;
            }
            await doctorApi.assignTimeSlots(
                scheduleConfig.selectedTeamIds,
                scheduleConfig.startTime,
                parseInt(scheduleConfig.durationPerTeam)
            );
            setShowScheduler(false);
            fetchData();
            alert('Time slots assigned and notifications sent to all members!');
        } catch (error) {
            console.error('Scheduling error:', error);
            alert('Failed to assign time slots.');
        }
    };

    const exportAllSlotsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42);
        doc.text('MASTER PRESENTATION SCHEDULE', 14, 25);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);

        const tableData = teams
            .filter(t => t.time_slot_start)
            .sort((a, b) => new Date(a.time_slot_start) - new Date(b.time_slot_start))
            .map(t => [
                t.name,
                t.course_code,
                t.profiles?.name || 'Unknown',
                new Date(t.time_slot_start).toLocaleString()
            ]);

        autoTable(doc, {
            startY: 45,
            head: [['TEAM NAME', 'COURSE', 'LEADER', 'PRESENTATION SLOT']],
            body: tableData.length > 0 ? tableData : [['No teams scheduled yet', '', '', '']],
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] }
        });

        doc.save(`Master_Schedule_${new Date().toLocaleDateString()}.pdf`);
    };

    const exportCourseSlotsPDF = (courseCode) => {
        const doc = new jsPDF();
        const courseTeams = teams.filter(t => t.course_code === courseCode);
        
        doc.setFontSize(22);
        doc.text(`${courseCode} SCHEDULE`, 14, 25);
        
        const tableData = courseTeams.map(t => [
            t.name,
            t.time_slot_start ? new Date(t.time_slot_start).toLocaleString() : 'NOT SCHEDULED'
        ]);

        autoTable(doc, {
            startY: 40,
            head: [['TEAM NAME', 'TIME SLOT']],
            body: tableData,
            theme: 'striped'
        });

        doc.save(`${courseCode}_Slots.pdf`);
    };

    const generatePDF = (team) => {
        const doc = new jsPDF();
        
        // Premium Header
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('TEAMSYNC REPORT', 14, 25);
        
        doc.setFontSize(10);
        doc.text(`DATE: ${new Date().toLocaleDateString()}`, 160, 25);
        
        // Team Info Section
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(16);
        doc.text(`Team Identity: ${team.name}`, 14, 55);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Academic Course: ${team.course_code}`, 14, 63);
        doc.text(`Assigned Academician: ${userData?.name || 'Authorized Doctor'}`, 14, 70);
        
        if (team.time_slot_start) {
             const start = new Date(team.time_slot_start).toLocaleString();
             doc.text(`Presentation Schedule: ${start}`, 14, 77);
        }

        // Table Data Construction
        const tableData = team.members.map(m => [
            m.profiles?.name || 'N/A',
            m.profiles?.student_id || 'N/A',
            m.profiles?.email || 'N/A',
            m.profiles?.whatsapp_number || 'N/A',
            m.role === 'owner' ? 'LEADER' : 'MEMBER'
        ]);

        autoTable(doc, {
            startY: 85,
            head: [['FULL NAME', 'UNIVERSITY ID', 'EMAIL ADDRESS', 'WHATSAPP', 'ROLE']],
            body: tableData,
            theme: 'striped',
            headStyles: { 
                fillColor: [66, 133, 244],
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: { fontSize: 9, cellPadding: 4 },
            alternateRowStyles: { fillColor: [245, 247, 250] }
        });

        // Footer
        const finalY = (doc.lastAutoTable?.finalY || 200) + 20;
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('This document is an official academic formation report generated by TeamSync.', 14, finalY);

        doc.save(`${team.name.replace(/\s+/g, '_')}_Manifest.pdf`);
    };

    // Filter teams based on search
    const filteredTeams = teams.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.course_code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group teams by course
    const groupedTeams = filteredTeams.reduce((acc, team) => {
        if (!acc[team.course_code]) acc[team.course_code] = [];
        acc[team.course_code].push(team);
        return acc;
    }, {});

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 pt-28 md:pt-32 relative z-0 overflow-x-hidden">
                {/* Background Decor */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen" />
                </div>

                <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                    {/* Hero Section */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary/30 transition-colors cursor-default">
                                    Academic Staff Portal
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
                                Doctor Manifest
                                <UserCheck className="w-8 h-8 text-primary opacity-50" />
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl">Official oversight dashboard for assigned course teams, grading, and scheduling.</p>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
                            <button 
                                onClick={exportAllSlotsPDF}
                                className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl font-bold transition-all border border-indigo-500/20 shadow-lg shadow-indigo-500/5 backdrop-blur-sm"
                                title="Download All Slots"
                            >
                                <Download className="w-5 h-5" />
                                <span className="sm:hidden lg:inline">Master Schedule</span>
                                <span className="hidden sm:inline lg:hidden">Master</span>
                            </button>
                            <button 
                                onClick={fetchData}
                                className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/10"
                                title="Refresh Data"
                            >
                                <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex flex-1 sm:flex-none">
                                <button
                                    onClick={() => setViewMode('relevant')}
                                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                                        viewMode === 'relevant' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    Assigned
                                </button>
                                <button
                                    onClick={() => setViewMode('courses')}
                                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                                        viewMode === 'courses' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    Catalog
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => setShowScheduler(true)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-accent/40"
                            >
                                <Calendar className="w-5 h-5" />
                                Batch Schedule
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats & Search */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Search by team name or course code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>
                        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-white/5 rounded-2xl p-6 flex items-center justify-between backdrop-blur-md">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Active Teams</p>
                                <p className="text-3xl font-black text-white">{filteredTeams.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <Layers className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Drill-down View: Course Collection or Specific Teams */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            <p className="text-gray-500 italic font-medium">Synchronizing academic data...</p>
                        </div>
                    ) : selectedCourse ? (
                        /* Team Details View for Selected Course */
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedCourse(null)}
                                    className="flex items-center gap-2 text-primary hover:text-white transition-colors font-bold"
                                >
                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                    Back to Courses
                                </button>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-black uppercase tracking-tight">{selectedCourse}</h2>
                                    <button 
                                        onClick={() => exportCourseSlotsPDF(selectedCourse)}
                                        className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all shadow-md"
                                        title="Download Course Slots"
                                    >
                                        <FileText className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {groupedTeams[selectedCourse]?.map(team => (
                                    <motion.div 
                                        key={team.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.05] transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{team.name}</h3>
                                                <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {team.members?.length} Members</span>
                                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                                                    <span className="flex items-center gap-1.5 uppercase font-mono">{team.id.substring(0,8)}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => generatePDF(team)}
                                                className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-2xl transition-all border border-primary/20 flex items-center gap-2 font-bold text-xs shadow-lg shadow-primary/10"
                                                title="Export Manifest"
                                            >
                                                <Download className="w-4 h-4" />
                                                Report
                                            </button>
                                        </div>

                                        <div className={`p-4 rounded-2xl flex items-center gap-4 mb-6 transition-all ${
                                            team.time_slot_start 
                                                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                                                : 'bg-white/5 border border-white/10 text-gray-500'
                                        }`}>
                                            <Clock className="w-5 h-5" />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Presentation Schedule</p>
                                                <p className="text-sm font-bold">
                                                    {team.time_slot_start 
                                                        ? new Date(team.time_slot_start).toLocaleString() 
                                                        : 'UNSCHEDULED'}
                                                </p>
                                            </div>
                                            {team.time_slot_start && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                        </div>

                                        <div className="space-y-2">
                                            {team.members?.map(m => (
                                                <div key={m.user_id} className="flex items-center justify-between p-2.5 bg-black/20 rounded-xl border border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                                            m.role === 'owner' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'
                                                        }`}>
                                                            {m.profiles?.name?.[0]}
                                                        </div>
                                                        <span className="text-xs font-semibold">{m.profiles?.name}</span>
                                                    </div>
                                                    <span className="text-[9px] text-gray-500 font-mono italic">{m.role === 'owner' ? 'Leader' : 'Member'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Course Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(groupedTeams).map(([course, courseTeams]) => (
                                <motion.div 
                                    key={course}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 cursor-pointer hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight mb-2 tracking-wide">{course}</h3>
                                    <p className="text-gray-400 text-sm mb-6 font-medium">Academic Course Management</p>
                                    
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Groups</span>
                                            <span className="text-xl font-black text-white">{courseTeams.length}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                                            <ChevronRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                    
                                    {/* Subtle decorative elements */}
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Users className="w-20 h-20 -rotate-12 translate-x-4 -translate-y-4" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Scheduler Modal */}
                <AnimatePresence>
                    {showScheduler && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl relative overflow-hidden"
                            >
                                {/* Decorative Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />

                                <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                                    <Calendar className="w-8 h-8 text-primary" />
                                    Batch Scheduler
                                </h2>
                                <p className="text-gray-400 mb-8 font-medium">Assign presentation time slots to selected teams sequentially.</p>
                                
                                <form onSubmit={handleScheduleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Session Start</label>
                                            <input 
                                                type="datetime-local" 
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                value={scheduleConfig.startTime}
                                                onChange={e => setScheduleConfig({...scheduleConfig, startTime: e.target.value})}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Minutes Per Group</label>
                                            <input 
                                                type="number" 
                                                required
                                                min="5"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                                value={scheduleConfig.durationPerTeam}
                                                onChange={e => setScheduleConfig({...scheduleConfig, durationPerTeam: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Target Team Selection</p>
                                        <div className="max-h-60 overflow-y-auto bg-black/40 rounded-3xl border border-white/5 p-4 space-y-2 shadow-inner">
                                            {filteredTeams.map(t => (
                                                <label key={t.id} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                                                    scheduleConfig.selectedTeamIds.includes(t.id) 
                                                        ? 'bg-primary/20 border-primary shadow-lg' 
                                                        : 'bg-white/5 border-transparent hover:bg-white/10'
                                                }`}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={scheduleConfig.selectedTeamIds.includes(t.id)}
                                                        onChange={e => {
                                                            const ids = e.target.checked 
                                                                ? [...scheduleConfig.selectedTeamIds, t.id]
                                                                : scheduleConfig.selectedTeamIds.filter(id => id !== t.id);
                                                            setScheduleConfig({...scheduleConfig, selectedTeamIds: ids});
                                                        }}
                                                        className="w-5 h-5 rounded-lg border-white/20 bg-white/10 text-primary focus:ring-primary/50"
                                                    />
                                                    <div className="flex-1">
                                                        <span className="text-sm font-bold block">{t.name}</span>
                                                        <span className="text-[10px] text-gray-500 font-mono uppercase">{t.course_code}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center px-4">
                                            <p className="text-xs text-primary font-bold">
                                                {scheduleConfig.selectedTeamIds.length} Teams Selected
                                            </p>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const allIds = filteredTeams.map(t => t.id);
                                                    setScheduleConfig(prev => ({
                                                        ...prev,
                                                        selectedTeamIds: prev.selectedTeamIds.length === allIds.length ? [] : allIds
                                                    }));
                                                }}
                                                className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                            >
                                                {scheduleConfig.selectedTeamIds.length === filteredTeams.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowScheduler(false)}
                                            className="flex-1 px-8 py-4 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="flex-1 px-8 py-4 rounded-2xl font-black bg-primary hover:bg-primary/90 text-white transition-all shadow-xl shadow-primary/25 active:scale-95"
                                        >
                                            Execute Schedule
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default DoctorDashboard;
