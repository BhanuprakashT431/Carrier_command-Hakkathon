import React, { useEffect, useState } from 'react';

const radius = 140;
const AGENTS = [
  { id: 'profile', name: 'Profile', delay: 100 },
  { id: 'career', name: 'Career', delay: 600 },
  { id: 'skill', name: 'Skill Gap', delay: 1100 },
  { id: 'market', name: 'Market', delay: 1600 },
  { id: 'risk', name: 'Risk', delay: 2100 },
  { id: 'learning', name: 'Learning', delay: 2600 },
  { id: 'adversarial', name: 'Adversarial', delay: 3100 },
  { id: 'evidence', name: 'Evidence', delay: 3600 },
  { id: 'comparison', name: 'Comparison', delay: 4100 },
].map((agent, i, arr) => {
  const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
  return {
    ...agent,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
});

const INSIGHTS = [
  { top: '5%', left: '-10%', title: 'Skill Gap Detected', text: 'Python — 42%', delay: '0s' },
  { top: '20%', right: '-5%', title: 'Market Signal', text: 'Demand ↑ 18%', delay: '1s' },
  { bottom: '15%', left: '5%', title: 'Stress Test', text: '8/10 Scenarios Survived', delay: '2s' },
  { bottom: '5%', right: '10%', title: 'Career Score', text: '82 → 88', delay: '3s' },
];

export default function CareerIntelligenceEngine() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    // Loop the sequence every 10 seconds
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev >= 5 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center transition-colors duration-500">
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" className="dark:stop-color-primary-400 dark:stop-opacity-30" />
            <stop offset="50%" stopColor="#635BFF" stopOpacity="0.8" className="dark:stop-color-primary-500 dark:stop-opacity-90" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.2" className="dark:stop-color-primary-400 dark:stop-opacity-30" />
          </linearGradient>
        </defs>
        <g transform="translate(200, 200)">
          {AGENTS.map((agent) => (
            <line
              key={`line-${agent.id}`}
              x1="0"
              y1="0"
              x2={agent.x}
              y2={agent.y}
              stroke="url(#lineGrad)"
              strokeWidth="1.5"
              className="animate-pulse-line opacity-70 dark:opacity-40"
              strokeDasharray="4 4"
            />
          ))}
        </g>
      </svg>

      {/* Central Node */}
      <div className="absolute z-20 flex flex-col items-center justify-center w-24 h-24 bg-white dark:bg-surface-800 border-2 border-primary-500 dark:border-primary-600 rounded-full shadow-lg transition-colors">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs text-center shadow-inner transition-colors">
          Career Profile
        </div>
      </div>

      {/* Agent Nodes */}
      <div className="absolute z-10 w-full h-full flex items-center justify-center pointer-events-none">
        {AGENTS.map((agent, i) => {
          // Simple activation logic based on stage
          const isActive = activeStage >= Math.floor(i / 2);
          
          return (
            <div
              key={agent.id}
              className={`absolute flex flex-col items-center justify-center transition-all duration-700
                ${isActive ? 'opacity-100 scale-100 shadow-[0_0_15px_rgba(99,91,255,0.3)] dark:shadow-[0_0_15px_rgba(99,91,255,0.5)]' : 'opacity-40 scale-90'}
              `}
              style={{
                transform: `translate(${agent.x}px, ${agent.y}px) scale(${isActive ? 1 : 0.9})`,
              }}
            >
              <div className="w-12 h-12 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-full shadow-sm flex items-center justify-center transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors duration-500 ${isActive ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'bg-surface-50 dark:bg-surface-900 text-surface-400 dark:text-surface-500'}`}>
                  {agent.name.charAt(0)}
                </div>
              </div>
              <span className="absolute top-14 whitespace-nowrap text-[10px] font-medium text-surface-600 dark:text-surface-300 bg-white/80 dark:bg-surface-800/80 px-1.5 py-0.5 rounded backdrop-blur-sm transition-colors">
                {agent.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Floating Insights */}
      {INSIGHTS.map((insight, i) => (
        <div
          key={i}
          className="absolute z-30 animate-float"
          style={{
            top: insight.top,
            left: insight.left,
            right: insight.right,
            bottom: insight.bottom,
            animationDelay: insight.delay,
          }}
        >
          <div className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-md border border-surface-200 dark:border-surface-700 shadow-lg rounded-lg p-3 w-40 transform hover:-translate-y-1 transition-all cursor-default">
            <div className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1 transition-colors">
              {insight.title}
            </div>
            <div className="text-xs font-medium text-surface-900 dark:text-white transition-colors">
              {insight.text}
            </div>
            <div className="mt-1 text-[8px] text-surface-400 dark:text-surface-500 italic transition-colors">
              Illustrative Example
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
