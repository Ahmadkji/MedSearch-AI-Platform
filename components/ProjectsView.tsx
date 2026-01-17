
import React from 'react';
import { Folder, Search, MoreVertical, Calendar, FileText, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onOpenProject, onDeleteProject }) => {
  return (
    <div className="p-8 lg:p-12 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saved Projects</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Access and continue your previous research analyses.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filter projects..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-[3rem] text-slate-400">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Folder size={32} className="text-slate-200" />
          </div>
          <p className="font-bold">No projects saved yet</p>
          <p className="text-sm">Complete a research query and save it to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="group bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 transition-all cursor-pointer relative"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                  <Folder size={24} />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-[17px] font-black text-slate-900 mb-2 truncate leading-tight">
                {project.query}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <FileText size={14} className="text-slate-300" />
                  {project.papers.length} Clinical Papers
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar size={14} className="text-slate-300" />
                  {new Date(project.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-50 flex items-center text-[12px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Resume Research &rarr;
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
