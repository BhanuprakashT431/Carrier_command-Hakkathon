import React from 'react';


const AdminEvaluation = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 text-surface-900">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-surface-900">System Evaluation & Metrics</h1>
          <span className="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded text-xs font-bold uppercase tracking-wider">
            DEMO — SYNTHETIC
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm">
            <div className="text-surface-500 font-bold text-[11px] uppercase tracking-wider mb-1">Agent Latency</div>
            <div className="text-3xl font-bold text-surface-900">1.24s</div>
            <div className="text-xs text-status-success font-medium mt-2">↓ 0.1s from last week</div>
          </div>
          <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm">
            <div className="text-surface-500 font-bold text-[11px] uppercase tracking-wider mb-1">System Stability</div>
            <div className="text-3xl font-bold text-surface-900">99.9%</div>
            <div className="text-xs text-surface-500 font-medium mt-2">Last 30 days</div>
          </div>
          <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm">
            <div className="text-surface-500 font-bold text-[11px] uppercase tracking-wider mb-1">Evidence Coverage</div>
            <div className="text-3xl font-bold text-surface-900">87.5%</div>
            <div className="text-xs text-status-success font-medium mt-2">↑ 2.3% improvement</div>
          </div>
          <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm">
            <div className="text-surface-500 font-bold text-[11px] uppercase tracking-wider mb-1">Fallback Rate</div>
            <div className="text-3xl font-bold text-surface-900">4.2%</div>
            <div className="text-xs text-status-error font-medium mt-2">↑ 0.5% (needs review)</div>
          </div>
        </div>

        <div className="bg-white border border-surface-200 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Agent Performance Breakdown</h2>
          <div className="space-y-4">
            {[
              { name: 'Profile Analyzer', latency: '0.4s', success: '99.9%', load: '12%' },
              { name: 'Market Intelligence', latency: '1.8s', success: '98.5%', load: '45%' },
              { name: 'Risk Assessment', latency: '0.9s', success: '99.1%', load: '21%' },
              { name: 'Evidence Agent', latency: '2.1s', success: '97.2%', load: '56%' },
            ].map(agent => (
              <div key={agent.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-50 rounded-xl border border-surface-200 gap-2">
                <div className="sm:w-1/4 font-bold text-surface-900">{agent.name}</div>
                <div className="sm:w-1/4 text-surface-600 text-sm font-medium">Latency: <span className="text-surface-900">{agent.latency}</span></div>
                <div className="sm:w-1/4 text-surface-600 text-sm font-medium">Success: <span className="text-surface-900">{agent.success}</span></div>
                <div className="sm:w-1/4 text-surface-600 text-sm font-medium">Load: <span className="text-surface-900">{agent.load}</span></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEvaluation;
