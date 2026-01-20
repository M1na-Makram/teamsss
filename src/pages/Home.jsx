import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Trust from '../components/Trust';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import LogicFilter from '../components/LogicFilter';
import AdminNotify from '../components/AdminNotify';
import Footer from '../components/Footer';

import AdminGovernance from '../components/AdminGovernance';
import SEO from '../components/common/SEO';

const Home = () => {
  return (
    <>
      <SEO 
        title="Smart Academic Team Formation"
        description="The next generation of academic collaboration. TeamSync is a secure, rule-based platform for university team formation and management."
      />
      <Navbar />
      <main className="relative">
        <Hero />
        <HowItWorks />
        <AdminGovernance />
        <Features />
        <LogicFilter />
      </main>
      <Footer />
    </>
  );
};

export default Home;

