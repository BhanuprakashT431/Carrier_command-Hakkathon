import React, { useState } from 'react';
import useCopilotStore from '../../store/copilotStore';

const SuggestedQuestions = ({ onSelect }) => {
  const { suggestedQuestions } = useCopilotStore();
  const categories = Object.keys(suggestedQuestions);
  const [activeTab, setActiveTab] = useState(categories[0]);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-center gap-2 mb-6 border-b border-surface-200 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === cat
                ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
                : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestedQuestions[activeTab].map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            className="text-left bg-white hover:bg-surface-50 border border-surface-200 hover:border-primary-300 p-4 rounded-xl text-sm font-medium text-surface-900 transition-all shadow-sm hover:shadow-md"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
