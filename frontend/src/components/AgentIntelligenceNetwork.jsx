import React, { useEffect, useState } from 'react';
import { 
  User, Code, Globe, Target, AlertTriangle, 
  Zap, FileCheck, FlaskConical, Map, BrainCircuit
} from 'lucide-react';

const AGENTS = [
  { id: 'profile', name: 'Profile Agent', icon: User, color: 'text-blue-400', status: 'complete' },
  { id: 'skills', name: 'Skills Agent', icon: Code, color: 'text-indigo-400', status: 'complete' },
  { id: 'market', name: 'Market Agent', icon: Globe, color: 'text-purple-400', status: 'active' },
  { id: 'career', name: 'Career Agent', icon: Target, color: 'text-emerald-400', status: 'waiting' },
  { id: 'risk', name: 'Risk Agent', icon: AlertTriangle, color: 'text-orange-400', status: 'waiting' },
  { id: 'stress', name: 'Stress Test Agent', icon: Zap, color: 'text-rose-400', status: 'waiting' },
  { id: 'evidence', name: 'Evidence Agent', icon: FileCheck, color: 'text-teal-400', status: 'waiting' },
  { id: 'simulation', name: 'Simulation Agent', icon: FlaskConical, color: 'text-cyan-400', status: 'waiting' },
  { id: 'roadmap', name: 'Roadmap Agent', icon: Map, color: 'text-fuchsia-400', status: 'waiting' }
];

const AgentNode = ({ agent, isCore = false, activeState = 'waiting' }) => {
  const Icon = agent?.icon;
  
  // Status styling
  const isComplete = activeState === 'complete';
  const isActive = activeState === 'active';
  
  const baseClasses = "relative flex flex-col items-center justify-center p-3 rounded-2xl border backdrop-blur-md transition-all duration-500 z-10 bg-surface-900/80";
  
  let statusClasses = "border-surface-700 text-surface-400 opacity-60";
  if (isActive) {
    statusClasses = "border-purple-500/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)] opacity-100 ring-1 ring-purple-500/30";
  } else if (isComplete) {
    statusClasses = "border-surface-600 text-surface-200 opacity-90";
  }

  if (isCore) {
    return (
      <div className="relative flex flex-col items-center justify-center p-6 rounded-full border border-purple-500/40 bg-purple-900/20 backdrop-blur-xl z-20 shadow-[0_0_40px_rgba(168,85,247,0.15)] animate-pulse-slow">
        <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-ping opacity-20"></div>
        <BrainCircuit className="w-10 h-10 text-purple-400 mb-2" />
        <span className="text-sm font-semibold tracking-wide text-purple-200 uppercase">Swarm Core</span>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${statusClasses} w-full max-w-[120px] aspect-square group`}>
      {isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400 animate-ping"></div>
      )}
      {isComplete && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400"></div>
      )}
      <div className={`p-2 rounded-xl mb-2 ${isComplete ? 'bg-surface-800' : 'bg-surface-800/50'}`}>
        <Icon className={`w-5 h-5 ${isActive ? agent.color : isComplete ? 'text-surface-300' : 'text-surface-500'}`} />
      </div>
      <span className="text-xs font-medium text-center leading-tight">
        {agent.name}
      </span>
      <span className="text-[10px] uppercase tracking-wider mt-1 opacity-70">
        {activeState}
      </span>
    </div>
  );
};

// SVG lines connecting grid items. We assume a 3x3 grid where core is at (1,1) [0-indexed]
const NetworkLines = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: '100%' }}>
    <defs>
      <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(168, 85, 247, 0.1)" />
        <stop offset="50%" stopColor="rgba(168, 85, 247, 0.4)" />
        <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
      </linearGradient>
      {/* Animated signal dot */}
      <radialGradient id="signal" cx="50%" cy="50%" r="50%">
         <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
         <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Center to Top-Left */}
    <line x1="50%" y1="50%" x2="16%" y2="20%" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="4 4" />
    {/* Center to Top-Center */}
    <line x1="50%" y1="50%" x2="50%" y2="16%" stroke="url(#line-grad)" strokeWidth="1.5" />
    {/* Center to Top-Right */}
    <line x1="50%" y1="50%" x2="84%" y2="20%" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="4 4" />
    
    {/* Center to Left */}
    <line x1="50%" y1="50%" x2="16%" y2="50%" stroke="url(#line-grad)" strokeWidth="1.5" />
    {/* Center to Right */}
    <line x1="50%" y1="50%" x2="84%" y2="50%" stroke="url(#line-grad)" strokeWidth="1.5" />
    
    {/* Center to Bottom-Left */}
    <line x1="50%" y1="50%" x2="16%" y2="80%" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="4 4" />
    {/* Center to Bottom-Center */}
    <line x1="50%" y1="50%" x2="50%" y2="84%" stroke="url(#line-grad)" strokeWidth="1.5" />
    {/* Center to Bottom-Right */}
    <line x1="50%" y1="50%" x2="84%" y2="80%" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="4 4" />

    {/* Center to far bottom (Roadmap) */}
    <path d="M 50% 50% Q 50% 100% 50% 95%" stroke="url(#line-grad)" strokeWidth="1" fill="none" strokeDasharray="4 4" />

    {/* Moving signals (particles) - CSS animation could be applied here, or just static representation for now */}
    <circle r="3" fill="url(#signal)">
      <animateMotion dur="3s" repeatCount="indefinite" path="M 16% 20% L 50% 50%" />
    </circle>
    <circle r="3" fill="url(#signal)">
      <animateMotion dur="4s" repeatCount="indefinite" path="M 50% 16% L 50% 50%" />
    </circle>
    <circle r="3" fill="url(#signal)">
      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 50% 50% L 84% 80%" />
    </circle>
  </svg>
);

/**
 * Reusable Agent Intelligence Network visualization.
 * Modes: 'overview' (Dashboard), 'executing' (Analysis), 'compact' (Copilot)
 */
export default function AgentIntelligenceNetwork({ mode = 'overview', liveStatus = {} }) {
  // Use passed liveStatus (for Analysis page execution) or default mock status
  const getStatus = (agentId) => {
    if (liveStatus[agentId]) return liveStatus[agentId];
    if (mode === 'overview' || mode === 'compact') return 'complete'; // All active/ready
    return 'waiting';
  };

  if (mode === 'compact') {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-900 border border-surface-700/50 shadow-inner">
        <BrainCircuit className="w-5 h-5 text-purple-400" />
        <div className="flex-1 flex gap-1 overflow-hidden">
          {AGENTS.map(a => (
            <div key={a.id} className="w-2 h-2 rounded-full bg-emerald-400" title={a.name}></div>
          ))}
        </div>
        <span className="text-xs text-surface-400 font-medium whitespace-nowrap">09 AGENTS READY</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto py-12 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <NetworkLines />
      
      {/* 3x3 Grid Layout */}
      <div className="grid grid-cols-3 gap-y-12 gap-x-4 sm:gap-x-12 place-items-center relative z-10">
        
        {/* Row 1 */}
        <AgentNode agent={AGENTS[0]} activeState={getStatus(AGENTS[0].id)} />
        <AgentNode agent={AGENTS[1]} activeState={getStatus(AGENTS[1].id)} />
        <AgentNode agent={AGENTS[2]} activeState={getStatus(AGENTS[2].id)} />
        
        {/* Row 2 */}
        <AgentNode agent={AGENTS[3]} activeState={getStatus(AGENTS[3].id)} />
        <AgentNode isCore={true} />
        <AgentNode agent={AGENTS[4]} activeState={getStatus(AGENTS[4].id)} />
        
        {/* Row 3 */}
        <AgentNode agent={AGENTS[5]} activeState={getStatus(AGENTS[5].id)} />
        <AgentNode agent={AGENTS[6]} activeState={getStatus(AGENTS[6].id)} />
        <AgentNode agent={AGENTS[7]} activeState={getStatus(AGENTS[7].id)} />
      </div>

      {/* Row 4 (Standalone) */}
      <div className="flex justify-center mt-12 relative z-10">
        <AgentNode agent={AGENTS[8]} activeState={getStatus(AGENTS[8].id)} />
      </div>
    </div>
  );
}
