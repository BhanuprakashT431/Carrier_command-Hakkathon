import React, { useEffect, useRef } from 'react';

const AGENTS = [
  { name: 'Profile Analyzer', role: 'Ingests resume & history', angle: 0 },
  { name: 'Market Intelligence', role: 'Real-time job data', angle: 40 },
  { name: 'Skill Gap Engine', role: 'Identifies missing skills', angle: 80 },
  { name: 'Goal Aligner', role: 'Matches with ambitions', angle: 120 },
  { name: 'Adversarial Agent', role: 'Stress-tests scenarios', angle: 160 },
  { name: 'Evidence Verifier', role: 'Validates claims', angle: 200 },
  { name: 'Simulation Engine', role: 'Runs what-if futures', angle: 240 },
  { name: 'Recommendation Synth', role: 'Builds adaptive roadmap', angle: 280 },
  { name: 'Master Orchestrator', role: 'Final decision logic', angle: 320 }
];

export default function NineAgentIntelligence() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.remove('reveal-hidden');
          sectionRef.current.classList.add('reveal-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-surface-950 overflow-hidden transition-colors duration-500" id="intelligence">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-4 transition-colors">
            One Profile. Nine Specialized Agents.<br/>
            <span className="text-primary-600 dark:text-primary-400">One Clear Career Strategy.</span>
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 transition-colors">
            Our pipeline doesn't just pass your data to an LLM. It routes it through a specialized multi-agent network that challenges and verifies every assumption.
          </p>
        </div>

        <div ref={sectionRef} className="reveal-hidden relative w-full max-w-4xl mx-auto aspect-square sm:aspect-[4/3] lg:aspect-[16/9] flex items-center justify-center mt-12">
          
          {/* Center Output Node */}
          <div className="absolute z-30 flex flex-col items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 text-white shadow-xl shadow-primary-500/40 dark:shadow-primary-500/20 animate-pulse-glow transition-colors">
            <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-xs uppercase text-center leading-tight">Verified<br/>Strategy</span>
          </div>

          {/* Lines & Nodes */}
          {AGENTS.map((agent, i) => {
            const angleRad = (agent.angle * Math.PI) / 180;
            // responsive radius calculation (roughly 40% of container width on desktop)
            const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 250;
            
            const x = Math.sin(angleRad) * radius;
            const y = -Math.cos(angleRad) * radius;

            return (
              <React.Fragment key={i}>
                {/* Connection Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                  <line 
                    x1="50%" y1="50%" 
                    x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} 
                    stroke="url(#agentGradient)" 
                    strokeWidth="2" 
                    strokeDasharray="4 6"
                    className="animate-signal-travel opacity-70 dark:opacity-40 transition-opacity"
                  />
                </svg>

                {/* Node */}
                <div 
                  className="absolute z-20 w-12 h-12 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-lg flex items-center justify-center group hover:scale-110 hover:border-primary-400 dark:hover:border-primary-500 transition-all cursor-default"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div className="w-3 h-3 rounded-full bg-primary-500 group-hover:bg-purple-500 transition-colors animate-node-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-900 dark:bg-surface-700 text-white text-xs py-1.5 px-3 rounded-lg w-32 text-center pointer-events-none shadow-lg">
                    <div className="font-bold mb-0.5">{agent.name}</div>
                    <div className="text-surface-300 dark:text-surface-200 text-[10px]">{agent.role}</div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <svg className="absolute inset-0 w-0 h-0">
            <defs>
              <linearGradient id="agentGradient">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

        </div>
      </div>
    </section>
  );
}
