/**
 * PLI & RPLI Smart Lead & Poster Studio • by PostalPro
 * Encrypted On-Device PWA for Postal Department Life Insurance Agents
 */

import React, { useState, useEffect } from 'react';
import { Users, Megaphone, User, Plus } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LeadsTab } from './components/LeadsTab';
import { MarketingTab } from './components/MarketingTab';
import { ProfileTab } from './components/ProfileTab';
import { LeadModal } from './components/LeadModal';
import { PosterModal } from './components/PosterModal';
import { AgentProfile, LanguageCode, Lead, ProspectTask } from './types';
import { decryptData, encryptData } from './utils/crypto';
import { DEFAULT_AGENT, INITIAL_PROSPECTS, INITIAL_SAMPLE_LEADS } from './utils/sampleData';
import { t } from './utils/i18n';

const VAULT_LEADS_KEY = 'postalpro_vault_leads_v1';
const VAULT_AGENT_KEY = 'postalpro_vault_agent_v1';
const VAULT_PROSPECTS_KEY = 'postalpro_vault_prospects_v1';
const VAULT_LANG_KEY = 'postalpro_vault_lang_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'leads' | 'marketing' | 'profile'>('leads');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Leads & Profile State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agent, setAgent] = useState<AgentProfile>(DEFAULT_AGENT);
  const [prospects, setProspects] = useState<ProspectTask[]>(INITIAL_PROSPECTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [selectedPosterLead, setSelectedPosterLead] = useState<Lead | null>(null);

  // 1. Initial Load & AES-GCM Decryption from Local Storage
  useEffect(() => {
    async function loadVault() {
      try {
        const savedLang = localStorage.getItem(VAULT_LANG_KEY) as LanguageCode;
        if (savedLang) setLanguage(savedLang);

        const encLeads = localStorage.getItem(VAULT_LEADS_KEY);
        if (encLeads) {
          const decryptedLeads = await decryptData<Lead[]>(encLeads, []);
          setLeads(decryptedLeads);
        } else {
          // Initialize with demo leads on first launch
          setLeads(INITIAL_SAMPLE_LEADS);
          const enc = await encryptData(INITIAL_SAMPLE_LEADS);
          localStorage.setItem(VAULT_LEADS_KEY, enc);
        }

        const encAgent = localStorage.getItem(VAULT_AGENT_KEY);
        if (encAgent) {
          const decryptedAgent = await decryptData<AgentProfile>(encAgent, DEFAULT_AGENT);
          setAgent(decryptedAgent);
        }

        const encProspects = localStorage.getItem(VAULT_PROSPECTS_KEY);
        if (encProspects) {
          const decryptedPros = await decryptData<ProspectTask[]>(encProspects, INITIAL_PROSPECTS);
          setProspects(decryptedPros);
        }
      } catch (err) {
        console.error('Error loading vault data:', err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadVault();
  }, []);

  // 2. Language Change Handler
  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem(VAULT_LANG_KEY, lang);
  };

  // 3. Save / Update Lead with AES-GCM Encryption
  const handleSaveLead = async (lead: Lead) => {
    const existingIndex = leads.findIndex(l => l.id === lead.id);
    let updated: Lead[];
    if (existingIndex >= 0) {
      updated = [...leads];
      updated[existingIndex] = lead;
    } else {
      updated = [lead, ...leads];
    }
    setLeads(updated);

    // Encrypt and save to localStorage
    const cipher = await encryptData(updated);
    localStorage.setItem(VAULT_LEADS_KEY, cipher);

    // Auto open poster preview for the newly created / updated lead
    setSelectedPosterLead(lead);
    setIsPosterModalOpen(true);
  };

  // 4. Delete Lead
  const handleDeleteLead = async (id: string) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    const cipher = await encryptData(updated);
    localStorage.setItem(VAULT_LEADS_KEY, cipher);
  };

  // 5. Save Agent Profile
  const handleSaveProfile = async (newProfile: AgentProfile) => {
    setAgent(newProfile);
    const cipher = await encryptData(newProfile);
    localStorage.setItem(VAULT_AGENT_KEY, cipher);
  };

  // 6. Prospects Handlers
  const handleAddProspect = async (newProspect: ProspectTask) => {
    const updated = [newProspect, ...prospects];
    setProspects(updated);
    const cipher = await encryptData(updated);
    localStorage.setItem(VAULT_PROSPECTS_KEY, cipher);
  };

  const handleToggleProspect = async (id: string) => {
    const updated = prospects.map(p => p.id === id ? { ...p, completed: !p.completed } : p);
    setProspects(updated);
    const cipher = await encryptData(updated);
    localStorage.setItem(VAULT_PROSPECTS_KEY, cipher);
  };

  const handleConvertToQuote = (prospect: ProspectTask) => {
    setEditingLead({
      id: `lead_${Date.now()}`,
      name: prospect.customerName,
      phone: prospect.phone,
      currentAge: 30,
      maturityAge: 58,
      term: 28,
      category: prospect.category === 'FARMER' || prospect.category === 'IPPB' ? 'RPLI' : 'PLI',
      planId: prospect.category === 'FARMER' ? 'rpli_santosh' : 'pli_santosh',
      planName: prospect.category === 'FARMER' ? 'Gram Santosh (EA)' : 'Santosh (EA)',
      sumAssured: 500000,
      monthlyPremium: 1420,
      quarterlyPremium: 4240,
      halfYearlyPremium: 8440,
      yearlyPremium: 16700,
      dailyCost: 46,
      totalPremiumPaid: 477120,
      estimatedMaturity: 1228000,
      bonusProfit: 750880,
      wealthMultiplier: '2.6x Growth',
      notes: `Converted from Field Prospect: ${prospect.notes}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsLeadModalOpen(true);
  };

  // 7. Load Sample Quotes
  const handleLoadDemoLeads = async () => {
    setLeads(INITIAL_SAMPLE_LEADS);
    const cipher = await encryptData(INITIAL_SAMPLE_LEADS);
    localStorage.setItem(VAULT_LEADS_KEY, cipher);
  };

  // 8. Export Encrypted Vault Backup (JSON)
  const handleExportBackup = async () => {
    const payload = {
      version: '3.2',
      exportedAt: new Date().toISOString(),
      leads,
      agent,
      prospects
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PostalPro_Vault_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 9. Import / Restore Backup JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.leads && Array.isArray(parsed.leads)) {
          setLeads(parsed.leads);
          const encLeads = await encryptData(parsed.leads);
          localStorage.setItem(VAULT_LEADS_KEY, encLeads);
        }
        if (parsed.agent) {
          setAgent(parsed.agent);
          const encAgent = await encryptData(parsed.agent);
          localStorage.setItem(VAULT_AGENT_KEY, encAgent);
        }
        if (parsed.prospects && Array.isArray(parsed.prospects)) {
          setProspects(parsed.prospects);
          const encPros = await encryptData(parsed.prospects);
          localStorage.setItem(VAULT_PROSPECTS_KEY, encPros);
        }
        alert('Encrypted vault restored successfully!');
      } catch (err) {
        console.error('Failed to import backup:', err);
        alert('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  // 10. Clear Vault
  const handleClearVault = () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      setLeads([]);
      setProspects([]);
      localStorage.removeItem(VAULT_LEADS_KEY);
      localStorage.removeItem(VAULT_PROSPECTS_KEY);
      alert('Local vault cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      
      {/* Sticky Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setTab={setCurrentTab}
        language={language}
        setLanguage={handleSetLanguage}
        leadsCount={leads.length}
        onOpenNewQuote={() => {
          setEditingLead(null);
          setIsLeadModalOpen(true);
        }}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {currentTab === 'leads' && (
          <LeadsTab
            leads={leads}
            agent={agent}
            language={language}
            onOpenNewQuote={() => {
              setEditingLead(null);
              setIsLeadModalOpen(true);
            }}
            onEditLead={(lead) => {
              setEditingLead(lead);
              setIsLeadModalOpen(true);
            }}
            onDeleteLead={handleDeleteLead}
            onOpenPoster={(lead) => {
              setSelectedPosterLead(lead);
              setIsPosterModalOpen(true);
            }}
            onLoadDemoLeads={handleLoadDemoLeads}
          />
        )}

        {currentTab === 'marketing' && (
          <MarketingTab
            agent={agent}
            language={language}
            prospects={prospects}
            onAddProspect={handleAddProspect}
            onToggleProspect={handleToggleProspect}
            onConvertToQuote={handleConvertToQuote}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            agent={agent}
            onSaveProfile={handleSaveProfile}
            leads={leads}
            language={language}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onClearVault={handleClearVault}
          />
        )}
      </main>

      {/* Modal: Lead Capture & Live Calculation Form */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSave={handleSaveLead}
        initialLead={editingLead}
        language={language}
      />

      {/* Modal: Visual Poster Generator & HD Export */}
      <PosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        lead={selectedPosterLead}
        agent={agent}
        currentLanguage={language}
      />

      {/* Footer Branding */}
      <footer className="bg-emerald-950 text-emerald-300 py-6 border-t border-emerald-900 text-center text-xs print:hidden mb-16 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-white">
            PLI & RPLI Smart Lead & Poster Studio • by PostalPro
          </p>
          <p className="text-[11px] text-emerald-400">
            100% Client-Side Progressive Web App • AES-GCM 256-Bit Encrypted on Device • Zero Server Storage
          </p>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar (Visible only on mobile screens < sm) */}
      <nav 
        aria-label="Mobile bottom navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-emerald-950/95 backdrop-blur-md border-t border-emerald-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl"
      >
        {/* Tab 1: Leads */}
        <button
          id="mobile-bottom-nav-leads"
          onClick={() => setCurrentTab('leads')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold transition cursor-pointer ${
            currentTab === 'leads'
              ? 'text-emerald-300 bg-emerald-900/60'
              : 'text-emerald-400/70 hover:text-emerald-200'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {leads.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-emerald-400 text-emerald-950">
                {leads.length}
              </span>
            )}
          </div>
          <span className="mt-0.5">Leads</span>
        </button>

        {/* Action Center: + New Quote */}
        <button
          id="mobile-bottom-nav-new-quote"
          onClick={() => {
            setEditingLead(null);
            setIsLeadModalOpen(true);
          }}
          className="flex flex-col items-center justify-center -mt-5 bg-linear-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-full shadow-lg border-2 border-emerald-900 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Tab 2: Marketing */}
        <button
          id="mobile-bottom-nav-marketing"
          onClick={() => setCurrentTab('marketing')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold transition cursor-pointer ${
            currentTab === 'marketing'
              ? 'text-emerald-300 bg-emerald-900/60'
              : 'text-emerald-400/70 hover:text-emerald-200'
          }`}
        >
          <Megaphone className="w-5 h-5" />
          <span className="mt-0.5">Marketing</span>
        </button>

        {/* Tab 3: Profile */}
        <button
          id="mobile-bottom-nav-profile"
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold transition cursor-pointer ${
            currentTab === 'profile'
              ? 'text-emerald-300 bg-emerald-900/60'
              : 'text-emerald-400/70 hover:text-emerald-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="mt-0.5">Profile</span>
        </button>
      </nav>

    </div>
  );
}
