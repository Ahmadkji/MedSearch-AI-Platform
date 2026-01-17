
import React, { useState, useMemo } from 'react';
import { Filter, Calendar, ChevronDown, Search, Bookmark, FileText, ExternalLink, MessageSquare, Plus, MoreHorizontal, Clock, Tag, ChevronRight, BookOpen, X } from 'lucide-react';

interface AnalysisViewProps {
  onChatWithPaper?: (paper: any) => void;
}

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
  lastEdited: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ onChatWithPaper }) => {
  const tabs = ["Overview", "Papers (12)", "Notes"];
  const [activeTab, setActiveTab] = React.useState("Overview");
  const [noteSearch, setNoteSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  
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
    },
    {
      id: 3,
      title: "JAK-STAT Pathway Mechanism Observations",
      content: "The targeted inhibition of JAK1/2 seems crucial. Observation: Side effects like acne appear dose-dependent in most phase 2 trials. Need to check if this carries over to phase 3 results.",
      date: "Oct 08, 2023",
      tags: ["Mechanism", "Safety", "JAK"],
      lastEdited: "3 days ago"
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

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
                           n.content.toLowerCase().includes(noteSearch.toLowerCase());
      const matchesTags = activeFilters.length === 0 || 
                         activeFilters.every(filterTag => n.tags.includes(filterTag));
      return matchesSearch && matchesTags;
    });
  }, [notes, noteSearch, activeFilters]);

  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;

    const tagsArray = newNote.tags.split(',').map(t => t.trim()).filter(t => t !== "");
    const note: Note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      tags: tagsArray,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastEdited: "Just now"
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', tags: '' });
    setIsAddingNote(false);
  };

  const handleCitationClick = (paperId: number) => {
    setActiveTab("Papers (12)");
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
          </div>
        </div>
      )}

      {activeTab === "Papers (12)" && (
        <div className="space-y-6 animate-in fade-in duration-300">
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
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter..." 
                className="bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs w-full sm:w-40 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

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
        <div className="animate-in fade-in duration-300 space-y-6">
          {/* Note Management Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  placeholder="Search in notes..." 
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
                />
              </div>
            </div>
            <button 
              onClick={() => setIsAddingNote(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <Plus size={16} />
              <span>New Note</span>
            </button>
          </div>

          {/* Tag Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-2 text-slate-400 mr-2 flex-shrink-0">
              <Tag size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Filters:</span>
            </div>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${
                  activeFilters.includes(tag)
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-600'
                }`}
              >
                {tag}
              </button>
            ))}
            {activeFilters.length > 0 && (
              <button 
                onClick={() => setActiveFilters([])}
                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 underline underline-offset-4 ml-2 whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Note Grid */}
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredNotes.map((note) => (
                <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-200 transition-all group flex flex-col h-full relative">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {note.tags.map(tag => (
                      <button 
                        key={tag} 
                        onClick={(e) => { e.stopPropagation(); toggleFilter(tag); }}
                        className={`px-2 py-0.5 text-[9px] lg:text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${
                          activeFilters.includes(tag)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border border-dashed border-slate-200 rounded-xl">
              <Search size={32} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No notes match your current filters</p>
              <button 
                onClick={() => { setNoteSearch(""); setActiveFilters([]); }}
                className="mt-2 text-xs text-emerald-600 font-bold hover:underline"
              >
                Clear all search and filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Note Modal Overlay */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-600 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Plus size={18} />
                Create New Research Note
              </h3>
              <button onClick={() => setIsAddingNote(false)} className="hover:bg-emerald-500 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddNote} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Title</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newNote.title}
                  onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="e.g. Mechanism Analysis"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Content</label>
                <textarea 
                  required
                  rows={4}
                  value={newNote.content}
                  onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Summarize your observation..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={newNote.tags}
                  onChange={e => setNewNote({ ...newNote, tags: e.target.value })}
                  placeholder="JAK, Safety, Methodology..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="pt-4 flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
                >
                  Save Note
                </button>
              </div>
            </form>
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
