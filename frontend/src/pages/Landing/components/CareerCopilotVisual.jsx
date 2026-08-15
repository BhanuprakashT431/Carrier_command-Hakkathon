import React, { useEffect, useRef } from 'react';

export default function CareerCopilotVisual() {
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
    <section className="py-24 bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-white relative z-10 overflow-hidden transition-colors duration-500" id="about">
      
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-100/40 dark:from-primary-900/40 to-transparent pointer-events-none transition-colors"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Visual Chat UI */}
          <div ref={sectionRef} className="reveal-hidden order-2 lg:order-1 relative">
            
            {/* Main Chat Box */}
            <div className="w-full max-w-lg bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-2xl relative transition-colors">
              
              {/* User Message */}
              <div className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex-shrink-0 mt-1 flex items-center justify-center text-xs font-bold text-surface-600 dark:text-surface-400 transition-colors">ME</div>
                <div className="bg-surface-100 dark:bg-surface-700 rounded-2xl rounded-tl-sm p-4 text-sm text-surface-700 dark:text-surface-200 transition-colors">
                  I'm worried about AI automating junior engineering roles. Should I still learn Python?
                </div>
              </div>

              {/* Copilot Message */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex-shrink-0 mt-1 flex items-center justify-center shadow-lg shadow-primary-500/50">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl rounded-tr-sm p-4 text-sm text-surface-700 dark:text-surface-300 transition-colors">
                  <p className="mb-4">
                    Based on our <span className="text-primary-600 dark:text-primary-400 font-bold">Adversarial Stress Test</span>, pure entry-level Python roles carry a 65% automation risk over the next 3 years.
                  </p>
                  <p className="mb-4">
                    However, your profile indicates a strong background in Data Analysis. If you pivot to <span className="text-surface-900 dark:text-white font-bold">Data Engineering</span>, the automation risk drops to 12%.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center gap-1 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 px-2 py-1 rounded text-xs text-surface-600 dark:text-surface-400 transition-colors">
                      <svg className="w-3 h-3 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Verified Market Data
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 px-2 py-1 rounded text-xs text-surface-600 dark:text-surface-400 transition-colors">
                      <svg className="w-3 h-3 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      View Roadmap Pivot
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Floating Tag */}
            <div className="absolute -right-8 top-12 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-4 py-3 rounded-xl shadow-xl animate-float delay-200 transition-colors">
              <div className="text-xs text-surface-500 dark:text-surface-400 mb-1 transition-colors">Context Aware</div>
              <div className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Reads your full profile
              </div>
            </div>

          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-6 transition-colors">
              Your Career Strategy Doesn't Stop After Analysis.
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 leading-relaxed transition-colors">
              Meet Career Copilot. It isn't a generic chatbot. It is deeply integrated with your specific Career Pipeline, knowing your exact skill gaps, market stress tests, and learning roadmap.
            </p>
            <ul className="space-y-4 text-left inline-block lg:block">
              <li className="flex items-center gap-3 text-surface-700 dark:text-surface-300 transition-colors">
                <div className="w-6 h-6 rounded bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 transition-colors">✓</div>
                Ask questions about your roadmap
              </li>
              <li className="flex items-center gap-3 text-surface-700 dark:text-surface-300 transition-colors">
                <div className="w-6 h-6 rounded bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 transition-colors">✓</div>
                Get interview preparation tailored to your weak points
              </li>
              <li className="flex items-center gap-3 text-surface-700 dark:text-surface-300 transition-colors">
                <div className="w-6 h-6 rounded bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 transition-colors">✓</div>
                Request tactical pivots when the market changes
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
