import React, { useEffect, useRef } from 'react';

export default function SimulationVisual() {
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
    <section className="py-24 bg-white dark:bg-surface-950 relative z-10 transition-colors duration-500" id="simulation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-6 transition-colors">
              What If Your Skills Changed Tomorrow?
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 mb-8 leading-relaxed transition-colors">
              Don't guess what to learn next. Use the Career Simulator to test changes to your skills, target salary, or location, and see exactly how it impacts your career suitability score in real-time.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mt-1 transition-colors">✓</div>
                <div>
                  <h4 className="font-bold text-surface-900 dark:text-white transition-colors">Skill Upgrades</h4>
                  <p className="text-sm text-surface-500 dark:text-surface-400 transition-colors">Simulate learning a new skill like Python or React.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mt-1 transition-colors">✓</div>
                <div>
                  <h4 className="font-bold text-surface-900 dark:text-white transition-colors">Market Shifts</h4>
                  <p className="text-sm text-surface-500 dark:text-surface-400 transition-colors">Simulate changes in remote work availability or salary bands.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div ref={sectionRef} className="reveal-hidden relative bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 shadow-xl transition-colors">
            {/* Input Panel */}
            <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6 mb-6 relative z-10 transition-colors">
              <div className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-4 transition-colors">Simulation Input</div>
              <div className="flex justify-between items-end mb-2">
                <div className="font-bold text-surface-900 dark:text-white transition-colors">Python (Backend)</div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors">45 → 80</div>
              </div>
              <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden flex transition-colors">
                <div className="h-full bg-surface-400 dark:bg-surface-500 w-[45%] transition-colors"></div>
                <div className="h-full bg-blue-500 dark:bg-blue-400 w-[35%] animate-pulse transition-colors"></div>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex justify-center -my-3 relative z-20">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-center text-surface-400 dark:text-surface-500 transition-colors">
                ↓
              </div>
            </div>

            {/* Output Panel */}
            <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6 mt-6 relative z-10 transition-colors">
              <div className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-4 transition-colors">Simulation Result</div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-surface-500 dark:text-surface-400 mb-1 transition-colors">Career Suitability</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-surface-900 dark:text-white transition-colors">72</span>
                    <span className="text-surface-400 dark:text-surface-500 transition-colors">→</span>
                    <span className="text-3xl font-black text-green-600 dark:text-green-400 transition-colors">86</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-green-500 dark:border-green-500/50 flex items-center justify-center text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 transition-colors">
                  +14
                </div>
              </div>

            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMXoiIGZpbGw9IiNFMEU3RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-50 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen pointer-events-none rounded-full mask-radial transition-opacity"></div>

          </div>

        </div>

      </div>
    </section>
  );
}
