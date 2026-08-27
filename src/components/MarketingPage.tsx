import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Home, 
  HeartHandshake, 
  Coins, 
  MessageSquare, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2, 
  ArrowLeft,
  CheckCircle2,
  Send,
  Users,
  Landmark,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutGrid
} from 'lucide-react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';
import { MARKETING_STRATEGIES } from '../data/marketingStrategies';
import { MarketingStrategyItem, AppView } from '../types';
import { FooterSection } from './FooterSection';

interface MarketingPageProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  initialStrategyId?: string | null;
  onNavigate: (view: AppView) => void;
  onOpenLegalModal: (view: AppView) => void;
}

const STRATEGY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Home,
  HeartHandshake,
  Coins,
  MessageSquare,
  Users,
  Landmark
};

export const MarketingPage: React.FC<MarketingPageProps> = ({
  themeObj,
  t,
  initialStrategyId,
  onNavigate,
  onOpenLegalModal
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  // Initialize selected strategy from prop or default to first
  const [selectedStrategy, setSelectedStrategy] = useState<MarketingStrategyItem>(() => {
    if (initialStrategyId) {
      const found = MARKETING_STRATEGIES.find(s => s.id === initialStrategyId);
      if (found) return found;
    }
    return MARKETING_STRATEGIES[0];
  });

  // Mobile view mode: 'toolkit' shows the active strategy script and steps directly, 'list' shows all 6 cards
  const [mobileViewMode, setMobileViewMode] = useState<'toolkit' | 'list'>('toolkit');
  const [copiedScript, setCopiedScript] = useState(false);

  // Sync if initialStrategyId changes
  useEffect(() => {
    if (initialStrategyId) {
      const found = MARKETING_STRATEGIES.find(s => s.id === initialStrategyId);
      if (found) {
        setSelectedStrategy(found);
        setMobileViewMode('toolkit');
      }
    }
  }, [initialStrategyId]);

  const currentIndex = MARKETING_STRATEGIES.findIndex(s => s.id === selectedStrategy.id);

  const handlePrevStrategy = () => {
    const prevIdx = (currentIndex - 1 + MARKETING_STRATEGIES.length) % MARKETING_STRATEGIES.length;
    setSelectedStrategy(MARKETING_STRATEGIES[prevIdx]);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleNextStrategy = () => {
    const nextIdx = (currentIndex + 1) % MARKETING_STRATEGIES.length;
    setSelectedStrategy(MARKETING_STRATEGIES[nextIdx]);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSelectFromList = (strategy: MarketingStrategyItem) => {
    setSelectedStrategy(strategy);
    setMobileViewMode('toolkit');
    // Smooth scroll to top of toolkit on mobile/tablet
    const toolkitEl = document.getElementById('active-strategy-toolkit');
    if (toolkitEl && window.innerWidth < 1024) {
      toolkitEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyScript = (script: string) => {
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleOpenWhatsAppShare = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Breadcrumbs & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 space-y-5">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 border ${
              isLight 
                ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8] text-[#1E1B18] hover:bg-[#F3ECE0]' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100') 
                : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
              isLight 
                ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-amber-100 text-amber-800') 
                : 'bg-amber-400/20 text-amber-300'
            }`}>
              Playbook {currentIndex + 1} of {MARKETING_STRATEGIES.length}
            </span>
          </div>
        </div>

        {/* Page Banner Title */}
        <div className={`p-5 sm:p-8 rounded-3xl border shadow-lg relative overflow-hidden ${
          isLight 
            ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8]' : 'bg-white border-slate-200') 
            : `${themeObj.cardBg} ${themeObj.cardBorder}`
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                style={{
                  backgroundColor: isLight ? (isRetro ? '#FEECE6' : '#FEF3C7') : 'rgba(245, 158, 11, 0.15)',
                  color: isLight ? (isRetro ? '#F95724' : '#D97706') : '#FBBF24'
                }}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Grassroots GDS Growth Playbooks</span>
              </div>

              <h1 className={`text-2xl sm:text-4xl font-black tracking-tight ${
                isLight ? (isRetro ? 'text-[#1A1815]' : 'text-slate-900') : themeObj.textPrimary
              }`}>
                High-Conversion Postal Marketing Strategies
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Proven grassroots promotional tactics, campaign toolkits, and pitch scripts designed for GDS & Postmasters to double branch deposits.
              </p>
            </div>

            {/* Quick Stats & Counter */}
            <div className="shrink-0 flex items-center gap-2 sm:gap-3">
              <div className={`px-4 py-2 rounded-2xl border text-center ${
                isLight ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-slate-900 border-slate-800 text-amber-300'
              }`}>
                <div className="text-sm sm:text-base font-black">{MARKETING_STRATEGIES.length} Verified Playbooks</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Ready to Deploy</div>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 📱 TOP HORIZONTAL QUICK-SWITCH CAROUSEL (Mobile & Tablet Priority) */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Select Campaign:</span>
            </div>

            {/* Mobile View Mode Switcher (Visible on < lg screens) */}
            <div className={`lg:hidden flex items-center p-1 rounded-2xl border ${
              isLight 
                ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8]' : 'bg-slate-100 border-slate-200') 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => setMobileViewMode('toolkit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  mobileViewMode === 'toolkit'
                    ? (isLight 
                        ? (isRetro ? 'bg-white text-[#F95724] shadow-xs ring-1 ring-black/5' : 'bg-white text-slate-900 shadow-xs') 
                        : 'bg-amber-400 text-slate-950 shadow-xs')
                    : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Script View</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileViewMode('list')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  mobileViewMode === 'list'
                    ? (isLight 
                        ? (isRetro ? 'bg-white text-[#F95724] shadow-xs ring-1 ring-black/5' : 'bg-white text-slate-900 shadow-xs') 
                        : 'bg-amber-400 text-slate-950 shadow-xs')
                    : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span>All Playbooks ({MARKETING_STRATEGIES.length})</span>
              </button>
            </div>
          </div>

          {/* Horizontal Swipeable Tabs Container */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {MARKETING_STRATEGIES.map((strategy, idx) => {
              const IconComp = STRATEGY_ICONS[strategy.iconName] || Target;
              const isSelected = selectedStrategy.id === strategy.id;

              return (
                <button
                  key={strategy.id}
                  onClick={() => handleSelectFromList(strategy)}
                  className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all border cursor-pointer active:scale-95 whitespace-nowrap select-none ${
                    isSelected
                      ? (isLight 
                          ? (isRetro ? 'bg-[#FAF5EB] border-[#F95724] text-[#F95724] shadow-sm ring-1 ring-[#F95724]' : 'bg-amber-500 text-slate-950 border-amber-500 shadow-md') 
                          : 'bg-amber-400 text-slate-950 border-amber-400 shadow-md')
                      : (isLight 
                          ? (isRetro ? 'bg-white border-[#E6DCB8] text-[#1E1B18] hover:border-[#D9CEBC]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50') 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800')
                  }`}
                >
                  <span className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                    isSelected
                      ? (isLight ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-slate-950/10 text-slate-950') : 'bg-slate-950/20 text-slate-950')
                      : (isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400')
                  }`}>
                    <IconComp className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span className="font-bold">{strategy.title}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? (isLight ? (isRetro ? 'bg-[#F95724]/20 text-[#F95724]' : 'bg-slate-950/20 text-slate-950') : 'bg-slate-950/20 text-slate-950')
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    #{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="pt-2">
          {/* DESKTOP & TABLET / MOBILE SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: 6 Strategy Cards Overview 
                - On Desktop (lg): Always shown in left column (lg:col-span-5)
                - On Mobile/Tablet (< lg): Shown only if mobileViewMode === 'list'
            */}
            <div className={`space-y-3.5 ${
              mobileViewMode === 'toolkit' ? 'hidden lg:block lg:col-span-5' : 'block lg:col-span-5'
            }`}>
              <div className="flex items-center justify-between pb-1">
                <h3 className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Campaign Playbooks ({MARKETING_STRATEGIES.length})
                </h3>
                <span className="text-[10px] text-slate-500">Tap to load campaign</span>
              </div>

              {MARKETING_STRATEGIES.map((strategy, idx) => {
                const IconComp = STRATEGY_ICONS[strategy.iconName] || Target;
                const isSelected = selectedStrategy.id === strategy.id;

                return (
                  <div
                    key={strategy.id}
                    onClick={() => handleSelectFromList(strategy)}
                    className={`p-4 sm:p-5 rounded-3xl cursor-pointer transition-all border flex flex-col justify-between select-none group ${
                      isSelected
                        ? (isLight 
                            ? (isRetro ? 'bg-[#FAF5EB] border-[#F95724] shadow-md ring-2 ring-[#F95724]' : 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-500') 
                            : 'bg-amber-950/40 border-amber-400 shadow-lg ring-2 ring-amber-400')
                        : (isLight 
                            ? (isRetro ? 'bg-white border-[#E6DCB8] hover:border-[#D9CEBC]' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs') 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700')
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                          isSelected
                            ? (isLight ? (isRetro ? 'bg-[#F95724] text-white' : 'bg-amber-500 text-slate-950') : 'bg-amber-400 text-slate-950')
                            : (isLight ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-amber-100 text-amber-700') : 'bg-slate-800 text-slate-300')
                        }`}>
                          <IconComp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                        </div>

                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isSelected 
                            ? (isLight ? (isRetro ? 'bg-[#F95724]/20 text-[#F95724]' : 'bg-amber-200 text-amber-900') : 'bg-amber-400/20 text-amber-300')
                            : (isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-400')
                        }`}>
                          {strategy.tag}
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-sm sm:text-base font-black leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {strategy.title}
                        </h4>
                        <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {strategy.keyHighlight}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3.5 mt-2 flex items-center justify-between text-xs font-bold border-t border-slate-200/60 dark:border-slate-800/60"
                      style={{ 
                        color: isLight 
                          ? (isRetro ? '#F95724' : (isSelected ? '#D97706' : '#64748B')) 
                          : (isSelected ? '#FBBF24' : '#94A3B8') 
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <span>{isSelected ? 'Currently Viewing Script' : 'View Campaign Script & Steps'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] opacity-70">#{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Complete Campaign Toolkit View
                - On Desktop (lg): Always shown in right column (lg:col-span-7)
                - On Mobile/Tablet (< lg): Shown directly when mobileViewMode === 'toolkit'
            */}
            <div 
              id="active-strategy-toolkit"
              className={`space-y-6 ${
                mobileViewMode === 'list' ? 'hidden lg:block lg:col-span-7' : 'block lg:col-span-7'
              }`}
            >
              <div className={`p-5 sm:p-8 rounded-3xl border shadow-xl space-y-6 overflow-hidden ${
                isLight 
                  ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8]' : 'bg-white border-slate-200') 
                  : 'bg-slate-900/90 border-slate-800'
              }`}>
                {/* Header Details */}
                <div className={`border-b pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        TARGET: {selectedStrategy.targetAudience}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {selectedStrategy.tag}
                      </span>
                    </div>
                    
                    <h2 className={`text-lg sm:text-2xl font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {selectedStrategy.title}
                    </h2>
                  </div>

                  <span className={`self-start px-3 py-1 rounded-full text-xs font-black shrink-0 ${
                    isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    Grassroots Verified
                  </span>
                </div>

                {/* Implementation Steps Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                      <h3 className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                        Implementation Steps:
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {selectedStrategy.steps.length} Key Steps
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedStrategy.steps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 sm:p-3.5 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm ${
                          isLight 
                            ? 'bg-slate-50/80 border-slate-200/80 text-slate-800' 
                            : 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ready-to-Use Customer Pitch Script Box */}
                <div className={`p-4 sm:p-5 rounded-3xl border space-y-3 ${
                  isLight 
                    ? (isRetro ? 'bg-white border-[#E6DCB8]' : 'bg-amber-50/40 border-amber-200') 
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5 truncate">
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate">READY-TO-USE CUSTOMER PITCH SCRIPT</span>
                    </span>

                    <button
                      onClick={() => handleCopyScript(selectedStrategy.pitchScript)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0 ${
                        copiedScript
                          ? 'bg-emerald-500 text-white'
                          : (isLight 
                              ? (isRetro ? 'bg-[#FEECE6] text-[#F95724] hover:bg-[#F95724] hover:text-white' : 'bg-slate-900 text-white hover:bg-slate-800') 
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700')
                      }`}
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                    </button>
                  </div>

                  <div className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm italic leading-relaxed ${
                    isLight 
                      ? 'text-slate-800 bg-white border-slate-200 shadow-xs' 
                      : 'text-slate-200 bg-slate-900/90 border-slate-800'
                  }`}>
                    "{selectedStrategy.pitchScript}"
                  </div>
                </div>

                {/* Real-Life Field Success Case Study */}
                {selectedStrategy.realLifeExample && (
                  <div className={`p-4 sm:p-5 rounded-3xl border space-y-2.5 ${
                    isLight 
                      ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8]' : 'bg-gradient-to-r from-amber-50/90 to-orange-50/60 border-amber-200/90 shadow-xs') 
                      : 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                          Proven Field Success Case Study
                        </span>
                        <h4 className={`text-xs sm:text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          Real-Life Example & Execution Result
                        </h4>
                      </div>
                    </div>

                    <p className={`text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl border ${
                      isLight 
                        ? 'bg-white/80 border-amber-200/60 text-slate-800' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-200'
                    }`}>
                      {selectedStrategy.realLifeExample}
                    </p>
                  </div>
                )}

                {/* One-Click Direct WhatsApp Share Tool */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${
                  isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-emerald-950/30 border-emerald-800/40'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-emerald-900 dark:text-emerald-300">
                        Share via WhatsApp Community Broadcast
                      </h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        Send this verified campaign message directly to your village WhatsApp group.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenWhatsAppShare(selectedStrategy.pitchScript)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to WhatsApp</span>
                  </button>
                </div>

                {/* 🔄 BOTTOM PREV / NEXT PLAYBOOK STEPPERS */}
                <div className={`pt-5 pb-0.5 border-t flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <button
                    onClick={handlePrevStrategy}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1.5 transition-all cursor-pointer border whitespace-nowrap shrink-0 active:scale-95 ${
                      isLight 
                        ? (isRetro ? 'bg-white border-[#E6DCB8] text-[#1E1B18] hover:bg-[#F5EFE4]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100') 
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                    <span>Previous</span>
                  </button>

                  <div className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border whitespace-nowrap ${
                    isLight 
                      ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8] text-[#3D3833]' : 'bg-slate-100 border-slate-200 text-slate-700') 
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}>
                    <span className="text-amber-500 font-black">#{currentIndex + 1}</span>
                    <span className="opacity-40">/</span>
                    <span>{MARKETING_STRATEGIES.length}</span>
                  </div>

                  <button
                    onClick={handleNextStrategy}
                    className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1.5 transition-all cursor-pointer border whitespace-nowrap shrink-0 active:scale-95 shadow-xs ${
                      isLight 
                        ? (isRetro ? 'bg-[#F95724] border-[#F95724] text-white hover:bg-[#E04818]' : 'bg-amber-500 border-amber-400 text-slate-950 hover:bg-amber-400') 
                        : 'bg-amber-400 border-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    <span>Next Playbook</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Footer Section */}
      <FooterSection
        themeObj={themeObj}
        t={t}
        onOpenModal={onOpenLegalModal}
      />
    </div>
  );
};

