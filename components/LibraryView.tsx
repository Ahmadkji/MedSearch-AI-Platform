
import React from 'react';
import { Bookmark, ExternalLink, FileText, Trash2, Search, Filter } from 'lucide-react';
import { LibraryItem } from '../types';

interface LibraryViewProps {
  items: LibraryItem[];
  onRemoveItem: (id: string) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ items, onRemoveItem }) => {
  return (
    <div className="p-8 lg:p-12 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Source Library</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage your curated collection of peer-reviewed publications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
            <Filter size={14} /> Filter
          </button>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search library..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-400">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Bookmark size={32} className="text-slate-200" />
          </div>
          <p className="font-bold">Library is empty</p>
          <p className="text-sm">Bookmark papers during research to save them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-6 group hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate mb-1">{item.paper.title}</h3>
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="truncate">{item.paper.authors}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="whitespace-nowrap">{item.paper.journal}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="whitespace-nowrap">{item.paper.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={item.paper.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  <ExternalLink size={18} />
                </a>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;
