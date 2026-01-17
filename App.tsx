
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AnalysisView from './components/AnalysisView';
import ResearchAssistant from './components/ResearchAssistant';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("Efficacy of JAK inhibitors in treating severe alopecia areata");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(false);
  const [pendingPaperChat, setPendingPaperChat] = useState<any>(null);

  const handleChatWithPaper = useCallback((paper: any) => {
    setPendingPaperChat({
      ...paper,
      timestamp: Date.now() // Force update even if same paper is clicked twice
    });
    setIsAssistantCollapsed(false);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900 transition-all duration-300">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />

        {/* Main Container */}
        <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300">
          <Header query={searchQuery} />
          
          <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
            <AnalysisView onChatWithPaper={handleChatWithPaper} />
          </main>
        </div>

        {/* Right Assistant Panel */}
        <ResearchAssistant 
          isCollapsed={isAssistantCollapsed}
          onToggle={() => setIsAssistantCollapsed(!isAssistantCollapsed)}
          externalPaperTrigger={pendingPaperChat}
        />
      </div>
    </div>
  );
};

export default App;
