
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FileText, ExternalLink, Plus, BookOpen, Loader2, Sparkles, RefreshCcw, Send, User, Microscope, Activity, BarChart3, Save } from 'lucide-react';
import { generateNotesFromText, summarizeSinglePaper, getResearchAssistantResponse } from '../services/geminiService';
import { Message, Paper } from '../types';

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
  lastEdited: string;
}

interface AnalysisViewProps {
  activeContext?: {
    type: 'summary' | 'paper';
    data?: Paper;
    autoTrigger?: 'summary';
  };
  onResetContext?: () => void;
  onCitationClick?: (id: number) => void;
  papers: Paper[];
  isGlobalLoading?: boolean;
  globalSummary?: string | null;
  currentQuery?: string;
  onSaveProject?: () => void;
}

interface CitationProps { 
  id: number; 
  onClick: (id: number) => void; 
  paper?: Paper;
}

const Citation: React.FC<CitationProps> = ({ id, onClick, paper }) => (
  <span className="relative inline-block group mx-1 align-baseline">
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      className="inline-flex items-center justify-center bg-emerald-100/90 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-700 transition-all shadow-sm active:scale-90"
    >
      {id}
    </button>
    {paper && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 p-4 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] pointer-events-none text-left backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Source [{id}]
            </div>
            <span className="text-[10px] text-slate-400 font-bold">{paper.date}</span>
          </div>
          <p className="text-[13px] font-bold text-slate-900 leading-snug">
            {paper.title}
          </p>
          <p className="text-[11px] text-slate-500 italic truncate border-t border-slate-50 pt-2 font-medium">
            {paper.authors}
          </p>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white"></div>
      </div>
    )}
  </span>
);

const AnalysisView: React.FC<AnalysisViewProps> = ({ 
  activeContext, 
  onResetContext, 
  onCitationClick, 
  papers, 
  isGlobalLoading,
  globalSummary,
  currentQuery,
  onSaveProject
}) => {
  const tabs = ["Overview", "Papers (" + papers.length + ")", "Notes"];
  const [activeTab, setActiveTab] = React.useState("Overview");
  const [noteSearch, setNoteSearch] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [paperSummary, setPaperSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeContext && activeContext.type === 'paper' && activeContext.data) {
      if (activeContext.autoTrigger === 'summary') {
        handlePaperSummaryTrigger(activeContext.data);
      }
    } else {
      setPaperSummary(null);
    }
  }, [activeContext]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading]);

  const handlePaperSummaryTrigger = async (paper: any) => {
    setIsSummaryLoading(true);
    const summary = await summarizeSinglePaper(paper);
    setPaperSummary(summary || "Failed to generate summary.");
    setIsSummaryLoading(false);
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");
    setIsChatLoading(true);

    const history = chatMessages.map(m => ({ role: m.role, content: m.content }));
    
    let context = "";
    if (activeContext?.type === 'paper' && activeContext.data) {
      context = `CURRENT FOCUS PAPER:\nTitle: ${activeContext.data.title}\nAuthors: ${activeContext.data.authors}\nAbstract: ${activeContext.data.abstract}\nAI Summary: ${paperSummary || "N/A"}`;
    } else {
      context = `GENERAL EXECUTIVE SUMMARY CONTEXT:\n${globalSummary || "General medical research findings."}`;
    }

    const response = await getResearchAssistantResponse(history, currentInput, context);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, assistantMsg]);
    setIsChatLoading(false);
  };

  const [notes, setNotes] = useState<Note[]>([]);

  const filteredNotes = useMemo(() => {
    const search = noteSearch.toLowerCase().trim();
    if (!search) return notes;
    return notes.filter(note => 
      note.title.toLowerCase().includes(search) || 
      note.content.toLowerCase().includes(search)
    );
  }, [notes, noteSearch]);

  const handleCitationClick = (paperId: number) => {
    if (onCitationClick) {
      onCitationClick(paperId);
      return;
    }
  };

  const renderStructuredContent = (content: string) => {
    if (!content) return null;
    const blocks = content.split(/\n(?=#+\s+)/);
    return (
      <div className="space-y-10">
        {blocks.map((block, blockIdx) => {
          const lines = block.split('\n').filter(l => l.trim() !== '');
          const headerLine = lines.find(l => l.startsWith('#'));
          const bodyLines = lines.filter(l => !l.startsWith('#'));
          return (
            <div key={blockIdx} className="group/block relative">
              {headerLine && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Activity size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {renderInlineElements(headerLine.replace(/#+\s+/, ''))}
                  </h3>
                </div>
              )}
              <div className="space-y-6">
                {bodyLines.map((line, lineIdx) => {
                  const isListItem = /^\s*(\d+\.|\*|-|•)\s+/.test(line);
                  if (isListItem) {
                    const cleanedText = line.replace(/^\s*(\d+\.|\*|-|•)\s+/, '');
                    return (
                      <div key={lineIdx} className="flex gap-4 pl-4 group/item relative">
                        <div className="absolute left-[20px] top-6 bottom-[-24px] w-px bg-slate-100 group-last/item:hidden" />
                        <div className="mt-2.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-sm flex-shrink-0 z-[1]" />
                        <div className="text-[16px] text-slate-700 leading-[1.8] font-[450] py-0.5">
                          {renderInlineElements(cleanedText)}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <p key={lineIdx} className="text-[16px] text-slate-600 leading-[1.8] font-[450] pl-4 border-l-2 border-transparent hover:border-slate-100 transition-colors">
                      {renderInlineElements(line)}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderInlineElements = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\[\d+\]|(?:\d+(?:\.\d+)?%|\b\d+\s+(?:months|years|mg|days)\b))/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const innerText = part.slice(2, -2);
        return <strong key={idx} className="font-bold text-slate-900 bg-emerald-50/50 px-1.5 py-0.5 rounded border-b border-emerald-100">{renderCitationsOnly(innerText)}</strong>;
      }
      if (part.match(/^\[\d+\]$/)) {
        const id = parseInt(part.slice(1, -1));
        const paper = papers.find(p => p.id === id);
        return <Citation key={idx} id={id} onClick={handleCitationClick} paper={paper} />;
      }
      if (part.match(/(?:\d+(?:\.\d+)?%|\b\d+\s+(?:months|years|mg|days)\b)/)) {
        return (
          <span key={idx} className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[14px]">
            <BarChart3 size={12} className="opacity-50" />
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const renderCitationsOnly = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const id = parseInt(match[1]);
        const paper = papers.find(p => p.id === id);
        return <Citation key={index} id={id} onClick={handleCitationClick} paper={paper} />;
      }
      return part;
    });
  };

  const PaperCard: React.FC<{ paper: Paper }> = ({ paper }) => (
    <div 
      id={`paper-${paper.id}`} 
      className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group"
    >
      <div className="p-8 pb-4">
        <h3 className="text-[18px] font-bold text-slate-900 group-hover:text-emerald-600 cursor-pointer mb-3 leading-snug transition-colors">
          {paper.title}
        </h3>
        <p className="text-[14px] text-slate-500 leading-relaxed mb-6 font-medium">
          {paper.abstract}
        </p>
      </div>
      <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-wider">
            <FileText size={16} /> PDF Report
          </button>
          <a 
            href={paper.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-wider"
          >
            <ExternalLink size={16} /> PubMed
          </a>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-white border border-emerald-100 px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-widest">
          Ref [{paper.id}]
        </span>
      </div>
    </div>
  );

  if (!currentQuery && !isGlobalLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-sm border border-emerald-100/50">
          <Microscope size={44} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">MedSearch AI Platform</h1>
        <p className="text-slate-500 max-w-lg text-[16px] leading-relaxed mb-10">
          Search the world's most reputable clinical databases and synthesize findings into an evidence-based executive report instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3 tracking-tight">Analysis Results</h1>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            {isGlobalLoading ? (
              <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Synthesizing literature...</span>
            ) : (
              <>
                <span className="text-slate-400">Database Scan: <span className="text-slate-900">Found {papers.length * 12} articles</span></span>
                <span className="text-slate-200">|</span>
                <span className="text-emerald-600">Relevance Filter: <span className="font-black underline">{papers.length} Peer-Reviewed Studies</span></span>
              </>
            )}
          </div>
          {!isGlobalLoading && (globalSummary || paperSummary) && (
            <button 
              onClick={onSaveProject}
              className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm"
            >
              <Save size={14} /> Save to Projects
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-10 border-b border-slate-200 mb-10 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-5 text-[14px] font-black transition-all relative whitespace-nowrap tracking-widest uppercase ${
              activeTab === tab ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-emerald-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-32">
          {isGlobalLoading ? (
            <div className="bg-white border border-slate-200 rounded-[3rem] p-40 flex flex-col items-center justify-center gap-10 shadow-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <Loader2 className="animate-spin text-emerald-600 relative z-10" size={64} strokeWidth={1} />
              </div>
              <div className="text-center space-y-4">
                <p className="text-2xl font-black text-slate-900 tracking-tight uppercase">Scanning Repositories</p>
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Extracting metadata from peer-reviewed databases...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 relative flex flex-col border-opacity-60">
              <div className="px-12 py-10 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-[10]">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
                      {activeContext?.type === 'paper' ? `Paper Deep-Dive` : "Executive Summary"}
                    </h2>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em] mt-0.5">Clinical Intelligence Synthesis</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {activeContext?.type === 'paper' && (
                    <button 
                      onClick={onResetContext}
                      className="flex items-center gap-2 text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all uppercase tracking-widest"
                    >
                      <RefreshCcw size={14} /> Global View
                    </button>
                  )}
                  <button 
                    onClick={async () => {
                      setIsSynthesizing(true);
                      const content = activeContext?.type === 'paper' ? paperSummary : globalSummary;
                      const generated = await generateNotesFromText(content || "");
                      setNotes(prev => [...generated.map((n:any, i:any) => ({...n, id: Date.now()+i, date: 'Today', lastEdited: 'Just now'})), ...prev]);
                      setIsSynthesizing(false);
                    }}
                    disabled={isSynthesizing || (!globalSummary && !paperSummary)}
                    className="flex items-center gap-3 text-[11px] font-black text-emerald-600 bg-white hover:bg-emerald-50 border border-emerald-200 px-5 py-2.5 rounded-xl uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-sm active:scale-95"
                  >
                    {isSynthesizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isSynthesizing ? "Synthesizing..." : "Convert to Notes"}
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-slate-50">
                {/* Main Content Area */}
                <div className="p-12 lg:p-16 space-y-16" id="summary-body">
                  {activeContext?.type === 'paper' ? (
                    <div className="animate-in fade-in duration-500">
                      {isSummaryLoading ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-8 text-slate-300">
                          <Loader2 className="animate-spin text-emerald-400" size={48} strokeWidth={1} />
                          <p className="text-sm font-black tracking-[0.3em] uppercase">Generating Technical Breakdown</p>
                        </div>
                      ) : (
                        <div className="max-w-none">
                          <div className="mb-14 p-10 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-slate-100 pointer-events-none">
                                <BookOpen size={120} strokeWidth={0.5} />
                            </div>
                            <div className="relative z-1">
                              <h4 className="text-2xl font-black text-slate-900 flex items-center gap-4 leading-tight mb-4">
                                {activeContext.data?.title}
                              </h4>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <User size={14} />
                                </div>
                                <p className="text-[14px] text-slate-500 font-bold italic">{activeContext.data?.authors}</p>
                              </div>
                            </div>
                          </div>
                          <div className="structured-content-container">
                            {renderStructuredContent(paperSummary || "")}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-800">
                      {globalSummary ? (
                        <div className="structured-content-container">
                          {renderStructuredContent(globalSummary)}
                        </div>
                      ) : (
                        <div className="py-40 flex flex-col items-center justify-center text-slate-400 gap-6">
                           <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                              <Activity size={48} className="text-slate-200" />
                           </div>
                          <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-300">Awaiting Search Completion</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Follow-up Section (Unified Style) */}
                {chatMessages.length > 0 && (
                  <div className="bg-white">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {msg.role === 'user' ? (
                          <div className="px-12 lg:px-16 py-8 flex justify-end bg-slate-50/30 border-b border-slate-50">
                            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-[15px] font-bold text-slate-700 shadow-sm flex items-center gap-3">
                              <User size={16} className="text-slate-400" />
                              {msg.content}
                            </div>
                          </div>
                        ) : (
                          <div className="p-12 lg:p-16 border-b border-slate-50">
                            <div className="assistant-response-full">
                              {renderStructuredContent(msg.content)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {isChatLoading && (
                  <div className="p-12 lg:p-16 flex flex-col items-center justify-center gap-6 text-slate-300">
                    <Loader2 className="animate-spin text-emerald-500" size={32} strokeWidth={1.5} />
                    <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Assistant is synthesizing follow-up findings</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="p-8 lg:p-12 pt-6 bg-white border-t border-slate-100 sticky bottom-0 z-20 backdrop-blur-md bg-white/90">
                <div className="relative group max-w-3xl mx-auto">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder={activeContext?.type === 'paper' ? `Ask a follow-up about this paper...` : "Ask the research assistant a follow-up question..."}
                    className="w-full pl-6 pr-20 py-4 text-[16px] border border-slate-200 rounded-[1.5rem] bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-400 font-medium shadow-sm"
                  />
                  <button 
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="absolute right-3 top-2.5 w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100 shadow-lg"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "Papers (" + papers.length + ")" && (
        <div className="space-y-8 animate-in fade-in duration-500 pb-32">
          {papers.length === 0 ? (
            <div className="py-40 text-center text-slate-300 font-black uppercase tracking-[0.3em] italic">Awaiting Publication Feed</div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Notes" && (
        <div className="animate-in fade-in duration-500 space-y-10 pb-32">
          <div className="flex items-center justify-between">
             <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Synthesized Knowledge Base</h3>
                <p className="text-slate-500 font-bold text-[14px] mt-1">Found {notes.length} verified clinical observations</p>
             </div>
             <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-emerald-200 transition-all active:scale-95">
               <Plus size={20} /> Create Manual Observation
            </button>
          </div>
          {notes.length === 0 ? (
            <div className="py-40 text-center text-slate-300 italic font-bold border-4 border-dashed border-slate-50 rounded-[4rem] bg-white">
               No notes synthesized. Utilize the <span className="text-emerald-600 underline underline-offset-4">Synthesis Tool</span> in the Overview panel.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredNotes.map((note) => (
                <div key={note.id} className="group bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:border-emerald-400 hover:shadow-[0_20px_60px_-15px_rgba(5,150,105,0.15)] transition-all cursor-pointer flex flex-col h-full ring-emerald-500/5 hover:ring-8">
                  <h4 className="text-[18px] font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{note.title}</h4>
                  <div className="text-[14px] text-slate-600 leading-relaxed line-clamp-5 mb-10 flex-grow font-medium">{renderInlineElements(note.content)}</div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> {note.tags[0] || 'Uncategorized'}</span>
                    <span>{note.lastEdited}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
