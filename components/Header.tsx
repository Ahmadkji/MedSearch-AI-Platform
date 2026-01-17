
import React, { useState, useEffect } from 'react';
import { Search, Share2, Menu } from 'lucide-react';

interface HeaderProps {
  query: string;
  onMenuClick?: () => void;
  onReferencesClick?: () => void;
  onSearch?: (query: string) => void;
  hideSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ query, onMenuClick, onReferencesClick, onSearch, hideSearch }) => {
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.(inputValue);
    }
  };

  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div className={`hidden lg:flex items-center gap-6 transition-opacity duration-300 ${hideSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-[400px] bg-slate-50 border border-slate-100 rounded-xl py-2 pl-4 pr-12 text-[13px] focus:outline-none focus:bg-white focus:border-emerald-200 transition-all text-slate-800 font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-300 bg-white border border-slate-100 px-1.5 rounded uppercase">K</span>
              <Search size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 mr-4">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">MedSearch AI Platform</span>
        </div>
        <button className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
          <Share2 size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Share Report</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
