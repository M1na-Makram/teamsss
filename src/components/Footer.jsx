import React from 'react';
import { 
  Layers, Twitter, Linkedin, Github, 
  Mail, ExternalLink, ShieldCheck, Cpu, 
  Globe, ArrowRight, Heart 
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Teams', href: '/teams', desc: 'Secure team formation' },
      { name: 'How It Works', href: '/how-it-works', desc: 'The academic workflow' },
      { name: 'Features', href: '/features', desc: 'Advanced engine details' },
    ],
    platform: [
      { name: 'Admin Dashboard', href: '/admin', desc: 'Supervisory control' },
      { name: 'Architecture', href: '/features#security', desc: 'System integrity' },
      { name: 'Docs', href: '#', desc: 'Developer resources' },
    ],
    company: [
      { name: 'About Us', href: '#', desc: 'Our academic mission' },
      { name: 'Contact Us', href: '#', desc: 'Get in touch' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#', desc: 'Data protection' },
      { name: 'Terms of Service', href: '#', desc: 'Platform rules' },
    ]
  };

  return (
    <footer className="relative bg-[#020617] pt-32 pb-12 overflow-hidden border-t border-white/5">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        
        {/* Particle/Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-24 pb-16 border-b border-white/5">
          <div className="max-w-xl">
             <Link to="/" className="flex items-center gap-3 group w-fit mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-12 h-12 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center text-white shadow-xl">
                  <Layers className="w-7 h-7" />
                </div>
              </div>
              <span className="text-3xl font-black text-white tracking-tighter uppercase italic">TeamSync</span>
            </Link>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
              A secure <span className="text-white italic">academic team management platform</span> built for real universities. Not just a portal, but a deterministic engine of <span className="text-indigo-400 font-bold">rules and validation.</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <motion.a 
                key={i} 
                href="#" 
                whileHover={{ y: -4, scale: 1.1 }}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-xl"
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">Product</h4>
            <ul className="space-y-6">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="group flex flex-col gap-1">
                    <span className="text-white font-bold group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                       {link.name}
                       <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">{link.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">Platform</h4>
            <ul className="space-y-6">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="group flex flex-col gap-1">
                    <span className="text-white font-bold group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                      {link.name}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">{link.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">Resources</h4>
            <ul className="space-y-6">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="group flex flex-col gap-1">
                    <span className="text-white font-bold group-hover:text-indigo-400 transition-colors">{link.name}</span>
                    <span className="text-[11px] text-gray-500 font-medium">{link.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">Governance</h4>
            <ul className="space-y-6">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="group flex flex-col gap-1">
                    <span className="text-white font-bold group-hover:text-indigo-400 transition-colors">{link.name}</span>
                    <span className="text-[11px] text-gray-500 font-medium">{link.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Global Schema Hook (SEO) */}
        <div className="grid md:grid-cols-3 gap-8 py-12 border-y border-white/5 mb-16">
          <div className="flex items-center gap-4 text-gray-400 transition-colors hover:text-white group">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-white">Secure Academic SaaS</span>
              <span className="text-[10px] font-medium opacity-60">Verified Identity Architecture</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400 transition-colors hover:text-white group">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
              <Cpu className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-white">V3 Logic Engine</span>
              <span className="text-[10px] font-medium opacity-60">Real-time Validation Layer</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400 transition-colors hover:text-white group">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
              <Globe className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-white">Global University Ready</span>
              <span className="text-[10px] font-medium opacity-60">CBP & GDPR Compliant</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[11px] text-gray-600 font-bold uppercase tracking-[0.2em]">
              © {currentYear} TeamSync — Engineering academic collaboration.
            </p>
            <div className="flex items-center gap-3 text-[9px] text-gray-700 font-mono">
              <span className="px-1.5 py-0.5 rounded border border-gray-800">NODE_ENV: PROD</span>
              <span className="px-1.5 py-0.5 rounded border border-gray-800">BLD_HASH: 7F2A9C</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-medium flex items-center gap-2">
            Made with <Heart className="w-3.5 h-3.5 text-red-500" /> for the next generation of builders.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
