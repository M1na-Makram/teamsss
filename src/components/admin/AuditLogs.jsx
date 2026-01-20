import React, { useState, useEffect } from 'react';
import { Shield, Search, Download, Calendar, Loader2, AlertTriangle, FileText, User } from 'lucide-react';
import { adminApi } from '../../services/api';
import { motion } from 'framer-motion';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await adminApi.getAuditLogs();
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action) => {
    if (action.includes('DELETE') || action.includes('REJECTED')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (action.includes('UPDATE') || action.includes('APPROVAL')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Audit & Compliance</h2>
          <p className="text-gray-400 text-sm">Permanent record of administrative interventions.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            <Download className="w-4 h-4" /> Export CSV Ledger
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action or admin..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 italic">Accessing encrypted ledger...</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        <tr>
                            <th className="px-8 py-5">Event Identification</th>
                            <th className="px-8 py-5">Administrator</th>
                            <th className="px-8 py-5">Action Type</th>
                            <th className="px-8 py-5">Temporal Data</th>
                            <th className="px-8 py-5 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                                            <Shield className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-500 uppercase">{log.id.slice(0, 13)}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {log.profiles?.name?.[0]}
                                        </div>
                                        <span className="text-sm font-medium text-white">{log.profiles?.name || 'System Admin'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase border ${getActionColor(log.action)}`}>
                                        {log.action.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-300 font-medium">{new Date(log.created_at).toLocaleDateString()}</span>
                                        <span className="text-[10px] text-gray-500">{new Date(log.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="text-gray-500 hover:text-primary transition-colors">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
