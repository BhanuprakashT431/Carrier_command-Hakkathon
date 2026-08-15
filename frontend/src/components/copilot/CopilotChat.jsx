import React from 'react';
import EvidenceCard from './EvidenceCard.jsx';
import ActionConfirm from './ActionConfirm.jsx';
import { Bot, User, Cpu, Sparkles } from 'lucide-react';

const CopilotChat = ({ messages, loading }) => {
  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full pb-2">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        return (
          <div key={idx} className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {!isUser && (
              <div className="w-8 h-8 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400 shrink-0 mt-1 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Bot className="w-4 h-4" />
              </div>
            )}

            {isUser ? (
              <div className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-xs max-w-[82%] shadow-md shadow-primary-950/40">
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
              </div>
            ) : (
              <div className="bg-surface-900/90 backdrop-blur-md border border-surface-800 text-surface-100 p-5 rounded-2xl rounded-tl-xs max-w-[88%] shadow-lg space-y-3">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-surface-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary-400" />
                      Swarm Intelligence
                    </span>
                    {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                      <span className="text-[10px] font-semibold bg-surface-800 text-primary-300 px-2 py-0.5 rounded border border-surface-700">
                        {msg.toolsUsed.join(', ')}
                      </span>
                    )}
                  </div>

                  {msg.dataMode === 'DEMO' ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
                      Demo Synthetic
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      Live AI Verified
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="text-xs sm:text-sm text-surface-200 leading-relaxed space-y-2 whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Evidence Sources */}
                {msg.evidence && msg.evidence.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-surface-800/80 flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                      Grounding & Evidence Sources
                    </div>
                    {msg.evidence.map((ev, i) => (
                      <EvidenceCard key={i} evidence={ev} />
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {msg.actions.map((action, i) => (
                      <ActionConfirm key={i} action={action} onConfirm={() => console.log('Confirm', action)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {isUser && (
              <div className="w-8 h-8 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center text-surface-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CopilotChat;

