import React, { useState, useRef, useEffect } from 'react';

import useCopilotStore from '../../store/copilotStore';
import CopilotChat from '../../components/copilot/CopilotChat.jsx';
import SuggestedQuestions from '../../components/copilot/SuggestedQuestions.jsx';
import { Bot, Plus, Network, MessageSquare, Zap, Activity } from 'lucide-react';

const Copilot = () => {
  const {
    conversations,
    activeConversationId,
    messages,
    loading,
    loadConversations,
    selectConversation,
    sendMessage,
  } = useCopilotStore();

  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    if (!text.trim() || loading) return;
    sendMessage(text);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex-1 w-full bg-surface-50 dark:bg-[#080B14] transition-colors duration-300 h-screen overflow-hidden flex flex-col font-sans">
      
      {/* Global Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/10 dark:bg-primary-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000" />
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Left Sidebar - Conversations List */}
        <div className="w-80 bg-surface-900/80 backdrop-blur-xl border border-surface-800 rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
          
          <div className="p-6 border-b border-surface-800/80 bg-surface-950/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 border border-primary-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Network className="w-4 h-4" />
              </span>
              Intelligence Hub
            </h2>
            <button
              onClick={() => selectConversation(null)}
              className="w-full relative overflow-hidden group/btn bg-surface-950 border border-surface-800 text-white font-bold py-3.5 rounded-xl shadow-sm hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-500/10 to-indigo-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 transition-colors flex items-center justify-center gap-2 text-sm">
                <Plus className="w-4 h-4 text-primary-400" />
                New Strategy Session
              </span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {conversations.length > 0 ? conversations.map(conv => {
              const isActive = activeConversationId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border relative overflow-hidden group ${
                    isActive 
                      ? 'bg-primary-900/20 border-primary-500/30 shadow-sm' 
                      : 'bg-surface-950/30 border-transparent hover:bg-surface-900 hover:border-surface-700/50'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-primary-500" />}
                  <div className={`font-bold text-sm truncate mb-1 flex items-center gap-2 ${isActive ? 'text-primary-400' : 'text-surface-300 group-hover:text-white transition-colors'}`}>
                    <MessageSquare className="w-3 h-3 shrink-0 opacity-70" />
                    {conv.title || 'Strategic Analysis'}
                  </div>
                  <div className={`text-xs truncate ${isActive ? 'text-primary-400/80' : 'text-surface-500'}`}>
                    {conv.preview || 'Initiating agents...'}
                  </div>
                </div>
              )
            }) : (
              <div className="flex flex-col items-center justify-center h-full text-surface-600 p-4 text-center">
                <MessageSquare className="w-10 h-10 mb-4 opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-surface-500">No Active Sessions</span>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-surface-800/80 bg-surface-950/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-surface-500">System Status</span>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Online</span>
              </div>
            </div>
            <p className="text-[10px] text-surface-600 font-medium">9-Agent Swarm allocated to intelligence tasks.</p>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-surface-900/80 backdrop-blur-xl border border-surface-800 rounded-3xl flex flex-col shadow-2xl overflow-hidden relative animate-fade-in-up delay-100">
          
          {/* Top Bar */}
          <div className="px-8 py-5 border-b border-surface-800/80 flex justify-between items-center bg-surface-950/50 relative z-10">
            <h3 className="font-extrabold text-white text-lg flex items-center gap-3">
              {activeConversationId ? conversations.find(c => c.id === activeConversationId)?.title : 'New Strategic Alignment'}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                High Confidence
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar relative z-10">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto mt-[-5vh]">
                <div className="relative w-24 h-24 mb-10 group">
                  <div className="absolute inset-0 bg-primary-500/30 blur-2xl rounded-full group-hover:bg-primary-500/40 transition-colors" />
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-indigo-600 p-[2px] shadow-[0_0_30px_rgba(168,85,247,0.3)] animate-float">
                    <div className="w-full h-full bg-[#080B14] rounded-[22px] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary-500/10 blur-xl" />
                      <Bot className="w-10 h-10 text-primary-400 relative z-10" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Access the Swarm Mind</h2>
                <p className="text-surface-400 text-base mb-12 max-w-xl leading-relaxed">
                  Direct your query to our 9-agent cluster. They will simultaneously analyze your profile, cross-reference market data, and debate strategies before answering.
                </p>
                
                <SuggestedQuestions onSelect={handleSend} />
              </div>
            ) : (
              <CopilotChat messages={messages} loading={loading} />
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-surface-950/80 border-t border-surface-800/80 relative z-10">
            <div className="max-w-4xl mx-auto relative">
              
              {loading && (
                <div className="absolute -top-12 left-4 flex items-center gap-3 px-4 py-2 bg-surface-900 border border-primary-500/30 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-widest text-primary-400 animate-fade-in-up">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  Agents Synthesizing Response
                </div>
              )}
              
              <div className="relative rounded-2xl bg-surface-900 border border-surface-800 shadow-inner focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500 transition-all duration-300 overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Command the swarm..."
                  className="w-full bg-transparent text-white placeholder-surface-500 p-5 pr-20 rounded-2xl resize-none focus:outline-none min-h-[70px] max-h-[200px] font-medium leading-relaxed custom-scrollbar"
                  rows={1}
                  maxLength={2000}
                />
                
                <div className="absolute right-3 bottom-3 flex items-center gap-4">
                  <span className="text-[10px] font-bold text-surface-600 hidden sm:block">{input.length}/2000</span>
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:shadow-none disabled:bg-surface-800 transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:active:scale-100"
                  >
                    <Zap className="w-5 h-5 fill-current" />
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
