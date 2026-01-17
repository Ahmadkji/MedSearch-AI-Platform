
import React, { useState } from 'react';
import { Filter, Calendar, ChevronDown, Search, Bookmark, FileText, ExternalLink, MessageSquare, Plus, MoreHorizontal, Clock, Tag } from 'lucide-react';

interface AnalysisViewProps {
  onChatWithPaper?: (paper: any) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ onChatWithPaper }) => {
  const tabs = ["Overview", "Papers (12)", "Notes"];
  const [activeTab, setActiveTab] = React.useState("Papers (12)");
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
    }
  ];

  const notes = [
    {
      id: 1,
      title: "Efficacy Comparison: Baricitinib vs. Ritlecitinib",
      content: "Initial meta-analysis suggests Baricitinib has a slightly higher success rate in pediatric cohorts, though ritlecitinib shows promising results in long-term safety profiles regarding infection rates.",
      date: "Oct 12, 2023",
      tags: ["Comparison", "Efficacy"],
      lastEdited: "2 hours ago"
    },
    {
      id: 2,
      title: "Exclusion Criteria Summary for King et al.",
      content: "Key exclusions to note: active tuberculosis history, malignancy within 5 years, and concurrent use of other systemic JAK inhibitors. This limits the generalizability to comorbid patients.",
      date: "Oct 10, 2023",
      tags: ["Methodology", "Exclusion"],
      lastEdited: "1 day ago"
    },
    {
      id: 3,
      title: "JAK-STAT Pathway Mechanism Observations",
      content: "The targeted inhibition of JAK1/2 seems crucial. Observation: Side effects like acne appear dose-dependent in most phase 2 trials. Need to check if this carries over to phase 3 results.",
      date: "Oct 08, 2023",
      tags: ["Mechanism", "Safety"],
      lastEdited: "3 days ago"
    }
  ];

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
    n.content.toLowerCase().includes(noteSearch.toLowerCase())
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
              <div key={paper.id} className="bg-white border border-slate-200 rounded-xl p-4 lg:p-6 shadow-sm group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-2">
                    {paper.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] lg:text-[10px] font-bold rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
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
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-200 transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] lg:text-[10px] font-bold rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <h4 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {note.title}
                </h4>
                
                <p className="text-[11px] lg:text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-medium text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{note.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{note.lastEdited}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Overview" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 shadow-sm animate-in fade-in duration-300">
           <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 lg:mb-6">Executive Summary</h2>
           <div className="space-y-4 lg:space-y-6 text-sm lg:text-base text-slate-700 leading-relaxed">
             <p>
               <span className="font-bold text-slate-900">Primary Outcome:</span> Oral JAK inhibitors, specifically baricitinib and ritlecitinib, have demonstrated superior efficacy in inducing hair regrowth compared to placebo in patients with severe alopecia areata (AA).
             </p>
             <p>
               <span className="font-bold text-slate-900">Safety Profile:</span> Most common adverse events include upper respiratory tract infections, headache, and acne. Serious infections were rare but present across all major phase 3 trials.
             </p>
             <div className="bg-emerald-50/50 p-4 border-l-4 border-emerald-500 rounded-r-lg text-xs lg:text-sm italic text-slate-600">
               "Current evidence suggests that JAK inhibitors are the most effective systemic therapy available for AA, though long-term maintenance data is still being collected."
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
