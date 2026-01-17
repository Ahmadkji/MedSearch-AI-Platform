
import React, { useRef, useEffect } from 'react';
import { FileText, ExternalLink, X, BookOpen, Download, Share2, Search, Quote, Bookmark, CheckCircle2, Wand2 } from 'lucide-react';

interface Paper {
  id: number;
  title: string;
  authors: string;
  journal: string;
  date: string;
  citations: number;
  abstract: string;
  tags: string[];
  url?: string;
}

interface ReferencesPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  papers: Paper[];
  focusedPaperId: number | null;
  onPaperClick?: (id: number) => void;
  onAnalyzePaper?: (paper: Paper, type: 'summary') => void;
  onBookmark?: (paper: Paper) => void;
}

const ReferencesPanel: React.FC<ReferencesPanelProps> = ({ 
  isCollapsed, 
  onToggle, 
  papers, 
  focusedPaperId,
  onPaperClick,
  onAnalyzePaper,
  onBookmark
}) => {
  const scrollRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (focusedPaperId && scrollRefs.current[focusedPaperId]) {
      scrollRefs.current[focusedPaperId]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [focusedPaperId]);

  if (isCollapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-16 bg-white border-l border-slate-200 h-full py-4 space-y-4">
        <button 
          onClick={onToggle}
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          title="Open References"
        >
          <BookOpen size={22} />
        </button>
        <div className="h-px w-8 bg-slate-100" />
        <div className="flex flex-col items-center gap-2 overflow-y-auto no-scrollbar">
          {papers.map(p => (
            <div 
              key={p.id}
              onClick={() => onPaperClick?.(p.id)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border cursor-pointer transition-all ${
                focusedPaperId === p.id 
                  ? 'bg-emerald-600 text-white border-emerald-600 scale-110 shadow-lg' 
                  : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-300 hover:text-emerald-500'
              }`}
            >
              [{p.id}]
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full sm:w-[400px] bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl lg:shadow-none transition-all duration-300">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-emerald-600" />
          <h2 className="font-bold text-slate-800 text-sm">Source Library</h2>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {papers.length}
          </span>
        </div>
        <button 
          onClick={onToggle}
          className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Search & Actions */}
      <div className="p-4 border-b border-slate-50 bg-slate-50/30 space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search references..." 
            className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={12} /> Export CSV
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Quote size={12} /> Cite All
          </button>
        </div>
      </div>

      {/* References List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20">
        {papers.map((paper) => (
          <div 
            key={paper.id}
            ref={el => { scrollRefs.current[paper.id] = el; }}
            onClick={() => onPaperClick?.(paper.id)}
            className={`bg-white border rounded-xl p-4 transition-all duration-300 cursor-pointer group hover:shadow-md ${
              focusedPaperId === paper.id 
                ? 'border-emerald-500 ring-2 ring-emerald-500/10' 
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors ${
                  focusedPaperId === paper.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                }`}>
                  [{paper.id}]
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-800 leading-snug mb-1 group-hover:text-emerald-600 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate italic">
                    {paper.authors}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onBookmark?.(paper); }}
                className="p-1.5 text-slate-300 hover:text-emerald-600 transition-colors"
                title="Save to Library"
              >
                <Bookmark size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4 px-1">
              <span className="flex items-center gap-1"><Bookmark size={10} /> {paper.journal}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{paper.date}</span>
            </div>

            {/* AI Summary Section (Only visible when focused) */}
            {focusedPaperId === paper.id && (
              <div className="mb-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                <button 
                  onClick={(e) => { e.stopPropagation(); onAnalyzePaper?.(paper, 'summary'); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 rounded-lg text-[11px] font-bold text-white hover:bg-emerald-700 transition-all shadow-md"
                >
                  <Wand2 size={12} /> Technical Summary
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                  <FileText size={14} /> PDF
                </button>
                <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                  <ExternalLink size={14} /> PubMed
                </button>
              </div>
              <button className="p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                <Share2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 size={14} /> All Sources Verified
          </span>
          <button className="text-slate-400 hover:text-slate-600 underline underline-offset-4">
            Report Error
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ReferencesPanel;
