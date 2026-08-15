import React, { useEffect, useState } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal.js';

const SCENARIOS = [
  'Market Decline', 'AI Automation', 'Skill Obsolescence', 'Entry Competition', 'Worst Case'
];

export default function StressTestVisual() {
  const revealRef = useScrollReveal();
  const [attackIndex, setAttackIndex] = useState(-1);

  useEffect(() => {
    // Attack sequence
    const interval = setInterval(() => {
      setAttackIndex((prev) => (prev >= SCENARIOS.length + 1 ? -1 : prev + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const isComplete = attackIndex > SCENARIOS.length - 1;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 bg-surface-50 dark:bg-surface-900 border-y border-surface-200 dark:border-surface-800 relative z-10 overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text */}
        <div className="reveal-hidden" ref={revealRef}>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-6 tracking-tight transition-colors">
            We Don't Just Recommend.<br/>
            <span className="text-red-500 dark:text-red-400">We Try to Break It.</span>
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 mb-6 leading-relaxed transition-colors">
            Our Adversarial Agent red-teams your career recommendation against economic downturns, AI automation, and skill obsolescence.
          </p>
          <p className="text-lg text-surface-500 dark:text-surface-400 mb-8 leading-relaxed transition-colors">
            Only paths that survive the stress test make it to your final roadmap.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 bg-white dark:bg-surface-800 px-3 py-1.5 rounded-full border border-surface-200 dark:border-surface-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Stress Testing
          </div>
        </div>

        {/* Right: Visual */}
        <div className="relative h-[400px] flex items-center justify-center reveal-hidden" ref={useScrollReveal()}>
          
          {/* Central Target Card */}
          <div className={`relative z-20 w-64 p-6 bg-white dark:bg-surface-800 border rounded-2xl shadow-xl transition-colors duration-300
            ${attackIndex >= 0 && !isComplete ? 'border-red-400 dark:border-red-500 shadow-red-500/20' : 'border-surface-200 dark:border-surface-700'}
          `}>
            <div className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-1 transition-colors">Target Career</div>
            <div className="text-xl font-bold text-surface-900 dark:text-white mb-6 transition-colors">AI/ML Engineer</div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center transition-all">
                <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase transition-colors">Score</span>
                <span className={`text-sm font-bold ${isComplete ? 'text-primary-600 dark:text-primary-400' : 'text-green-600 dark:text-green-400'} transition-colors`}>
                  {isComplete ? '81 (Tested)' : '87 (Base)'}
                </span>
              </div>
              <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-1.5 transition-colors">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-1000 ${isComplete ? 'bg-primary-500 dark:bg-primary-400' : 'bg-green-500 dark:bg-green-400'}`} 
                  style={{ width: isComplete ? '81%' : '87%' }} 
                />
              </div>

              {isComplete && (
                <div className="animate-fade-in flex justify-between items-center pt-4 border-t border-surface-100 dark:border-surface-700 transition-colors">
                  <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase transition-colors">Robustness</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400 transition-colors">82%</span>
                </div>
              )}
            </div>
          </div>

          {/* Attacking Scenarios */}
          {SCENARIOS.map((scenario, i) => {
            const isAttacking = attackIndex === i;
            const hasAttacked = attackIndex > i;
            
            // Calculate a random angle/position for each scenario to attack from
            const angle = (i / SCENARIOS.length) * Math.PI * 2;
            const radius = 200;
            const startX = Math.cos(angle) * radius;
            const startY = Math.sin(angle) * radius;

            return (
              <div
                key={scenario}
                className={`absolute z-10 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg border border-red-200 dark:border-red-800/50 shadow-md whitespace-nowrap transition-all duration-1000 ease-in-out
                  ${isAttacking ? 'opacity-100' : hasAttacked ? 'opacity-0 scale-50' : 'opacity-0 scale-50'}
                `}
                style={{
                  transform: isAttacking ? 'translate(0px, 0px) scale(1)' : `translate(${startX}px, ${startY}px) scale(0.5)`,
                }}
              >
                {scenario} ⚡
              </div>
            );
          })}

          <div className="absolute bottom-0 right-0 text-[9px] text-surface-400 dark:text-surface-500 italic transition-colors">Illustrative Example</div>
        </div>

      </div>
    </section>
  );
}
