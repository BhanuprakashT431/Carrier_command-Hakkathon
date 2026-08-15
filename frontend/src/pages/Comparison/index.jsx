import React, { useState, useEffect } from 'react';
import { comparisonApi } from '../../services/comparison.api.js';
import useAnalysisStore from '../../store/analysisStore.js';
import { 
  GitMerge, 
  Target, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  BookOpen, 
  GraduationCap,
  Network
} from 'lucide-react';

const Comparison = () => {
  const { analysisId, fetchLatestAnalysis, decision } = useAnalysisStore();
  const [targetRoles, setTargetRoles] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!analysisId) {
      fetchLatestAnalysis();
    }
  }, [analysisId, fetchLatestAnalysis]);

  useEffect(() => {
    if (decision?.alternativeCareers) {
      const top3 = decision.alternativeCareers.slice(0, 3).map(c => c.career || c.title);
      while (top3.length < 3) top3.push('');
      setTargetRoles(top3);
    }
  }, [decision]);

  const handleRunComparison = async (e) => {
    e.preventDefault();
    if (!analysisId) {
      setError('Please run an analysis first.');
      return;
    }

    const validRoles = targetRoles.filter(r => r.trim() !== '');
    if (validRoles.length < 2) {
      setError('Please provide at least 2 roles to compare.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await comparisonApi.runComparison({ analysisId, careers: validRoles });
      setResult({
        careers: res.data.comparison,
        recommendations: res.data.recommendations
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate comparison. Please check if you have a valid analysis.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (index, value) => {
    const newRoles = [...targetRoles];
    newRoles[index] = value;
    setTargetRoles(newRoles);
  };

  const DimensionConfig = {
    suitability: { icon: Target, label: 'Suitability Match', color: 'text-blue-500' },
    stressAdjusted: { icon: Activity, label: 'Stress Adjusted Score', color: 'text-rose-500' },
    risk: { icon: ShieldAlert, label: 'Risk Score', color: 'text-amber-500' },
    robustness: { icon: ShieldCheck, label: 'Robustness', color: 'text-emerald-500' },
    stability: { icon: TrendingUp, label: 'Market Stability', color: 'text-indigo-500' },
    growthOpportunity: { icon: Search, label: 'Growth Opportunity', color: 'text-fuchsia-500' },
    skillGap: { icon: BookOpen, label: 'Skill Gap Magnitude', color: 'text-orange-500' }
  };

  const MetricRow = ({ metricKey, isScore = false, invertColors = false }) => {
    const config = DimensionConfig[metricKey];
    const Icon = config.icon;

    return (
      <div className="flex flex-col md:flex-row group border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
        <div className="w-full md:w-72 p-4 md:p-6 bg-surface-900/40 flex items-center gap-4">
          <div className={`p-2 rounded-lg bg-surface-800/50 ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-white">{config.label}</span>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-0">
          {result.careers.map((c, idx) => {
            const val = c[metricKey];
            
            let colorClass = "text-surface-300";
            if (isScore) {
              if (val >= 80) colorClass = "text-emerald-400 font-bold";
              else if (val >= 60) colorClass = "text-amber-400 font-bold";
              else colorClass = "text-rose-400 font-bold";
            } else if (val === 'High' || val === 'Low' || val === 'Medium') {
               const isGood = invertColors ? val === 'Low' : val === 'High';
               const isBad = invertColors ? val === 'High' : val === 'Low';
               if (isGood) colorClass = "text-emerald-400 font-bold";
               else if (isBad) colorClass = "text-rose-400 font-bold";
               else colorClass = "text-amber-400 font-bold";
            }

            return (
              <div key={idx} className="p-4 md:p-6 border-l border-surface-800/50 flex flex-col justify-center items-center">
                <span className={`text-base md:text-lg ${colorClass}`}>
                  {val}
                  {isScore && <span className="text-xs text-surface-500 font-semibold ml-1">/ 100</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full bg-surface-50 dark:bg-[#080B14] transition-colors duration-300 min-h-screen pb-20">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob" />
        <div className="absolute bottom-40 left-20 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000" />
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between animate-fade-up gap-6">
          <div className="flex items-center gap-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <GitMerge className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                Career Matrix
              </h1>
              <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                Multi-dimensional trajectory comparison.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-900 border border-surface-800 rounded-xl">
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
             <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Swarm Comparison Active</span>
          </div>
        </div>
        
        <div className="bg-surface-900/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-surface-800 p-8 sm:p-10 mb-12 animate-fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                Target Trajectories
              </h2>
              <p className="text-sm text-surface-400">Select 3 careers to evaluate concurrently.</p>
            </div>
            
            <button
              onClick={handleRunComparison}
              disabled={loading}
              className="relative overflow-hidden group/btn bg-primary-600 text-white font-bold px-10 py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Analyzing Matrix...
                  </>
                ) : (
                  <>
                    <GitMerge className="w-5 h-5" />
                    Run Swarm Comparison
                  </>
                )}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targetRoles.map((role, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative bg-surface-950 border border-surface-800 rounded-2xl p-2 flex items-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold mr-3 shrink-0 border border-blue-500/20">
                    0{idx + 1}
                  </div>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => handleRoleChange(idx, e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-base font-semibold text-white px-2 py-3 placeholder:text-surface-600"
                    placeholder="e.g. Data Scientist"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {result ? (
          <div className="space-y-12 animate-fade-in-up">
            
            {/* Adaptive Recommendations */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Activity className="w-5 h-5 text-indigo-400" />
                Adaptive Recommendations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-amber-500/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl rounded-full group-hover:bg-amber-500/20 transition-colors" />
                  <div className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <span className="text-amber-400 bg-amber-500/10 p-1.5 rounded-lg">🏆</span> Best Overall
                  </div>
                  <div className="text-sm font-extrabold text-white leading-snug">{result.recommendations.bestOverall}</div>
                </div>

                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-fuchsia-500/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 blur-2xl rounded-full group-hover:bg-fuchsia-500/20 transition-colors" />
                  <div className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <span className="text-fuchsia-400 bg-fuchsia-500/10 p-1.5 rounded-lg">🛡️</span> Most Robust
                  </div>
                  <div className="text-sm font-extrabold text-white leading-snug">{result.recommendations.mostRobust}</div>
                </div>

                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full group-hover:bg-emerald-500/20 transition-colors" />
                  <div className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <span className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg">📉</span> Lowest Risk
                  </div>
                  <div className="text-sm font-extrabold text-white leading-snug">{result.recommendations.lowestRisk}</div>
                </div>

                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-cyan-500/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full group-hover:bg-cyan-500/20 transition-colors" />
                  <div className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <span className="text-cyan-400 bg-cyan-500/10 p-1.5 rounded-lg">⚡</span> Fastest Readiness
                  </div>
                  <div className="text-sm font-extrabold text-white leading-snug">{result.recommendations.fastestReadiness}</div>
                </div>

                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-orange-500/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-2xl rounded-full group-hover:bg-orange-500/20 transition-colors" />
                  <div className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <span className="text-orange-400 bg-orange-500/10 p-1.5 rounded-lg">🔄</span> Best Alternative
                  </div>
                  <div className="text-sm font-extrabold text-white leading-snug">{result.recommendations.bestAlternative}</div>
                </div>

                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/20 transition-colors" />
                  <div className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <span className="text-blue-400 bg-blue-500/10 p-1.5 rounded-lg">📈</span> Highest Growth
                  </div>
                  <div className="text-sm font-extrabold text-white leading-snug">{result.recommendations.highestGrowth || 'N/A'}</div>
                </div>

              </div>
            </div>

            {/* Comparison Matrix Table */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Network className="w-5 h-5 text-slate-400" />
                  Dimensional Matrix
                </h2>
              </div>
              
              <div className="bg-surface-900/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-surface-800 overflow-hidden relative">
                
                {/* Table Header */}
                <div className="flex flex-col md:flex-row border-b border-surface-800 bg-surface-950/80">
                  <div className="w-full md:w-72 p-6 hidden md:flex items-center">
                    <span className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Evaluation Dimension</span>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-0">
                    {result.careers.map((c, idx) => (
                      <div key={idx} className="p-4 md:p-6 border-l border-surface-800/50 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0"></div>
                        <div className="text-[10px] text-surface-500 font-bold uppercase tracking-widest mb-2">Option 0{idx + 1}</div>
                        <span className="text-sm md:text-base font-extrabold text-white text-center leading-tight">
                          {c.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col">
                  <MetricRow metricKey="suitability" isScore={true} />
                  <MetricRow metricKey="stressAdjusted" isScore={true} />
                  <MetricRow metricKey="robustness" isScore={true} />
                  <MetricRow metricKey="stability" isScore={true} />
                  <MetricRow metricKey="risk" isScore={true} invertColors={true} />
                  <MetricRow metricKey="skillGap" isScore={false} invertColors={true} />
                  <MetricRow metricKey="growthOpportunity" />
                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="bg-surface-900/40 backdrop-blur-xl rounded-[32px] border border-surface-800 border-dashed p-16 flex flex-col items-center justify-center text-center mt-8 group relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
             
             <div className="w-24 h-24 bg-surface-900 border border-surface-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner transform group-hover:scale-105 transition-transform duration-500">
                <GitMerge className="w-10 h-10 text-surface-600 group-hover:text-blue-500 transition-colors duration-500" />
             </div>
             
             <h3 className="text-2xl font-bold text-white mb-3">Matrix Awaiting Execution</h3>
             <p className="text-surface-400 max-w-md font-medium text-base">
                Define up to 3 target roles above and deploy the agent swarm to compute a multi-dimensional comparative analysis.
             </p>
             {error && <p className="text-rose-400 mt-4 bg-rose-500/10 p-2 rounded">{error}</p>}
          </div>
        )}
      </main>
    </div>
  );
};

export default Comparison;
