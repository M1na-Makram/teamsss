import React, { useState, useEffect } from 'react';
import { Bell, Send, Mail, Trash2, Plus, Layout, Save, User, Loader2, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { adminApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationsPanel = () => {
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    message: '',
    type: 'broadcast' // 'broadcast' or 'direct'
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('compose'); // 'compose', 'templates'

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await adminApi.getTemplates();
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      if (formData.type === 'broadcast') {
        await adminApi.broadcastNotification({
          title: formData.title,
          body: formData.message,
          type: 'admin_broadcast'
        });
      } else {
        await adminApi.sendDirectNotification(formData.userId, formData.title, formData.message);
      }
      setSuccess(true);
      setFormData({ ...formData, userId: '', title: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAsTemplate = async () => {
    if (!formData.title || !formData.message) return;
    try {
        await adminApi.addTemplate({
            title: formData.title,
            body: formData.message
        });
        fetchTemplates();
        alert('Template saved successfully!');
    } catch (error) {
        console.error('Error saving template:', error);
    }
  };

  const useTemplate = (template) => {
    setFormData({
        ...formData,
        title: template.title,
        message: template.body
    });
    setActiveTab('compose');
  };

  const deleteTemplate = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
        await adminApi.deleteTemplate(id);
        fetchTemplates();
    } catch (error) {
        console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Communication Hub</h2>
          <p className="text-gray-400 text-sm">Targeted and global announcement system.</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button 
                onClick={() => setActiveTab('compose')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'compose' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Plus className="w-4 h-4" /> Compose
            </button>
            <button 
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'templates' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Layout className="w-4 h-4" /> Templates
            </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'compose' ? (
          <motion.div
            key="compose"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Compose Form */}
            <div className="lg:col-span-2 space-y-6">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    
                    <form onSubmit={handleSend} className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, type: 'broadcast'})}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${formData.type === 'broadcast' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Universal Broadcast
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, type: 'direct'})}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${formData.type === 'direct' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Direct Message
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {formData.type === 'direct' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Recipient User ID</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={formData.userId}
                                            onChange={(e) => setFormData({...formData, userId: e.target.value})}
                                            required={formData.type === 'direct'}
                                            placeholder="Paste the unique token from user profile..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Subject Heading</label>
                            <input 
                                type="text" 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                placeholder="e.g., Important: Course Closure Imminent"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Message Payload</label>
                            <textarea 
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                required
                                rows="6"
                                placeholder="Enter the content of your message here..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/40 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Despatch System Alert</>}
                            </button>
                            <button 
                                type="button"
                                onClick={saveAsTemplate}
                                className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all"
                                title="Save as reusable template"
                            >
                                <Save className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3"
                        >
                            <CheckCircle className="w-5 h-5" /> Transmission successful.
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Sidebar Instructions / Quick Tools */}
            <div className="space-y-6">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                        <AlertCircle className="w-4 h-4 text-primary" /> Guidelines
                    </h3>
                    <ul className="space-y-4 text-xs text-gray-500 leading-relaxed">
                        <li>• <span className="text-gray-300">Broadcasts</span> reach all students immediately.</li>
                        <li>• <span className="text-gray-300">Direct Messages</span> target specific UIDs found in the user directory.</li>
                        <li>• For system updates, use the <span className="text-primary font-bold">Templates</span> to maintain consistent tone.</li>
                    </ul>
                </div>
                
                <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 relative overflow-hidden group">
                    <Bell className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                    <h3 className="text-white font-bold mb-2">Omnichannel Send</h3>
                    <p className="text-xs text-gray-300 mb-4 leading-relaxed">System alerts are visual and can be pushed to mobile devices via FCM synchronization.</p>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="templates"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {templates.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                    <p className="italic">No saved templates found. Create one from the compose tab.</p>
                </div>
            ) : templates.map(t => (
                <div key={t.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Layout className="w-5 h-5" />
                        </div>
                        <button 
                            onClick={() => deleteTemplate(t.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <h4 className="text-white font-bold mb-2">{t.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-3 mb-6 italic leading-relaxed">"{t.body}"</p>
                    <button 
                        onClick={() => useTemplate(t)}
                        className="w-full py-2 bg-white/10 hover:bg-primary hover:text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all text-gray-400"
                    >
                        Apply Payload
                    </button>
                </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsPanel;
