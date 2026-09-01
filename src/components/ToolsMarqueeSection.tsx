import React, { useRef } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  Share2,
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';
import { POSTAL_TOOLS } from '../data/postalTools';
import { PostalToolItem, AppView } from '../types';

interface ToolsMarqueeSectionProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onSelectTool: (tool: PostalToolItem) => void;
  onNavigate: (view: AppView) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Receipt,
  ShieldCheck,
  Share2
};

export const ToolsMarqueeSection: React.FC<ToolsMarqueeSectionProps> = ({
  themeObj,
  t
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (marqueeContainerRef.current) {
      marqueeContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (marqueeContainerRef.current) {
      marqueeContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const handleToolClick = (tool: PostalToolItem) => {
    if (tool.id === 'td-bill-gen' || tool.targetView === 'tdbill') {
      window.open('https://postalpro.in/tdbill/', '_blank', 'noopener,noreferrer');
    } else if (tool.id === 'pli-leads-pro' || tool.targetView === 'plileads') {
      window.open('https://postalpro.in/plileads/', '_blank', 'noopener,noreferrer');
    } else if (tool.id === 'scheme-share' || tool.targetView === 'schemeshare') {
      window.open('https://postalpro.in/schemeshare/', '_blank', 'noopener,noreferrer');
    } else if (tool.externalUrl) {
      window.open(tool.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Create a continuous seamless track by repeating items
  const marqueeItems = [...POSTAL_TOOLS, ...POSTAL_TOOLS, ...POSTAL_TOOLS, ...POSTAL_TOOLS];

  return (
    <section 
      id="tools-marquee-section" 
      className="py-8 sm:py-16 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
            style={{
              backgroundColor: isLight ? (isRetro ? '#FEECE6' : '#FEF3C7') : 'rgba(245, 158, 11, 0.15)',
              color: isLight ? (isRetro ? '#F95724' : '#D97706') : '#FBBF24'
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.toolsSection.badge}</span>
          </div>

          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight ${
            isLight ? (isRetro ? 'text-[#1A1815]' : 'text-slate-900') : themeObj.textPrimary
          }`}>
            {t.toolsSection.title}
          </h2>

          <p className={`text-xs sm:text-sm max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {t.toolsSection.subtitle}
          </p>
        </div>

        {/* Manual Scroll Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={scrollLeft}
            aria-label="Scroll tools left"
            className={`p-2.5 rounded-full border transition-all cursor-pointer select-none active:scale-95 ${
              isLight 
                ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800 shadow-sm' 
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll tools right"
            className={`p-2.5 rounded-full border transition-all cursor-pointer select-none active:scale-95 ${
              isLight 
                ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800 shadow-sm' 
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-white'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auto-Moving Smooth Marquee Track with Hover Pause */}
      <div 
        ref={marqueeContainerRef}
        className="marquee-wrapper relative w-full overflow-x-auto no-scrollbar py-3 px-4 sm:px-6 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="marquee-track flex gap-4 w-max">
          {marqueeItems.map((tool, index) => {
            const IconComponent = ICON_MAP[tool.iconName] || Receipt;

            return (
              <div
                key={`${tool.id}-${index}`}
                onClick={() => handleToolClick(tool)}
                className={`w-[260px] sm:w-[300px] shrink-0 p-5 rounded-3xl cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between border select-none group hover:-translate-y-1.5 ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-900 hover:border-amber-500 hover:shadow-xl' 
                    : `${themeObj.cardBg} ${themeObj.cardBorder} text-white hover:border-amber-400/60 hover:shadow-xl`
                }`}
              >
                <div className="space-y-3.5">
                  {/* Header: Icon & Category Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isLight 
                        ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-amber-100 text-amber-700') 
                        : 'bg-amber-400/15 text-amber-400'
                    }`}>
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {tool.badge && (
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isLight 
                          ? (isRetro ? 'bg-[#FAF5EB] text-[#F95724] border border-[#F95724]/20' : 'bg-slate-100 text-slate-700 border border-slate-200') 
                          : 'bg-slate-800 text-amber-300 border border-slate-700'
                      }`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className={`text-sm sm:text-base font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {tool.title}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Action Indicator */}
                <div className={`pt-4 mt-3 flex items-center justify-between border-t text-xs font-bold ${
                  isLight ? 'border-slate-100' : 'border-slate-800/80'
                }`}>
                  <span className={isLight ? (isRetro ? 'text-[#F95724]' : 'text-indigo-600') : themeObj.accent}>
                    {t.toolsSection.launchBtn}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
                    isLight 
                      ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-slate-100 text-slate-700') 
                      : 'bg-slate-800 text-white'
                  }`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

