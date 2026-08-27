/**
 * TD Commission Generator by PostalPro
 * Official India Post Time Deposit (TD) Incentive & Claim Bill Studio
 * Direct Home Navigation: https://postalpro.in/
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calculator, 
  Printer, 
  Building2, 
  Plus, 
  ShieldCheck, 
  ExternalLink,
  Coins,
  ArrowUp
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BillRegisterTab } from './components/BillRegisterTab';
import { QuickCalculatorCard } from './components/QuickCalculatorCard';
import { OfficialBillPrintView } from './components/OfficialBillPrintView';
import { BranchProfileTab } from './components/BranchProfileTab';
import { TDAccountModal } from './components/TDAccountModal';
import { BatchImportModal } from './components/BatchImportModal';
import { EncryptedVaultModal } from './components/EncryptedVaultModal';
import { OfficeProfile, TDAccountItem, TDTerm, ThemeType } from './types';
import { DEFAULT_OFFICE_PROFILE, INITIAL_SAMPLE_ACCOUNTS } from './utils/sampleTDData';
import { calculateIncentive } from './utils/tdRules';
import { THEMES } from './utils/themeConfig';

const VAULT_ACCOUNTS_KEY = 'postalpro_td_accounts_v1';
const VAULT_OFFICE_KEY = 'postalpro_td_office_v1';
const VAULT_THEME_KEY = 'postalpro_td_theme_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'register' | 'calculator' | 'officialBill' | 'profile'>('register');
  const [theme, setTheme] = useState<ThemeType>('emerald');
  
  // Data State
  const [accounts, setAccounts] = useState<TDAccountItem[]>([]);
  const [office, setOffice] = useState<OfficeProfile>(DEFAULT_OFFICE_PROFILE);
  const [billMonth, setBillMonth] = useState<string>('August 2026');
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modal State
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TDAccountItem | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll listener for top nav button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 1. Initial Load from Local Storage Vault
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(VAULT_THEME_KEY) as ThemeType;
      if (savedTheme && THEMES[savedTheme]) {
        setTheme(savedTheme);
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
    } catch (err) {
      console.error('Error loading TD Vault data:', err);
    }
  }, []);

  // 2. Save Theme Preference
  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem(VAULT_THEME_KEY, newTheme);
  };

  // 3. Save / Update TD Account
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

  // 4. Delete TD Account
  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to remove this TD account from the bill?')) {
      const updated = accounts.filter((item) => item.id !== id);
      setAccounts(updated);
      localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(updated));
    }
  };

  // 5. Batch Import Accounts
  const handleBatchImport = (importedItems: TDAccountItem[]) => {
    const updated = [...importedItems, ...accounts];
    setAccounts(updated);
    localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(updated));
  };

  // 6. Reset to Sample Accounts
  const handleResetToSample = () => {
    setAccounts(INITIAL_SAMPLE_ACCOUNTS);
    localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(INITIAL_SAMPLE_ACCOUNTS));
  };

  // 7. Save Office Profile
  const handleSaveOffice = (updatedOffice: OfficeProfile) => {
    setOffice(updatedOffice);
    localStorage.setItem(VAULT_OFFICE_KEY, JSON.stringify(updatedOffice));
  };

  // 8. Restore from Encrypted Vault Backup
  const handleRestoreVaultData = (restoredAccounts: TDAccountItem[], restoredOffice: OfficeProfile) => {
    setAccounts(restoredAccounts);
    setOffice(restoredOffice);
    localStorage.setItem(VAULT_ACCOUNTS_KEY, JSON.stringify(restoredAccounts));
    localStorage.setItem(VAULT_OFFICE_KEY, JSON.stringify(restoredOffice));
  };

  // 9. Clear Local Vault
  const handleClearVault = () => {
    setAccounts([]);
    localStorage.removeItem(VAULT_ACCOUNTS_KEY);
  };

  // Total incentive calculation
  const totalIncentive = accounts.reduce((sum, item) => sum + (item.incentiveAmount || 0), 0);
  const themeObj = THEMES[theme] || THEMES.emerald;

  return (
    <div className={`min-h-screen ${theme === 'slateDark' ? 'bg-neutral-950 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950 w-full overflow-x-hidden`}>
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setTab={setCurrentTab}
        accountsCount={accounts.length}
        totalIncentive={totalIncentive}
        theme={theme}
        setTheme={handleSetTheme}
        onOpenNewAccountModal={() => {
          setEditingItem(null);
          setIsAccountModalOpen(true);
        }}
        onOpenVaultModal={() => setIsVaultModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 pt-3 sm:pt-5 pb-20 sm:pb-12 overflow-x-hidden">
        {currentTab === 'register' && (
          <BillRegisterTab
            accounts={accounts}
            office={office}
            onOpenNewAccountModal={() => {
              setEditingItem(null);
              setIsAccountModalOpen(true);
            }}
            onOpenBatchModal={() => setIsBatchModalOpen(true)}
            onOpenVaultModal={() => setIsVaultModalOpen(true)}
            onEditAccount={(item) => {
              setEditingItem(item);
              setIsAccountModalOpen(true);
            }}
            onDeleteAccount={handleDeleteAccount}
            onResetToSample={handleResetToSample}
            onNavigateToOfficialBill={() => setCurrentTab('officialBill')}
          />
        )}

        {currentTab === 'calculator' && (
          <QuickCalculatorCard />
        )}

        {currentTab === 'officialBill' && (
          <OfficialBillPrintView
            accounts={accounts}
            office={office}
            billMonth={billMonth}
            billDate={billDate}
            onBackToRegister={() => setCurrentTab('register')}
          />
        )}

        {currentTab === 'profile' && (
          <BranchProfileTab
            office={office}
            onSaveProfile={handleSaveOffice}
            onResetDefaults={() => handleSaveOffice(DEFAULT_OFFICE_PROFILE)}
          />
        )}
      </main>

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

      {/* Floating Scroll to Top Navigation Button (Upward Arrow) */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={handleScrollToTop}
          title="Scroll to Top"
          aria-label="Scroll back to top of page"
          className="fixed bottom-16 right-3.5 sm:bottom-6 sm:right-6 z-40 bg-slate-900/90 hover:bg-emerald-700 text-amber-300 hover:text-white p-2.5 sm:p-3 rounded-full shadow-2xl border border-slate-700/80 hover:border-emerald-500 backdrop-blur-xs cursor-pointer transition-all duration-200 active:scale-90 flex items-center justify-center animate-in fade-in zoom-in-75 print:hidden group"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
          <span className="sr-only">Back to Top</span>
        </button>
      )}

      {/* Footer Branding & PostalPro Redirect Link */}
      <footer className={`${themeObj.headerBg} text-emerald-300 py-6 border-t ${themeObj.headerBorder} text-center text-xs print:hidden mb-14 sm:mb-0 w-full overflow-x-hidden`}>
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <a
              id="footer-postalpro-home-link"
              href="https://postalpro.in/"
              target="_self"
              className="font-bold text-white hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer underline decoration-amber-400 decoration-2"
            >
              <span>TD Commission Generator by PostalPro</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-emerald-400">•</span>
            <span className="text-emerald-200">India Post • TD Bill Studio</span>
          </div>
          <p className="text-[11px] text-emerald-400/90">
            Strict 12-Digit Finacle Account Validator • 256-Bit Encrypted Local Vault • Department of Posts Format
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Sticky Navigation (Visible only on mobile screens < sm) */}
      <nav 
        aria-label="Mobile bottom navigation bar"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-emerald-800/80 px-1 py-1 flex items-center justify-around shadow-2xl print:hidden max-w-full w-full"
      >
        {/* Register Tab */}
        <button
          id="mobile-bottom-tab-register"
          onClick={() => setCurrentTab('register')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer min-w-0 ${
            currentTab === 'register'
              ? 'text-amber-300 bg-emerald-950/80'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <FileText className="w-4.5 h-4.5" />
            {accounts.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[8px] font-black rounded-full bg-amber-400 text-slate-950">
                {accounts.length}
              </span>
            )}
          </div>
          <span className="mt-0.5 whitespace-nowrap">Register</span>
        </button>

        {/* Quick Calc Tab */}
        <button
          id="mobile-bottom-tab-calculator"
          onClick={() => setCurrentTab('calculator')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer min-w-0 ${
            currentTab === 'calculator'
              ? 'text-amber-300 bg-emerald-950/80'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4.5 h-4.5" />
          <span className="mt-0.5 whitespace-nowrap">Calculator</span>
        </button>

        {/* Center Floating + Add TD Account Button */}
        <button
          id="mobile-bottom-add-account-btn"
          onClick={() => {
            setEditingItem(null);
            setIsAccountModalOpen(true);
          }}
          className="flex flex-col items-center justify-center -mt-4 bg-linear-to-r from-amber-500 to-emerald-500 text-slate-950 p-2.5 rounded-full shadow-lg border-2 border-slate-950 active:scale-95 transition cursor-pointer shrink-0"
          title="Add TD Account"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Official Bill Tab */}
        <button
          id="mobile-bottom-tab-officialBill"
          onClick={() => setCurrentTab('officialBill')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer min-w-0 ${
            currentTab === 'officialBill'
              ? 'text-amber-300 bg-emerald-950/80'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Printer className="w-4.5 h-4.5" />
          <span className="mt-0.5 whitespace-nowrap">Claim Bill</span>
        </button>

        {/* BO Profile Tab */}
        <button
          id="mobile-bottom-tab-profile"
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer min-w-0 ${
            currentTab === 'profile'
              ? 'text-amber-300 bg-emerald-950/80'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4.5 h-4.5" />
          <span className="mt-0.5 whitespace-nowrap">Profile</span>
        </button>
      </nav>

    </div>
  );
}
