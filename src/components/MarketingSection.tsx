import React, { useState } from 'react';
import { 
  TrendingUp, 
  Home, 
  HeartHandshake, 
  Coins, 
  MessageSquare, 
  ArrowRight, 
  Target,
  Users,
  Landmark
} from 'lucide-react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';
import { MARKETING_STRATEGIES } from '../data/marketingStrategies';
import { MarketingStrategyItem } from '../types';
import { MarketingConversationScene } from './MarketingConversationScene';

interface MarketingSectionProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onOpenMarketingHub: (strategyId?: string) => void;
}

const STRATEGY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Home,
  HeartHandshake,
  Coins,
  MessageSquare,
  Users,
  Landmark
};

export const MarketingSection: React.FC<MarketingSectionProps> = ({
  themeObj,
  t,
  onOpenMarketingHub
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';
  const [selectedStrategy, setSelectedStrategy] = useState<MarketingStrategyItem>(MARKETING_STRATEGIES[0]);

  const handleCardClick = (strategy: MarketingStrategyItem) => {
    setSelectedStrategy(strategy);
    // On smaller screens, smoothly scroll to the conversation scene so user sees instant response
    if (window.innerWidth < 1024) {
      const previewEl = document.getElementById('home-marketing-preview');
      if (previewEl) {
        previewEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <section 
      id="marketing-section" 
      className="py-8 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      <div className={`rounded-3xl p-5 sm:p-10 relative overflow-hidden transition-all duration-300 shadow-xl border ${
        isLight 
          ? (isRetro ? 'bg-white border-[#E6DCB8] text-[#1E1B18]' : 'bg-white border-slate-200 text-slate-900')
          : `${themeObj.cardBg} ${themeObj.cardBorder} text-white`
      }`}>
        {/* Ambient background light */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Header Ribbon & Title */}
        <div className={`relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}>
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
              style={{
                backgroundColor: isLight ? (isRetro ? '#FEECE6' : '#FEF3C7') : 'rgba(245, 158, 11, 0.15)',
                color: isLight ? (isRetro ? '#F95724' : '#D97706') : '#FBBF24'
              }}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{t.marketingSection.badge}</span>
            </div>

            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight ${
              isLight ? (isRetro ? 'text-[#1A1815]' : 'text-slate-900') : themeObj.textPrimary
            }`}>
              {t.marketingSection.title}
            </h2>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {t.marketingSection.subtitle}
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              id="marketing-explore-hub-btn"
              onClick={() => onOpenMarketingHub()}
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-md cursor-pointer active:scale-95 ${
                themeObj.buttonPrimary
              }`}
            >
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              <span>{t.marketingSection.ctaBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-80" />
            </button>
          </div>
        </div>

        {/* Clean 2-Column Strategy Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Left Column: 6 Strategy Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {MARKETING_STRATEGIES.map((strategy) => {
              const IconComp = STRATEGY_ICONS[strategy.iconName] || TrendingUp;
              const isSelected = selectedStrategy.id === strategy.id;

              return (
                <div
                  key={strategy.id}
                  onClick={() => handleCardClick(strategy)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between select-none group ${
                    isSelected
                      ? (isLight 
                          ? (isRetro ? 'bg-[#FAF5EB] border-[#F95724] shadow-sm ring-1 ring-[#F95724]' : 'bg-amber-50/70 border-amber-500 shadow-sm ring-1 ring-amber-500') 
                          : 'bg-amber-950/30 border-amber-400 shadow-md ring-1 ring-amber-400')
                      : (isLight 
                          ? (isRetro ? 'bg-white border-[#E6DCB8] hover:border-[#D9CEBC]' : 'bg-slate-50 border-slate-200 hover:border-slate-300') 
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700')
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isSelected
                          ? (isLight ? (isRetro ? 'bg-[#F95724] text-white' : 'bg-amber-500 text-white') : 'bg-amber-400 text-slate-950')
                          : (isLight ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-amber-100 text-amber-700') : 'bg-slate-800 text-slate-300')
                      }`}>
                        <IconComp className="w-4 h-4 stroke-[2.2]" />
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full truncate max-w-[120px] ${
                        isSelected 
                          ? (isLight ? (isRetro ? 'bg-[#F95724]/15 text-[#F95724]' : 'bg-amber-100 text-amber-800') : 'bg-amber-400/20 text-amber-300')
                          : (isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-400')
                      }`}>
                        {strategy.tag}
                      </span>
                    </div>

                    <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {strategy.title}
                    </h4>

                    <p className={`text-[11px] line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {strategy.keyHighlight}
                    </p>
                  </div>

                  {/* Direct Link to Open Playbook Page for this Strategy */}
                  <div className="pt-3 border-t mt-2 flex items-center justify-between border-slate-200/60 dark:border-slate-800/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenMarketingHub(strategy.id);
                      }}
                      className={`text-[11px] font-black flex items-center gap-1.5 transition-colors cursor-pointer hover:underline ${
                        isLight 
                          ? (isRetro ? 'text-[#F95724]' : 'text-amber-700 hover:text-amber-900') 
                          : 'text-amber-400 hover:text-amber-300'
                      }`}
                    >
                      <span>{t.marketingSection.viewScript}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="text-[10px] opacity-60 font-semibold">Playbook ↗</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Animated Interactive Conversation Scene */}
          <div id="home-marketing-preview" className="lg:col-span-6 space-y-4">
            <MarketingConversationScene
              strategy={selectedStrategy}
              themeObj={themeObj}
              t={t}
            />

            {/* Direct button to open dedicated strategy playbook page */}
            <div className="flex justify-end">
              <button
                onClick={() => onOpenMarketingHub(selectedStrategy.id)}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 border ${
                  isLight 
                    ? (isRetro ? 'bg-[#FAF5EB] border-[#F95724] text-[#F95724] hover:bg-[#F95724] hover:text-white' : 'bg-amber-500 text-slate-950 hover:bg-amber-400 border-amber-400') 
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300 border-amber-400'
                }`}
              >
                <span>Open Full "{selectedStrategy.title}" Playbook & Script Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

