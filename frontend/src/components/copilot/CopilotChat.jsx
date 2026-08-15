import React from 'react';
import EvidenceCard from './EvidenceCard.jsx';
import ActionConfirm from './ActionConfirm.jsx';

const CopilotChat = ({ messages, loading }) => {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-4">
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'user' ? (
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ) : (
            <div className="bg-surface-900 border border-surface-800 text-white px-5 py-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm relative">
              
              {/* Tool Indicator & Data Mode */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-surface-800">
                <div className="flex flex-wrap items-center gap-2">
                  {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                    <>
                      <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">Tools:</span>
                      {msg.toolsUsed.map(tool => (
                        <span key={tool} className="text-[11px] font-bold bg-surface-800 text-primary-400 px-2 py-1 rounded-md border border-surface-700 flex items-center gap-1">
                          ⚙️ {tool}
                        </span>
                      ))}
                    </>
                  )}
                </div>
                
                {msg.dataMode === 'DEMO' ? (
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20">Demo AI • Synthetic</span>
                ) : (
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Live AI</span>
                )}
              </div>

              <div className="prose prose-invert max-w-none prose-p:leading-relaxed text-surface-200">
                {msg.content}
              </div>

              {/* Evidence References */}
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-1">Evidence Sources</div>
                  {msg.evidence.map((ev, i) => (
                    <EvidenceCard key={i} evidence={ev} />
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-5 flex flex-col gap-3">
                  {msg.actions.map((action, i) => (
                    <ActionConfirm key={i} action={action} onConfirm={() => console.log('Confirm', action)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CopilotChat;
