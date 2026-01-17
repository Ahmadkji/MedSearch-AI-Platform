
import React, { useState } from 'react';
import { 
  Paperclip, 
  SlidersHorizontal, 
  ArrowRight, 
  ChevronRight,
  Zap,
  Dna,
  Brain,
  Pill,
  Sparkles,
  FlaskConical,
  Heart
} from 'lucide-react';
import { Project } from '../types';

interface DashboardViewProps {
  onSearch: (query: string) => void;
  recentProjects: Project[];
}

const CATEGORIES = [
  {
    title: "Oncology & Precision Medicine",
    icon: <Dna size={14} />,
    questions: [
      "What are the survival rates for CAR-T cell therapy in pediatric ALL?",
      "Does liquid biopsy improve early detection of stage I lung cancer?",
      "Analyze the role of BRCA1 mutations in PARP inhibitor resistance"
    ]
  },
  {
    title: "Pharmacology & Therapeutics",
    icon: <Pill size={14} />,
    questions: [
      "Compare the efficacy of GLP-1 agonists vs SGLT2 inhibitors for weight loss",
      "Are there significant long-term side effects for newer JAK inhibitors in RA?",
      "What is the mechanism of action for tirzepatide in metabolic syndrome?"
    ]
  },
  {
    title: "Neurology & Mental Health",
    icon: <Brain size={14} />,
    questions: [
      "Is there a correlation between gut microbiome diversity and Parkinson's progression?",
      "How does deep brain stimulation affect quality of life in treatment-resistant depression?",
      "Evaluate the evidence for amyloid-beta targeting therapies in early Alzheimer's"
    ]
  },
  {
    title: "Cardiology & Vascular Health",
    icon: <Heart size={14} />,
    questions: [
      "Are statins effective for primary prevention in adults over 75?",
      "What is the impact of sodium reduction on hypertensive patients with heart failure?",
      "Compare clinical outcomes of TAVR vs SAVR in low-risk patients"
    ]
  },
  {
    title: "Immunology & Infectious Disease",
    icon: <FlaskConical size={14} />,
    questions: [
      "What is the duration of neutralizing antibody response after mRNA vaccination?",
      "Analyze the efficacy of dual-pathway inhibition in moderate-to-severe Crohn's disease",
      "Are there emerging resistance patterns for recent broad-spectrum antivirals?"
    ]
  }
];

const DashboardView: React.FC<DashboardViewProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearchTrigger = () => {
    if (inputValue.trim()) onSearch(inputValue);
  };

  return (
    <div className="min-h-full bg-white flex flex-col items-center pt-20 pb-32 animate-in fade-in duration-700">
      {/* Search Hub Header */}
      <div className="w-full max-w-3xl px-6 flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Sparkles size={24} />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">MedSearch</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-10 tracking-tight">Clinical research starts here</h1>
        
        {/* Centered Search Bar */}
        <div className="w-full relative group">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/40 p-1.5 flex items-center transition-all group-focus-within:border-emerald-500 group-focus-within:ring-4 group-focus-within:ring-emerald-500/5">
            <div className="flex items-center px-4 border-r border-slate-100 gap-2 cursor-pointer hover:bg-slate-50 rounded-lg py-2 transition-colors">
              <Zap size={16} className="text-emerald-600" />
              <span className="text-sm font-bold text-slate-700">Pro</span>
              <ChevronRight size={14} className="text-slate-300" />
            </div>
            <div className="flex items-center px-4 border-r border-slate-100 gap-2 cursor-pointer hover:bg-slate-50 rounded-lg py-2 transition-colors">
              <span className="text-sm font-bold text-slate-700">Verified</span>
              <ChevronRight size={14} className="text-slate-300" />
            </div>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
              placeholder="Search medical research, journals, or clinical data..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-[16px] text-slate-800 font-medium placeholder:text-slate-400"
            />
            <div className="flex items-center gap-2 px-2">
              <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <Paperclip size={18} />
              </button>
              <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <SlidersHorizontal size={18} />
              </button>
              <button 
                onClick={handleSearchTrigger}
                className="w-11 h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 transition-all active:scale-95 ml-1"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="w-full max-w-3xl px-6 space-y-12">
        <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Curation of Medical Inquiries</span>
            <div className="h-px bg-slate-100 flex-1"></div>
        </div>

        {CATEGORIES.map((category, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <span className="text-slate-400">{category.icon}</span>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">{category.title}</h3>
            </div>
            <div className="space-y-2">
              {category.questions.map((q, qIdx) => (
                <button 
                  key={qIdx}
                  onClick={() => onSearch(q)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-xl transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                      {category.icon}
                    </div>
                    <span className="text-[14px] font-bold text-slate-700">{q}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
