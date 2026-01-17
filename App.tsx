
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AnalysisView from './components/AnalysisView';
import ReferencesPanel from './components/ReferencesPanel';
import ProjectsView from './components/ProjectsView';
import LibraryView from './components/LibraryView';
import DashboardView from './components/DashboardView';
import { Paper, Project, LibraryItem } from './types';
import { searchPubMed, generateGlobalSummary } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isReferencesCollapsed, setIsReferencesCollapsed] = useState(window.innerWidth < 1024);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [focusedPaperId, setFocusedPaperId] = useState<number | null>(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalSummary, setGlobalSummary] = useState<string | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);

  const [activeAnalysisContext, setActiveAnalysisContext] = useState<{
    type: 'summary' | 'paper';
    data?: Paper;
    autoTrigger?: 'summary';
  }>({ type: 'summary' });

  useEffect(() => {
    const savedProjects = localStorage.getItem('medsearch_projects');
    const savedLibrary = localStorage.getItem('medsearch_library');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedLibrary) setLibraryItems(JSON.parse(savedLibrary));
  }, []);

  useEffect(() => {
    localStorage.setItem('medsearch_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('medsearch_library', JSON.stringify(libraryItems));
  }, [libraryItems]);

  const handleSearch = useCallback(async (newQuery: string) => {
    if (!newQuery.trim()) return;
    setSearchQuery(newQuery);
    setIsGlobalLoading(true);
    setCurrentView('analysis');
    setActiveAnalysisContext({ type: 'summary' });
    setGlobalSummary(null);

    try {
      const results = await searchPubMed(newQuery);
      setPapers(results);
      if (results.length > 0) {
        const summary = await generateGlobalSummary(newQuery, results);
        setGlobalSummary(summary);
      }
    } catch (err) {
      console.error("Search flow error:", err);
    } finally {
      setIsGlobalLoading(false);
    }
  }, []);

  const handleSaveProject = () => {
    if (!searchQuery || papers.length === 0) return;
    const newProject: Project = {
      id: Date.now().toString(),
      query: searchQuery,
      papers: papers,
      summary: globalSummary,
      timestamp: Date.now()
    };
    setProjects(prev => [newProject, ...prev]);
    alert("Project saved successfully!");
  };

  const handleBookmarkPaper = (paper: Paper) => {
    if (libraryItems.some(item => item.paper.id === paper.id)) return;
    const newItem: LibraryItem = {
      id: Date.now().toString(),
      paper: paper,
      savedAt: Date.now()
    };
    setLibraryItems(prev => [newItem, ...prev]);
  };

  const handleOpenProject = (project: Project) => {
    setSearchQuery(project.query);
    setPapers(project.papers);
    setGlobalSummary(project.summary);
    setCurrentView('analysis');
    setActiveAnalysisContext({ type: 'summary' });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleRemoveLibraryItem = (id: string) => {
    setLibraryItems(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      } else {
        setIsReferencesCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnalyzePaper = (paper: Paper, type: 'summary') => {
    setActiveAnalysisContext({
      type: 'paper',
      data: paper,
      autoTrigger: type
    });
    setFocusedPaperId(paper.id);
  };

  const handleGlobalCitationClick = (paperId: number) => {
    setFocusedPaperId(paperId);
    if (isReferencesCollapsed) {
      setIsReferencesCollapsed(false);
    }
  };

  const renderMainView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            onSearch={handleSearch} 
            recentProjects={projects} 
          />
        );
      case 'projects':
        return (
          <ProjectsView 
            projects={projects} 
            onOpenProject={handleOpenProject} 
            onDeleteProject={handleDeleteProject} 
          />
        );
      case 'library':
        return (
          <LibraryView 
            items={libraryItems} 
            onRemoveItem={handleRemoveLibraryItem} 
          />
        );
      case 'analysis':
      default:
        return (
          <AnalysisView 
            activeContext={activeAnalysisContext}
            onResetContext={() => setActiveAnalysisContext({ type: 'summary' })}
            onCitationClick={handleGlobalCitationClick}
            papers={papers}
            isGlobalLoading={isGlobalLoading}
            globalSummary={globalSummary}
            currentQuery={searchQuery}
            onSaveProject={handleSaveProject}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900 transition-all duration-300">
      <div className="flex flex-1 overflow-hidden relative">
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              setIsMobileSidebarOpen(false);
            }}
            onNewQuery={() => {
              setSearchQuery("");
              setPapers([]);
              setGlobalSummary(null);
              setCurrentView('dashboard');
              setIsMobileSidebarOpen(false);
            }}
          />
        </div>

        <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300 relative">
          <Header 
            query={searchQuery} 
            onMenuClick={() => setIsMobileSidebarOpen(true)} 
            onReferencesClick={() => setIsReferencesCollapsed(!isReferencesCollapsed)}
            onSearch={handleSearch}
            hideSearch={currentView === 'dashboard'} // Added prop to hide header search on dashboard
          />
          <main className="flex-1 overflow-y-auto bg-white">
            {renderMainView()}
          </main>
        </div>

        <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-auto transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isReferencesCollapsed ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'} ${isReferencesCollapsed && 'lg:w-16'}`}>
          <ReferencesPanel 
            isCollapsed={isReferencesCollapsed} 
            onToggle={() => setIsReferencesCollapsed(!isReferencesCollapsed)} 
            papers={papers} 
            focusedPaperId={focusedPaperId}
            onPaperClick={(id) => setFocusedPaperId(id)}
            onAnalyzePaper={handleAnalyzePaper}
            onBookmark={(paper) => {
              handleBookmarkPaper(paper);
              alert("Paper added to Library!");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
