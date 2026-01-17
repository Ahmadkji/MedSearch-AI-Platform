
import React, { useState } from 'react';
import { Filter, Calendar, ChevronDown, Search, Bookmark, FileText, ExternalLink, MessageSquare, Plus, MoreHorizontal, Clock, Tag, ChevronRight, BookOpen } from 'lucide-react';

interface AnalysisViewProps {
  onChatWithPaper?: (paper: any) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ onChatWithPaper }) => {
  const tabs = ["Overview", "Papers (12)", "Notes"];
  const [activeTab, setActiveTab] = React.useState("Overview");
  const [noteSearch, setNoteSearch] = useState("");

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

  const handleCitationClick = (paperId: number) => {
    setActiveTab("Papers (12)");
    // In a real app, we would scroll to the specific paper element
    setTimeout(() => {
      const element = document.getElementById(`paper-${paperId}`);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const Citation = ({ id }: { id: number }) => (
    <sup 
      onClick={(e) => {
        e.stopPropagation();
        handleCitationClick(id);
      }}
      className="ml-0.5 px-1 rounded cursor-pointer text-emerald-600 font-bold hover:bg-emerald-100 transition-colors"
    >
      [{id}]
    </sup>
  );

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Title Area */}
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">Analysis Results</h1>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] lg:text-xs text-slate-500">
          <span>Found 142 articles</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span>Filtered to 12 relevant studies</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span>Updated 2 mins ago</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 lg:gap-8 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Executive Summary</h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">
                <Sparkles size={12} className="animate-pulse" />
                AI Generated
              </div>
            </div>
            
            <div className="p-6 lg:p-8 space-y-8">
              {/* Clinical Significance Section */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="text-emerald-500" />
                  Clinical Significance
                </h3>
                <p className="text-sm lg:text-[15px] text-slate-700 leading-relaxed">
                  The treatment landscape for severe alopecia areata (AA) has been fundamentally transformed by the advent of systemic JAK inhibitors. 
                  In two landmark phase 3 trials (BRAVE-AA1 and BRAVE-AA2), oral baricitinib demonstrated a statistically significant 
                  superiority over placebo in achieving a SALT score of ≤20 (representing 80% scalp hair coverage) at week 36<Citation id={1} />. 
                  This breakthrough led to the first-ever FDA approval for a systemic treatment in adults with severe AA, 
                  offering a viable pharmacological intervention for a condition previously limited to topical or intralesional therapies<Citation id={1} />.
                </p>
              </section>

              {/* Mechanism Section */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Tag size={14} className="text-emerald-500" />
                  Mechanism of Action
                </h3>
                <p className="text-sm lg:text-[15px] text-slate-700 leading-relaxed">
                  The therapeutic efficacy is primarily driven by the interruption of the JAK-STAT signaling pathway, 
                  which is critical for the production of interferon-γ (IFN-γ) and interleukin-15 (IL-15)<Citation id={1} />. 
                  Newer agents like ritlecitinib provide a more targeted approach by inhibiting JAK3 and the TEC family 
                  of kinases, effectively preventing the activation of cytotoxic T cells and natural killer (NK) cells 
                  that drive the autoimmune destruction of hair follicles<Citation id={2} />.
                </p>
              </section>

              {/* Safety & Tolerability Section */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Filter size={14} className="text-emerald-500" />
                  Safety & Tolerability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Across both baricitinib and ritlecitinib cohorts, the most frequent adverse events (AEs) 
                      included upper respiratory tract infections, headache, and nasopharyngitis<Citation id={1} /><Citation id={2} />. 
                      Notably, acne was reported more frequently in baricitinib groups compared to placebo (approx. 5.1% vs 1.2%)<Citation id={1} />.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-2">Key Laboratory Findings</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Dose-dependent elevations in creatine kinase levels<Citation id={1} />
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Minor increases in LDL and HDL cholesterol<Citation id={1} />
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="bg-emerald-50/50 p-6 border-l-4 border-emerald-500 rounded-r-lg text-[13px] lg:text-sm italic text-slate-600 leading-relaxed">
                "The shift from symptomatic topical treatment to targeted systemic inhibition represents a paradigm shift in alopecia research, 
                though long-term safety data beyond 52 weeks is essential for evaluating the risk of thromboembolic events and malignancy."
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sources in this summary</h4>
              <div className="space-y-1">
                {papers.map(p => (
                  <div key={p.id} className="text-xs flex items-center gap-2 group cursor-pointer" onClick={() => handleCitationClick(p.id)}>
                    <span className="font-bold text-emerald-600">[{p.id}]</span>
                    <span className="text-slate-500 group-hover:text-emerald-600 transition-colors truncate">{p.title} — {p.journal} ({p.date})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Papers (12)" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Study Type <ChevronDown size={12} className="text-slate-400" />
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Year <ChevronDown size={12} className="text-slate-400" />
              </button>
              <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Journal <ChevronDown size={12} className="text-slate-400" />
              </button>
              <button className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 ml-1">
                Reset
              </button>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search size={14} />
              </div>
              <input 
                type="text" 
                placeholder="Filter..." 
                className="bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs w-full sm:w-40 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Paper List */}
          <div className="space-y-4">
            {papers.map((paper) => (
              <div id={`paper-${paper.id}`} key={paper.id} className="bg-white border border-slate-200 rounded-xl p-4 lg:p-6 shadow-sm group hover:border-emerald-200 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-2">
                    {paper.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] lg:text-[10px] font-bold rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] lg:text-[10px] font-bold rounded uppercase tracking-wider">
                      Reference [{paper.id}]
                    </span>
                  </div>
                  <button className="text-slate-300 hover:text-emerald-600 transition-colors p-1">
                    <Bookmark size={18} />
                  </button>
                </div>

                <h3 className="text-base lg:text-lg font-bold text-emerald-600 hover:underline cursor-pointer mb-2 leading-tight">
                  {paper.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 mb-4 font-medium">
                  <span className="text-slate-900 font-bold">{paper.authors}</span>
                  <span className="text-slate-300">•</span>
                  <span>{paper.journal}</span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span>{paper.date}</span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span>Cited by {paper.citations}</span>
                </div>

                <p className="text-xs lg:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-2">
                  {paper.abstract}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4 lg:gap-6">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors">
                      <FileText size={14} />
                      PDF
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors">
                      <ExternalLink size={14} />
                      PubMed
                    </button>
                  </div>
                  <button 
                    onClick={() => onChatWithPaper?.(paper)}
                    className="flex items-center justify-center gap-2 bg-slate-50 sm:bg-transparent py-2.5 sm:py-0 rounded-lg sm:rounded-none text-xs font-bold sm:font-semibold text-emerald-600 sm:text-slate-500 hover:text-emerald-600 transition-colors active:scale-95"
                  >
                    <MessageSquare size={14} />
                    Chat with Paper
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Notes" && (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  placeholder="Search notes..." 
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
                />
              </div>
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <Tag size={14} />
                <span>Tags</span>
              </button>
            </div>
            <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95">
              <Plus size={16} />
              <span>New Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-200 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] lg:text-[10px] font-bold rounded uppercase tracking-wider">Comparison</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] lg:text-[10px] font-bold rounded uppercase tracking-wider">Efficacy</span>
                </div>
              </div>
              <h4 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">Efficacy Comparison: Baricitinib vs. Ritlecitinib</h4>
              <p className="text-[11px] lg:text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3 flex-grow">Initial meta-analysis suggests Baricitinib has a slightly higher success rate in pediatric cohorts, though ritlecitinib shows promising results in long-term safety profiles regarding infection rates.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-medium text-slate-400">
                <div className="flex items-center gap-1.5"><Calendar size={12} /><span>Oct 12, 2023</span></div>
                <div className="flex items-center gap-1.5"><Clock size={12} /><span>2 hours ago</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;

// Dummy helper icon
const Sparkles = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
