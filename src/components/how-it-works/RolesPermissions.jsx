import React from 'react';
import { motion } from 'framer-motion';
import { User, Crown, ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';

const RolesPermissions = () => {
  const roles = [
    {
      title: 'Student',
      icon: <User className="w-8 h-8 text-blue-400" />,
      tag: 'Member',
      features: ['Join or create teams', 'Track team status', 'Receive instant alerts']
    },
    {
      title: 'Team Leader',
      icon: <Crown className="w-8 h-8 text-amber-500" />,
      tag: 'Manager',
      features: ['Accept / reject members', 'Manage team capacity', 'Coordinate progress']
    },
    {
      title: 'Doctor',
      icon: <GraduationCap className="w-8 h-8 text-cyan-400" />,
      tag: 'Supervisor',
      features: ['Assigned by admin', 'Oversees teams', 'Reviews academic progress']
    },
    {
      title: 'Admin',
      icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
      tag: 'Governance',
      features: ['Approve accounts', 'Assign doctors', 'Enforce system rules']
    }
  ];

  return (
    <section className="py-24 bg-[#020617] border-y border-white/5 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6"
          >
            Access Control
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Roles & Permissions</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Everyone has a role. Everyone has limits.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {roles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 className="w-20 h-20 -mr-6 -mt-6" />
              </div>
              
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform">
                {role.icon}
              </div>
              
              <div className="mb-6">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{role.tag}</span>
                <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors">{role.title}</h3>
              </div>

              <ul className="space-y-4">
                {role.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center mt-12 text-sm text-gray-600 italic">
          Caption: “Everyone has a role. Everyone has limits.”
        </p>
      </div>
    </section>
  );
};

export default RolesPermissions;
