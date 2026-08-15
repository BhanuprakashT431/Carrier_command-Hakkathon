import React, { useEffect, useRef } from 'react';

const cards = [
  {
    title: 'Analyze',
    description: 'A deep scan of your skills, market alignment, and potential trajectories using specialized AI agents.',
    icon: (
      <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    title: 'Stress-Test',
    description: 'We subject recommendations to 10 adversarial scenarios (e.g., AI automation, market crashes) to ensure resilience.',
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Adapt',
    description: 'Your career isn\'t static. Receive dynamic 30/60/90 day roadmaps that pivot when the market or your goals change.',
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  }
];

export default function WhyCareerCommand() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const items = sectionRef.current.querySelectorAll('.reveal-card');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.remove('reveal-hidden');
              item.classList.add('reveal-visible');
            }, index * 150);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-surface-50 dark:bg-surface-900 relative z-10 transition-colors duration-500" id="product">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-card reveal-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-4 transition-colors">
            Career Advice Is Easy.<br/>
            <span className="text-primary-600 dark:text-primary-400">Career Intelligence Is Different.</span>
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 transition-colors">
            Most tools give generic advice. We run your profile through a rigorous deterministic pipeline to produce a verified strategy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div key={i} className="reveal-card reveal-hidden bg-white dark:bg-surface-800 rounded-2xl p-8 border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-3 transition-colors">{card.title}</h3>
              <p className="text-surface-500 dark:text-surface-400 leading-relaxed transition-colors">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
