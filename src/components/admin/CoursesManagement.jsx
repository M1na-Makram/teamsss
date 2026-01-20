import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Trash2, Edit, Loader2, CheckCircle, X, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', faculty: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await adminApi.getCourses();
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        if (editingCourse) {
            await adminApi.updateCourse(editingCourse.id, formData);
        } else {
            await adminApi.addCourse(formData);
        }
        setModalOpen(false);
        setEditingCourse(null);
        setFormData({ code: '', name: '', faculty: '' });
        fetchCourses();
    } catch (error) {
        alert('Operation failed. Ensure codes are unique.');
    } finally {
        setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanent deletion will remove this course from all filters. Proceed?')) return;
    try {
        await adminApi.deleteCourse(id);
        fetchCourses();
    } catch (error) {
        console.error('Deletion error:', error);
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormData({ code: course.code, name: course.name, faculty: course.faculty });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Course Catalog</h2>
          <p className="text-gray-400 text-sm">Define academic subjects for team synchronization.</p>
        </div>
        <button 
            onClick={() => { setEditingCourse(null); setFormData({ code: '', name: '', faculty: '' }); setModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/40"
        >
            <Plus className="w-5 h-5" /> Register Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 italic">Syncing catalog...</p>
            </div>
        ) : courses.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10 border-dashed italic">
                No courses defined in the system registry.
            </div>
        ) : courses.map(c => (
            <div key={c.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openEdit(c)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary w-fit border border-primary/20">
                    <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{c.code}</h4>
                <p className="text-sm font-medium text-gray-300 mb-4">{c.name}</p>
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/5 text-gray-500 uppercase tracking-widest border border-white/5">
                        {c.faculty || 'General'}
                    </span>
                </div>
            </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setModalOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none"
                >
                    <div className="bg-[#0f172a] border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl pointer-events-auto overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            {editingCourse ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                            {editingCourse ? 'Refine Course Definition' : 'Universal Course Registration'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Identification Code</label>
                                <input 
                                    type="text" value={formData.code} 
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    required placeholder="e.g. CS101, LAW-404"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nomenclature / Title</label>
                                <input 
                                    type="text" value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required placeholder="Full descriptive name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Faculty Affiliation</label>
                                <select 
                                    value={formData.faculty} 
                                    onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none shadow-xl"
                                >
                                    <option value="">Select Faculty</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Medicine">Medicine</option>
                                    <option value="Literature">Literature</option>
                                    <option value="Business">Business</option>
                                    <option value="Law">Law</option>
                                </select>
                            </div>

                            <button 
                                type="submit" disabled={actionLoading}
                                className="w-full mt-4 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/40 disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Confirm Allocation</>}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesManagement;
