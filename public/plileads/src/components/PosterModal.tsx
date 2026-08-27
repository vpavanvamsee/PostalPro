import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Printer, Phone, CheckCircle2, Shield, Sparkles, Globe } from 'lucide-react';
import { AgentProfile, LanguageCode, Lead } from '../types';
import { formatINR } from '../utils/pliPlans';
import { SUPPORTED_LANGUAGES, t } from '../utils/i18n';
import { generateWhatsAppMessage } from '../utils/marketingData';
import { renderPosterToBlob } from '../utils/posterCanvas';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  agent: AgentProfile;
  currentLanguage: LanguageCode;
}

export const PosterModal: React.FC<PosterModalProps> = ({
  isOpen,
  onClose,
  lead,
  agent,
  currentLanguage
}) => {
  const [posterLang, setPosterLang] = useState<LanguageCode>(currentLanguage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setPosterLang(currentLanguage);
  }, [currentLanguage, isOpen]);

  if (!isOpen || !lead) return null;

  // Trigger high-res canvas rendering and PNG download
  const handleDownloadPNG = async () => {
    try {
      setIsGenerating(true);
      const blob = await renderPosterToBlob(lead, agent, posterLang);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const cleanName = lead.name.replace(/[^a-zA-Z0-9]/g, '_');
      a.href = url;
      a.download = `PLI_Poster_${cleanName}_${lead.category}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setToastMsg('HD Poster Downloaded Successfully!');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err) {
      console.error('Failed to render poster:', err);
      alert('Error generating high-resolution poster image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // WhatsApp Share with localized formatted quote
  const handleWhatsAppShare = () => {
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
      posterLang
    );
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(rawMsg)}`;
    window.open(url, '_blank');
  };

  // Print Slip
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-slate-200 overflow-hidden my-auto max-h-[96vh] flex flex-col print:shadow-none print:border-none print:max-h-none">
        
        {/* Top Modal Controls Strip (Hidden in Print) */}
        <div className="bg-emerald-950 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3 border-b border-emerald-900 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs sm:text-sm">Poster Preview & Export</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Modal Language Selector */}
            <div className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-800">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <select
                aria-label="Poster Language"
                value={posterLang}
                onChange={(e) => setPosterLang(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Visual Poster Area */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-100 flex-1 flex justify-center print:p-0 print:bg-white">
          {/* THE EXACT POSTER CARD */}
          <div
            id="printable-quote-card"
            className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden text-slate-800 font-sans print:shadow-none print:border-2 print:border-emerald-950"
          >
            {/* 1. DEEP FOREST GREEN HEADER */}
            <div className="bg-emerald-900 text-white p-4 sm:p-5 relative border-b-4 border-amber-400">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xs tracking-tighter shadow-sm shrink-0">
                    POST
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-200 uppercase">
                      {t(posterLang, 'deptOfPosts')}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-white mt-0.5">
                      {lead.category === 'PLI' ? 'POSTAL LIFE INSURANCE (PLI)' : 'RURAL POSTAL LIFE INSURANCE (RPLI)'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Top-Right Gold Sovereign Guarantee Pill */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400 text-emerald-950 text-[10px] font-bold rounded-full shadow-xs uppercase tracking-wider">
                <Shield className="w-3 h-3 text-emerald-950 fill-emerald-950" />
                <span>100% GOVT SOVEREIGN GUARANTEE</span>
              </div>
            </div>

            {/* Poster Inner Container */}
            <div className="p-4 space-y-3.5">
              {/* 2. PROPOSER DETAILS PILL */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-1">
                  <span>{t(posterLang, 'proposer')}: {lead.name} ({t(posterLang, 'age')} {lead.currentAge} {t(posterLang, 'years')})</span>
                  <span className="text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                    {t(posterLang, 'maturityAge')}: {lead.maturityAge} {t(posterLang, 'years')}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-700 flex items-center justify-between">
                  <span>{t(posterLang, 'plan')}: <strong>{lead.planName}</strong></span>
                  <span>{t(posterLang, 'term')}: <strong>{lead.term} {t(posterLang, 'years')}</strong></span>
                </div>
              </div>

              {/* 3. TWIN HERO METRIC BOXES */}
              <div className="grid grid-cols-2 gap-3">
                {/* Left Hero Box: DAILY SAVINGS BUDGET */}
                <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-300 text-center shadow-2xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {t(posterLang, 'dailySavingsBudget')}
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-emerald-950 mt-0.5">
                    ₹{lead.dailyCost} <span className="text-xs font-semibold text-emerald-700">/ day</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                    {t(posterLang, 'monthlyPremSubtitle')}: <strong>{formatINR(lead.monthlyPremium)}</strong>
                  </p>
                </div>

                {/* Right Hero Box: ESTIMATED MATURITY PAYOUT */}
                <div className="bg-amber-50/60 rounded-lg p-3 border border-amber-300 text-center shadow-2xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    {t(posterLang, 'estimatedMaturityPayout')}
                  </p>
                  <p className="text-lg sm:text-xl font-black text-amber-950 mt-0.5">
                    {formatINR(lead.estimatedMaturity)}
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                    {t(posterLang, 'guaranteedPlusBonus')}
                  </p>
                </div>
              </div>

              {/* 4. FINANCIAL BREAKDOWN CARD */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📊</span>
                  <span>{t(posterLang, 'financialBreakdown')}</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="px-3 py-1.5 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">{t(posterLang, 'lifeCoverSA')}</span>
                    <span className="font-bold text-slate-900">{formatINR(lead.sumAssured)}</span>
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">{t(posterLang, 'totalPremPaid')} ({lead.term} {t(posterLang, 'years')})</span>
                    <span className="font-semibold text-slate-700">{formatINR(lead.totalPremiumPaid)}</span>
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-between bg-emerald-50/40">
                    <span className="text-emerald-900 font-bold">+ {t(posterLang, 'pureBonusProfit')}</span>
                    <span className="font-black text-emerald-700">+ {formatINR(lead.bonusProfit)}</span>
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-between bg-amber-50/30">
                    <span className="text-amber-900 font-bold">🚀 {t(posterLang, 'wealthMultiplierTitle')}</span>
                    <span className="font-black text-amber-800">~ {lead.wealthMultiplier}</span>
                  </div>
                </div>
              </div>

              {/* 5. FLEXIBLE PAYMENT MODES PILL BOX */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-semibold text-slate-700 text-center flex flex-wrap items-center justify-around gap-2">
                <span>{t(posterLang, 'modeMonthly')}: <strong className="text-slate-900">{formatINR(lead.monthlyPremium)}</strong></span>
                <span className="text-slate-300">|</span>
                <span>{t(posterLang, 'modeQuarterly')}: <strong className="text-slate-900">{formatINR(lead.quarterlyPremium)}</strong></span>
                <span className="text-slate-300">|</span>
                <span>{t(posterLang, 'modeHalfYearly')}: <strong className="text-emerald-800">{formatINR(lead.halfYearlyPremium)}</strong> <span className="text-[10px] text-amber-800 bg-amber-100 px-1 py-0.5 rounded font-bold">1% Off</span></span>
                <span className="text-slate-300">|</span>
                <span>{t(posterLang, 'modeYearly')}: <strong className="text-emerald-800">{formatINR(lead.yearlyPremium)}</strong> <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1 py-0.5 rounded font-bold">2% Off</span></span>
              </div>

              {/* 6. BULLETED TRUST & REBATE BADGES */}
              <div className="space-y-1.5 text-[11px] text-slate-700 font-medium px-1 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>SA Rebate:</strong> ₹1/month discount per every ₹20,000 Sum Assured ({formatINR(lead.sumAssured)} = ₹{Math.floor(lead.sumAssured / 20000)}/mo rebate)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Advance Payment Rebate:</strong> 1% rebate on 6-month & 2% rebate on 12-month advance payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Income Tax Rebate:</strong> Tax deduction on premium under Sec 80C + 100% Tax-Free maturity under Sec 10(10D)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t(posterLang, 'trust2')}</span>
                </div>
              </div>

              {/* 7. PERSONALIZED CONTACT FOOTER */}
              <div className="bg-emerald-950 text-white rounded-lg p-3 text-center border-t-2 border-amber-400 space-y-0.5">
                <p className="text-xs font-bold text-white">
                  {t(posterLang, 'contactAgent')}: {agent.name || 'Postal Advisor'} ({agent.designation || 'BPM'}, {agent.branchOffice || 'Post Office'})
                </p>
                <p className="text-xs font-black text-amber-300 flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>📞 Call / WhatsApp: {agent.phone || 'Contact Local Post Office'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar (Hidden in Print) */}
        <div className="bg-white p-3.5 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 print:hidden">
          {toastMsg && (
            <div className="w-full text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200">
              {toastMsg}
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition border border-slate-200 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t(posterLang, 'printSlip')}</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{t(posterLang, 'shareWhatsApp')}</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-emerald-950 rounded-full text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isGenerating ? 'Rendering HD...' : t(posterLang, 'downloadPNG')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
