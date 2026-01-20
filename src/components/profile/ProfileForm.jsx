import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, BookOpen, GraduationCap, Bell, ChevronRight, Save, CheckCircle2, AlertCircle, Loader2, Hash, Users, MessageCircle, HelpCircle } from 'lucide-react';
import { profileApi, coursesApi } from '../../services/api';
import SearchableSelect from '../common/SearchableSelect';

// Updated faculties - only SIM and Computer Science
const FACULTIES = [
  'Software Industry & Multimedia (SIM)',
  'Computer Science'
];

// Specializations - only for Computer Science
const SPECIALIZATIONS = {
  'Computer Science': [
    'Cyber Security Program',
    'Intelligent Systems',
    'Data Science & Artificial Intelligence'
  ]
};

const ProfileForm = ({ onComplete }) => {
  const { currentUser, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
  const [showTooltip, setShowTooltip] = useState(false);

  const [formData, setFormData] = useState({
    fullName: currentUser?.user_metadata?.full_name || '',
    email: currentUser?.email || '',
    phone: '',
    whatsappNumber: '',
    sameAsPhone: true,
    studentId: '',
    faculty: '',
    specialization: '',
    courses: [],
    notifications: {
      teamRequests: true,
      adminMessages: true,
      newTeams: true,
      teamNeedsMembers: false,
      ratings: true
    },
    photoUrl: currentUser?.user_metadata?.avatar_url || currentUser?.user_metadata?.picture || ''
  });

  const [validationState, setValidationState] = useState({
      studentId: { valid: null, message: '' },
      phone: { valid: null, message: '' }
  });

  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
      const fetchCourses = async () => {
          try {
              const { data } = await coursesApi.getAll(); 
              if (data) setAvailableCourses(data);
          } catch (error) {
              console.error('Failed to fetch courses:', error);
          }
      };
      fetchCourses();
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        fullName: userData.name || prev.fullName,
        phone: userData.phone || prev.phone,
        whatsappNumber: userData.whatsapp_number || userData.phone || prev.whatsappNumber,
        sameAsPhone: userData.whatsapp_number === userData.phone,
        studentId: userData.student_id || prev.studentId,
        faculty: userData.faculty || prev.faculty,
        specialization: userData.specialization || prev.specialization,
        courses: userData.courses || prev.courses,
        photoUrl: userData.photo_url || prev.photoUrl,
        notifications: {
          teamRequests: userData.team_requests ?? prev.notifications.teamRequests,
          adminMessages: userData.admin_messages ?? prev.notifications.adminMessages,
          newTeams: userData.new_teams ?? prev.notifications.newTeams,
          teamNeedsMembers: userData.team_needs_members ?? prev.notifications.teamNeedsMembers,
          ratings: userData.ratings ?? prev.notifications.ratings,
        }
      }));
      
      // Load draft if exists and profile not complete
      if (userData.draft_data && !userData.profile_completed) {
           setFormData(prev => ({ ...prev, ...userData.draft_data }));
      }
    }
  }, [userData]);

  const [touched, setTouched] = useState({});

  // Auto-save logic
  useEffect(() => {
      if (userData?.profile_completed) return;
      
      const timer = setTimeout(async () => {
          if (formData.fullName) { // simplistic check to avoid saving empty initial state
             setSaveStatus('saving');
             try {
                 await profileApi.saveDraft(formData);
                 setSaveStatus('saved');
                 setTimeout(() => setSaveStatus(''), 2000);
             } catch (e) {
                 setSaveStatus('error');
             }
          }
      }, 30000); 
      return () => clearTimeout(timer);
  }, [formData, userData]);

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  };

  // Debounced Student ID Validation
  useEffect(() => {
      const timer = setTimeout(async () => {
          if (formData.studentId && formData.studentId.length >= 7) {
              try {
                  const { valid, message } = await profileApi.validateStudentId(formData.studentId);
                  setValidationState(prev => ({ ...prev, studentId: { valid, message } }));
              } catch (e) {
                 // ignore
              }
          }
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
  }, [formData.studentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('notifications.')) {
      const notifKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notifKey]: checked
        }
      }));
    } else {
      setFormData(prev => {
          const updates = { ...prev, [name]: value };
          // Reset specialization if faculty changes
          if (name === 'faculty') {
            updates.specialization = '';
          }
          if (name === 'phone' && prev.sameAsPhone) updates.whatsappNumber = value;
          return updates;
      });
    }
    setError('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const toggleCourse = (courseId) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter(id => id !== courseId)
        : [...prev.courses, courseId]
    }));
  };

  const isDoctor = userData?.role === 'doctor';

  // Check if specialization is required (only for Computer Science)
  const requiresSpecialization = formData.faculty === 'Computer Science';

  const isFormValid = () => {
    const baseValid = formData.fullName.trim() && 
                      formData.phone.trim() && 
                      validatePhone(formData.phone) && 
                      formData.faculty && 
                      formData.courses.length > 0;
    
    if (isDoctor) {
        return baseValid;
    }

    // Specialization is required only for Computer Science
    const specializationValid = !requiresSpecialization || formData.specialization;

    return (
      baseValid &&
      formData.studentId?.trim() && 
      (!validationState.studentId.message) &&
      specializationValid
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await profileApi.completeProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        whatsappNumber: formData.sameAsPhone ? formData.phone : formData.whatsappNumber,
        studentId: formData.studentId,
        faculty: formData.faculty,
        specialization: formData.specialization || null,
        courses: formData.courses,
        notificationPrefs: formData.notifications,
        photoUrl: formData.photoUrl
      });

      await refreshUserData();
      if (onComplete) {
          onComplete();
      } else {
          navigate('/teams');
      }
    } catch (err) {
      console.error('Profile submission error:', err);
      // Handle "locked" errors specifically
      if (err.message.includes('locked')) {
          setError('Some fields are locked and cannot be changed: ' + err.message);
      } else {
          setError(err.message || 'Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage = (() => {
    const fields = isDoctor ? [
      formData.fullName,
      formData.phone && validatePhone(formData.phone),
      formData.faculty,
      formData.courses.length > 0
    ] : [
      formData.fullName,
      formData.phone && validatePhone(formData.phone),
      formData.studentId,
      formData.faculty,
      !requiresSpecialization || formData.specialization,
      formData.courses.length > 0
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  })();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Auto-save Indicator */}
      <div className="absolute top-4 right-4 text-xs text-gray-500">
          {saveStatus === 'saving' && 'Saving draft...'}
          {saveStatus === 'saved' && 'Draft saved'}
      </div>

      {/* Progress Bar */}
      <div className="bg-white/5 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-primary to-accent"
        />
      </div>
      <p className="text-sm text-gray-400 text-center">
        Profile Completion: <span className="text-white font-semibold">{completionPercentage}%</span>
      </p>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-300 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Photo URL */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Profile Photo URL
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          <input
            type="url"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
            placeholder="https://example.com/photo.jpg"
          />
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {isDoctor ? 'Full Academic Name' : 'Full Name'} <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={() => handleBlur('fullName')}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            placeholder="John Doe"
          />
        </div>
      </div>

      {/* Student ID (Students Only) */}
      {!isDoctor && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Student ID <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              onBlur={() => handleBlur('studentId')}
              required
              disabled={!!userData?.student_id && userData?.profile_completed}
              className={`w-full bg-white/5 border rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  validationState.studentId.valid === false ? 'border-red-500/50 focus:ring-red-500/50' : 
                  (validationState.studentId.valid === true ? 'border-green-500/50 focus:ring-green-500/50' : 'border-white/10 focus:ring-primary/50')
              } ${userData?.student_id && userData?.profile_completed ? 'cursor-not-allowed opacity-60' : ''}`}
              placeholder="12345678"
            />
          </div>
          {validationState.studentId.message && (
              <p className="text-xs text-red-400 mt-1">{validationState.studentId.message}</p>
          )}
        </div>
      )}

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Phone Number <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
            required
            className={`w-full bg-white/5 border rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
              touched.phone && !validatePhone(formData.phone) && formData.phone
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/10 focus:ring-primary/50 focus:border-primary/50'
            }`}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      {/* WhatsApp Number */}
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
            <span>WhatsApp Number <span className="text-red-400">*</span></span>
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={formData.sameAsPhone}
                    onChange={(e) => {
                        setFormData(prev => ({ 
                            ...prev, 
                            sameAsPhone: e.target.checked,
                            whatsappNumber: e.target.checked ? prev.phone : prev.whatsappNumber
                        }));
                    }}
                    className="rounded border-white/20 bg-white/10 text-primary focus:ring-primary/50"
                />
                Same as Phone
            </label>
        </label>
        <div className="relative">
          <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="tel"
            name="whatsappNumber"
            value={formData.sameAsPhone ? formData.phone : formData.whatsappNumber}
            onChange={handleChange}
            disabled={formData.sameAsPhone}
            required
            className={`w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${
                formData.sameAsPhone ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

       {/* Email */}
       <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          University Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Faculty */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Faculty <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#0f172a]">Select Faculty</option>
            {FACULTIES.map(faculty => (
              <option key={faculty} value={faculty} className="bg-[#0f172a]">{faculty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Specialization - Conditional: Only show for Computer Science */}
      {requiresSpecialization && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Specialization <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required={requiresSpecialization}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0f172a]">Select Specialization</option>
              {SPECIALIZATIONS['Computer Science'].map(spec => (
                <option key={spec} value={spec} className="bg-[#0f172a]">{spec}</option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {/* Enrolled Courses */}
      <div>
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-gray-300">
                {isDoctor ? 'Assigned Courses' : 'Enrolled Courses'} <span className="text-red-400">*</span>
              </label>
              {/* Tooltip */}
              <div className="relative">
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                  aria-label="Course selection help"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 top-full mt-2 z-10 w-64 p-3 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl text-xs text-gray-300"
                  >
                    <p>💡 You can search for courses instead of selecting them manually.</p>
                    <div className="absolute -top-1.5 left-3 w-3 h-3 bg-[#1e293b] border-l border-t border-white/10 rotate-45" />
                  </motion.div>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-400">
              Selected: <span className="text-white font-semibold">{formData.courses.length}</span>
            </span>
        </div>
        
        <SearchableSelect
            options={availableCourses} // Expecting { id, name, code } objects
            value={formData.courses}
            onChange={(newCourses) => setFormData(prev => ({ ...prev, courses: newCourses }))}
            placeholder="Search by course name or code (e.g. CS101)..."
            label="" // Label handled above
            multiple={true}
        />
        
        {formData.courses.length === 0 && (
            <p className="text-xs text-amber-400/80 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Please select at least one course.
            </p>
        )}
      </div>

      {/* Notification Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </label>
        <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
          {[
            { key: 'teamRequests', label: 'Team join requests' },
            { key: 'adminMessages', label: 'Admin announcements' },
            { key: 'newTeams', label: 'New teams in my courses' },
            { key: 'teamNeedsMembers', label: 'Teams looking for members' },
            { key: 'ratings', label: 'Teammate rating reminders' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name={`notifications.${key}`}
                checked={formData.notifications[key]}
                onChange={handleChange}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/50"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid() || loading}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/30 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {userData?.profile_completed ? 'Updating...' : 'Saving Profile...'}
          </>
        ) : (
          <>
            {userData?.profile_completed ? 'Update Profile' : 'Save & Continue'}
            <CheckCircle2 className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Need help? Contact support or your faculty admin.
      </p>
    </form>
  );
};

export default ProfileForm;
