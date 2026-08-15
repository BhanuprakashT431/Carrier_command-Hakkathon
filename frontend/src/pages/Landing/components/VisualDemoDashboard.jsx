import React, { useEffect, useRef } from 'react';

const steps = [
  { label: 'Profile Input', sub: 'Resume & Skills', active: true },
  { label: 'Gap Analysis', sub: 'Market Requirements', active: true },
  { label: 'Stress Test', sub: 'Adversarial Agent', active: true },
  { label: 'Evidence Check', sub: 'Claim Verification', active: true },
  { label: 'Career Strategy', sub: 'Adaptive Roadmap', active: true }
];

export default function VisualDemoDashboard() {
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
    <section className="py-24 bg-surface-50 dark:bg-surface-900 relative z-10 overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-4 transition-colors">
            From Raw Profile to Verified Strategy
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 transition-colors">
            Watch the intelligence pipeline process a candidate in real-time.
          </p>
        </div>

        <div ref={sectionRef} className="reveal-hidden relative max-w-5xl mx-auto bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-xl p-8 overflow-x-auto transition-colors">
          
          <div className="min-w-[800px] relative">
            {/* The line */}
            <div className="absolute top-[45px] left-[50px] right-[50px] h-1 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 w-full animate-signal-travel" style={{ strokeDasharray: '200', strokeDashoffset: '200' }}></div>
            </div>

            {/* The steps */}
            <div className="relative flex justify-between">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center w-32 relative group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10 bg-white dark:bg-surface-900 border-2 transition-all duration-300 group-hover:scale-110 ${step.active ? 'border-primary-500 shadow-[0_0_15px_rgba(99,91,255,0.3)] dark:shadow-[0_0_15px_rgba(99,91,255,0.5)]' : 'border-surface-200 dark:border-surface-700'}`}>
                    <div className={`w-4 h-4 rounded-full ${step.active ? 'bg-primary-500 animate-pulse' : 'bg-surface-200 dark:bg-surface-700'}`}></div>
                  </div>
                  <div className="text-sm font-bold text-surface-900 dark:text-white text-center transition-colors">{step.label}</div>
                  <div className="text-[10px] font-medium text-surface-400 text-center mt-1 uppercase tracking-wider">{step.sub}</div>
                </div>
              ))}
            </div>

            {/* Output Panel */}
            <div className="mt-12 p-6 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider transition-colors">Final Analysis Output</div>
                <div className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded transition-colors">Analysis Complete</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700 transition-colors">
                  <div className="text-xs text-surface-400 font-medium mb-1">Target Role</div>
                  <div className="text-sm font-bold text-surface-900 dark:text-white transition-colors">Senior Cloud Architect</div>
                </div>
                <div className="bg-white dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700 transition-colors">
                  <div className="text-xs text-surface-400 font-medium mb-1">Suitability</div>
                  <div className="text-xl font-black text-primary-600 dark:text-primary-400 transition-colors">92/100</div>
                </div>
                <div className="bg-white dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700 transition-colors">
                  <div className="text-xs text-surface-400 font-medium mb-1">Skill Gap</div>
                  <div className="text-sm font-bold text-orange-600 dark:text-orange-400 transition-colors">Kubernetes Security (High)</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
