import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [liveScore, setLiveScore] = useState(92);
  const [liveProgress, setLiveProgress] = useState(78);
  const [riskAction, setRiskAction] = useState("Generating Pivot...");
  
  useEffect(() => {
    setMounted(true);
    
    const interval = setInterval(() => {
      setLiveScore(Math.floor(Math.random() * 11) + 88); // 88 to 98
      setLiveProgress(Math.floor(Math.random() * 26) + 70); // 70 to 95
      const actions = ["Generating Pivot...", "Re-routing Strategy...", "Analyzing Fallback...", "Optimizing Path..."];
      setRiskAction(actions[Math.floor(Math.random() * actions.length)]);
    }, 1800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[720px] lg:min-h-[820px] flex items-center justify-center pt-24 pb-32 px-4 sm:px-6 lg:px-8 z-10 transition-colors duration-500">
      <div className="mx-auto max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Content */}
        <div className={`flex flex-col items-center text-center lg:items-start lg:text-left z-20 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50/80 dark:bg-primary-900/30 border border-primary-200/50 dark:border-primary-500/20 px-3 py-1.5 text-[11px] font-bold text-primary-700 dark:text-primary-300 uppercase tracking-[0.2em] mb-8 shadow-sm backdrop-blur-sm transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Powered by Multi-Agent AI
          </div>

          {/* Headline */}
          <h1 className="text-[40px] leading-[1.1] sm:text-[56px] lg:text-[72px] xl:text-[80px] font-[800] text-surface-900 dark:text-white tracking-tight mb-6 transition-colors">
            Build a Career Strategy <br className="hidden lg:block"/>
            That <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-purple-500 to-blue-500 dark:from-primary-400 dark:via-purple-400 dark:to-blue-400 animate-gradient-shift">Adapts With You.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-surface-500 dark:text-surface-300 max-w-2xl mb-10 leading-relaxed font-medium transition-colors">
            Career Command Center combines multi-agent AI, evidence verification, adversarial stress testing, and adaptive learning to help you make better career decisions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/auth/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 text-white font-bold text-base shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-300">
                Build My Career Strategy →
              </button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-200 font-bold text-base hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-surface-700 transition-all duration-300">
                Explore How It Works
              </button>
            </a>
          </div>
        </div>

        {/* Right: AI Processing Visualization */}
        <div className={`relative z-20 w-full max-w-[500px] mx-auto aspect-square flex justify-center items-center transition-all duration-1000 delay-300 transform ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          
          {/* Background Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 opacity-20 dark:opacity-30 filter blur-[80px] animate-pulse"></div>
          </div>

          {/* Main Center Card */}
          <div className="relative z-20 w-80 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200 dark:border-surface-700 rounded-3xl p-6 shadow-2xl shadow-primary-900/10 dark:shadow-black/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-inner border border-white/20">
                JD
              </div>
              <div>
                <div className="text-surface-900 dark:text-white font-extrabold text-lg leading-tight">John Doe</div>
                <div className="text-surface-500 dark:text-surface-400 text-sm font-medium">Product Manager</div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-primary-600 dark:text-primary-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Trajectory
                  </span>
                  <span className="text-surface-900 dark:text-white transition-all duration-300">{liveProgress}%</span>
                </div>
                <div className="h-2 w-full bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full relative transition-all duration-500 ease-out" style={{ width: `${liveProgress}%` }}>
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                 <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">Strategy</span>
                 <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50">Market Fit</span>
              </div>
            </div>
          </div>

          {/* Floating Element 1: Market Fit */}
          <div className="absolute top-[10%] right-[0%] z-30 animate-[float_4s_ease-in-out_infinite]">
            <div className="bg-white/95 dark:bg-surface-800/95 backdrop-blur-md border border-surface-200 dark:border-surface-700 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <div className="text-[10px] text-surface-500 dark:text-surface-400 font-bold uppercase tracking-wider">Market Demand</div>
                <div className="text-sm font-black text-surface-900 dark:text-white">Very High</div>
              </div>
            </div>
          </div>

          {/* Floating Element 2: Risk Agent */}
          <div className="absolute bottom-[20%] left-[-5%] z-30 animate-[float_5s_ease-in-out_infinite_1s]">
            <div className="bg-white/95 dark:bg-surface-800/95 backdrop-blur-md border border-surface-200 dark:border-surface-700 p-4 rounded-2xl shadow-xl flex flex-col gap-1.5">
               <div className="text-[10px] text-surface-500 dark:text-surface-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                 <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
                 Risk Detected
               </div>
               <div className="text-sm font-extrabold text-surface-900 dark:text-white">AI Automation</div>
               <div className="text-[11px] text-primary-600 dark:text-primary-400 font-bold mt-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded w-fit inline-block transition-all duration-300">{riskAction}</div>
            </div>
          </div>

          {/* Floating Element 3: Match Score */}
          <div className="absolute top-[65%] right-[-5%] z-30 animate-[float_4.5s_ease-in-out_infinite_0.5s]">
            <div className="bg-white/95 dark:bg-surface-800/95 backdrop-blur-md border border-surface-200 dark:border-surface-700 p-1 rounded-full shadow-xl flex flex-col items-center justify-center w-24 h-24 ring-4 ring-white/50 dark:ring-surface-800/50">
               <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 transition-all duration-300">{liveScore}</div>
               <div className="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest mt-0.5">Score</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
