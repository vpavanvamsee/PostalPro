import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Calculator, 
  Printer, 
  Menu, 
  X, 
  Plus, 
  ShieldCheck, 
  Palette, 
  Coins, 
  Home, 
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { ThemeType } from '../types';
import { THEMES } from '../utils/themeConfig';

interface NavbarProps {
  currentTab: 'register' | 'calculator' | 'officialBill' | 'profile';
  setTab: (tab: 'register' | 'calculator' | 'officialBill' | 'profile') => void;
  accountsCount: number;
  totalIncentive: number;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  onOpenNewAccountModal: () => void;
  onOpenVaultModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  accountsCount,
  totalIncentive,
  theme,
  setTheme,
  onOpenNewAccountModal,
  onOpenVaultModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const themeObj = THEMES[theme] || THEMES.emerald;

  const handleTabClick = (tab: 'register' | 'calculator' | 'officialBill' | 'profile') => {
    setTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleNewAccountClick = () => {
    setIsMobileMenuOpen(false);
    onOpenNewAccountModal();
  };

  const handleVaultClick = () => {
    setIsMobileMenuOpen(false);
    onOpenVaultModal();
  };

  return (
    <header className={`sticky top-0 z-40 ${themeObj.headerBg} text-white shadow-md border-b ${themeObj.headerBorder} w-full overflow-x-hidden`}>
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-1.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Header - Redirects to https://postalpro.in/ on click */}
        <a
          id="header-brand-postalpro-home"
          href="https://postalpro.in/"
          target="_self"
          title="TD Commission Generator by PostalPro - Click to visit postalpro.in"
          className="flex items-center gap-2 sm:gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-xl pr-1 sm:pr-2 transition-all min-w-0 flex-1 sm:flex-initial overflow-hidden"
        >
          <div className="bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-md flex items-center justify-center text-emerald-900 group-hover:scale-105 group-hover:bg-amber-50 transition-all shrink-0">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span className="font-extrabold text-xs sm:text-base tracking-tight text-white group-hover:text-amber-300 transition-colors truncate">
                TD Commission Generator
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-300 group-hover:text-white transition-colors shrink-0">
                by PostalPro
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                12-Digit Finacle Ready
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-300/80 font-medium truncate mt-0.5">
              India Post • TD Bill Studio
            </p>
          </div>
        </a>

        {/* Desktop Controls (Hidden on Mobile) */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Total Incentive Live Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs">
            <span className="text-[11px] text-emerald-300 font-medium">Claim Total:</span>
            <span className="font-mono font-bold text-amber-300">₹{totalIncentive.toLocaleString('en-IN')}</span>
          </div>

          {/* Theme Selector */}
          <div className="relative flex items-center bg-emerald-900/60 hover:bg-emerald-900/90 rounded-full px-2.5 py-1.5 text-xs font-semibold text-white border border-emerald-700/80 transition">
            <Palette className="w-3.5 h-3.5 text-emerald-300 mr-1.5 pointer-events-none" />
            <select
              id="desktop-theme-selector"
              value={theme}
              aria-label="Select application theme"
              onChange={(e) => setTheme(e.target.value as ThemeType)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-3 appearance-none"
            >
              {Object.values(THEMES).map((th) => (
                <option key={th.id} value={th.id} className="bg-slate-900 text-white">
                  {th.name}
                </option>
              ))}
            </select>
            <span className="text-[9px] text-emerald-300 pointer-events-none">▼</span>
          </div>

          {/* Encrypted Vault Button */}
          <button
            onClick={onOpenVaultModal}
            title="Encrypted Vault & Data Management (256-bit AES-GCM)"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-[11px] text-emerald-300 hover:text-white font-medium cursor-pointer transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Vault</span>
          </button>

          {/* Quick Add TD Account Button */}
          <button
            id="desktop-add-account-btn"
            onClick={onOpenNewAccountModal}
            className="bg-linear-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold py-1.5 px-3.5 rounded-full text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add TD Account</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-1 shrink-0">
          <button
            id="mobile-hamburger-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="p-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/80 focus:outline-none cursor-pointer transition flex items-center justify-center shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white stroke-[2.5]" />
            ) : (
              <Menu className="w-5 h-5 text-white stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs Strip */}
      <div className={`hidden sm:block ${themeObj.subHeaderBg} border-t ${themeObj.headerBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1">
          {/* Tab 1: Bill Register */}
          <button
            id="desktop-nav-tab-register"
            onClick={() => handleTabClick('register')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              currentTab === 'register'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/40'
                : 'border-transparent text-emerald-200/80 hover:text-white hover:bg-emerald-900/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bill Register</span>
            {accountsCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-slate-950">
                {accountsCount}
              </span>
            )}
          </button>

          {/* Tab 2: Quick Calculator */}
          <button
            id="desktop-nav-tab-calculator"
            onClick={() => handleTabClick('calculator')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              currentTab === 'calculator'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/40'
                : 'border-transparent text-emerald-200/80 hover:text-white hover:bg-emerald-900/20'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Quick TD Calculator</span>
          </button>

          {/* Tab 3: Official Bill Print */}
          <button
            id="desktop-nav-tab-officialBill"
            onClick={() => handleTabClick('officialBill')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              currentTab === 'officialBill'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/40'
                : 'border-transparent text-emerald-200/80 hover:text-white hover:bg-emerald-900/20'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Official Claim Bill (Print / PDF)</span>
          </button>

          {/* Tab 4: Branch Office Profile */}
          <button
            id="desktop-nav-tab-profile"
            onClick={() => handleTabClick('profile')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              currentTab === 'profile'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/40'
                : 'border-transparent text-emerald-200/80 hover:text-white hover:bg-emerald-900/20'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Branch Office Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Hamburger Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-slate-950 border-t border-emerald-800/80 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-4 max-h-[82vh] overflow-y-auto">
            {/* Primary Action: Add TD Account */}
            <button
              id="mobile-menu-add-account-btn"
              onClick={handleNewAccountClick}
              className="w-full bg-linear-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 active:from-amber-600 active:to-emerald-600 text-slate-950 font-black py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>+ Add New TD Account</span>
            </button>

            {/* Quick Portal Navigation */}
            <div className="space-y-1 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1">
                Portal Sections
              </p>

              {/* Bill Register */}
              <button
                id="mobile-drawer-tab-register"
                onClick={() => handleTabClick('register')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                  currentTab === 'register'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Bill Register</span>
                </div>
                {accountsCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-slate-950">
                    {accountsCount} Accounts
                  </span>
                )}
              </button>

              {/* Quick Calculator */}
              <button
                id="mobile-drawer-tab-calculator"
                onClick={() => handleTabClick('calculator')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                  currentTab === 'calculator'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Quick TD Calculator</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* Official Claim Bill */}
              <button
                id="mobile-drawer-tab-officialBill"
                onClick={() => handleTabClick('officialBill')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                  currentTab === 'officialBill'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-sky-400" />
                  <span>Official Claim Bill (Print / PDF)</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* BO Profile */}
              <button
                id="mobile-drawer-tab-profile"
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span>Branch Office Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>

            {/* Encrypted Vault Access */}
            <button
              onClick={handleVaultClick}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Encrypted Vault & Backup</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">256-Bit AES →</span>
            </button>

            {/* Theme Picker */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Color Theme</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-300">
                  {themeObj.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {Object.values(THEMES).map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition cursor-pointer truncate ${
                      theme === th.id
                        ? 'bg-emerald-600 text-white ring-1 ring-amber-300 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {th.name}
                  </button>
                ))}
              </div>
            </div>

            {/* PostalPro Link */}
            <a
              id="mobile-drawer-home-link"
              href="https://postalpro.in/"
              className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">Visit PostalPro Hub Home</span>
              </div>
              <span className="text-[11px] text-amber-400">postalpro.in →</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
