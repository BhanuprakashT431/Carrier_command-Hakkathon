import React, { useEffect, useRef } from 'react';

const steps = [
  { step: '01', title: 'Create Profile', desc: 'Upload your resume or fill out your skills and experience manually.' },
  { step: '02', title: 'Select Targets', desc: 'Choose your desired roles, target salary, and preferred location.' },
  { step: '03', title: 'AI Analysis', desc: 'Our agents analyze your profile against real-time market data to find gaps.' },
  { step: '04', title: 'Stress Testing', desc: 'We simulate 10 adversarial scenarios to ensure your path is resilient.' },
  { step: '05', title: 'Evidence Check', desc: 'All recommendations are backed by verified market evidence and salary data.' },
  { step: '06', title: 'Execution', desc: 'Get a step-by-step adaptive roadmap to close your skill gaps and land the job.' }
];

export default function HowItWorksPipeline() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const items = sectionRef.current.querySelectorAll('.reveal-step');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.remove('reveal-hidden');
              item.classList.add('reveal-visible');
            }, index * 100);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-surface-950 relative z-10 transition-colors duration-500" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-4 transition-colors">
            How It Works
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 transition-colors">
            A deterministic, step-by-step process to optimize your career.
          </p>
        </div>

        <div ref={sectionRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="reveal-step reveal-hidden flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-primary-400 dark:group-hover:border-primary-500 transition-all duration-300">
                <span className="text-xl font-black text-primary-600 dark:text-primary-400 transition-colors">{step.step}</span>
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-3 transition-colors">{step.title}</h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm leading-relaxed transition-colors">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
