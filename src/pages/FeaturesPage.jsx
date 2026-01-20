import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureHero from '../components/features-page/FeatureHero';
import FeatureCategories from '../components/features-page/FeatureCategories';
import AuthIdentity from '../components/features-page/AuthIdentity';
import TeamsEngine from '../components/features-page/TeamsEngine';
import SmartDiscovery from '../components/features-page/SmartDiscovery';
import Communication from '../components/features-page/Communication';
import AdminGovernance from '../components/features-page/AdminGovernance';
import ValidationSecurity from '../components/features-page/ValidationSecurity';
import FeatureComparison from '../components/features-page/FeatureComparison';
import SEO from '../components/common/SEO';

const FeaturesPage = () => {
  return (
    <>
      <SEO 
        title="Engineering-Grade Features"
        description="Explore the advanced engine powering TeamSync. Smart discovery, rule-based formation, and secure academic governance."
      />
      <Navbar />
      <FeatureHero />
      <FeatureCategories />
      <AuthIdentity />
      <TeamsEngine />
      <SmartDiscovery />
      <Communication />
      <AdminGovernance />
      <ValidationSecurity />
      <FeatureComparison />
      <Footer />
    </>
  );
};

export default FeaturesPage;
