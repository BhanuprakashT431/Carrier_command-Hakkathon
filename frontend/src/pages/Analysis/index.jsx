import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAnalysisStore from '../../store/analysisStore.js';
import AgentIntelligenceNetwork from '../../components/AgentIntelligenceNetwork.jsx';
import { CheckCircle, Clock, Search, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

const Analysis = () => {
  const {
    analysisId,
    status,
    dataMode,
    results,
    error,
    agentStatuses,
    stressTest,
    evidence,
    learningRoadmap,
    decision,
    setDataMode,
    runAnalysis,
    pollStatus,
    clearAnalysis,
  } = useAnalysisStore();

  useEffect(() => {
    if (analysisId && status !== 'IDLE' && status !== 'COMPLETED' && status !== 'FAILED') {
      pollStatus(analysisId);
    }
  }, [analysisId, status, pollStatus]);

  const handleRunAnalysis = () => {
    runAnalysis(dataMode);
  };

  const isRunning = status === 'PENDING' || status === 'PROFILE_RUNNING' || status === 'PARALLEL_AGENTS_RUNNING';

  return (
    <div className="flex-1 w-full bg-surface-50 dark:bg-[#080B14] transition-colors duration-300 min-h-screen">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob" />
        <div className="absolute top-60 left-20 w-80 h-80 bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000" />
      </div>

      {/* Demo Mode Ribbon */}
      {dataMode === 'DEMO' && (
        <div className="w-full bg-gradient-to-r from-purple-600 to-primary-600 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-sm relative z-20">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">Synthetic Data Engine Active</span>
        </div>
      )}

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Header section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">
              Analysis Workspace
            </h1>
            <p className="mt-2 text-surface-600 dark:text-surface-400 text-lg max-w-2xl">
              Unleash a swarm of specialized AI agents to evaluate your market fit, surface risks, and map your trajectory.
            </p>
          </div>
          
          <div className="flex p-1 bg-surface-200/50 dark:bg-surface-800/50 backdrop-blur-md rounded-xl shadow-inner border border-surface-200 dark:border-surface-700 w-fit">
            <button
              onClick={() => setDataMode('LIVE')}
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                dataMode === 'LIVE' 
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm border border-surface-200 dark:border-surface-700' 
                  : 'text-surface-500 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Live Engine
            </button>
            <button
              onClick={() => setDataMode('DEMO')}
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                dataMode === 'DEMO' 
                  ? 'bg-primary-600 text-white shadow-sm' 
                  : 'text-surface-500 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Simulated Data
            </button>
          </div>
        </div>

        {/* Error State */}
        {status === 'FAILED' && (
          <div className="mb-10 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-center sm:items-start gap-4 animate-fade-up">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-red-600 dark:text-red-400 text-lg mb-1">Engine Failure</h3>
              <p className="text-red-600/80 dark:text-red-400/80">{error || 'An unexpected error occurred during the swarm analysis.'}</p>
            </div>
            <button 
              onClick={clearAnalysis}
              className="mt-4 sm:mt-0 px-6 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-sm shrink-0"
            >
              Reboot Engine
            </button>
          </div>
        )}

        {/* IDLE / PENDING / RUNNING State */}
        {(status === 'IDLE' || isRunning || (status === 'COMPLETED' && !results)) && (
          <div className="bg-surface-900/40 backdrop-blur-xl border border-surface-800 shadow-2xl rounded-3xl p-10 flex flex-col items-center animate-fade-up">
            
            <div className="w-full flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <Cpu className="w-6 h-6 text-primary-400" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                  {isRunning ? 'Swarm Executing...' : '09 Agents Ready'}
                </h2>
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={isRunning}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                  isRunning 
                  ? 'bg-surface-800 text-surface-500 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                }`}
              >
                {isRunning ? 'Processing...' : 'Run Agent Swarm'}
              </button>
            </div>
            
            {/* Embedded 9-Agent Network */}
            <div className="w-full mb-8">
               <AgentIntelligenceNetwork mode={isRunning ? 'executing' : 'overview'} liveStatus={agentStatuses} />
            </div>

            {/* If executing, show the sequential list as requested */}
            {isRunning && (
              <div className="w-full max-w-lg mx-auto bg-surface-900/80 border border-surface-800 p-6 rounded-2xl">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500 mb-4 text-center">Execution Sequence</h3>
                 <div className="space-y-3">
                    {[
                      { id: 'profile', name: 'PROFILE AGENT' },
                      { id: 'skills', name: 'SKILLS AGENT' },
                      { id: 'market', name: 'MARKET AGENT' },
                      { id: 'career', name: 'CAREER AGENT' },
                      { id: 'risk', name: 'RISK AGENT' },
                      { id: 'stress', name: 'STRESS TEST AGENT' },
                      { id: 'evidence', name: 'EVIDENCE AGENT' },
                      { id: 'simulation', name: 'SIMULATION AGENT' },
                      { id: 'roadmap', name: 'ROADMAP AGENT' }
                    ].map(a => {
                       const state = agentStatuses[a.id] || 'waiting';
                       return (
                         <div key={a.id} className="flex justify-between items-center">
                           <span className="text-sm font-semibold text-surface-300">{a.name}</span>
                           <div className="flex items-center gap-2">
                             {state === 'complete' && <><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Complete</span></>}
                             {state === 'active' && <><span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span><span className="text-xs text-primary-400 font-bold uppercase tracking-wider">Analyzing</span></>}
                             {state === 'waiting' && <><Clock className="w-4 h-4 text-surface-600" /><span className="text-xs text-surface-600 font-bold uppercase tracking-wider">Waiting</span></>}
                           </div>
                         </div>
                       )
                    })}
                 </div>
              </div>
            )}
          </div>
        )}

        {/* Completed State - CAREER INTELLIGENCE REPORT */}
        {status === 'COMPLETED' && results && (
          <div className="animate-fade-up space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-900/80 backdrop-blur-md border border-emerald-500/30 shadow-sm p-4 sm:px-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Analysis Complete</h3>
                  <p className="text-xs text-emerald-400 font-medium">9-Agent Swarm Consensus Reached.</p>
                </div>
              </div>
              <button 
                onClick={clearAnalysis}
                className="w-full sm:w-auto px-5 py-2.5 bg-surface-800 text-surface-300 font-semibold rounded-xl hover:bg-surface-700 transition-colors mt-4 sm:mt-0"
              >
                Re-run Analysis
              </button>
            </div>

            {/* Career Intelligence Report Header */}
            <div className="bg-surface-900 border border-surface-800 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-emerald-500"></div>
               <h2 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Career Intelligence Report</h2>
               
               {/* Extract the top career for the report header */}
               {decision && (
                 <div className="mt-8">
                   <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-8">{decision.career}</h3>
                   <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
                     <div className="text-center">
                       <p className="text-[10px] uppercase tracking-widest text-surface-400 font-bold mb-2">Career Suitability</p>
                       <p className="text-3xl font-bold text-emerald-400">{decision.stressAdjustedScore || decision.suitabilityScore}</p>
                     </div>
                     <div className="w-px h-12 bg-surface-800 hidden sm:block"></div>
                     <div className="text-center">
                       <p className="text-[10px] uppercase tracking-widest text-surface-400 font-bold mb-2">Confidence Level</p>
                       <p className="text-3xl font-bold text-primary-400">HIGH</p>
                     </div>
                     <div className="w-px h-12 bg-surface-800 hidden sm:block"></div>
                     <div className="text-center">
                       <p className="text-[10px] uppercase tracking-widest text-surface-400 font-bold mb-2">Market Demand</p>
                       <p className="text-3xl font-bold text-white">{decision.riskScore < 30 ? 'Strong' : 'Medium'}</p>
                     </div>
                   </div>
                 </div>
               )}
            </div>

            {/* 2-Column Report Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* Left Column */}
               <div className="space-y-8">
                 {/* Why This Career */}
                 <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8">
                   <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Why This Recommendation?</h4>
                   <ul className="space-y-4">
                     {decision?.strengths?.map((reason, i) => (
                       <li key={i} className="flex gap-3 text-surface-300">
                         <span className="shrink-0 w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold">{i+1}</span>
                         <span className="leading-relaxed">{reason}</span>
                       </li>
                     ))}
                   </ul>
                 </div>

                 {/* Skill Gaps */}
                 <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8">
                   <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                     <Target className="w-5 h-5 text-rose-400" /> Critical Skill Gaps
                   </h4>
                   <div className="space-y-4">
                     {results?.skillGaps?.map((gap, idx) => (
                       <div key={idx} className="flex items-center justify-between border-b border-surface-800 pb-3 last:border-0 last:pb-0">
                         <div>
                           <span className="font-semibold text-surface-200 block">{gap.skillName}</span>
                           <span className="text-xs text-surface-500">Current: {gap.currentLevel}/100 → Required: {gap.requiredLevel}/100</span>
                         </div>
                         <div className="flex flex-col items-end">
                           <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded font-bold uppercase tracking-wider">{gap.priority} Priority</span>
                           <span className="text-[10px] text-surface-400 mt-1">Gap: {gap.gapSize}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Career Risks (Stress Test Summary) */}
                 {stressTest && (
                   <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8">
                     <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                       <ShieldAlert className="w-5 h-5 text-amber-400" /> Top Career Risks
                     </h4>
                     <div className="space-y-4">
                       {stressTest.scenarios?.filter(s => s.impact === 'High' || s.impact === 'Medium' || s.impact === 'HIGH' || s.impact === 'MEDIUM').slice(0, 3).map((sc, idx) => (
                         <div key={idx} className="p-4 bg-surface-800/50 rounded-xl border border-surface-700/50">
                           <div className="flex justify-between items-center mb-2">
                             <span className="font-bold text-surface-200">{sc.name}</span>
                             <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${sc.impact === 'HIGH' || sc.impact === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>{sc.impact} Risk</span>
                           </div>
                           <p className="text-sm text-surface-400">{sc.reasoning}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               {/* Right Column */}
               <div className="space-y-8">
                 {/* Evidence */}
                 <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8">
                   <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                     <Search className="w-5 h-5 text-indigo-400" /> Evidence Verification
                   </h4>
                   <div className="space-y-4">
                     {Array.isArray(evidence) && evidence.slice(0, 4).map((claim, idx) => (
                       <div key={idx} className="flex items-start gap-3 bg-surface-800/30 p-4 rounded-xl border border-surface-700/30">
                         {claim.isSupported ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                         <div>
                           <p className="text-sm text-surface-200 mb-1">{claim.claim}</p>
                           <p className="text-[10px] text-surface-500 uppercase tracking-wider font-bold">Source: {claim.source || 'Unknown'}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Next Actions (from Roadmap) */}
                 {learningRoadmap && (
                   <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8">
                     <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Immediate Next Actions</h4>
                     <div className="space-y-3">
                       {decision?.nextActions?.slice(0, 3).map((action, idx) => (
                         <div key={idx} className="flex items-center gap-4 bg-primary-500/10 border border-primary-500/20 p-4 rounded-xl group cursor-pointer hover:bg-primary-500/20 transition-colors">
                           <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold">{idx + 1}</div>
                           <p className="text-sm text-white font-medium flex-1">{action}</p>
                           <ArrowRight className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                       ))}
                     </div>
                     <Link to="/progress" className="block w-full mt-6 py-3 text-center rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-bold transition-colors">
                       View Full Roadmap
                     </Link>
                   </div>
                 )}
               </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Analysis;
