
import React from 'react';
import { PlusCircle, User, LogOut, ChevronLeft, ChevronRight, FlaskConical, Microscope, X } from 'lucide-react';
import { NAVIGATION_ITEMS, RECENT_HISTORY } from '../constants';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, onCloseMobile }) => {
  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand & Mobile Close */}
      <div className={`p-6 flex items-center justify-between ${isCollapsed ? 'justify-center px-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-1.5 rounded-lg flex-shrink-0">
            <Microscope size={20} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-slate-800 tracking-tight whitespace-nowrap">
              MedSearch
            </span>
          )}
        </div>
        <button 
          onClick={onCloseMobile}
          className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Action Button */}
      <div className={`px-4 mb-8 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all shadow-sm active:scale-95 ${
          isCollapsed ? 'p-2.5 aspect-square' : 'w-full py-2 px-4 h-10'
        }`}>
          <span className="text-lg font-light flex items-center justify-center">+</span>
          {!isCollapsed && <span className="text-sm">New Query</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div>
          {!isCollapsed && (
            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4 px-2">
              WORKSPACE
            </h3>
          )}
          <ul className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href="#"
                  className={`flex items-center gap-3 py-2.5 rounded-lg transition-colors ${
                    isCollapsed ? 'justify-center px-0' : 'px-3'
                  } ${
                    item.active ? 'bg-emerald-50/50 text-emerald-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex-shrink-0 opacity-80">{item.icon}</span>
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4 px-2">
              RECENT HISTORY
            </h3>
          )}
          <ul className="space-y-1">
            {RECENT_HISTORY.map((item, idx) => (
              <li key={idx}>
                <a 
                  href="#" 
                  className={`block text-xs font-medium text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-lg truncate transition-all ${
                    isCollapsed ? 'w-10 h-10 flex items-center justify-center mx-auto' : 'px-3 py-2'
                  }`}
                >
                  {isCollapsed ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                  ) : (
                    item
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Footer */}
      <div className={`p-4 border-t border-slate-100 mt-auto ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors ${
          isCollapsed ? 'justify-center w-full' : ''
        }`}>
          <img 
            src="https://picsum.photos/id/64/40/40" 
            alt="User" 
            className="w-8 h-8 rounded-full bg-slate-200 object-cover flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">Dr. Sarah Chen</p>
              <p className="text-[10px] font-medium text-slate-400 truncate">Research Lead</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
