import React from 'react';
import { PlusCircle, Microscope, LayoutDashboard, Folder, Library } from 'lucide-react';
import { NAVIGATION_ITEMS, RECENT_HISTORY } from '../constants';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, onCloseMobile }) => {
  return (
    <aside 
      className={`bg-white border-r border-slate-100 flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand */}
      <div className={`p-8 flex items-center gap-4 ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="bg-[#10b981] p-2 rounded-xl flex-shrink-0 shadow-sm shadow-emerald-100">
          <Microscope size={24} className="text-white" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-2xl text-slate-900 tracking-tight whitespace-nowrap">
            MedSearch
          </span>
        )}
      </div>

      {/* Action Button */}
      <div className={`px-6 mb-10 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button className={`flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-50 active:scale-95 ${
          isCollapsed ? 'w-12 h-12 p-0' : 'w-full py-3 px-4'
        }`}>
          <PlusCircle size={18} strokeWidth={2.5} />
          {!isCollapsed && <span className="text-sm">New Query</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-10 ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <div>
          {!isCollapsed && (
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 px-2">
              WORKSPACE
            </h3>
          )}
          <ul className="space-y-1.5">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href="#"
                  className={`flex items-center gap-4 py-3 rounded-xl transition-all ${
                    isCollapsed ? 'justify-center px-0' : 'px-4'
                  } ${
                    item.active 
                      ? 'bg-[#ecfdf5] text-[#059669] font-bold' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className={`flex-shrink-0 ${item.active ? 'text-[#059669]' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="text-[14px]">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 px-2">
              RECENT HISTORY
            </h3>
          )}
          <ul className="space-y-1">
            {RECENT_HISTORY.map((item, idx) => (
              <li key={idx}>
                <a 
                  href="#" 
                  className={`block text-[13px] font-medium text-slate-500 hover:text-[#059669] hover:bg-[#ecfdf5]/50 rounded-lg truncate transition-all ${
                    isCollapsed ? 'w-10 h-10 flex items-center justify-center mx-auto' : 'px-4 py-2.5'
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
      <div className={`p-6 border-t border-slate-50 mt-auto ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <img 
            src="https://picsum.photos/id/64/64/64" 
            alt="User" 
            className="w-10 h-10 rounded-full bg-slate-200 object-cover flex-shrink-0 ring-2 ring-emerald-50"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-slate-900 truncate leading-none mb-1">Dr. Sarah Chen</p>
              <p className="text-[12px] font-medium text-slate-400 truncate leading-none">Research Lead</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;