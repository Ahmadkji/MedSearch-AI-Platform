
import React from 'react';
import { Search, Bell, Settings, Share2, X } from 'lucide-react';

interface HeaderProps {
  query: string;
}

const Header: React.FC<HeaderProps> = ({ query }) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Search Input */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <input
            type="text"
            defaultValue={query}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-4 pr-12 text-sm focus:outline-none focus:border-blue-400 transition-all text-slate-700 font-medium"
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
            <button className="text-slate-400 hover:text-slate-600">
              <X size={14} strokeWidth={3} />
            </button>
            <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1 rounded shadow-sm">K</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell size={18} />
        </button>
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
          <Settings size={18} />
        </button>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
          <Share2 size={16} strokeWidth={2.5} />
          <span>Share Report</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
