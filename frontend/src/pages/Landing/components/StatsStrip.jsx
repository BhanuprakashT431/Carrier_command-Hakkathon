import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Specialized AI Agents', value: 9, suffix: '' },
  { label: 'Adversarial Scenarios', value: 10, suffix: '+' },
  { label: 'Deterministic Scoring', value: 100, suffix: '%' },
  { label: 'Career Intelligence', staticValue: '24/7' },
];

const AnimatedCounter = ({ value, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let hasRun = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun) {
          hasRun = true;
          
          const steps = 40;
          const stepTime = duration / steps;
          let currentStep = 0;
          
          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            // easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setCount(Math.floor(easeProgress * value));
            
            if (currentStep >= steps) {
              setCount(value);
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

export default function StatsStrip() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const items = sectionRef.current.querySelectorAll('.stat-item');
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 border-y border-surface-200 dark:border-surface-800 bg-white/50 dark:bg-surface-900/50 backdrop-blur-sm z-10 relative transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-surface-200 dark:divide-surface-800">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item reveal-hidden flex flex-col items-center justify-center text-center px-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white mb-2 transition-colors">
                {stat.staticValue ? stat.staticValue : <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-sm font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
