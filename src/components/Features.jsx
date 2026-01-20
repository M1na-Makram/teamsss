import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, MessageSquare, Lock, Database, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'Authentication & Identity',
      desc: 'Secure Google Login with mandatory profile completion ensuring every user is verified.',
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      tech: 'Firebase Auth',
    },
    {
      title: 'Team Intelligence',
      desc: 'Smart rules enforcement: One team per course, max members limits, and leader roles.',
      icon: <Users className="w-8 h-8 text-accent" />,
      tech: 'PostgreSQL',
    },
    {
      title: 'Doctor & Admin Dashboard',
      desc: 'Powerful tools for faculty to view team progress, assign grades, and broadcast announcements.',
      icon: <Lock className="w-8 h-8 text-orange-400" />,
      tech: 'Admin Panel',
    },
    {
      title: 'Smart Notifications',
      desc: 'Instant alerts for team invites, rejections, and doctor assignments via App & WhatsApp.',
      icon: <MessageSquare className="w-8 h-8 text-secondary" />,
      tech: 'Real-time Push',
    },
    {
      title: 'Team Formation Controls',
      desc: 'Prevent unwanted joins with leader approval. Block spammers and report inactive teams.',
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      tech: 'Smart Rules',
    },
  ];

  return (
    <section id="features" className="py-24 bg-background/50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Core Capabilities
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-xl text-gray-400"
          >
            Everything you need to manage academic teams at scale.
          </motion.p>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, idx) => (
             <FeatureCard key={idx} feature={feature} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, idx }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group rounded-2xl bg-white/5 border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 relative"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
        {feature.icon}
      </div>

      {/* Header / Clickable Area for Mobile */}
      <div className="p-6 md:p-8 flex items-center md:block gap-4 cursor-pointer md:cursor-default">
        <div className="md:mb-6 md:p-4 bg-background rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
          {feature.icon}
        </div>

        <div className="flex-1 md:w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold md:mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                </h3>
                {/* Mobile Chevron */}
                <div className={`md:hidden p-1 rounded-full bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={`px-6 md:px-8 pb-6 md:pb-8 pt-0 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100 overflow-hidden md:overflow-visible'}`}>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {feature.desc}
        </p>
        
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-500">
          {feature.tech}
        </div>
      </div>
    </motion.div>
  );
};


export default Features;
