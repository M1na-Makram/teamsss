import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertCircle } from 'lucide-react';
import { coursesApi } from '../../services/api';

const CreateTeamModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    lectureGroup: '',
    section: '',
    maxMembers: 5,
    description: '',
    invitedStudents: ''
  });
  const [error, setError] = useState('');
  const [dbCourses, setDbCourses] = useState([]);

  useEffect(() => {
    if (isOpen) {
        const fetchCourses = async () => {
            try {
                const { data, error } = await coursesApi.getAll();
                if (error) throw error;
                setDbCourses(data || []);
            } catch (err) {
                console.error('Failed to fetch courses:', err);
            }
        };
        fetchCourses();
    }
  }, [isOpen]);

  // Numeric options 1-10
  const GROUPS = Array.from({ length: 10 }, (_, i) => i + 1);
  const SECTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Team name is required');
      return;
    }
    if (!formData.courseCode || !formData.lectureGroup || !formData.section) {
      setError('Please fill all required fields');
      return;
    }
    if (formData.maxMembers < 2 || formData.maxMembers > 10) {
      setError('Max members must be between 2 and 10');
      return;
    }
    onConfirm({
        name: formData.name,
        courseCode: formData.courseCode,
        lectureGroup: parseInt(formData.lectureGroup),
        section: parseInt(formData.section),
        maxMembers: formData.maxMembers,
        description: formData.description,
        invitedStudents: formData.invitedStudents ? formData.invitedStudents.split(',').map(s => s.trim()).filter(Boolean) : []
    });
  };

  const handleClose = () => {
    setFormData({ 
      name: '', 
      courseCode: '', 
      lectureGroup: '', 
      section: '', 
      maxMembers: 5, 
      description: '', 
      invitedStudents: '' 
    });
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Create New Team</h3>
                <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex gap-3 text-red-300 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Team Alpha"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0f172a]">Select course</option>
                    {dbCourses.map(course => (
                      <option key={course.code} value={course.code} className="bg-[#0f172a]">{course.code} - {course.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                       Group (Lecture) <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="lectureGroup"
                      value={formData.lectureGroup}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0f172a]">Select Group</option>
                      {GROUPS.map(num => (
                        <option key={num} value={num} className="bg-[#0f172a]">{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                       Section <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0f172a]">Select Section</option>
                      {SECTIONS.map(num => (
                        <option key={num} value={num} className="bg-[#0f172a]">{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Members <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxMembers"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    min="2"
                    max="10"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Invite Members (Optional)
                   </label>
                   <input
                     type="text"
                     name="invitedStudents"
                     value={formData.invitedStudents}
                     onChange={handleChange}
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                     placeholder="Enter Student IDs separated by commas" 
                   />
                   <p className="text-xs text-gray-500 mt-1">Example: 2023001, 2023055</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Brief description of your team..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-primary/50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Team
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTeamModal;
