import React, { useEffect } from 'react';

import useProgressStore from '../../store/progressStore';
import { Target, TrendingUp, Activity, CheckCircle, Clock } from 'lucide-react';

const ProgressPage = () => {
  const { 
    careerReadiness, 
    skillProgress, 
    milestones, 
    weeklyPlan,
    loadReadiness,
    loadSkillProgress,
    loadMilestones,
    loadWeeklyPlan,
    completeMilestone
  } = useProgressStore();

  useEffect(() => {
    loadReadiness();
    loadSkillProgress();
    loadMilestones();
    loadWeeklyPlan();
  }, [loadReadiness, loadSkillProgress, loadMilestones, loadWeeklyPlan]);

  const readiness = careerReadiness || { score: 0, breakdown: { skills: 0, learning: 0, projects: 0, certs: 0, experience: 0 } };
  const skills = skillProgress || [];
  
  const isLoading = !careerReadiness && skills.length === 0 && !milestones;

  return (
    <div className="flex-1 w-full bg-[#080B14] transition-colors duration-300 min-h-screen pb-20">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-lighten animate-blob" />
        <div className="absolute top-60 left-0 w-[400px] h-[400px] bg-primary-500/10 blur-[120px] rounded-full mix-blend-lighten animate-blob animation-delay-2000" />
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Live Tracking
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Progression Matrix
            </h1>
            <p className="text-surface-400 text-lg max-w-2xl font-medium">
              Monitor your skill acquisition, active milestones, and real-time market readiness.
            </p>
          </div>
          
          <button className="relative overflow-hidden group/btn bg-surface-900 border border-surface-800 text-white font-bold px-8 py-3 rounded-xl shadow-sm hover:border-primary-500/50 transition-all duration-300 w-fit">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-primary-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 text-primary-400" />
              Recalibrate
            </span>
          </button>
        </div>

        {/* Section 1: Career Readiness Dashboard */}
        <section className="mb-10 animate-fade-in-up">
          <div className="bg-surface-900/80 backdrop-blur-xl border border-surface-800 shadow-2xl rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center relative z-10">
              
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-primary-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
                <div className="absolute inset-0 bg-surface-950 rounded-full m-2 shadow-inner" />
                <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-xl" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-surface-800/50" strokeWidth="6" fill="none" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="url(#progress-gradient)" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray={`${251.2 * (readiness.score / 100)} 251.2`} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <span className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-primary-400 drop-shadow-sm">{readiness.score}</span>
                  <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mt-1">Readiness</span>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Readiness Synthesis</h3>
                  <p className="text-sm text-surface-400 font-medium leading-relaxed">
                    System-generated assessment based on skill gap closures, milestone completions, and market demand alignment.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: 'Skill Coverage', value: readiness.breakdown.skills, color: 'bg-primary-500', icon: '⚡' },
                    { label: 'Learning Progress', value: readiness.breakdown.learning, color: 'bg-purple-500', icon: '📚' },
                    { label: 'Project Evidence', value: readiness.breakdown.projects, color: 'bg-emerald-500', icon: '🏗️' },
                    { label: 'Certifications', value: readiness.breakdown.certs, color: 'bg-amber-500', icon: '🎓' },
                    { label: 'Experience', value: readiness.breakdown.experience, color: 'bg-rose-500', icon: '💼' }
                  ].map((item, idx) => (
                    <div key={item.label} className="group">
                      <div className="flex justify-between text-sm mb-2 items-center">
                        <span className="text-surface-300 font-bold flex items-center gap-2">
                          <span className="opacity-70">{item.icon}</span>
                          {item.label}
                        </span>
                        <span className="text-white font-extrabold">{item.value}%</span>
                      </div>
                      <div className="w-full bg-surface-800/50 h-2.5 rounded-full overflow-hidden shadow-inner border border-surface-700/30">
                        <div className={`${item.color} h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out`} style={{ width: `${item.value}%` }}>
                           <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 w-full h-full transform -skew-x-12 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Skill Progress Tracker */}
        <section className="mb-10 animate-fade-in-up delay-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Target className="w-5 h-5 text-primary-400" />
              Skill Acquisition Tracker
            </h2>
            <button className="text-sm bg-surface-900 border border-surface-800 hover:border-primary-500/50 hover:bg-surface-800/50 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-400" />
              Log Progress
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.length > 0 ? (
              skills.map((skill, i) => {
                const delta = skill.current - skill.previous;
                const isPositive = delta > 0;
                
                return (
                  <div key={i} className="bg-surface-950 border border-surface-800 shadow-xl p-6 rounded-2xl hover:border-primary-500/50 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <h3 className="font-extrabold text-white text-lg">{skill.name}</h3>
                      {isPositive && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {delta}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-end gap-2 mb-3 relative z-10">
                      <span className="text-4xl font-extrabold text-white leading-none">{skill.current}</span>
                      <span className="text-sm font-bold text-surface-500 mb-1">/ 100</span>
                    </div>
                    
                    <div className="w-full bg-surface-800/80 h-2 rounded-full overflow-hidden shadow-inner border border-surface-700/50 relative z-10">
                      <div className="bg-gradient-to-r from-primary-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${skill.current}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-surface-950/50 border border-surface-800 border-dashed rounded-3xl backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-surface-900 flex items-center justify-center text-3xl mb-4 opacity-50 shadow-inner">
                  🛠️
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Awaiting Skill Data</h3>
                <p className="text-sm font-medium text-surface-500 max-w-sm text-center">Complete courses, projects, or assessments to begin tracking your technical proficiency.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 3 & 4 Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in-up delay-200">
          
          {/* Section 3: Learning Milestones */}
          <section className="xl:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Active Milestones
            </h2>
            
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
              {['PLANNED', 'IN_PROGRESS', 'COMPLETED'].map(status => {
                const phaseMilestones = (milestones || []).filter(m => m.status === status);
                
                let headerColor = 'text-surface-400';
                if (status === 'IN_PROGRESS') headerColor = 'text-primary-400';
                if (status === 'COMPLETED') headerColor = 'text-emerald-400';

                return (
                  <div key={status} className="min-w-[300px] sm:min-w-[340px] snap-center bg-surface-900/60 backdrop-blur-xl border border-surface-800 shadow-xl rounded-[24px] p-5 flex flex-col h-full">
                    <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-5 flex items-center gap-2 ${headerColor}`}>
                      <span className={`w-2 h-2 rounded-full ${status === 'IN_PROGRESS' ? 'bg-primary-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]' : status === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-surface-600'}`} />
                      {status.replace('_', ' ')}
                    </h3>
                    
                    <div className="space-y-4 flex-1">
                      {phaseMilestones.length > 0 ? (
                        phaseMilestones.map((m, idx) => (
                          <div key={idx} className="bg-surface-950 border border-surface-800/80 p-5 rounded-2xl shadow-sm hover:border-surface-600 transition-colors group">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-2">Phase {m.phase || 1}</div>
                            <h4 className="text-white font-bold mb-3 leading-tight text-sm sm:text-base">{m.title}</h4>
                            
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-surface-800">
                              <span className="text-xs font-semibold text-surface-400 bg-surface-900 px-2.5 py-1 rounded-md border border-surface-800">{m.category}</span>
                              
                              {status === 'PLANNED' && (
                                <button className="text-[10px] font-bold uppercase tracking-widest bg-surface-800 text-white px-4 py-2 rounded-lg hover:bg-surface-700 transition-all border border-surface-700">Start</button>
                              )}
                              {status === 'IN_PROGRESS' && (
                                <button className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 px-4 py-2 rounded-lg shadow-sm transition-all">Complete</button>
                              )}
                              {status === 'COMPLETED' && (
                                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Done
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-sm font-medium text-surface-600 py-10 border border-surface-800 border-dashed rounded-2xl bg-surface-950/50">
                          Empty queue
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Weekly Action Plan */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              Action Plan
            </h2>
            
            <div className="bg-surface-900/80 backdrop-blur-xl border border-surface-800 shadow-2xl rounded-[24px] p-6 sm:p-8">
              
              <div className="flex justify-between items-center mb-8 border-b border-surface-800 pb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-surface-400 mb-1">Time Investment</div>
                  <div className="text-surface-300 font-bold">This Week</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-white leading-none">{weeklyPlan?.totalScheduled || 0} <span className="text-surface-500 text-lg">/ {weeklyPlan?.weeklyHours || 5}</span></div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-surface-400 mt-1">Hours Target</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {weeklyPlan?.days?.map((dayObj, idx) => {
                  const dayName = dayObj.day.substring(0, 3);
                  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'short' }) === dayName;
                  
                  return (
                    <div key={dayObj.day} className="flex gap-4 group">
                      <div className={`w-10 text-[11px] uppercase tracking-widest font-bold mt-3 ${isToday ? 'text-primary-400' : 'text-surface-500'}`}>
                        {dayName}
                      </div>
                      <div className="flex-1">
                        {dayObj.tasks.length > 0 ? dayObj.tasks.map((task, tIdx) => (
                          <div key={tIdx} className={`rounded-xl p-4 text-sm font-semibold mb-2 border transition-all duration-300 ${
                            isToday 
                              ? 'bg-primary-900/20 border-primary-500/30 text-primary-100 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                              : 'bg-surface-950 border-surface-800 text-surface-300 group-hover:border-surface-600'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span>{task.title}</span>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                isToday ? 'bg-primary-500/20 text-primary-300 border-primary-500/30' : 'bg-surface-900 text-surface-500 border-surface-800'
                              }`}>{task.estimatedHours}H</span>
                            </div>
                          </div>
                        )) : (
                          <div className="rounded-xl p-4 text-sm font-semibold mb-2 border bg-surface-950 border-surface-800 border-dashed text-surface-500/50">
                            No tasks scheduled
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </section>

        </div>

      </main>
    </div>
  );
};

export default ProgressPage;
