/**
 * PostalPro India • Official Redesigned WebApp & Landing Hub
 * Fully AI-powered site built and designed by tech-enthusiastic GDS
 * Canonical URL: https://postalpro.in/
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TDAccountModal } from './components/TDAccountModal';
import { BatchImportModal } from './components/BatchImportModal';
import { EncryptedVaultModal } from './components/EncryptedVaultModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { LegalModals } from './components/LegalModals';
import { InteractiveToolsModal } from './components/InteractiveToolsModal';
import { GuidesView } from './components/GuidesView';
import { QuizzesView } from './components/QuizzesView';
import { ToolsPage } from './components/ToolsPage';
import { MarketingPage } from './components/MarketingPage';
import { BottomNav } from './components/BottomNav';
import { ScrollToTopRocket } from './components/ScrollToTopRocket';
import { OfflineToast } from './components/OfflineToast';

import { OfficeProfile, TDAccountItem, ThemeType, AppView, LanguageCode, PostalToolItem } from './types';
import { DEFAULT_OFFICE_PROFILE, INITIAL_SAMPLE_ACCOUNTS } from './utils/sampleTDData';
import { THEME_CONFIGS, ThemeDefinition } from './utils/themeConfig';
import { TRANSLATIONS, TranslationDict } from './utils/languages';

const VAULT_ACCOUNTS_KEY = 'postalpro_td_accounts_v1';
const VAULT_OFFICE_KEY = 'postalpro_td_office_v1';
const VAULT_THEME_KEY = 'postalpro_td_theme_v1';
const VAULT_LANG_KEY = 'postalpro_td_lang_v1';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedMarketingStrategyId, setSelectedMarketingStrategyId] = useState<string | null>(null);
  
  // Theme & Language State - Default to Retro Warm Cream Theme
  const [theme, setTheme] = useState<ThemeType>('retroCream');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // TD Bill Accounts & Office State
  const [accounts, setAccounts] = useState<TDAccountItem[]>([]);
  const [office, setOffice] = useState<OfficeProfile>(DEFAULT_OFFICE_PROFILE);
  const [billMonth, setBillMonth] = useState<string>('August 2026');
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modal States
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TDAccountItem | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [legalModalView, setLegalModalView] = useState<AppView | null>(null);
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<PostalToolItem | null>(null);

  // Active theme and translation dictionary
  const themeObj: ThemeDefinition = THEME_CONFIGS[theme] || THEME_CONFIGS.retroCream;
  const t: TranslationDict = TRANSLATIONS[language] || TRANSLATIONS.en;

  // 1. Initial Load from Local Storage Vault
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(VAULT_THEME_KEY) as ThemeType;
      if (savedTheme && THEME_CONFIGS[savedTheme]) {
        setTheme(savedTheme);
      } else {
        setTheme('retroCream');
      }

      const savedLang = localStorage.getItem(VAULT_LANG_KEY) as LanguageCode;
      if (savedLang && TRANSLATIONS[savedLang]) {
        setLanguage(savedLang);
      }

      const savedOffice = localStorage.getItem(VAULT_OFFICE_KEY);
      if (savedOffice) {
        setOffice(JSON.parse(savedOffice));
      } else {
        setOffice(DEFAULT_OFFICE_PROFILE);
        localStorage.setItem(VAULT_OFFICE_KEY, JSON.stringify(DEFAULT_OFFICE_PROFILE));
      }

      const savedAccounts = localStorage.getItem(VAULT_ACCOUNTS_KEY);
      if (savedAccounts) {
        setAccounts(JSON.parse(savedAccounts));
      } else {
        setAccounts(INITIAL_SAMPLE_ACCOUNTS);
        localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(INITIAL_SAMPLE_ACCOUNTS));
      }

      // 1b. Handle Initial Hash Routing (e.g., #tdbill, #plileads, #tools, #marketing)
      const initialHash = window.location.hash.replace('#', '').toLowerCase();
      if (initialHash === 'tools') {
        setCurrentView('tools');
      } else if (initialHash === 'marketing') {
        setCurrentView('marketing');
      } else if (initialHash === 'guides') {
        setCurrentView('guides');
      } else if (initialHash === 'quizzes') {
        setCurrentView('quizzes');
      } else if (initialHash === 'tdbill' || initialHash === 'tdbill-section') {
        setTimeout(() => {
          const el = document.getElementById('tdbill-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else if (initialHash === 'plileads' || initialHash === 'plileads-section') {
        setTimeout(() => {
          const el = document.getElementById('plileads-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } catch (err) {
      console.error('Error loading PostalPro data:', err);
    }
  }, []);

  // 2. Set Theme
  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem(VAULT_THEME_KEY, newTheme);
  };

  // 3. Set Language
  const handleSetLanguage = (newLang: LanguageCode) => {
    setLanguage(newLang);
    localStorage.setItem(VAULT_LANG_KEY, newLang);
  };

  // 4. Save / Update TD Account
  const handleSaveAccount = (savedItem: TDAccountItem) => {
    let updated: TDAccountItem[];
    const exists = accounts.some((a) => a.id === savedItem.id);

    if (exists) {
      updated = accounts.map((item) => (item.id === savedItem.id ? savedItem : item));
    } else {
      updated = [savedItem, ...accounts];
    }

    setAccounts(updated);
    localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(updated));
    setEditingItem(null);
  };

  // 5. Delete TD Account
  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to remove this TD account from the bill?')) {
      const updated = accounts.filter((item) => item.id !== id);
      setAccounts(updated);
      localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(updated));
    }
  };

  // 6. Batch Import Accounts
  const handleBatchImport = (importedItems: TDAccountItem[]) => {
    const updated = [...importedItems, ...accounts];
    setAccounts(updated);
    localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(updated));
  };

  // 7. Reset to Sample Accounts
  const handleResetToSample = () => {
    setAccounts(INITIAL_SAMPLE_ACCOUNTS);
    localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(INITIAL_SAMPLE_ACCOUNTS));
  };

  // 8. Save Office Profile
  const handleSaveOffice = (updatedOffice: OfficeProfile) => {
    setOffice(updatedOffice);
    localStorage.setItem(VAULT_OFFICE_KEY, JSON.stringify(updatedOffice));
  };

  // 9. Restore from Encrypted Vault Backup
  const handleRestoreVaultData = (restoredAccounts: TDAccountItem[], restoredOffice: OfficeProfile) => {
    setAccounts(restoredAccounts);
    setOffice(restoredOffice);
    localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(restoredAccounts));
    localStorage.setItem(VAULT_OFFICE_KEY, JSON.stringify(restoredOffice));
  };

  // 10. Clear Local Vault
  const handleClearVault = () => {
    setAccounts([]);
    localStorage.removeItem(VAULT_ACCOUNTS_KEY);
  };

  // Handle Tool Launch
  const handleSelectPostalTool = (tool: PostalToolItem) => {
    if (tool.id === 'td-bill-gen' || tool.targetView === 'tdbill') {
      window.open('https://postalpro.in/tdbill/', '_blank', 'noopener,noreferrer');
    } else if (tool.id === 'pli-leads-pro' || tool.targetView === 'plileads') {
      window.open('https://postalpro.in/plileads/', '_blank', 'noopener,noreferrer');
    } else if (tool.externalUrl) {
      window.open(tool.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      setActiveInteractiveTool(tool);
    }
  };

  // Total incentive calculation
  const totalIncentive = accounts.reduce((sum, item) => sum + (item.incentiveAmount || 0), 0);

  return (
    <div 
      className={`min-h-screen ${themeObj.bg} ${themeObj.textPrimary} flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 w-full overflow-x-hidden transition-colors duration-300 relative`}
    >
      {/* Absolute Top Anchor for smooth Scroll-To-Top */}
      <div id="top-of-page" className="absolute top-0 left-0 w-px h-px pointer-events-none opacity-0 -z-50" tabIndex={-1} aria-hidden="true" />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (['about', 'privacy', 'publicNotice'].includes(view)) {
            setLegalModalView(view);
          } else if (view === 'plileads') {
            window.open('https://postalpro.in/plileads/', '_blank', 'noopener,noreferrer');
          } else if (view === 'tdbill') {
            window.open('https://postalpro.in/tdbill/', '_blank', 'noopener,noreferrer');
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        theme={theme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        language={language}
        onSelectLanguage={handleSetLanguage}
        t={t}
        accountsCount={accounts.length}
        totalIncentive={totalIncentive}
        onOpenNewAccountModal={() => {
          setEditingItem(null);
          setIsAccountModalOpen(true);
        }}
        onOpenVaultModal={() => setIsVaultModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full mx-auto pb-16 md:pb-0">
        {/* VIEW 1: Full Redesigned 6-Section Landing Page */}
        {currentView === 'home' && (
          <LandingPage
            themeObj={themeObj}
            t={t}
            onNavigate={(view, param) => {
              if (['about', 'privacy', 'publicNotice'].includes(view)) {
                setLegalModalView(view);
              } else if (view === 'plileads') {
                window.open('https://postalpro.in/plileads/', '_blank', 'noopener,noreferrer');
              } else if (view === 'tdbill') {
                window.open('https://postalpro.in/tdbill/', '_blank', 'noopener,noreferrer');
              } else if (view === 'marketing') {
                if (param) {
                  setSelectedMarketingStrategyId(param);
                }
                setCurrentView('marketing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onSelectTool={handleSelectPostalTool}
            onOpenLegalModal={(view) => setLegalModalView(view)}
          />
        )}

        {/* VIEW 2: Postal Guides & Volumes */}
        {currentView === 'guides' && (
          <GuidesView
            themeObj={themeObj}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 3: AI Exam Practice Quizzes */}
        {currentView === 'quizzes' && (
          <QuizzesView
            themeObj={themeObj}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 6: Marketing Strategies Full Page View */}
        {currentView === 'marketing' && (
          <MarketingPage
            themeObj={themeObj}
            t={t}
            initialStrategyId={selectedMarketingStrategyId}
            onNavigate={(view) => {
              if (['about', 'privacy', 'publicNotice'].includes(view)) {
                setLegalModalView(view);
              } else {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onOpenLegalModal={(view) => setLegalModalView(view)}
          />
        )}

        {/* VIEW 7: Dedicated Tools Page */}
        {currentView === 'tools' && (
          <ToolsPage
            themeObj={themeObj}
            t={t}
            onNavigate={(view) => {
              if (['about', 'privacy', 'publicNotice'].includes(view)) {
                setLegalModalView(view);
              } else {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onSelectTool={handleSelectPostalTool}
            onOpenLegalModal={(view) => setLegalModalView(view)}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation Bar on Mobile View (Icons for Home, Tools, Marketing, Theme) */}
      <BottomNav
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        themeObj={themeObj}
        t={t}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Animated Rocket Launch Scroll-to-Top Button */}
      <ScrollToTopRocket themeObj={themeObj} />

      {/* Modal: Add/Edit TD Account with strict 12-digit validator & duplicate checking */}
      <TDAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveAccount}
        itemToEdit={editingItem}
        existingAccounts={accounts}
      />

      {/* Modal: Batch Quick Import */}
      <BatchImportModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onImport={handleBatchImport}
      />

      {/* Modal: 256-Bit Encrypted Vault & Data Management */}
      <EncryptedVaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        accounts={accounts}
        office={office}
        onRestoreData={handleRestoreVaultData}
        onClearData={handleClearVault}
      />

      {/* Modal: Theme Selector (With Retro Cream from screenshot + famous themes) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={handleSetTheme}
      />

      {/* Modal: Legal & Informational Modals (About Us from postalpro.in, Public Notice, Privacy, Sitemap) */}
      <LegalModals
        currentModal={legalModalView}
        onClose={() => setLegalModalView(null)}
        themeObj={themeObj}
        onNavigate={(view) => {
          setLegalModalView(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modal: Interactive Tools Runner (DIGIPIN, POSB Interest Master, GDS Salary, Forms) */}
      <InteractiveToolsModal
        tool={activeInteractiveTool}
        onClose={() => setActiveInteractiveTool(null)}
        themeObj={themeObj}
      />

      {/* Subtle Offline Connectivity Toast for Rural Post Offices */}
      <OfflineToast themeObj={themeObj} />
    </div>
  );
}
