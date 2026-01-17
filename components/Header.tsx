
import React from 'react';
import { Search, Bell, Settings, Share2, X, Menu, MessageSquare } from 'lucide-react';

interface HeaderProps {
  query: string;
  onMenuClick?: () => void;
  onChatClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ query, onMenuClick, onChatClick }) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 gap-3">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search Input */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <input
            type="text"
            defaultValue={query}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-4 pr-10 lg:pr-12 text-[13px] lg:text-sm focus:outline-none focus:border-emerald-400 transition-all text-slate-700 font-medium truncate"
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
            <button className="text-slate-400 hover:text-slate-600 hidden sm:block">
              <X size={14} strokeWidth={3} />
            </button>
            <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1 rounded shadow-sm hidden sm:block">K</span>
            <Search size={14} className="text-slate-400 sm:hidden" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 lg:gap-2">
        <button className="hidden sm:flex p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell size={18} />
        </button>
        <button className="hidden sm:flex p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
          <Settings size={18} />
        </button>
        
        {/* Mobile Chat Toggle */}
        <button 
          onClick={onChatClick}
          className="lg:hidden p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          <MessageSquare size={18} />
        </button>

        <div className="hidden lg:block h-6 w-px bg-slate-200 mx-2"></div>
        
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95">
          <Share2 size={16} strokeWidth={2.5} />
          <span className="hidden lg:inline">Share Report</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
