
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plus, MessageSquare, Layout, Info, X } from 'lucide-react';
import { Message } from '../types';
import { getResearchAssistantResponse } from '../services/geminiService';

interface ResearchAssistantProps {
  isCollapsed: boolean;
  onToggle: () => void;
  externalPaperTrigger?: any;
}

const ResearchAssistant: React.FC<ResearchAssistantProps> = ({ isCollapsed, onToggle, externalPaperTrigger }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Medical Research Assistant. How can I help you analyze your findings today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPaperContext, setCurrentPaperContext] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle external triggers (Chat with Paper button)
  useEffect(() => {
    if (externalPaperTrigger) {
      setCurrentPaperContext(externalPaperTrigger);
      const prompt = `I'd like to discuss the paper: "${externalPaperTrigger.title}". Could you summarize its key findings and methodology for me?`;
      handleExternalMessage(prompt, externalPaperTrigger);
    }
  }, [externalPaperTrigger]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isCollapsed]);

  const handleExternalMessage = async (content: string, paper: any) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const contextualHistory = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: `Contextual Paper Details:\nTitle: ${paper.title}\nAuthors: ${paper.authors}\nAbstract: ${paper.abstract}\n\nUser Question: ${content}` }
    ];

    const response = await getResearchAssistantResponse(contextualHistory, content);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const finalInput = currentPaperContext 
      ? `Discussing Paper: ${currentPaperContext.title}\n\nQuestion: ${inputValue}`
      : inputValue;

    const response = await getResearchAssistantResponse(history, finalInput);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const suggestions = ["Compare Sample Sizes", "Find Conflicting Data"];

  return (
    <div 
      className={`bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0 shadow-2xl lg:shadow-none ${
        isCollapsed ? 'hidden lg:flex lg:w-16' : 'w-full sm:w-[400px]'
      }`}
    >
      {!isCollapsed ? (
        <>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white flex-shrink-0">
            <h2 className="font-bold text-slate-800 text-sm whitespace-nowrap">Research Assistant</h2>
            <button 
              onClick={onToggle}
              className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 transition-colors"
              title="Close Assistant"
            >
              <X size={18} className="lg:hidden" />
              <MessageSquare size={18} className="hidden lg:block" />
            </button>
          </div>

          {/* Context Badge */}
          {currentPaperContext && (
            <div className="bg-emerald-50/50 px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between group flex-shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="p-1 bg-emerald-100 text-emerald-600 rounded">
                  <Info size={12} />
                </div>
                <div className="text-[10px] text-emerald-700 font-bold truncate">
                  Chatting about: {currentPaperContext.title}
                </div>
              </div>
              <button 
                onClick={() => setCurrentPaperContext(null)}
                className="text-[10px] text-emerald-400 hover:text-emerald-600 font-bold ml-2 whitespace-nowrap"
              >
                Reset
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 space-y-4 bg-slate-50/20" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] sm:max-w-[90%] rounded-2xl px-4 py-3 lg:px-5 lg:py-4 text-[13px] leading-relaxed shadow-sm break-words overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-white text-slate-700 border border-slate-100 ml-8 sm:ml-12' 
                    : 'bg-[#f0fdf4] text-[#064e3b] mr-8 sm:mr-12'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#f0fdf4] rounded-2xl px-5 py-4 flex gap-1 items-center">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>

          {/* Footer / Input Area */}
          <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
              {suggestions.map((s) => (
                <button key={s} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-medium text-slate-600 hover:border-emerald-200 hover:text-emerald-600 transition-all whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>
            
            <div className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={currentPaperContext ? "Ask about this paper..." : "Ask about your research..."}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-5 pr-12 text-[13px] focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-400 shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-3 top-2.5 p-1 text-emerald-500 hover:text-emerald-700 transition-colors disabled:opacity-30 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center">
          {/* Collapsed Header / Toggle Area (Desktop Only) */}
          <div className="h-16 flex items-center justify-center w-full border-b border-slate-50">
            <button 
              onClick={onToggle}
              className="p-2.5 text-slate-300 hover:text-emerald-500 hover:bg-slate-50 rounded-xl transition-all"
              title="Expand Research Assistant"
            >
              <MessageSquare size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchAssistant;
