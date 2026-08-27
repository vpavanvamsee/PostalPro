import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Copy, 
  Check, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Coins
} from 'lucide-react';
import { AgentProfile, LanguageCode, ProspectTask } from '../types';
import { OBJECTION_BUSTERS, STATUS_TEMPLATES } from '../utils/marketingData';
import { t } from '../utils/i18n';

interface MarketingTabProps {
  agent: AgentProfile;
  language: LanguageCode;
  prospects: ProspectTask[];
  onAddProspect: (prospect: ProspectTask) => void;
  onToggleProspect: (id: string) => void;
  onConvertToQuote: (prospect: ProspectTask) => void;
}

export const MarketingTab: React.FC<MarketingTabProps> = ({
  agent,
  language,
  prospects,
  onAddProspect,
  onToggleProspect,
  onConvertToQuote
}) => {
  // New Field Prospect Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState<'SSA' | 'IPPB' | 'SHOP' | 'FARMER'>('SSA');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custLocation, setCustLocation] = useState('');
  const [custNotes, setCustNotes] = useState('');

  // Toast State for Copied items
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    const newProspect: ProspectTask = {
      id: `pros_${Date.now()}`,
      category,
      customerName: custName.trim(),
      phone: custPhone.trim(),
      location: custLocation.trim(),
      notes: custNotes.trim(),
      completed: false,
      date: new Date().toLocaleDateString('en-GB')
    };

    onAddProspect(newProspect);
    setCustName('');
    setCustPhone('');
    setCustLocation('');
    setCustNotes('');
    setShowAddForm(false);
  };

  const completedCount = prospects.filter(p => p.completed).length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Daily Doorstep & Field Prospecting Tracker */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-400 text-emerald-950 rounded-full uppercase tracking-wider">
                Field CRM
              </span>
              <h3 className="text-base font-bold text-white">
                {t(language, 'fieldTrackerTitle')}
              </h3>
            </div>
            <p className="text-xs text-emerald-200/80 font-medium mt-1">
              {t(language, 'fieldTrackerDesc')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-emerald-200/80 font-semibold uppercase tracking-wider">Daily Goal Progress</p>
              <p className="text-base sm:text-lg font-black text-amber-300 leading-none mt-0.5">
                {completedCount} / {prospects.length} Done
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-xs font-bold rounded-full transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t(language, 'addProspect')}</span>
            </button>
          </div>
        </div>

        {/* Form to Add New Field Contact */}
        {showAddForm && (
          <form onSubmit={handleCreateProspect} className="p-4 sm:p-5 bg-emerald-50/40 border-b border-emerald-100 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Add New Doorstep / Field Prospect
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target Segment</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="SSA">👨‍👩‍👧 SSA Parents</option>
                  <option value="IPPB">🏦 IPPB Withdrawers</option>
                  <option value="SHOP">🏪 Shopkeeper / Daily</option>
                  <option value="FARMER">🌾 Farmer / Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Patel"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Village / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Main Bazaar, SO Ward 3"
                  value={custLocation}
                  onChange={(e) => setCustLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Discussion Notes / Plan Pitched</label>
              <input
                type="text"
                placeholder="e.g. Interested in ₹5L Santosh plan for daughter college fund, follow up on Friday"
                value={custNotes}
                onChange={(e) => setCustNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Save Field Contact
              </button>
            </div>
          </form>
        )}

        {/* 4 Segment Playbook Cards */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/50 border-b border-slate-200">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-900">👨‍👩‍👧 {t(language, 'targetSSA')}</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{t(language, 'targetSSADesc')}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-900">🏦 {t(language, 'targetIPPB')}</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{t(language, 'targetIPPBDesc')}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-900">🏪 {t(language, 'targetShop')}</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{t(language, 'targetShopDesc')}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-900">🌾 {t(language, 'targetFarmer')}</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{t(language, 'targetFarmerDesc')}</p>
          </div>
        </div>

        {/* Prospects List */}
        <div className="p-4 divide-y divide-slate-100">
          {prospects.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-medium">
              No field contacts added yet. Click "+ Add Field Contact" to log daily prospecting conversations!
            </div>
          ) : (
            prospects.map((p) => (
              <div key={p.id} className="py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={p.completed}
                    onChange={() => onToggleProspect(p.id)}
                    className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${p.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {p.customerName}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {p.category}
                      </span>
                      {p.location && (
                        <span className="text-xs text-slate-400 font-medium">
                          📍 {p.location}
                        </span>
                      )}
                    </div>
                    {p.notes && (
                      <p className="text-xs text-slate-600 mt-0.5">
                        💬 {p.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onConvertToQuote(p)}
                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 transition border border-amber-200 cursor-pointer"
                  >
                    <span>Convert to Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 2. Battle-Tested Objection Busters */}
      <section className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {t(language, 'objectionBustersTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t(language, 'objectionBustersDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OBJECTION_BUSTERS.map((obj) => {
            const isCopied = copiedId === obj.id;
            return (
              <div
                key={obj.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  {/* Objection Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-red-50 text-red-700 rounded-full border border-red-200 uppercase tracking-wider">
                      Objection #{obj.id.slice(0, 3).toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleCopyText(obj.id, obj.scriptKey)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? t(language, 'copiedText') : t(language, 'copyText')}</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    {obj.titleKey}
                  </h4>

                  <p className="text-xs italic text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    {obj.objectionKey}
                  </p>

                  <p className="text-[11px] font-bold text-emerald-800 mt-2.5">
                    {obj.strategyKey}
                  </p>

                  {/* Ready to speak Pitch Script */}
                  <div className="mt-2 text-xs text-slate-700 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100 leading-relaxed">
                    <p className="font-semibold text-emerald-950 mb-1">🗣️ Ready-to-Speak Pitch Script:</p>
                    <p className="whitespace-pre-line">{obj.scriptKey}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 1-Click Copyable Regional WhatsApp Status & Broadcast Templates */}
      <section className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {t(language, 'statusTemplatesTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t(language, 'statusTemplatesDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATUS_TEMPLATES.map((tmpl) => {
            const isCopied = copiedId === tmpl.id;
            const fullText = `${tmpl.bodyKey}\n*${agent.name}* (${agent.designation}, ${agent.branchOffice})\n📞 Mobile: ${agent.phone}`;

            return (
              <div
                key={tmpl.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                      {tmpl.category}
                    </span>
                    <button
                      onClick={() => handleCopyText(tmpl.id, fullText)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-emerald-900 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? t(language, 'copiedText') : t(language, 'copyText')}</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {tmpl.titleKey}
                  </h4>

                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {fullText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
