import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Mail, MoreVertical, Loader2, User, CheckCircle, XCircle, Clock, Filter, ShieldAlert } from 'lucide-react';
import { adminApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers({ search: searchTerm, status: statusFilter });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleApprove = async (userId, newStatus) => {
    setActionLoading(userId);
    try {
        const { error } = await adminApi.approveUser(userId, newStatus);
        if (error) {
            alert(`Failed to update status: ${error.message || 'Unknown error'}`);
            return;
        }
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, approval_status: newStatus, approved: newStatus === 'approved' } : u));
    } catch (error) {
        console.error('Approval error:', error);
        alert('An unexpected error occurred during approval.');
    } finally {
        setActionLoading(null);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    setActionLoading(userId);
    try {
        const { error } = await adminApi.updateUserRole(userId, newRole);
        if (error) {
            alert(`Failed to update role: ${error.message}`);
            return;
        }
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
        console.error('Role update error:', error);
    } finally {
        setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you absolutely sure? This will permanently delete the student profile.')) return;
    setActionLoading(userId);
    try {
        await adminApi.deleteUser(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
        console.error('Delete error:', error);
    } finally {
        setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold">Users Management</h2>
            <p className="text-gray-400 text-sm">Review, approve and manage student identities.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[140px]"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, email or student ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-gray-400">Loading directory...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Approval Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Faculty / Group</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Join Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length > 0 ? users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-sm overflow-hidden border border-white/5">
                          {user.photo_url ? (
                            <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{user.name || 'Anonymous Student'}</span>
                                {user.role === 'admin' && <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-bold uppercase">Admin</span>}
                                {user.role === 'doctor' && <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[9px] font-bold uppercase">Doctor</span>}
                            </div>
                            <span className="block text-xs text-gray-500">ID: {user.student_id || 'N/A'}</span>
                            <span className="block text-xs text-gray-600 truncate max-w-[150px]">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        {getStatusBadge(user.approval_status)}
                    </td>
                    <td className="px-6 py-4">
                        <span className="block text-sm text-gray-300">{user.faculty || 'Unassigned'}</span>
                        <span className="block text-xs text-gray-500">Group {user.student_group || '-'}, Section {user.section || '-'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                            {user.approval_status === 'pending' || user.approval_status === 'rejected' ? (
                                <button 
                                    onClick={() => handleApprove(user.id, 'approved')}
                                    disabled={actionLoading === user.id}
                                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all border border-green-500/20"
                                    title="Approve User"
                                >
                                    {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                            ) : null}
                            
                            {user.approval_status === 'pending' || user.approval_status === 'approved' ? (
                                <button 
                                    onClick={() => handleApprove(user.id, 'rejected')}
                                    disabled={actionLoading === user.id}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20"
                                    title="Reject User"
                                >
                                    {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                </button>
                            ) : null}

                            {user.role !== 'doctor' && user.role !== 'admin' && (
                                <button 
                                    onClick={() => handleRoleUpdate(user.id, 'doctor')}
                                    disabled={actionLoading === user.id}
                                    className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all border border-indigo-500/20"
                                    title="Promote to Doctor"
                                >
                                    {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                                </button>
                            )}

                            <div className="h-4 w-[1px] bg-white/10 mx-1" />
                            
                            <button 
                                onClick={() => navigate('/admin/notifications')}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                title="Message User"
                            >
                                <Mail className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={actionLoading === user.id}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                                title="Delete User"
                            >
                                {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                            <User className="w-12 h-12 opacity-20" />
                            <p className="italic text-sm">No students found matching your criteria.</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
