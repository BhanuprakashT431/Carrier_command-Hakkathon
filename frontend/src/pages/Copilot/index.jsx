import React, { useState, useRef, useEffect } from 'react';
import useCopilotStore from '../../store/copilotStore';
import CopilotChat from '../../components/copilot/CopilotChat.jsx';
import SuggestedQuestions from '../../components/copilot/SuggestedQuestions.jsx';
import { Bot, Plus, Network, MessageSquare, Zap, Activity, Trash2, Sparkles, Send } from 'lucide-react';

const Copilot = () => {
  const {
    conversations,
    activeConversationId,
    messages,
    loading,
    loadConversations,
    selectConversation,
    deleteConversation,
    sendMessage,
  } = useCopilotStore();

  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (text) => {
    const toSend = (text || input).trim();
    if (!toSend || loading) return;
    sendMessage(toSend);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 w-full bg-[#080B14] transition-colors duration-300 h-[calc(100vh-8.5rem)] min-h-[600px] overflow-hidden flex flex-col font-sans relative">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary-600/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10 w-full max-w-[1600px] mx-auto p-3 sm:p-4 lg:p-6 gap-4 sm:gap-6 h-full">
        
        {/* Left Sidebar - Intelligence Hub & History */}
        <div className="w-72 lg:w-80 bg-surface-900/80 backdrop-blur-xl border border-surface-800/80 rounded-2xl flex flex-col shadow-2xl overflow-hidden shrink-0 h-full">
          
          <div className="p-4 sm:p-5 border-b border-surface-800/80 bg-surface-950/60 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 border border-primary-500/30 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                  <Network className="w-4 h-4" />
                </span>
                Intelligence Hub
              </h2>
              <span className="text-[10px] font-bold text-surface-400 bg-surface-800/70 px-2 py-0.5 rounded-full border border-surface-700/60">
                {conversations.length} {conversations.length === 1 ? 'session' : 'sessions'}
              </span>
            </div>

            <button
              onClick={() => selectConversation(null)}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-primary-950/40 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 text-white" />
              New Strategy Session
            </button>
          </div>
          
          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
            {conversations.length > 0 ? (
              conversations.map(conv => {
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 border flex items-center justify-between gap-2 ${
                      isActive 
                        ? 'bg-primary-500/15 border-primary-500/40 text-white shadow-sm' 
                        : 'bg-surface-950/30 border-surface-800/50 hover:bg-surface-800/50 hover:border-surface-700/60 text-surface-300'
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-indigo-500 rounded-r" />}
                    
                    <div className="min-w-0 flex-1 pl-1">
                      <div className={`font-semibold text-xs truncate flex items-center gap-1.5 ${isActive ? 'text-primary-300' : 'text-surface-200 group-hover:text-white'}`}>
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{conv.title || 'Strategy Session'}</span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-primary-400/80' : 'text-surface-500 group-hover:text-surface-400'}`}>
                        {conv.preview || 'Ready for queries'}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      title="Delete conversation"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-surface-500 hover:text-rose-400 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-surface-500 p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-950/80 border border-surface-800 flex items-center justify-center mb-3 text-surface-600">
                  <MessageSquare className="w-5 h-5 opacity-40" />
                </div>
                <span className="text-xs font-semibold text-surface-400 mb-1">No Previous Sessions</span>
                <p className="text-[11px] text-surface-600 leading-relaxed">Start a new query to initiate the 9-agent analysis swarm.</p>
              </div>
            )}
          </div>

          {/* Sidebar Status Footer */}
          <div className="p-3.5 border-t border-surface-800/80 bg-surface-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">9-Agent Swarm</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Online • Live AI
            </span>
          </div>
        </div>

        {/* Main Chat Workspace */}
        <div className="flex-1 bg-surface-900/80 backdrop-blur-xl border border-surface-800/80 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative h-full">
          
          {/* Top Bar */}
          <div className="px-6 py-3.5 border-b border-surface-800/80 flex justify-between items-center bg-surface-950/60 relative z-10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400">
                <Bot className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <h3 className="font-extrabold text-white text-sm sm:text-base truncate">
                  {activeConversationId 
                    ? (conversations.find(c => c.id === activeConversationId)?.title || 'Strategic Alignment')
                    : 'Strategic Alignment Swarm'}
                </h3>
                <p className="text-[10px] text-surface-400">Autonomous multi-agent career reasoning engine</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Live Reasoning
              </span>
              {messages.length > 0 && (
                <button
                  onClick={() => selectConversation(null)}
                  className="text-xs font-semibold text-surface-400 hover:text-white bg-surface-800/70 hover:bg-surface-800 border border-surface-700/80 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Clear Chat
                </button>
              )}
            </div>
          </div>

          {/* Chat Messages / Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative z-10 flex flex-col justify-between">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto text-center max-w-3xl mx-auto py-6">
                
                {/* Center Swarm Orb */}
                <div className="relative w-20 h-20 mb-6 group">
                  <div className="absolute inset-0 bg-primary-500/25 blur-2xl rounded-full group-hover:bg-primary-500/40 transition-colors" />
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 p-[2px] shadow-[0_0_25px_rgba(168,85,247,0.35)] animate-float">
                    <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary-500/10 blur-md" />
                      <Bot className="w-9 h-9 text-primary-400 relative z-10" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2.5 tracking-tight">
                  Access the Swarm Mind
                </h2>
                <p className="text-surface-400 text-xs sm:text-sm mb-8 max-w-lg leading-relaxed">
                  Query our 9 specialized agents in real-time. They will cross-reference your verified profile, market trajectories, learning milestones, and stress-test data before answering.
                </p>
                
                {/* 2x2 Suggested Questions */}
                <SuggestedQuestions onSelect={handleSend} />
              </div>
            ) : (
              <div className="space-y-6">
                <CopilotChat messages={messages} loading={loading} />
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3.5 sm:p-5 bg-surface-950/90 border-t border-surface-800/80 relative z-10 shrink-0">
            <div className="max-w-4xl mx-auto relative">
              
              {loading && (
                <div className="absolute -top-10 left-3 flex items-center gap-2.5 px-3 py-1.5 bg-surface-900 border border-primary-500/30 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-wider text-primary-400 animate-fade-in-up">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  Agents synthesizing live response...
                </div>
              )}
              
              <div className="relative rounded-2xl bg-surface-900/90 border border-surface-800 shadow-inner focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500/80 transition-all duration-200 overflow-hidden flex items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask the 9-agent swarm about your career trajectory, skill gaps, or learning roadmap..."
                  className="w-full bg-transparent text-white placeholder-surface-500 p-4 pr-24 rounded-2xl resize-none focus:outline-none min-h-[56px] max-h-[160px] text-xs sm:text-sm font-medium leading-relaxed custom-scrollbar"
                  rows={1}
                  maxLength={2000}
                />
                
                <div className="absolute right-2.5 bottom-2.5 flex items-center gap-3">
                  <span className="text-[10px] font-bold text-surface-600 hidden sm:block">
                    {input.length}/2000
                  </span>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="h-9 w-9 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-950/40 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copilot;

