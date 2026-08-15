import React, { useState } from 'react';
import useCopilotStore from '../../store/copilotStore';
import { Compass, BookOpen, Sliders, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
  Career: Compass,
  Learning: BookOpen,
  Simulation: Sliders,
  Progress: TrendingUp,
};

const SuggestedQuestions = ({ onSelect }) => {
  const { suggestedQuestions } = useCopilotStore();
  const categories = Object.keys(suggestedQuestions);
  const [activeTab, setActiveTab] = useState(categories[0] || 'Career');

  const IconComponent = CATEGORY_ICONS[activeTab] || Sparkles;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Category Pills Bar */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-6 p-1.5 bg-surface-950/60 backdrop-blur-md rounded-2xl border border-surface-800/80 w-fit mx-auto shadow-inner">
        {categories.map(cat => {
          const CatIcon = CATEGORY_ICONS[cat] || Sparkles;
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/25 border border-primary-400/30'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60 border border-transparent'
              }`}
            >
              <CatIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-surface-400'}`} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Questions 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
        {(suggestedQuestions[activeTab] || []).map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            className="group relative flex items-start justify-between gap-3 p-4 rounded-2xl bg-surface-900/80 hover:bg-surface-800/90 border border-surface-800/90 hover:border-primary-500/40 text-surface-200 hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-primary-950/30 cursor-pointer overflow-hidden text-left"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 shrink-0 mt-0.5 group-hover:bg-primary-500/20 group-hover:text-primary-300 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <p className="text-xs sm:text-sm font-medium text-surface-200 group-hover:text-white leading-relaxed line-clamp-2">
                {q}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-surface-500 group-hover:text-primary-400 group-hover:translate-x-1 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;

