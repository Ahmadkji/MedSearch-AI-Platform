
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AnalysisView from './components/AnalysisView';
import ReferencesPanel from './components/ReferencesPanel';
import { Paper } from './types';
import { searchPubMed, generateGlobalSummary } from './services/geminiService';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isReferencesCollapsed, setIsReferencesCollapsed] = useState(window.innerWidth < 1024);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [focusedPaperId, setFocusedPaperId] = useState<number | null>(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalSummary, setGlobalSummary] = useState<string | null>(null);
  
  // Initialize with empty papers list
  const [papers, setPapers] = useState<Paper[]>([]);

  const [activeAnalysisContext, setActiveAnalysisContext] = useState<{
    type: 'summary' | 'paper';
    data?: Paper;
    autoTrigger?: 'summary';
  }>({ type: 'summary' });

  // Handle Global Search
  const handleSearch = useCallback(async (newQuery: string) => {
    if (!newQuery.trim()) return;
    setSearchQuery(newQuery);
    setIsGlobalLoading(true);
    setActiveAnalysisContext({ type: 'summary' });
    setGlobalSummary(null);

    try {
      // 1. Search PubMed
      const results = await searchPubMed(newQuery);
      setPapers(results);
      
      // 2. Generate new summary
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

  // Handle window resizing
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
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300 relative">
          <Header 
            query={searchQuery} 
            onMenuClick={() => setIsMobileSidebarOpen(true)} 
            onReferencesClick={() => setIsReferencesCollapsed(!isReferencesCollapsed)}
            onSearch={handleSearch}
          />
          <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
            <AnalysisView 
              activeContext={activeAnalysisContext}
              onResetContext={() => setActiveAnalysisContext({ type: 'summary' })}
              onCitationClick={handleGlobalCitationClick}
              papers={papers}
              isGlobalLoading={isGlobalLoading}
              globalSummary={globalSummary}
              currentQuery={searchQuery}
            />
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
          />
        </div>
      </div>
    </div>
  );
};

export default App;
