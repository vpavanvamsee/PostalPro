import React, { useState } from 'react';
import { 
  Palette, 
  Home, 
  Globe, 
  TrendingUp, 
  Wrench 
} from 'lucide-react';
import { ThemeType, AppView, LanguageCode } from '../types';
import { THEME_CONFIGS, ThemeDefinition } from '../utils/themeConfig';
import { SUPPORTED_LANGUAGES, TranslationDict } from '../utils/languages';
import { PostalProLogo } from './PostalProLogo';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  theme: ThemeType;
  onOpenThemeModal: () => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  t: TranslationDict;
  accountsCount: number;
  totalIncentive: number;
  onOpenNewAccountModal: () => void;
  onOpenVaultModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  theme,
  onOpenThemeModal,
  language,
  onSelectLanguage,
  t
}) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const themeObj: ThemeDefinition = THEME_CONFIGS[theme] || THEME_CONFIGS.retroCream;

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setIsLangDropdownOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 ${themeObj.headerBg} ${themeObj.headerText} shadow-md border-b ${themeObj.headerBorder} w-full transition-colors duration-200`}>
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left: Brand Header - POSTALPRO Title & Catchy Emblem */}
        <button
          id="header-brand-postalpro-home"
          onClick={() => handleNavClick('home')}
          title="PostalPro - India Postal Utility Hub"
          className="flex items-center group cursor-pointer focus:outline-none rounded-xl pr-1 transition-all shrink-0 select-none"
        >
          <PostalProLogo
            size="md"
            showWordmark={true}
            showTagline={true}
            themeObj={themeObj}
            animated={true}
          />
        </button>

        {/* Center: Desktop / Tablet Navigation Tabs (Home, Tools, Marketing) */}
        <nav 
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0"
        >
          {/* Nav Item: Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              currentView === 'home'
                ? themeObj.headerNavActive
                : themeObj.headerNavInactive
            }`}
          >
            <Home className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span>{t.nav.home}</span>
          </button>

          {/* Nav Item: Tools */}
          <button
            onClick={() => handleNavClick('tools')}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              currentView === 'tools'
                ? themeObj.headerNavActive
                : themeObj.headerNavInactive
            }`}
          >
            <Wrench className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span>{t.nav.tools}</span>
          </button>

          {/* Nav Item: Marketing */}
          <button
            onClick={() => handleNavClick('marketing')}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              currentView === 'marketing'
                ? themeObj.headerNavActive
                : themeObj.headerNavInactive
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span>{t.nav.marketing}</span>
          </button>
        </nav>

        {/* Right Action Icons: Language + Theme (Visible on all screens: Mobile, Tablet & Desktop) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              id="language-switcher-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer select-none ${themeObj.headerButton}`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{SUPPORTED_LANGUAGES.find(l => l.code === language)?.label || 'EN'}</span>
              <span className="text-[9px] opacity-70">▼</span>
            </button>

            {isLangDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in border ${
                themeObj.isLight 
                  ? 'bg-white border-slate-200 text-slate-900' 
                  : 'bg-slate-900 border-slate-700 text-white'
              }`}>
                {SUPPORTED_LANGUAGES.map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => {
                      onSelectLanguage(langItem.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-xs font-bold text-left flex items-center justify-between transition cursor-pointer ${
                      themeObj.isLight
                        ? (language === langItem.code ? 'text-[#F95724] bg-orange-50 font-black' : 'text-slate-700 hover:bg-slate-50')
                        : (language === langItem.code ? 'text-amber-400 bg-slate-800/80' : 'text-slate-200 hover:bg-slate-800')
                    }`}
                  >
                    <span>{langItem.nativeName}</span>
                    <span className="text-[10px] opacity-70">{langItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Selector Button (Hidden on Mobile, as Mobile has dedicated Theme button in BottomNav) */}
          <button
            id="theme-selector-modal-btn"
            onClick={onOpenThemeModal}
            className={`hidden sm:flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer select-none ${themeObj.headerButton}`}
            title="Change Theme (6 Professional Styles)"
          >
            <Palette className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden lg:inline">{themeObj.name}</span>
            <span className="lg:hidden">{t.nav.theme}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
