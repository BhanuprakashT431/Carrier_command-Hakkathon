import React from 'react';

const DecisionTrace = ({ results, stressTest, evidence, decision }) => {
  const steps = [
    { id: 'profile', label: 'Profile', icon: '👤', summary: 'Analyzed User Profile' },
    { id: 'gaps', label: 'Gaps', icon: '⚡', summary: results?.skillGaps ? `${results.skillGaps.length} gaps identified` : 'Analyzing...' },
    { id: 'market', label: 'Market', icon: '📈', summary: results?.marketInfo ? 'Market data integrated' : 'Pending...' },
    { id: 'risk', label: 'Risk', icon: '⚠️', summary: 'Risks assessed' },
    { id: 'stress', label: 'Stress', icon: '🤺', summary: stressTest ? `${stressTest.scenarios?.length} scenarios run` : 'Pending...' },
    { id: 'evidence', label: 'Evidence', icon: '🔎', summary: evidence ? `${evidence.claims?.length} claims verified` : 'Pending...' },
    { id: 'final', label: 'Final Decision', icon: '⚖️', summary: decision ? 'Resolved' : 'Pending...' },
  ];

  return (
    <section className="bg-white border border-surface-200 shadow-sm rounded-2xl p-6 md:col-span-2 overflow-hidden w-full">
      <h2 className="text-xl font-bold text-surface-900 mb-8 flex items-center gap-2">
        <span>🔄</span> Decision Trace Pipeline
      </h2>
      <div className="flex flex-wrap md:flex-nowrap items-start justify-between relative gap-4">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-surface-200 z-0"></div>
        
        {steps.map((step, idx) => {
          const isPending = step.summary.includes('Pending') || step.summary.includes('Analyzing...');
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center flex-1 min-w-[80px]">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 border-2 transition-colors duration-500 shadow-sm
                ${isPending
                  ? 'bg-surface-50 border-surface-200 text-surface-400' 
                  : 'bg-primary-50 border-primary-500 text-primary-600'}`}>
                {step.icon}
              </div>
              <div className="text-sm font-bold text-surface-900 text-center">{step.label}</div>
              <div className="text-[10px] text-surface-500 font-medium text-center mt-1 max-w-[80px] leading-tight">{step.summary}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DecisionTrace;
