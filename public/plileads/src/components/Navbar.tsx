import React from 'react';
import { Shield, Plus, Globe, Users, Megaphone, User, Mail } from 'lucide-react';
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
  return (
    <>
      {/* ================= TOP HEADER ================= */}
      <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-lg border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm flex items-center justify-center text-emerald-900">
              <Mail className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg leading-none tracking-tight text-white">
                  PostalPro
                </h1>
                <span className="hidden md:inline-block bg-emerald-800/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-700/60">
                  PLI & RPLI
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-200/80 font-semibold mt-0.5">
                PLI & RPLI Smart Lead Studio
              </p>
            </div>
          </div>

          {/* Right Tools: Vault, Language & Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Security Indicator */}
            <div
              title="All client records are 256-bit AES-GCM encrypted on this device only."
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/50 text-emerald-200 border border-emerald-700 text-xs font-medium"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold tracking-wide">256-Bit Local Vault</span>
            </div>

            {/* Language Selector Pill */}
            <div className="relative flex items-center bg-emerald-800/60 hover:bg-emerald-800/90 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white border border-emerald-700 transition">
              <Globe className="w-3.5 h-3.5 text-emerald-300 mr-1 sm:mr-1.5 pointer-events-none" />
              <select
                id="language-selector"
                value={language}
                aria-label="Language selector"
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-3 sm:pr-4 appearance-none"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.native} ({lang.label})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-emerald-300 pointer-events-none">▼</span>
            </div>

            {/* Primary Action Button */}
            <button
              id="navbar-new-quote-btn"
              onClick={onOpenNewQuote}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold p-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">{t(language, 'newLead')}</span>
            </button>
          </div>
        </div>

        {/* Desktop / Tablet Tab Strip */}
        <div className="bg-emerald-950/90 border-t border-emerald-800/60 hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2">
            <button
              id="nav-tab-leads"
              onClick={() => setTab('leads')}
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

            <button
              id="nav-tab-marketing"
              onClick={() => setTab('marketing')}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition relative cursor-pointer ${
                currentTab === 'marketing'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-900/50'
                  : 'border-transparent text-emerald-200/80 hover:text-white hover:bg-emerald-900/30'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>{t(language, 'marketingTab')}</span>
            </button>

            <button
              id="nav-tab-profile"
              onClick={() => setTab('profile')}
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
      </header>

      {/* ================= STICKY MOBILE BOTTOM NAV ================= */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-emerald-950/95 backdrop-blur-md border-t border-emerald-800/80 shadow-[0_-4px_16px_rgba(0,0,0,0.25)] sm:hidden pb-safe"
      >
        <div className="grid grid-cols-3 h-16 max-w-md mx-auto">
          {/* Mobile Leads Tab */}
          <button
            onClick={() => setTab('leads')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
              currentTab === 'leads'
                ? 'text-emerald-400 font-bold'
                : 'text-emerald-200/70 hover:text-emerald-100 font-medium'
            }`}
          >
            <div className="relative">
              <Users className={`w-5 h-5 ${currentTab === 'leads' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {leadsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-[9px] font-black rounded-full bg-emerald-500 text-white leading-tight">
                  {leadsCount}
                </span>
              )}
            </div>
            <span className="text-[11px] leading-none tracking-tight">{t(language, 'leadsTab')}</span>
            {currentTab === 'leads' && (
              <span className="absolute top-0 w-8 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          {/* Mobile Marketing Tab */}
          <button
            onClick={() => setTab('marketing')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
              currentTab === 'marketing'
                ? 'text-emerald-400 font-bold'
                : 'text-emerald-200/70 hover:text-emerald-100 font-medium'
            }`}
          >
            <Megaphone className={`w-5 h-5 ${currentTab === 'marketing' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px] leading-none tracking-tight">{t(language, 'marketingTab')}</span>
            {currentTab === 'marketing' && (
              <span className="absolute top-0 w-8 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          {/* Mobile Profile Tab */}
          <button
            onClick={() => setTab('profile')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
              currentTab === 'profile'
                ? 'text-emerald-400 font-bold'
                : 'text-emerald-200/70 hover:text-emerald-100 font-medium'
            }`}
          >
            <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px] leading-none tracking-tight">{t(language, 'profileTab')}</span>
            {currentTab === 'profile' && (
              <span className="absolute top-0 w-8 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
