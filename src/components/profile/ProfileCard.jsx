import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, BookOpen, GraduationCap, 
  Calendar, Hash, Users, MessageCircle, Edit2
} from 'lucide-react';

const ProfileCard = ({ userData, onEdit }) => {
  const infoGroups = [
    {
      title: "Personal Information",
      items: [
        { label: "Full Name", value: userData?.name, icon: User },
        { label: "Email", value: userData?.email, icon: Mail },
        { label: "Student ID", value: userData?.student_id, icon: Hash },
        { label: "Phone", value: userData?.phone, icon: Phone },
        { label: "WhatsApp", value: userData?.whatsapp_number, icon: MessageCircle },
      ]
    },
    {
      title: "Academic Information",
      items: [
        { label: "Faculty", value: userData?.student_group, icon: GraduationCap },
        { label: "Group", value: userData?.faculty, icon: Users },
        { label: "Academic Term", value: userData?.section, icon: Calendar },
        { label: "Section", value: userData?.academic_term, icon: Users },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-1 shadow-xl">
              <div className="w-full h-full bg-[#1e293b] rounded-xl flex items-center justify-center overflow-hidden">
                {userData?.photo_url ? (
                  <img src={userData.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onEdit}
            className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{userData?.name || 'User Name'}</h2>
            <p className="text-gray-400">{userData?.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {infoGroups.map((group, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">{group.title}</h3>
                <div className="space-y-3">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{item.label}</p>
                        <p className="text-sm text-gray-200 font-medium">{item.value || 'Not set'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {userData?.courses && userData.courses.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Enrolled Courses</h3>
              <div className="flex flex-wrap gap-2">
                {userData.courses.map((course, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
