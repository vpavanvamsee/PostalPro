import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Image as ImageIcon, 
  Share2, 
  Phone, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Shield, 
  Users, 
  Layers, 
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { AgentProfile, LanguageCode, Lead } from '../types';
import { formatINR } from '../utils/pliPlans';
import { t } from '../utils/i18n';
import { generateWhatsAppMessage } from '../utils/marketingData';

interface LeadsTabProps {
  leads: Lead[];
  agent: AgentProfile;
  language: LanguageCode;
  onOpenNewQuote: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onOpenPoster: (lead: Lead) => void;
  onLoadDemoLeads: () => void;
}

export const LeadsTab: React.FC<LeadsTabProps> = ({
  leads,
  agent,
  language,
  onOpenNewQuote,
  onEditLead,
  onDeleteLead,
  onOpenPoster,
  onLoadDemoLeads
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'PLI' | 'RPLI' | 'high_value'>('all');
  const [activePreviewLeadId, setActivePreviewLeadId] = useState<string | null>(leads[0]?.id || null);

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(term) ||
      lead.phone.includes(term) ||
      lead.planName.toLowerCase().includes(term) ||
      lead.category.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (filterType === 'PLI') return lead.category === 'PLI';
    if (filterType === 'RPLI') return lead.category === 'RPLI';
    if (filterType === 'high_value') return lead.sumAssured >= 1000000;
    return true;
  });

  // Calculate Aggregates for Dashboard Banner
  const totalSA = leads.reduce((acc, l) => acc + (l.sumAssured || 0), 0);
  const totalMonthly = leads.reduce((acc, l) => acc + (l.monthlyPremium || 0), 0);
  
  // Find top plan
  const planCounts: Record<string, number> = {};
  leads.forEach(l => { planCounts[l.planName] = (planCounts[l.planName] || 0) + 1; });
  const topPlanName = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Santosh (EA)';

  const selectedPreviewLead = leads.find(l => l.id === activePreviewLeadId) || filteredLeads[0] || leads[0];

  const handleWhatsAppClick = (lead: Lead) => {
    const rawMsg = generateWhatsAppMessage(
      lead.name,
      lead.category,
      lead.planName,
      lead.currentAge,
      lead.term,
      formatINR(lead.sumAssured),
      lead.dailyCost,
      formatINR(lead.monthlyPremium),
      formatINR(lead.estimatedMaturity),
      formatINR(lead.bonusProfit),
      lead.wealthMultiplier,
      agent,
      language
    );
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(rawMsg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Summary Statistics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate" title={t(language, 'totalLeads')}>
              {t(language, 'totalLeads')}
            </p>
            <p className="text-sm sm:text-xl lg:text-2xl font-black text-slate-900 leading-tight truncate">
              {leads.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate" title={t(language, 'totalSA')}>
              {t(language, 'totalSA')}
            </p>
            <p className="text-sm sm:text-xl lg:text-2xl font-black text-slate-900 leading-tight truncate tracking-tight" title={formatINR(totalSA)}>
              {formatINR(totalSA)}
            </p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate" title={t(language, 'estPremiumPool')}>
              {t(language, 'estPremiumPool')}
            </p>
            <p className="text-sm sm:text-xl lg:text-2xl font-black text-slate-900 leading-tight truncate tracking-tight" title={`${formatINR(totalMonthly)}/mo`}>
              {formatINR(totalMonthly)}<span className="text-[10px] sm:text-xs font-bold text-slate-500">/mo</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate" title={t(language, 'topPlan')}>
              {t(language, 'topPlan')}
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight mt-0.5" title={topPlanName}>
              {topPlanName}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Live Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t(language, 'searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border-none rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t(language, 'filterAll')}
          </button>
          <button
            onClick={() => setFilterType('PLI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              filterType === 'PLI'
                ? 'bg-emerald-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t(language, 'filterPLI')}
          </button>
          <button
            onClick={() => setFilterType('RPLI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              filterType === 'RPLI'
                ? 'bg-emerald-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t(language, 'filterRPLI')}
          </button>
          <button
            onClick={() => setFilterType('high_value')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              filterType === 'high_value'
                ? 'bg-emerald-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t(language, 'filterHighValue')}
          </button>
        </div>
      </div>

      {/* 3. Captured Leads Section (Responsive Side-by-Side on Desktop) */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            {t(language, 'noLeadsTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
            {t(language, 'noLeadsDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenNewQuote}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition shadow-sm cursor-pointer"
            >
              + {t(language, 'newLead')}
            </button>
            <button
              onClick={onLoadDemoLeads}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full text-xs font-bold transition border border-amber-300 cursor-pointer"
            >
              ✨ {t(language, 'loadDemoLeads')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Lead List Cards (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-3">
            {filteredLeads.map((lead) => {
              const isSelected = selectedPreviewLead?.id === lead.id;
              const isPLI = lead.category === 'PLI';

              return (
                <div
                  key={lead.id}
                  onClick={() => setActivePreviewLeadId(lead.id)}
                  className={`bg-white p-4 rounded-xl border-l-4 ${
                    isPLI ? 'border-l-emerald-500' : 'border-l-amber-500'
                  } border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition cursor-pointer relative ${
                    isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : ''
                  }`}
                >
                  {/* Lead Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isPLI 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {lead.category}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug truncate">
                        {lead.name}
                      </h4>
                      <span className="text-xs font-semibold text-slate-500">
                        • {lead.planName}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
                      <span>📞 +91 {lead.phone}</span>
                      <span>🎂 Age: {lead.currentAge} Yrs</span>
                      <span>🎯 Maturity: {lead.maturityAge} Yrs ({lead.term} Yrs)</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs flex-wrap">
                      <span className="font-bold text-slate-700">
                        SA: <span className="text-emerald-700">{formatINR(lead.sumAssured)}</span>
                      </span>
                      <span className="font-bold text-slate-700">
                        Premium: <span className="text-slate-900">{formatINR(lead.monthlyPremium)}/mo</span>
                      </span>
                      {Math.floor(lead.sumAssured / 20000) > 0 && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          🏷️ -₹{Math.floor(lead.sumAssured / 20000)}/mo SA Rebate
                        </span>
                      )}
                      <span className="hidden sm:inline-block text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Maturity: {formatINR(lead.estimatedMaturity)}
                      </span>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPoster(lead);
                      }}
                      title="Generate Poster"
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppClick(lead);
                      }}
                      title="Share to WhatsApp"
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`tel:${lead.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      title="Call Lead"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditLead(lead);
                      }}
                      title="Edit Lead"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(t(language, 'confirmDelete'))) {
                          onDeleteLead(lead.id);
                        }
                      }}
                      title="Delete Lead"
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Sleek Live Poster Card Visualizer (5 Cols on desktop) */}
          <div className="lg:col-span-5 hidden lg:block">
            {selectedPreviewLead && (
              <div className="sticky top-28 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
                {/* Poster Header */}
                <div className="bg-emerald-900 text-white p-4 text-center relative border-b-2 border-amber-400">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                      Department of Posts • India
                    </span>
                    <span className="bg-amber-400 text-emerald-950 text-[9px] font-black px-2 py-0.5 rounded shadow">
                      100% Sovereign Guarantee
                    </span>
                  </div>
                  <h3 className="font-black text-base tracking-tight mt-1">
                    {selectedPreviewLead.category === 'PLI' ? 'POSTAL LIFE INSURANCE (PLI)' : 'RURAL POSTAL LIFE INSURANCE'}
                  </h3>
                </div>

                {/* Poster Body */}
                <div className="p-4 space-y-3.5">
                  {/* Proposer Pill */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>{selectedPreviewLead.name} (Age {selectedPreviewLead.currentAge})</span>
                    <span className="text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Maturity: {selectedPreviewLead.maturityAge} Yrs
                    </span>
                  </div>

                  {/* Plan Badge */}
                  <div className="text-center py-1">
                    <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      📜 {selectedPreviewLead.planName} ({selectedPreviewLead.term} Years Term)
                    </span>
                  </div>

                  {/* Twin Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Daily Cost</span>
                      <p className="text-base font-black text-slate-800 mt-0.5">₹{selectedPreviewLead.dailyCost} / day</p>
                      <span className="text-[10px] text-slate-500 font-medium">₹{selectedPreviewLead.monthlyPremium}/mo</span>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase">Estimated Return</span>
                      <p className="text-base font-black text-emerald-700 mt-0.5">{formatINR(selectedPreviewLead.estimatedMaturity)}</p>
                      <span className="text-[10px] text-emerald-600 font-medium">+ {formatINR(selectedPreviewLead.bonusProfit)} Profit</span>
                    </div>
                  </div>

                  {/* Math Breakdown Table */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <div className="flex justify-between p-2 border-b border-slate-100 bg-slate-50/50">
                      <span className="text-slate-500">Life Cover (Sum Assured)</span>
                      <span className="font-bold text-slate-800">{formatINR(selectedPreviewLead.sumAssured)}</span>
                    </div>
                    <div className="flex justify-between p-2 border-b border-slate-100">
                      <span className="text-slate-500">Total Premium Paid</span>
                      <span className="font-bold text-slate-800">{formatINR(selectedPreviewLead.totalPremiumPaid)}</span>
                    </div>
                    <div className="flex justify-between p-2 border-b border-slate-100 bg-emerald-50/50">
                      <span className="text-emerald-900 font-bold">Pure Bonus Profit</span>
                      <span className="text-emerald-700 font-bold">+ {formatINR(selectedPreviewLead.bonusProfit)}</span>
                    </div>
                    <div className="flex justify-between p-2 border-b border-slate-100 bg-amber-50/40 text-[11px]">
                      <span className="text-amber-900 font-medium">SA Rebate (₹1/₹20k SA)</span>
                      <span className="font-bold text-amber-800">- ₹{Math.floor(selectedPreviewLead.sumAssured / 20000)}/mo</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 text-[11px]">
                      <span className="text-slate-600">Advance Pay Discount</span>
                      <span className="font-bold text-slate-800">1% (6M) | 2% (12M)</span>
                    </div>
                  </div>

                  {/* Tax Saving Mini Banner */}
                  <div className="bg-emerald-50/80 p-2 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Tax Rebate:</strong> Sec 80C Deduction (up to ₹1.5L) + 100% Tax-Free Maturity (Sec 10(10D)).</span>
                  </div>

                  {/* Agent Contact Footer */}
                  <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white leading-tight">{agent.name}</p>
                      <p className="text-[10px] text-emerald-300 font-mono mt-0.5">Agency: {agent.agencyCode || 'PLI-DIRECT'}</p>
                    </div>
                    <span className="bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-full text-[10px]">
                      📞 {agent.phone}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Split Bar */}
                <div className="grid grid-cols-2 bg-slate-50 border-t border-slate-200 p-2.5 gap-2">
                  <button
                    onClick={() => onOpenPoster(selectedPreviewLead)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download HD</span>
                  </button>
                  <button
                    onClick={() => handleWhatsAppClick(selectedPreviewLead)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) for Mobile */}
      <button
        id="fab-new-lead"
        onClick={onOpenNewQuote}
        className="sm:hidden fixed bottom-20 right-5 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl transition cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>{t(language, 'newLead')}</span>
      </button>
    </div>
  );
};
