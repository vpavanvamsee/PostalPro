import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Globe, 
  Users, 
  Megaphone, 
  User, 
  Mail, 
  Menu, 
  X, 
  Check, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../utils/i18n';

interface NavbarProps {
  currentTab: 'leads' | 'marketing' | 'profile';
  setTab: (tab: 'leads' | 'marketing' | 'profile') => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  leadsCount: number;
  onOpenNewQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  language,
  setLanguage,
  leadsCount,
  onOpenNewQuote
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'leads' | 'marketing' | 'profile') => {
    setTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleNewQuoteClick = () => {
    setIsMobileMenuOpen(false);
    onOpenNewQuote();
  };

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-lg border-b border-emerald-800">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand with White Icon Container */}
        <a 
          id="header-brand-home-link"
          href="https://postalpro.in/"
          target="_self"
          title="Go to PostalPro Home"
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg pr-2 transition"
        >
          <div className="bg-white p-2 rounded-lg shadow-sm flex items-center justify-center text-emerald-900 shrink-0 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-base sm:text-lg leading-none tracking-tight text-white group-hover:text-emerald-200 transition-colors truncate">
                PostalPro
              </h1>
                <span className="bg-emerald-800/90 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-700/60 shrink-0">
                  PLI & RPLI
                </span>
              </div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-200/80 font-semibold mt-0.5 truncate">
                  Smart Lead Studio
                </p>
              </div>
          </a>

        {/* Desktop Right Tools: Hidden on Mobile (< sm), visible on sm+ */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Security Encrypted Indicator */}
          <div 
            title="All client records are 256-bit AES-GCM encrypted on this device only."
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/50 text-emerald-200 border border-emerald-700 text-xs font-medium"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold tracking-wide">256-Bit Local Vault</span>
          </div>

          {/* Language Selector Pill (Desktop) */}
          <div className="relative flex items-center bg-emerald-800/60 hover:bg-emerald-800/90 rounded-full px-3 py-1.5 text-xs font-semibold text-white border border-emerald-700 transition">
            <Globe className="w-3.5 h-3.5 text-emerald-300 mr-1.5 pointer-events-none" />
            <select
              id="language-selector-desktop"
              value={language}
              aria-label="Language selector"
              onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-emerald-300 pointer-events-none ml-1">▼</span>
          </div>

          {/* Primary New Quote Pill Button (Desktop) */}
          <button
            id="navbar-new-quote-btn-desktop"
            onClick={onOpenNewQuote}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold py-1.5 sm:py-2 px-3.5 sm:px-4 rounded-full text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t(language, 'newLead')}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button (Visible only on mobile < sm) */}
        <div className="flex sm:hidden items-center">
          <button
            id="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-700/80 focus:outline-none cursor-pointer transition flex items-center justify-center"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white stroke-[2.5]" />
            ) : (
              <Menu className="w-6 h-6 text-white stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop / Tablet Navigation Strip */}
      <div className="bg-emerald-950/90 border-t border-emerald-800/60 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2">
          {/* Tab 1: Leads */}
          <button
            id="nav-tab-leads-desktop"
            onClick={() => handleTabClick('leads')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition relative cursor-pointer ${
              currentTab === 'leads'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-900/50'
                : 'border-transparent text-emerald-200/80 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t(language, 'leadsTab')}</span>
            {leadsCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500 text-white">
                {leadsCount}
              </span>
            )}
          </button>

          {/* Tab 2: Marketing & Objections */}
          <button
            id="nav-tab-marketing-desktop"
            onClick={() => handleTabClick('marketing')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition relative cursor-pointer ${
              currentTab === 'marketing'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-900/50'
                : 'border-transparent text-emerald-200/80 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{t(language, 'marketingTab')}</span>
          </button>

          {/* Tab 3: Agent Profile */}
          <button
            id="nav-tab-profile-desktop"
            onClick={() => handleTabClick('profile')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition relative cursor-pointer ${
              currentTab === 'profile'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-900/50'
                : 'border-transparent text-emerald-200/80 hover:text-white hover:bg-emerald-900/30'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t(language, 'profileTab')}</span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Hamburger Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-emerald-950 border-t border-emerald-800 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* 1. Mobile Primary Call to Action: New Quote */}
            <button
              id="mobile-menu-new-quote-btn"
              onClick={handleNewQuoteClick}
              className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:from-emerald-600 active:to-teal-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>+ {t(language, 'newLead')} (Calculator)</span>
            </button>

            {/* 2. Mobile Navigation Tabs */}
            <div className="space-y-1 bg-emerald-900/40 p-2 rounded-xl border border-emerald-800/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1">
                Navigation
              </p>

              {/* Leads & Quotes */}
              <button
                id="mobile-nav-tab-leads"
                onClick={() => handleTabClick('leads')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                  currentTab === 'leads'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-300" />
                  <span>{t(language, 'leadsTab')}</span>
                </div>
                {leadsCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-400 text-emerald-950">
                    {leadsCount}
                  </span>
                )}
              </button>

              {/* Marketing & Objections */}
              <button
                id="mobile-nav-tab-marketing"
                onClick={() => handleTabClick('marketing')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                  currentTab === 'marketing'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4 text-emerald-300" />
                  <span>{t(language, 'marketingTab')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* Agent Profile & Goals */}
              <button
                id="mobile-nav-tab-profile"
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-emerald-300" />
                  <span>{t(language, 'profileTab')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>

            {/* 3. Mobile Language Selector */}
            <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Poster & Quote Language</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-200 bg-emerald-800/80 px-2 py-0.5 rounded-md">
                  {currentLangObj.native}
                </span>
              </div>

              {/* Grid of Languages */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      language === lang.code
                        ? 'bg-emerald-600 text-white ring-1 ring-emerald-300'
                        : 'bg-emerald-950/60 text-emerald-200/90 hover:bg-emerald-800/70'
                    }`}
                  >
                    <span className="truncate">{lang.native}</span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Security Status Footer */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-900/30 border border-emerald-800/50 text-emerald-300 text-xs">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-[11px] text-emerald-200/80 leading-tight">
                256-Bit Encrypted on device. No client data is sent to external servers.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
