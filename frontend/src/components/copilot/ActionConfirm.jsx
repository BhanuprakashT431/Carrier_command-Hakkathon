import React, { useState } from 'react';

const ActionConfirm = ({ action, onConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm(action);
  };

  return (
    <div className="bg-white border border-surface-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
      
      {!confirmed ? (
        <>
          <h4 className="font-bold text-surface-900 mb-1">{action.title || 'Suggested Action'}</h4>
          <p className="text-sm text-surface-600 mb-4">{action.description}</p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              Confirm Action
            </button>
            <button className="text-surface-500 hover:text-surface-700 font-medium text-sm px-4 py-2">
              Dismiss
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-status-success">
          <span className="text-xl">✓</span>
          <span className="font-bold text-sm">Action confirmed and in progress.</span>
        </div>
      )}
    </div>
  );
};

export default ActionConfirm;
