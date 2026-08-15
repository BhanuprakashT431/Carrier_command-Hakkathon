import React from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import StatsStrip from './components/StatsStrip.jsx';
import WhyCareerCommand from './components/WhyCareerCommand.jsx';
import NineAgentIntelligence from './components/NineAgentIntelligence.jsx';
import FeaturesGrid from './components/FeaturesGrid.jsx';
import VisualDemoDashboard from './components/VisualDemoDashboard.jsx';
import HowItWorksPipeline from './components/HowItWorksPipeline.jsx';
import SimulationVisual from './components/SimulationVisual.jsx';
import CareerCopilotVisual from './components/CareerCopilotVisual.jsx';
import FinalCTA from './components/FinalCTA.jsx';
import Footer from './components/Footer.jsx';
import AnimatedBackground from './components/AnimatedBackground.jsx';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 flex flex-col font-inter text-surface-900 dark:text-white relative transition-colors duration-500">
      <AnimatedBackground />
      <Navbar />

      <main className="flex-1 w-full overflow-hidden flex flex-col relative z-10">
        {/* We do NOT wrap these in padded divs. The components handle their own padding. */}
        <HeroSection />
        <StatsStrip />
        <WhyCareerCommand />
        <NineAgentIntelligence />
        <FeaturesGrid />
        <VisualDemoDashboard />
        <HowItWorksPipeline />
        <SimulationVisual />
        <CareerCopilotVisual />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
