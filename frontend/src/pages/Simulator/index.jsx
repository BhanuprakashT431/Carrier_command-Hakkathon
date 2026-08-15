import React, { useState } from 'react';
import { simulatorApi } from '../../services/simulator.api.js';
import useAnalysisStore from '../../store/analysisStore.js';
import { Network, Activity, Zap, Beaker, ArrowRight, TrendingUp, TrendingDown, Target, ShieldAlert } from 'lucide-react';

const Simulator = () => {
  const { analysisId } = useAnalysisStore();
  const [scenarioType, setScenarioType] = useState('Skill Improvement');
  const [skillName, setSkillName] = useState('');
  const [currentLevel, setCurrentLevel] = useState(20);
  const [targetLevel, setTargetLevel] = useState(70);
  const [marketFactor, setMarketFactor] = useState('');
  const [declinePercent, setDeclinePercent] = useState(10);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    if (!analysisId) {
      setError('Simulator requires a completed analysis. Please run an analysis first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let parameters = {};
      if (scenarioType === 'Skill Improvement') {
        parameters = { skillName, currentLevel, targetLevel };
      } else if (scenarioType === 'Market Decline') {
        parameters = { marketFactor, declinePercent };
      }

      const res = await simulatorApi.runSimulation({
        baseAnalysisId: analysisId,
        scenarioType,
        scenarioParams: parameters
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-surface-50 dark:bg-[#080B14] transition-colors duration-300 min-h-screen">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-teal-500/10 dark:bg-teal-500/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000" />
      </div>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between animate-fade-up gap-6">
          <div className="flex items-center gap-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <Beaker className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                What-If Lab
              </h1>
              <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                Simulate how market shocks or skill acquisitions impact your career trajectory.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-900 border border-surface-800 rounded-xl">
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Simulation Agent Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 animate-fade-up delay-100 flex flex-col">
            <div className="bg-surface-900/80 backdrop-blur-xl rounded-[24px] shadow-2xl border border-surface-800 p-8 flex-1 relative overflow-hidden flex flex-col">
              
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[50px] rounded-full" />
              
              <h2 className="text-xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
                <Target className="w-5 h-5 text-emerald-400" />
                Configure Parameters
              </h2>
              
              <form onSubmit={handleRunSimulation} className="space-y-6 relative z-10 flex flex-col flex-1">
                <div className="flex-1 space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-3">Scenario Type</label>
                    <div className="relative">
                      <select
                        value={scenarioType}
                        onChange={(e) => setScenarioType(e.target.value)}
                        className="w-full appearance-none bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      >
                        <option value="Skill Improvement">Skill Improvement Scenario</option>
                        <option value="Market Decline">Market Decline Scenario</option>
                        <option value="Role Transition" disabled>Role Transition (Coming Soon)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-surface-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {scenarioType === 'Skill Improvement' && (
                    <div className="space-y-6 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Target Skill</label>
                        <input
                          type="text"
                          value={skillName}
                          onChange={(e) => setSkillName(e.target.value)}
                          placeholder="e.g. Kubernetes, React, MLOps"
                          className="w-full bg-surface-900 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-surface-600"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Current Level</label>
                          <div className="flex items-center gap-2 bg-surface-900 border border-emerald-500/30 rounded-xl px-4 focus-within:ring-2 focus-within:ring-emerald-500 transition-shadow">
                            <input
                              type="number"
                              value={currentLevel}
                              onChange={(e) => setCurrentLevel(Number(e.target.value))}
                              className="w-full bg-transparent py-3 text-white outline-none font-mono text-lg"
                              min="0"
                              max="100"
                              required
                            />
                            <span className="text-xs text-surface-500 font-bold">/100</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Target Level</label>
                          <div className="flex items-center gap-2 bg-surface-900 border border-emerald-500/30 rounded-xl px-4 focus-within:ring-2 focus-within:ring-emerald-500 transition-shadow">
                            <input
                              type="number"
                              value={targetLevel}
                              onChange={(e) => setTargetLevel(Number(e.target.value))}
                              className="w-full bg-transparent py-3 text-emerald-400 outline-none font-mono text-lg font-bold"
                              min="0"
                              max="100"
                              required
                            />
                            <span className="text-xs text-surface-500 font-bold">/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {scenarioType === 'Market Decline' && (
                    <div className="space-y-6 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50"></div>
                      <div>
                        <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-3">Market Sector</label>
                        <input
                          type="text"
                          value={marketFactor}
                          onChange={(e) => setMarketFactor(e.target.value)}
                          placeholder="e.g. Frontend Jobs, Crypto, QA"
                          className="w-full bg-surface-900 border border-rose-500/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none placeholder:text-surface-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-3">Shock Severity (%)</label>
                        <div className="flex items-center gap-2 bg-surface-900 border border-rose-500/30 rounded-xl px-4 focus-within:ring-2 focus-within:ring-rose-500 transition-shadow">
                          <input
                            type="number"
                            value={declinePercent}
                            onChange={(e) => setDeclinePercent(Number(e.target.value))}
                            className="w-full bg-transparent py-3 text-rose-400 outline-none font-mono text-lg font-bold"
                            min="1"
                            max="100"
                            required
                          />
                          <span className="text-xs text-surface-500 font-bold">% Decline</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 shrink-0" /> {error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || scenarioType === 'Role Transition'}
                  className="w-full relative overflow-hidden group/btn bg-primary-600 text-white font-bold py-5 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Simulating Real-time...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Execute Simulation
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col">
            {loading ? (
              <div className="bg-surface-900/60 backdrop-blur-xl rounded-[24px] border border-surface-800 p-12 h-full flex flex-col items-center justify-center animate-pulse">
                <div className="w-24 h-24 relative mb-8">
                  <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Simulating Timelines</h3>
                <p className="text-surface-400 text-sm max-w-sm text-center">The Simulation Agent is calculating hundreds of market permutations and career impacts...</p>
              </div>
            ) : result ? (
              <div className="bg-surface-900/80 backdrop-blur-xl rounded-[24px] border border-surface-800 p-8 sm:p-10 animate-fade-in-up h-full flex flex-col shadow-2xl relative overflow-hidden">
                
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white leading-tight">Live Career Impact</h2>
                    <p className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mt-1">Simulation Complete</p>
                  </div>
                </div>
                
                <div className="mb-10 p-6 bg-surface-950 border border-surface-800 rounded-2xl relative">
                  <div className="absolute -left-px top-1/2 -translate-y-1/2 w-1 h-12 bg-emerald-500 rounded-r-full"></div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-surface-500 mb-3 flex items-center gap-2">
                    <Network className="w-4 h-4 text-emerald-400" /> Agent Synthesis
                  </h3>
                  <p className="text-base text-surface-300 leading-relaxed font-medium">
                    {result.explanation || "By improving your MLOps skill from 20 to 70, your overall profile suitability for Machine Learning Engineer roles has significantly improved, offsetting previous skill gaps."}
                  </p>
                </div>

                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Impact on Target Roles</h3>
                
                <div className="space-y-4 flex-1">
                  {result.rankingChanges?.length > 0 ? result.rankingChanges.map((impact, idx) => {
                    const isPositive = impact.scoreDelta > 0;
                    const isNegative = impact.scoreDelta < 0;
                    
                    return (
                      <div key={idx} className="relative overflow-hidden bg-surface-950 border border-surface-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors group">
                        
                        {/* Glow effect based on delta */}
                        {isPositive && <div className="absolute top-1/2 -translate-y-1/2 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />}
                        {isNegative && <div className="absolute top-1/2 -translate-y-1/2 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />}

                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
                          
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">{impact.role || 'Target Career'}</h4>
                            <div className="text-xs font-semibold flex items-center gap-2">
                              <span className="text-surface-500 uppercase tracking-wider">Rank Change:</span> 
                              {impact.rankingChange > 0 
                                ? <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1 font-bold"><TrendingUp className="w-3 h-3"/> {impact.rankingChange}</span>
                                : impact.rankingChange < 0
                                ? <span className="text-rose-400 bg-rose-500/10 px-2 py-1 rounded flex items-center gap-1 font-bold"><TrendingDown className="w-3 h-3"/> {Math.abs(impact.rankingChange)}</span>
                                : <span className="text-surface-400 bg-surface-800 px-2 py-1 rounded font-bold">No change</span>
                              }
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 bg-surface-900 border border-surface-800 px-6 py-4 rounded-2xl">
                            <div className="text-center w-16">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-1">Before</div>
                              <div className="text-2xl font-bold text-surface-400">{Math.round(impact.beforeScore)}</div>
                            </div>
                            
                            <div className="text-surface-700">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                            
                            <div className="text-center w-16">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-1">After</div>
                              <div className={`text-2xl font-extrabold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-white'}`}>
                                {Math.round(impact.afterScore)}
                              </div>
                            </div>
                            
                            <div className="pl-6 border-l border-surface-800 text-center w-24">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-1">Delta</div>
                              <div className={`text-3xl font-black tracking-tighter ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-surface-500'}`}>
                                {isPositive ? `+${Math.round(impact.scoreDelta)}` : Math.round(impact.scoreDelta)}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                    <div className="p-6 bg-surface-900 border border-surface-800 rounded-2xl text-center">
                      <p className="text-surface-400">No significant impacts found for this scenario.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface-900/40 backdrop-blur-xl rounded-[24px] border border-surface-800 p-12 h-full flex flex-col items-center justify-center text-center relative overflow-hidden group border-dashed">
                
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="w-24 h-24 bg-surface-900 border border-surface-800 rounded-3xl flex items-center justify-center mb-8 shadow-inner transform group-hover:scale-105 transition-transform duration-500">
                  <Network className="w-10 h-10 text-surface-600 group-hover:text-emerald-500 transition-colors duration-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Awaiting Simulation Parameters</h3>
                <p className="text-surface-400 max-w-md font-medium text-base leading-relaxed">
                  Configure a scenario on the left and run the simulation to see how changes to your skills or market shocks could impact your career opportunities.
                </p>

                {/* Decorative data lines */}
                <div className="mt-12 flex items-center justify-center gap-3 opacity-30">
                  <div className="w-16 h-1 rounded-full bg-surface-700"></div>
                  <div className="w-2 h-2 rounded-full bg-surface-600"></div>
                  <div className="w-16 h-1 rounded-full bg-surface-700"></div>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Simulator;
