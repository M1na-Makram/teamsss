import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, GraduationCap, Plus, Trash2, Search, Loader2, BookOpen, UserCheck, Shield, Mail, AlertCircle } from 'lucide-react';
import { adminApi, profileApi } from '../../services/api';

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docsRes, coursesRes] = await Promise.all([
        adminApi.getDoctors(),
        adminApi.getCourses()
      ]);
      
      if (docsRes.error) throw docsRes.error;
      if (coursesRes.error) throw coursesRes.error;

      setDoctors(docsRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (err) {
      console.error('Error fetching doctors data:', err);
      setError('Failed to load doctors and courses. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCourse = async (doctorId, courseId) => {
    setProcessing(true);
    try {
      const { error } = await adminApi.assignDoctorToCourse(doctorId, courseId);
      if (error) throw error;
      await fetchData();
      setShowAssignModal(false);
    } catch (err) {
      alert(err.message || 'Failed to assign course');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveCourse = async (doctorId, courseId) => {
    if (!confirm('Are you sure you want to remove this course assignment?')) return;
    setProcessing(true);
    try {
      const { error } = await adminApi.removeDoctorFromCourse(doctorId, courseId);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to remove assignment');
    } finally {
      setProcessing(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name?.toLowerCase().includes(search.toLowerCase()) || 
    doc.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Doctors Management
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage doctor accounts and course assignments</p>
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-gray-400">Loading doctor records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      {doc.photo_url ? (
                        <img src={doc.photo_url} alt={doc.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <UserCheck className="w-7 h-7 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{doc.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4" />
                        {doc.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                        setSelectedDoctor(doc);
                        setShowAssignModal(true);
                    }}
                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                    title="Assign to Course"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    Assigned Courses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {doc.assignments?.length > 0 ? (
                      doc.assignments.map((asgn) => (
                        <div
                          key={asgn.course?.id}
                          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm group/tag"
                        >
                          <span className="text-gray-300">
                            {asgn.course?.code}: {asgn.course?.name}
                          </span>
                          <button
                            onClick={() => handleRemoveCourse(doc.id, asgn.course?.id)}
                            className="p-1 hover:text-red-400 transition-colors opacity-0 group-hover/tag:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No courses assigned yet</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold">No Doctors Found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-2">Assign Course</h3>
              <p className="text-gray-400 text-sm mb-6">
                Assign a new course to <span className="text-white font-medium">{selectedDoctor?.name}</span>
              </p>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {courses
                  .filter(c => !selectedDoctor?.assignments?.some(a => a.course?.id === c.id))
                  .map(course => (
                    <button
                      key={course.id}
                      disabled={processing}
                      onClick={() => handleAssignCourse(selectedDoctor.id, course.id)}
                      className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                    >
                      <div>
                        <div className="font-bold text-sm">{course.code}</div>
                        <div className="text-xs text-gray-400">{course.name}</div>
                      </div>
                      {processing ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                {courses.filter(c => !selectedDoctor?.assignments?.some(a => a.course?.id === c.id)).length === 0 && (
                   <p className="text-center py-4 text-gray-500 text-sm italic">All available courses already assigned</p>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorsManagement;
