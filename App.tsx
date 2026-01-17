
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AnalysisView from './components/AnalysisView';
import ResearchAssistant from './components/ResearchAssistant';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("Efficacy of JAK inhibitors in treating severe alopecia areata");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(window.innerWidth < 1024);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingPaperChat, setPendingPaperChat] = useState<any>(null);

  // Handle window resizing to ensure proper layout state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      } else {
        setIsAssistantCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChatWithPaper = useCallback((paper: any) => {
    setPendingPaperChat({
      ...paper,
      timestamp: Date.now()
    });
    setIsAssistantCollapsed(false);
  }, []);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleAssistant = () => setIsAssistantCollapsed(!isAssistantCollapsed);

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900 transition-all duration-300">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        </div>

        {/* Main Container */}
        <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300 relative">
          <Header 
            query={searchQuery} 
            onMenuClick={toggleMobileSidebar}
            onChatClick={toggleAssistant}
          />
          
          <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
            <AnalysisView onChatWithPaper={handleChatWithPaper} />
          </main>
        </div>

        {/* Research Assistant Drawer/Panel */}
        <div className={`
          fixed inset-y-0 right-0 z-50 w-full sm:w-auto transform transition-transform duration-300 lg:relative lg:translate-x-0
          ${isAssistantCollapsed ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'}
          ${isAssistantCollapsed && 'lg:w-16'}
        `}>
          <ResearchAssistant 
            isCollapsed={isAssistantCollapsed}
            onToggle={toggleAssistant}
            externalPaperTrigger={pendingPaperChat}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
