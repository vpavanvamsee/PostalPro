import React, { useState } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  Share2,
  ArrowRight, 
  Sparkles, 
  Search,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';
import { POSTAL_TOOLS } from '../data/postalTools';
import { PostalToolItem, AppView } from '../types';
import { FooterSection } from './FooterSection';

interface ToolsPageProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onNavigate: (view: AppView) => void;
  onSelectTool: (tool: PostalToolItem) => void;
  onOpenLegalModal: (view: AppView) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Receipt,
  ShieldCheck,
  Share2
};

export const ToolsPage: React.FC<ToolsPageProps> = ({
  themeObj,
  t,
  onNavigate,
  onOpenLegalModal
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories for the available tools
  const categories = ['All', 'Official Utilities', 'Marketing'];

  const filteredTools = POSTAL_TOOLS.filter((tool) => {
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.badge && tool.badge.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Top Header & Search Bar (Clean dedicated tools layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Navigation Breadcrumb / Return */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 border ${
              isLight 
                ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8] text-[#1E1B18] hover:bg-[#F3ECE0]' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100') 
                : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
              isLight 
                ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-amber-100 text-amber-800') 
                : 'bg-amber-400/20 text-amber-300'
            }`}>
              PostalPro Suite
            </span>
          </div>
        </div>

        {/* Page Title & Subtitle Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg relative overflow-hidden ${
          isLight 
            ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8]' : 'bg-white border-slate-200') 
            : `${themeObj.cardBg} ${themeObj.cardBorder}`
        }`}>
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
              style={{
                backgroundColor: isLight ? (isRetro ? '#FEECE6' : '#FEF3C7') : 'rgba(245, 158, 11, 0.15)',
                color: isLight ? (isRetro ? '#F95724' : '#D97706') : '#FBBF24'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Postal Suite</span>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-black tracking-tight ${
              isLight ? (isRetro ? 'text-[#1A1815]' : 'text-slate-900') : themeObj.textPrimary
            }`}>
              Postal Utilities & WebApps
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Official Branch Post Office tools for instant TD Commission Bill generation and PLI/RPLI lead and quote management.
            </p>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, TD bill, PLI leads..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border outline-none transition-all ${
                isLight 
                  ? (isRetro ? 'bg-white border-[#E6DCB8] text-[#1E1B18] focus:border-[#F95724]' : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500') 
                  : 'bg-slate-900 border-slate-800 text-white focus:border-amber-400'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? (isLight 
                          ? (isRetro ? 'bg-[#F95724] text-white shadow-sm' : 'bg-amber-500 text-slate-950 shadow-sm') 
                          : 'bg-amber-400 text-slate-950 shadow-sm')
                      : (isLight 
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white')
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {filteredTools.map((tool) => {
            const IconComponent = ICON_MAP[tool.iconName] || Receipt;

            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleToolClick(tool)}
                className={`p-6 sm:p-7 rounded-3xl cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between border select-none ${
                  isLight 
                    ? (isRetro 
                        ? 'bg-white border-[#E6DCB8] text-[#1E1B18] hover:border-[#F95724] hover:shadow-xl' 
                        : 'bg-white border-slate-200 text-slate-900 hover:border-amber-500 hover:shadow-xl')
                    : `${themeObj.cardBg} ${themeObj.cardBorder} text-white hover:border-amber-400/60 hover:shadow-xl`
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isLight 
                        ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-amber-100 text-amber-700') 
                        : 'bg-amber-400/15 text-amber-400'
                    }`}>
                      <IconComponent className="w-6 h-6 stroke-[2.2]" />
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
                    <h3 className={`text-lg sm:text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {tool.title}
                    </h3>
                    <p className={`text-xs sm:text-sm mt-1.5 line-clamp-3 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className={`pt-4 mt-5 flex items-center justify-between border-t text-xs font-bold ${
                  isLight ? 'border-slate-100' : 'border-slate-800/80'
                }`}>
                  <span className={`flex items-center gap-1.5 ${isLight ? (isRetro ? 'text-[#F95724]' : 'text-amber-600') : 'text-amber-400'}`}>
                    <span>Launch in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
                    isLight 
                      ? (isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-slate-100 text-slate-700') 
                      : 'bg-slate-800 text-white'
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="text-sm font-bold text-slate-400">No tools found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <FooterSection
        themeObj={themeObj}
        t={t}
        onOpenModal={onOpenLegalModal}
        onNavigate={onNavigate}
      />
    </div>
  );
};
