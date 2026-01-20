import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HIWHero from '../components/how-it-works/HIWHero';
import FlowOverview from '../components/how-it-works/FlowOverview';
import StepBreakdown from '../components/how-it-works/StepBreakdown';
import RolesPermissions from '../components/how-it-works/RolesPermissions';
import Comparison from '../components/how-it-works/Comparison';
import VisualLogic from '../components/how-it-works/VisualLogic';
import FinalCTA from '../components/how-it-works/FinalCTA';

import SEO from '../components/common/SEO';

const HowItWorksPage = () => {
  return (
    <>
      <SEO 
        title="How the Platform Works"
        description="Learn the deterministic 7-step process of academic team formation on TeamSync. From registration to official doctor assignment."
      />
      <Navbar />
      <HIWHero />
      <FlowOverview />
      <StepBreakdown />
      <RolesPermissions />
      <Comparison />
      <VisualLogic />
      <FinalCTA />
      <Footer />
    </>
  );
};

export default HowItWorksPage;
