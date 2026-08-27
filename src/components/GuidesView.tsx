import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  FileText,
  Sparkles
} from 'lucide-react';
import { POSTAL_GUIDES_DATA, GuideItem } from '../data/guidesData';
import { ThemeDefinition } from '../utils/themeConfig';

interface GuidesViewProps {
  themeObj: ThemeDefinition;
  onBackToHome: () => void;
}

export const GuidesView: React.FC<GuidesViewProps> = ({
  themeObj,
  onBackToHome
}) => {
  const isRetro = themeObj.id === 'retroCream';
  const [selectedGuide, setSelectedGuide] = useState<GuideItem>(POSTAL_GUIDES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = POSTAL_GUIDES_DATA.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            isRetro 
              ? 'bg-white border border-[#EAE0D0] text-[#1E1B18] hover:bg-[#FAF4E8]' 
              : 'bg-slate-900 border border-slate-800 text-white hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to PostalPro Home</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Departmental Study & Knowledge Hub
        </span>
      </div>

      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg space-y-3 ${
        isRetro 
          ? 'bg-white border-2 border-[#EAE0D0] text-[#1E1B18]' 
          : `${themeObj.cardBg} border ${themeObj.cardBorder} text-white`
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Post Office Guides & Departmental Volumes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Clear, digitized operating rules for PO Guide Part 1, Postal Volumes V, VI, VII & Post Office Act 2023.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Guides List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search guides, rules, volumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium ${
                isRetro ? 'bg-white border-[#E0D4C0]' : 'bg-slate-900 border-slate-800 text-white'
              }`}
            />
          </div>

          <div className="space-y-2">
            {filteredGuides.map((guide) => {
              const isSelected = selectedGuide.id === guide.id;

              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? (isRetro 
                          ? 'bg-[#FAF4E8] border-[#F95724] shadow-md ring-1 ring-[#F95724]' 
                          : 'bg-amber-950/40 border-amber-500 shadow-amber-900/20 shadow-md ring-1 ring-amber-400')
                      : (isRetro 
                          ? 'bg-white border-[#EAE0D0] hover:border-[#D9CEBC]' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700')
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-500">
                      {guide.category}
                    </span>
                    <h3 className="text-sm font-bold leading-snug">
                      {guide.title}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 shrink-0 ml-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Guide Reader */}
        <div className="lg:col-span-8">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
            isRetro 
              ? 'bg-white border-2 border-[#EAE0D0] text-[#1E1B18]' 
              : `${themeObj.cardBg} border ${themeObj.cardBorder} text-white`
          }`}>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
              <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400">
                {selectedGuide.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                {selectedGuide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {selectedGuide.summary}
              </p>
            </div>

            {/* Chapters & Rules */}
            <div className="space-y-6">
              {selectedGuide.chapters.map((chapter, cIdx) => (
                <div 
                  key={cIdx} 
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isRetro ? 'bg-[#FAF4E8] border-[#E0D4C0]' : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div>
                    <h3 className="text-base font-black text-amber-500">
                      {chapter.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Key Exam & Departmental Rules:
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {chapter.keyRules.map((rule, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
