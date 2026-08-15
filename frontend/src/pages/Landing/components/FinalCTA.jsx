import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
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
    <section className="py-24 relative z-10 overflow-hidden bg-white dark:bg-surface-950 transition-colors duration-500">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div ref={sectionRef} className="reveal-hidden relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 dark:from-primary-950 dark:via-surface-900 dark:to-purple-950 px-6 py-16 sm:p-20 text-center shadow-2xl transition-colors">
          
          {/* Background graphics */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMXoiIGZpbGw9IiNFMEU3RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] mix-blend-overlay"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500 dark:bg-primary-600 rounded-full mix-blend-screen dark:mix-blend-lighten filter blur-[100px] opacity-50 dark:opacity-30 transition-opacity"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 dark:bg-purple-600 rounded-full mix-blend-screen dark:mix-blend-lighten filter blur-[100px] opacity-50 dark:opacity-30 transition-opacity"></div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 transition-colors">
              Your Career Shouldn't Be Guesswork.
            </h2>
            <p className="text-lg text-primary-100 dark:text-surface-300 max-w-2xl mx-auto mb-10 transition-colors">
              Stop relying on generic advice and hallucinated LLM responses. Get a deterministic, stress-tested career roadmap built specifically for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-primary-500 text-primary-900 dark:text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-primary-50 dark:hover:bg-primary-400 transition-all duration-300">
                  Start My Career Analysis
                </button>
              </Link>
              <Link to="/auth/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent border border-primary-400 dark:border-surface-600 text-white dark:text-surface-300 font-bold text-base hover:bg-primary-800 dark:hover:bg-surface-800 hover:border-primary-300 dark:hover:border-surface-400 transition-all duration-300">
                  Sign In
                </button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-primary-200/60 dark:text-surface-500 font-medium transition-colors">
              Free to start • No credit card required • Instant analysis
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
