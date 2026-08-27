import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Plus, 
  Trash2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { PLILeadItem } from '../types';
import { ThemeDefinition } from '../utils/themeConfig';

interface PLILeadsAppViewProps {
  themeObj: ThemeDefinition;
  onBackToHome: () => void;
}

export const PLILeadsAppView: React.FC<PLILeadsAppViewProps> = ({
  themeObj,
  onBackToHome
}) => {
  const isRetro = themeObj.id === 'retroCream';

  // Sample initial leads
  const [leads, setLeads] = useState<PLILeadItem[]>([
    {
      id: 'lead-1',
      prospectName: 'Shri K. Venkatesh',
      mobile: '9876543210',
      village: 'Vadlamudi BO',
      scheme: 'PLI - Santosh (EA)',
      sumAssured: 500000,
      termYears: 20,
      estimatedMonthlyPremium: 1420,
      status: 'New Prospect',
      date: '2026-08-20'
    },
    {
      id: 'lead-2',
      prospectName: 'Smt. P. Lakshmi',
      mobile: '9440123456',
      village: 'Chebrolu SO',
      scheme: 'RPLI - Gram Santosh',
      sumAssured: 200000,
      termYears: 15,
      estimatedMonthlyPremium: 680,
      status: 'Proposal Filled',
      date: '2026-08-24'
    }
  ]);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [scheme, setScheme] = useState<PLILeadItem['scheme']>('PLI - Santosh (EA)');
  const [sumAssured, setSumAssured] = useState<number>(500000);
  const [age, setAge] = useState<number>(30);

  // Approximate PLI monthly rate math based on age and sum assured
  const estimatedMonthlyPremium = Math.round((sumAssured / 1000) * (2.8 + (age - 20) * 0.08));
  const estimatedMaturityValue = Math.round(sumAssured + (sumAssured * 0.052 * (58 - age)));

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newLead: PLILeadItem = {
      id: `lead-${Date.now()}`,
      prospectName: name,
      mobile: phone || '9999999999',
      village: village || 'Local BO',
      scheme: scheme,
      sumAssured: sumAssured,
      termYears: 58 - age,
      estimatedMonthlyPremium: estimatedMonthlyPremium,
      status: 'New Prospect',
      date: new Date().toISOString().split('T')[0]
    };

    setLeads([newLead, ...leads]);
    setName('');
    setPhone('');
    setVillage('');
  };

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  const handleSendWhatsAppQuote = (lead: PLILeadItem) => {
    const text = encodeURIComponent(
      `*POSTAL LIFE INSURANCE (PLI/RPLI) OFFICIAL QUOTATION*\n\n` +
      `Hello ${lead.prospectName} ji,\n` +
      `Here is your government-backed Postal Life Insurance plan details:\n` +
      `• *Plan:* ${lead.scheme}\n` +
      `• *Sum Assured:* ₹${lead.sumAssured.toLocaleString('en-IN')}\n` +
      `• *Monthly Premium:* ₹${lead.estimatedMonthlyPremium.toLocaleString('en-IN')}\n` +
      `• *Bonus:* Sovereign Central Govt Guarantee\n\n` +
      `Please contact your local Branch Postmaster (BPM) to finalize your proposal!`
    );
    window.open(`https://wa.me/91${lead.mobile.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            isRetro 
              ? 'bg-white border border-[#EAE0D0] text-[#1E1B18] hover:bg-[#FAF4E8]' 
              : 'bg-slate-900 border border-slate-800 text-white hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to PostalPro Home</span>
        </button>

        <a
          href="https://postalpro.in/plileads/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
        >
          <span>Open Full Standalone PLI Leads App</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Grid: Form + Leads List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quick Lead & Quote Form */}
        <div className="lg:col-span-5">
          <form 
            onSubmit={handleAddLead}
            className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-4 ${
              isRetro 
                ? 'bg-white border-2 border-[#EAE0D0] text-[#1E1B18]' 
                : `${themeObj.cardBg} border ${themeObj.cardBorder} text-white`
            }`}
          >
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">
                Prospect Capture & Quote
              </span>
              <h2 className="text-xl font-black">
                New PLI / RPLI Lead
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Prospect Full Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shri Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold ${
                  isRetro ? 'bg-[#FAF4E8] border-[#E0D4C0]' : 'bg-slate-900 border-slate-800 text-white'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Mobile Number:
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className={`w-full p-2.5 rounded-xl border text-sm font-semibold font-mono ${
                    isRetro ? 'bg-[#FAF4E8] border-[#E0D4C0]' : 'bg-slate-900 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Age (Years):
                </label>
                <input
                  type="number"
                  min={19}
                  max={55}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border text-sm font-semibold font-mono ${
                    isRetro ? 'bg-[#FAF4E8] border-[#E0D4C0]' : 'bg-slate-900 border-slate-800 text-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Select Insurance Scheme:
              </label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold ${
                  isRetro ? 'bg-[#FAF4E8] border-[#E0D4C0]' : 'bg-slate-900 border-slate-800 text-white'
                }`}
              >
                <option value="PLI - Santosh (EA)">PLI - Santosh (Endowment Assurance)</option>
                <option value="PLI - Suraksha (WLA)">PLI - Suraksha (Whole Life Assurance)</option>
                <option value="RPLI - Gram Santosh">RPLI - Gram Santosh (Rural EA)</option>
                <option value="RPLI - Gram Priya">RPLI - Gram Priya (10-Year Rural Plan)</option>
                <option value="RPLI - Yugal Suraksha">RPLI - Yugal Suraksha (Joint Life)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Sum Assured: ₹{sumAssured.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={50000}
                value={sumAssured}
                onChange={(e) => setSumAssured(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Instant Math Preview */}
            <div className={`p-4 rounded-2xl border space-y-1.5 text-center ${
              isRetro ? 'bg-[#FAF4E8] border-[#E0D4C0]' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Est. Monthly Premium:</span>
                <span className="font-bold font-mono text-emerald-500">₹{estimatedMonthlyPremium} / mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Est. Maturity Value (Age 58):</span>
                <span className="font-bold font-mono text-amber-500">₹{estimatedMaturityValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
                isRetro ? 'bg-[#F95724] text-white hover:bg-[#E04515]' : themeObj.buttonPrimary
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Save Lead & Generate Quote</span>
            </button>
          </form>
        </div>

        {/* Right Column: Active Prospect Leads List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black">
              Active Prospect Pipeline ({leads.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Data saved locally in browser
            </span>
          </div>

          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className={`p-5 rounded-2xl border transition shadow-sm space-y-3 ${
                  isRetro 
                    ? 'bg-white border-2 border-[#EAE0D0] text-[#1E1B18]' 
                    : `${themeObj.cardBg} border ${themeObj.cardBorder} text-white`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {lead.scheme}
                    </span>
                    <h4 className="text-base font-black mt-1">
                      {lead.prospectName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {lead.village} • Mobile: {lead.mobile}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-500">Sum Assured</span>
                    <p className="font-mono font-bold">₹{lead.sumAssured.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-500">Monthly Premium</span>
                    <p className="font-mono font-bold text-emerald-500">₹{lead.estimatedMonthlyPremium.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500">Status</span>
                    <p className="font-bold text-amber-500 truncate">{lead.status}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleSendWhatsAppQuote(lead)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Quotation Flyer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
