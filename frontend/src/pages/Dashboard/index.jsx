import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import useProfileStore from '../../store/profileStore.js';
import useProgressStore from '../../store/progressStore.js';
import useAnalysisStore from '../../store/analysisStore.js';
import ResumeUploader from '../../components/profile/ResumeUploader.jsx';
import AgentIntelligenceNetwork from '../../components/AgentIntelligenceNetwork.jsx';
import { Zap, Target, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { careerReadiness, loadReadiness } = useProgressStore();
  const { fetchLatestAnalysis, decision, results, learningRoadmap, status } = useAnalysisStore();

  const isProfileComplete = profile && profile.skills?.length > 0 && profile.preferences?.jobTitle;

  useEffect(() => {
    if (isProfileComplete) {
      loadReadiness();
      fetchLatestAnalysis();
    }
  }, [isProfileComplete, loadReadiness, fetchLatestAnalysis]);

  const targetRole = profile?.preferences?.jobTitle || 'N/A';
  const readinessScore = careerReadiness?.score || decision?.suitabilityScore || 0;
  
  // Real skill gaps from backend results (if available)
  const gaps = results?.skillGaps || decision?.skillGaps || [];
  let strongestSkill = "N/A";
  let biggestGap = "N/A";
  if (gaps.length > 0) {
    const sortedGaps = [...gaps].sort((a, b) => a.gapSize - b.gapSize);
    strongestSkill = sortedGaps[0].skillName || "N/A";
    biggestGap = sortedGaps[sortedGaps.length - 1].skillName || "N/A";
  }

  const marketSignal = decision?.riskScore < 30 ? 'Strong' : (decision?.riskScore < 70 ? 'Medium' : 'Weak');
  const recommendedRole = decision?.career || targetRole;
  const nextActions = decision?.nextActions || [];

  return (
    <div className="w-full flex-1 flex flex-col bg-surface-50 dark:bg-[#080B14] transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000" />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-up">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                Welcome back, {user?.email?.split('@')[0] || 'User'}
              </h1>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Agents Online
              </div>
            </div>
            <p className="text-surface-600 dark:text-surface-400 text-lg">
              Your Multi-Agent Career Intelligence system is ready.
            </p>
          </div>
        </div>

        {!isProfileComplete ? (
          <div className="mb-10 bg-surface-900/60 backdrop-blur-xl border border-surface-800 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-up delay-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-500/10 rounded-xl text-primary-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Your Career Intelligence Engine is Ready</h2>
                  <p className="text-surface-400">Upload your resume to activate the 9-agent system.</p>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-surface-800 pt-6">
              <ResumeUploader />
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-up delay-100">
            
            {/* Intelligence Overview Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Readiness Radial */}
              <div className="lg:col-span-1 bg-surface-900/60 backdrop-blur-xl border border-surface-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 mb-6 w-full text-left">Career Readiness</h3>
                <div className="relative w-40 h-40 flex items-center justify-center mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-800"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      strokeDasharray={`${(readinessScore * 100) / 100}, 100`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-white tracking-tighter">{readinessScore}%</span>
                  </div>
                </div>
                <p className="text-sm text-surface-400">Based on target: <span className="text-white font-medium">{targetRole}</span></p>
              </div>

              {/* AI Career Signal */}
              <div className="lg:col-span-2 bg-surface-900/60 backdrop-blur-xl border border-surface-800 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-400" /> AI Career Signal
                  </h3>
                  <Link to="/analysis" className="text-xs font-semibold text-primary-400 hover:text-primary-300">View Full Analysis &rarr;</Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700/50">
                    <p className="text-xs text-surface-400 mb-1">Strongest Skill</p>
                    <p className="font-bold text-white text-lg truncate">{strongestSkill}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700/50">
                    <p className="text-xs text-surface-400 mb-1">Biggest Gap</p>
                    <p className="font-bold text-rose-400 text-lg truncate">{biggestGap}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700/50">
                    <p className="text-xs text-surface-400 mb-1">Market Signal</p>
                    <p className="font-bold text-emerald-400 text-lg truncate">{marketSignal}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700/50">
                    <p className="text-xs text-surface-400 mb-1">Recommended Role</p>
                    <p className="font-bold text-primary-300 text-lg truncate" title={recommendedRole}>{recommendedRole}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-primary-300 font-semibold uppercase tracking-wider mb-1">Next Best Action</p>
                    <p className="text-white font-medium">Continue closing the {biggestGap} skill gap to improve market readiness.</p>
                  </div>
                  <Link to="/progress" className="shrink-0 p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 9-Agent Intelligence Network */}
            <div className="bg-surface-900/40 backdrop-blur-xl border border-surface-800/50 rounded-3xl p-8 pb-0">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">9-Agent Intelligence Network</h2>
                <p className="text-surface-400 max-w-2xl mx-auto">Your dedicated AI swarm continuously analyzing profile data, market conditions, and skill trajectories.</p>
              </div>
              <AgentIntelligenceNetwork mode="overview" />
            </div>

            {/* Next Best Actions */}
            {nextActions.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Next Best Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {nextActions.slice(0, 3).map((action, idx) => (
                    <div key={idx} className="bg-surface-900 border border-surface-800 hover:border-primary-500/50 transition-colors p-5 rounded-2xl flex flex-col justify-between group">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors">{action}</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-surface-800">
                        <Link to="/progress" className="text-primary-400 hover:text-primary-300 font-semibold text-sm">Start &rarr;</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
