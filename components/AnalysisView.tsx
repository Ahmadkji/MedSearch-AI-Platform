
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, Calendar, ChevronDown, Search, Bookmark, FileText, ExternalLink, MessageSquare, Plus, MoreHorizontal, Clock, Tag, ChevronRight, BookOpen, X, Sparkles, Wand2, CheckCircle2, Loader2, HelpCircle, ArrowRight, Save, BookmarkCheck, CornerDownRight } from 'lucide-react';
import { generateNotesFromText, generateRelatedQuestions, generateDiscoveryAnswer } from '../services/geminiService';

interface AnalysisViewProps {
  onChatWithPaper?: (paper: any) => void;
  query?: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
  lastEdited: string;
}

interface RelatedQuestion {
  question: string;
  category: string;
}

// Define props for the Citation component
interface CitationProps {
  id: number;
  onClick: (id: number) => void;
}

// Separate Citation component for global use
const Citation: React.FC<CitationProps> = ({ id, onClick }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick(id);
    }}
    className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-[10px] px-1.5 py-0.5 rounded-md mx-0.5 hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-110 active:scale-90"
  >
    [{id}]
  </button>
);

const AnalysisView: React.FC<AnalysisViewProps> = ({ onChatWithPaper, query = "Efficacy of JAK inhibitors in treating severe alopecia areata" }) => {
  const tabs = ["Overview", "Papers (12)", "Notes"];
  const [activeTab, setActiveTab] = React.useState("Overview");
  const [noteSearch, setNoteSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  
  // Inline Discovery States
  const [activeDiscoveryQuestion, setActiveDiscoveryQuestion] = useState<string | null>(null);
  const [discoveryAnswer, setDiscoveryAnswer] = useState<string | null>(null);
  const [isAnsweringDiscovery, setIsAnsweringDiscovery] = useState(false);
  const [isDiscoverySaved, setIsDiscoverySaved] = useState(false);
  const [recursiveQuestions, setRecursiveQuestions] = useState<RelatedQuestion[]>([]);
  const [isLoadingRecursive, setIsLoadingRecursive] = useState(false);
  
  const discoveryResultRef = useRef<HTMLDivElement>(null);
  
  // Note Form State
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Efficacy Comparison: Baricitinib vs. Ritlecitinib",
      content: "Initial meta-analysis suggests Baricitinib has a slightly higher success rate in pediatric cohorts, though ritlecitinib shows promising results in long-term safety profiles regarding infection rates.",
      date: "Oct 12, 2023",
      tags: ["Comparison", "Efficacy", "JAK"],
      lastEdited: "2 hours ago"
    },
    {
      id: 2,
      title: "Exclusion Criteria Summary for King et al.",
      content: "Key exclusions to note: active tuberculosis history, malignancy within 5 years, and concurrent use of other systemic JAK inhibitors. This limits the generalizability to comorbid patients.",
      date: "Oct 10, 2023",
      tags: ["Methodology", "Safety"],
      lastEdited: "1 day ago"
    }
  ]);

  const papers = [
    {
      id: 1,
      title: "Two Phase 3 Trials of Baricitinib for Alopecia Areata",
      authors: "King B, et al.",
      journal: "New England Journal of Medicine",
      date: "May 2022",
      citations: 145,
      abstract: "In two phase 3 trials involving patients with severe alopecia areata, oral baricitinib was superior to placebo with respect to hair regrowth at 36 weeks. Acne, elevated levels of creatine kinase, and increased levels of low-...",
      tags: ["RCT", "Phase 3"]
    },
    {
      id: 2,
      title: "Ritlecitinib for the Treatment of Alopecia Areata",
      authors: "King B, et al.",
      journal: "The Lancet",
      date: "April 2023",
      citations: 89,
      abstract: "Ritlecitinib, an oral selective JAK3/TEC family kinase inhibitor, was effective and well tolerated in patients aged 12 years and older with alopecia areata and at least 50% scalp hair loss.",
      tags: ["JAK3/TEC", "Adolescent"]
    }
  ];

  // Load Related Questions on mount or tab switch
  useEffect(() => {
    if (activeTab === "Overview" && relatedQuestions.length === 0) {
      loadQuestions();
    }
  }, [activeTab]);

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    const summaryText = document.getElementById('summary-body')?.innerText || "";
    const questions = await generateRelatedQuestions(query, summaryText);
    setRelatedQuestions(questions);
    setIsLoadingQuestions(false);
  };

  const handleSynthesizeNotes = async () => {
    setIsSynthesizing(true);
    const summaryContent = document.getElementById('summary-body')?.innerText || "";
    const generated = await generateNotesFromText(summaryContent);
    if (generated && generated.length > 0) {
      const newNotes: Note[] = generated.map((n: any, idx: number) => ({
        id: Date.now() + idx,
        title: n.title,
        content: n.content,
        tags: [...n.tags, "AI Generated"],
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastEdited: "Just now"
      }));
      setNotes(prev => [...newNotes, ...prev]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setIsSynthesizing(false);
  };

  const handleQuestionClick = async (question: string) => {
    if (activeDiscoveryQuestion === question && discoveryAnswer && !isLoadingRecursive) return;
    setActiveDiscoveryQuestion(question);
    setIsAnsweringDiscovery(true);
    setDiscoveryAnswer(null);
    setIsDiscoverySaved(false);
    setRecursiveQuestions([]);
    const summaryContent = document.getElementById('summary-body')?.innerText || "";
    const result = await generateDiscoveryAnswer(question, summaryContent);
    setDiscoveryAnswer(result);
    setIsAnsweringDiscovery(false);
    setIsLoadingRecursive(true);
    const nextQuestions = await generateRelatedQuestions(question, result);
    setRecursiveQuestions(nextQuestions);
    setIsLoadingRecursive(false);
    setTimeout(() => {
      discoveryResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSaveDiscoveryToNotes = () => {
    if (!activeDiscoveryQuestion || !discoveryAnswer || isDiscoverySaved) return;
    const note: Note = {
      id: Date.now(),
      title: `Discovery: ${activeDiscoveryQuestion}`,
      content: discoveryAnswer,
      tags: ["AI Discovery", "Follow-up"],
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastEdited: "Just now"
    };
    setNotes([note, ...notes]);
    setIsDiscoverySaved(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCitationClick = (paperId: number) => {
    setActiveTab("Papers (12)");
    setTimeout(() => {
      const element = document.getElementById(`paper-${paperId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-emerald-500/30', 'transition-all');
        setTimeout(() => element.classList.remove('ring-4', 'ring-emerald-500/30'), 2000);
      }
    }, 150);
  };

  const renderDiscoveryContent = (content: string) => {
    const parts = content.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const id = parseInt(match[1]);
        return <Citation key={index} id={id} onClick={handleCitationClick} />;
      }
      return part;
    });
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
                           n.content.toLowerCase().includes(noteSearch.toLowerCase());
      const matchesTags = activeFilters.length === 0 || 
                         activeFilters.every(filterTag => n.tags.includes(filterTag));
      return matchesSearch && matchesTags;
    });
  }, [notes, noteSearch, activeFilters]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [notes]);

  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    const note: Note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(t => t.trim()).filter(t => t),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastEdited: "Just now"
    };
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', tags: '' });
    setIsAddingNote(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Title Area */}
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">Analysis Results</h1>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] lg:text-xs text-slate-500 font-medium">
          <span>Found 142 articles</span>
          <span className="text-slate-300 sm:inline mx-1 hidden">•</span>
          <span>Filtered to 12 relevant studies</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 lg:gap-8 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative">
            {/* Summary Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Executive Summary</h2>
              <div className="flex items-center gap-3">
                {showSuccess ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in zoom-in-95">
                    <CheckCircle2 size={16} />
                    <span>Added to Notes</span>
                  </div>
                ) : (
                  <button 
                    onClick={handleSynthesizeNotes}
                    disabled={isSynthesizing}
                    className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {isSynthesizing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    {isSynthesizing ? "Synthesizing..." : "Synthesize Notes"}
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-1.5 rounded-lg uppercase tracking-wider">
                  <Sparkles size={12} className="text-amber-400" />
                  AI Verified
                </div>
              </div>
            </div>
            
            {/* Detailed Summary Sections */}
            <div className="p-6 lg:p-8 space-y-8" id="summary-body">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="text-emerald-500" />
                  Clinical Significance
                </h3>
                <p className="text-sm lg:text-[15px] text-slate-700 leading-relaxed">
                  The treatment landscape for severe alopecia areata (AA) has been fundamentally transformed by the advent of systemic JAK inhibitors. 
                  In two landmark phase 3 trials (BRAVE-AA1 and BRAVE-AA2), oral baricitinib demonstrated a statistically significant 
                  superiority over placebo in achieving a SALT score of ≤20 (representing 80% scalp hair coverage) at week 36<Citation id={1} onClick={handleCitationClick} />. 
                  This breakthrough led to the first-ever FDA approval for a systemic treatment in adults with severe AA<Citation id={1} onClick={handleCitationClick} />.
                </p>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Tag size={14} className="text-emerald-500" />
                  Mechanism of Action
                </h3>
                <p className="text-sm lg:text-[15px] text-slate-700 leading-relaxed">
                  The therapeutic efficacy is primarily driven by the interruption of the JAK-STAT signaling pathway, 
                  which is critical for the production of interferon-γ (IFN-γ) and interleukin-15 (IL-15)<Citation id={1} onClick={handleCitationClick} />. 
                  Newer agents like ritlecitinib provide a more targeted approach by inhibiting JAK3 and the TEC family 
                  of kinases<Citation id={2} onClick={handleCitationClick} />.
                </p>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Filter size={14} className="text-emerald-500" />
                  Safety & Tolerability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Across both baricitinib and ritlecitinib cohorts, the most frequent adverse events (AEs) 
                    included upper respiratory tract infections, headache, and nasopharyngitis<Citation id={1} onClick={handleCitationClick} /><Citation id={2} onClick={handleCitationClick} />.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-2">Key Laboratory Findings</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Dose-dependent elevations in creatine kinase levels<Citation id={1} onClick={handleCitationClick} />
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Minor increases in LDL and HDL cholesterol<Citation id={1} onClick={handleCitationClick} />
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Discovery Paths (Vertical Stack) */}
              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HelpCircle size={14} className="text-emerald-500" />
                  Discovery Paths (Related Questions)
                </h3>
                
                {isLoadingQuestions ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 mb-6">
                    {relatedQuestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuestionClick(item.question)}
                        disabled={isAnsweringDiscovery && activeDiscoveryQuestion === item.question}
                        className={`group flex items-center p-4 bg-white border rounded-xl transition-all text-left relative overflow-hidden ${
                          activeDiscoveryQuestion === item.question 
                            ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20 bg-emerald-50/10' 
                            : 'border-slate-100 hover:border-emerald-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex-1">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-1 inline-block px-1.5 py-0.5 bg-emerald-50 rounded">
                            {item.category}
                          </span>
                          <p className="text-sm font-semibold text-slate-700 leading-snug">
                            {item.question}
                          </p>
                        </div>
                        <div className="ml-4 p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                          {isAnsweringDiscovery && activeDiscoveryQuestion === item.question ? (
                            <Loader2 size={16} className="text-emerald-400 animate-spin" />
                          ) : (
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Inline Discovery Result Box */}
                {(isAnsweringDiscovery || discoveryAnswer) && activeDiscoveryQuestion && (
                  <div 
                    ref={discoveryResultRef}
                    className="animate-in fade-in slide-in-from-top-4 duration-500 bg-white border border-emerald-100 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-xl"
                  >
                    {/* Progress Indicator */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-100/50">
                      {isAnsweringDiscovery && (
                        <div className="h-full bg-emerald-500 animate-[shimmer_2s_infinite]" style={{ width: '40%' }}></div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-6 mb-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                          <HelpCircle size={20} />
                        </div>
                        <div className="pt-0.5">
                          <h4 className="text-[15px] font-bold text-slate-900 leading-tight">{activeDiscoveryQuestion}</h4>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <Sparkles size={10} className="text-amber-400" />
                              AI Deep Dive Insight
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {discoveryAnswer && !isAnsweringDiscovery && (
                          <button 
                            onClick={handleSaveDiscoveryToNotes}
                            disabled={isDiscoverySaved}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95 ${
                              isDiscoverySaved 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-500'
                            }`}
                          >
                            {isDiscoverySaved ? <BookmarkCheck size={14} /> : <Save size={14} />}
                            <span>{isDiscoverySaved ? 'Saved to Library' : 'Save to Notes'}</span>
                          </button>
                        )}
                        <button 
                          onClick={() => { setActiveDiscoveryQuestion(null); setDiscoveryAnswer(null); }}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      {isAnsweringDiscovery ? (
                        <div className="space-y-4">
                          <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                          <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                        </div>
                      ) : (
                        <div className="text-sm lg:text-[15px] text-slate-700 leading-relaxed space-y-4 prose prose-slate border-l-2 border-emerald-100 pl-4">
                          {discoveryAnswer && renderDiscoveryContent(discoveryAnswer)}
                        </div>
                      )}
                    </div>

                    {/* Recursive Vertical Follow-ups */}
                    {discoveryAnswer && !isAnsweringDiscovery && (
                      <div className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <div className="flex items-center gap-2 mb-4">
                          <CornerDownRight size={16} className="text-slate-300" />
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dive deeper based on this insight</h5>
                        </div>
                        
                        {isLoadingRecursive ? (
                          <div className="space-y-2">
                            <div className="w-full h-12 bg-slate-50 rounded-xl animate-pulse"></div>
                            <div className="w-full h-12 bg-slate-50 rounded-xl animate-pulse"></div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {recursiveQuestions.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleQuestionClick(q.question)}
                                className="group p-3 bg-white border border-slate-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all text-left flex items-center justify-between"
                              >
                                <div>
                                  <span className="text-[8px] font-bold text-emerald-600 uppercase px-1 py-0.5 bg-emerald-50 rounded mb-1 inline-block">
                                    {q.category}
                                  </span>
                                  <p className="text-[11px] font-semibold text-slate-600 leading-tight group-hover:text-slate-900">
                                    {q.question}
                                  </p>
                                </div>
                                <ChevronRight size={14} className="text-slate-200 group-hover:text-emerald-400 ml-4" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-8 flex items-center justify-between pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                        <Clock size={12} className="text-slate-300" />
                        REAL-TIME SYNTHESIS
                      </div>
                      <span className="text-[10px] text-slate-400 italic font-medium">Grounding context: MedSearch Proprietary Research Index</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Papers Tab */}
      {activeTab === "Papers (12)" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-4">
            {papers.map((paper) => (
              <div id={`paper-${paper.id}`} key={paper.id} className="bg-white border border-slate-200 rounded-xl p-4 lg:p-6 shadow-sm group hover:border-emerald-200 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-2">
                    {paper.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider">
                      Reference [{paper.id}]
                    </span>
                  </div>
                </div>
                <h3 className="text-base lg:text-lg font-bold text-emerald-600 hover:underline cursor-pointer mb-2 leading-tight">
                  {paper.title}
                </h3>
                <p className="text-xs lg:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-2">
                  {paper.abstract}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors">
                      <FileText size={14} /> PDF
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors">
                      <ExternalLink size={14} /> PubMed
                    </button>
                  </div>
                  <button 
                    onClick={() => onChatWithPaper?.(paper)}
                    className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-800"
                  >
                    <MessageSquare size={14} /> Chat with Paper
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === "Notes" && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Your Research Library</h3>
            <button onClick={() => setIsAddingNote(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
              <Plus size={16} /> New Note
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-200 transition-all flex flex-col h-full relative">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {note.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="font-bold text-slate-800 mb-2 line-clamp-1">{note.title}</h4>
                <p className="text-[11px] lg:text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {note.content}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {note.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {note.lastEdited}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Note Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-600 text-white font-bold">
              <span>New Research Note</span>
              <button onClick={() => setIsAddingNote(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddNote} className="p-6 space-y-4">
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                placeholder="Title"
                value={newNote.title}
                onChange={e => setNewNote({ ...newNote, title: e.target.value })}
              />
              <textarea 
                required
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                placeholder="Note Content"
                value={newNote.content}
                onChange={e => setNewNote({ ...newNote, content: e.target.value })}
              />
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                placeholder="Tags (comma separated)"
                value={newNote.tags}
                onChange={e => setNewNote({ ...newNote, tags: e.target.value })}
              />
              <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-md active:scale-95 transition-all">
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
