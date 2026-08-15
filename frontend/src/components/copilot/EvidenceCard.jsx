import React, { useState } from 'react';

const EvidenceCard = ({ evidence }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'VERIFIED': return 'bg-status-success/10 text-status-success border-status-success/20';
      case 'DATA_UNAVAILABLE': return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      case 'DEMO_SYNTHETIC': return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'UNVERIFIED': return 'bg-status-error/10 text-status-error border-status-error/20';
      default: return 'bg-surface-100 text-surface-700 border-surface-200';
    }
  };

  return (
    <div className="bg-surface-50 border border-surface-200 rounded-lg overflow-hidden">
      <div 
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-surface-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-surface-900">{evidence.claim}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(evidence.status)}`}>
            {evidence.status || 'INFO'}
          </span>
          <span className="text-surface-500">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      
      {expanded && (
        <div className="p-3 pt-3 text-sm text-surface-600 bg-white border-t border-surface-200">
          <p><span className="font-bold text-surface-900">Source:</span> {evidence.source}</p>
          {evidence.details && <p className="mt-1">{evidence.details}</p>}
        </div>
      )}
    </div>
  );
};

export default EvidenceCard;
