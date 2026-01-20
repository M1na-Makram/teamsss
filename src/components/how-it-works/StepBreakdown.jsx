import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, UserCog, Lock, BookOpenCheck, 
  Search, Users, Bell, AlertTriangle, Fingerprint 
} from 'lucide-react';

const StepBreakdown = () => {
  const steps = [
    {
      id: 1,
      title: 'Register & Login',
      icon: <Fingerprint className="w-6 h-6 text-indigo-400" />,
      desc: 'Secure access via Firebase Authentication (Google or Email). Your account is your validated academic identity.',
      rules: ['No anonymous access', 'Verified email required'],
      badge: 'No anonymous access',
      note: 'Your account = your academic identity.'
    },
    {
      id: 2,
      title: 'Complete Profile (Mandatory)',
      icon: <UserCog className="w-6 h-6 text-purple-400" />,
      desc: 'Fields: Full name, WhatsApp (alerts), Faculty, Term. Incomplete profiles are blocked from all system actions.',
      rules: ['Mandatory Profile', 'No Actions until complete'],
      badge: 'Profile Lock',
      note: 'We can’t build teams with missing info.',
      highlight: true
    },
    {
      id: 3,
      title: 'Admin Account Approval',
      icon: <Lock className="w-6 h-6 text-amber-500" />,
      desc: 'Admins verify your eligibility. State: Pending, Approved, or Rejected (with reason). This keeps things academic.',
      rules: ['Admin Review Required', 'Manual Verification'],
      badge: 'Gatekeeper active',
      note: 'This keeps the system clean and academic.'
    },
    {
      id: 4,
      title: 'Select Academic Context',
      icon: <BookOpenCheck className="w-6 h-6 text-cyan-400" />,
      desc: 'Select your enrolled courses. The UI dynamically adapts to show only relevant teams and actions.',
      rules: ['Dynamic Scope', 'Relevant Context Only'],
      badge: 'Context-Aware UI'
    },
    {
      id: 5,
      title: 'Browse & Filter Teams',
      icon: <Search className="w-6 h-6 text-blue-400" />,
      desc: 'Filter by courses. View team size, capacity, and leader details. High-visibility progress bars show availability.',
      rules: ['Smart Discovery', 'Capacity bars'],
      badge: 'Live Analytics',
      emptyState: 'No teams yet — maybe you should lead one 👀'
    },
    {
      id: 6,
      title: 'Join or Create Team',
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      desc: 'Join: Request → Acceptance. Create: Become leader. Hard rules: 1 team/course, max 5 members.',
      rules: ['Strict Capacity', '1 Team per course'],
      badge: 'Rules Enforced',
      note: 'Rules are enforced, not optional.'
    },
    {
      id: 7,
      title: 'Notifications & Sync',
      icon: <Bell className="w-6 h-6 text-green-400" />,
      desc: 'Navbar bell, FCM push alerts, and automated WhatsApp triggers. Never miss an update or join request.',
      rules: ['6-Channel Sync', 'Zero-latency push'],
      badge: 'Automated Sync',
      note: 'No silent actions. Ever.'
    }
  ];

  return (
    <section className="py-24 bg-[#020617] relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`relative p-8 rounded-[2rem] border ${step.highlight ? 'bg-indigo-500/[0.03] border-indigo-500/20' : 'bg-white/[0.02] border-white/5'} transition-all duration-500 hover:border-white/10 group flex flex-col`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            {step.icon}
                        </div>
                        <span className="text-5xl font-black text-white/[0.03] font-mono leading-none">0{step.id}</span>
                    </div>

                    <div className="mb-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                        {step.badge}
                      </span>
                      <h3 className="text-xl md:text-2xl font-extrabold text-white mb-4 group-hover:text-indigo-400 transition-colors">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                        {step.desc}
                    </p>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                        {step.rules.map((rule, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <ShieldCheck className={`w-3.5 h-3.5 ${step.highlight ? 'text-indigo-400' : 'text-gray-600'}`} />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{rule}</span>
                            </div>
                        ))}
                    </div>

                    {step.note && (
                      <div className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] italic text-gray-500 leading-normal">
                          {step.note}
                        </p>
                      </div>
                    )}
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default StepBreakdown;
