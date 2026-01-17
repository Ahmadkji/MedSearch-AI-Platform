
import React from 'react';
import { PlusCircle, Microscope, LayoutDashboard, Folder, Library, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onNewQuery: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, currentView, onNavigate, onNewQuery }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Folder size={20} /> },
    { id: 'library', label: 'Library', icon: <Library size={20} /> },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-100 flex flex-col h-full transition-all duration-500 ease-in-out relative group ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Creative Collapse Toggle (Desktop) */}
      <button 
        onClick={onToggle}
        className={`hidden lg:flex absolute top-12 -right-3.5 z-[60] w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 active:scale-90 cursor-pointer shadow-sm opacity-40 group-hover:opacity-100`}
      >
        <div className="transition-transform duration-500">
          {isCollapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
        </div>
      </button>

      {/* Internal Scrollable Wrapper to prevent toggle clipping */}
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* Brand */}
        <div className={`p-8 flex items-center gap-4 ${isCollapsed ? 'justify-center px-0' : ''}`}>
          <div className="bg-[#10b981] p-2 rounded-xl flex-shrink-0 shadow-sm shadow-emerald-100 transition-transform duration-300 hover:rotate-6">
            <Microscope size={24} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-2xl text-slate-900 tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              MedSearch
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className={`px-6 mb-10 transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={onNewQuery}
            className={`flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-bold transition-all duration-300 shadow-md shadow-emerald-50 active:scale-95 ${
            isCollapsed ? 'w-12 h-12 p-0 rounded-full' : 'w-full py-3 px-4'
          }`}>
            <PlusCircle size={18} strokeWidth={2.5} className={isCollapsed ? 'mx-auto' : ''} />
            {!isCollapsed && <span className="text-sm whitespace-nowrap overflow-hidden">New Query</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 space-y-10 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          <div>
            {!isCollapsed && (
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 px-2 animate-in fade-in duration-500">
                WORKSPACE
              </h3>
            )}
            <ul className="space-y-1.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-4 py-3 rounded-xl transition-all duration-300 group/nav ${
                      isCollapsed ? 'justify-center px-0' : 'px-4'
                    } ${
                      currentView === item.id 
                        ? 'bg-[#ecfdf5] text-[#059669] font-bold' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`flex-shrink-0 transition-transform duration-300 group-hover/nav:scale-110 ${currentView === item.id ? 'text-[#059669]' : 'text-slate-400 group-hover/nav:text-emerald-500'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="text-[14px] whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-1 duration-300">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User Footer */}
        <div className={`p-6 border-t border-slate-50 mt-auto transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all duration-300 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <img 
              src="https://picsum.photos/id/64/64/64" 
              alt="User" 
              className="w-10 h-10 rounded-full bg-slate-200 object-cover flex-shrink-0 ring-2 ring-emerald-50 transition-transform duration-300 hover:scale-105"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-500">
                <p className="text-[14px] font-bold text-slate-900 truncate leading-none mb-1">Dr. Sarah Chen</p>
                <p className="text-[12px] font-medium text-slate-400 truncate leading-none">Research Lead</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
