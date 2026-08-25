import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Building, 
  Phone, 
  Target, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Lock,
  RefreshCw
} from 'lucide-react';
import { AgentProfile, LanguageCode, Lead } from '../types';
import { formatINR } from '../utils/pliPlans';
import { t } from '../utils/i18n';

interface ProfileTabProps {
  agent: AgentProfile;
  onSaveProfile: (profile: AgentProfile) => void;
  leads: Lead[];
  language: LanguageCode;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearVault: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  agent,
  onSaveProfile,
  leads,
  language,
  onExportBackup,
  onImportBackup,
  onClearVault
}) => {
  const [formData, setFormData] = useState<AgentProfile>(agent);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setToastMsg(t(language, 'profileSavedToast'));
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Progress Calculation
  const totalAchievedSA = leads.reduce((acc, l) => acc + (l.sumAssured || 0), 0);
  const targetSA = Math.max(1, formData.monthlyTargetSA || 1000000);
  const percentage = Math.min(100, Math.round((totalAchievedSA / targetSA) * 100));

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      
      {/* 1. Monthly Goal Progress Gauge Banner */}
      <section className="bg-emerald-900 text-white rounded-xl p-4 sm:p-6 border border-emerald-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-base shadow-sm">
              🎯
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                {t(language, 'targetProgress')}
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {percentage}% {t(language, 'targetAchieved')} {formatINR(targetSA)}
              </h3>
            </div>
          </div>
          <div className="text-right sm:self-center">
            <p className="text-xs text-emerald-200 font-semibold">Active Quoted Pipeline</p>
            <p className="text-lg font-black text-amber-300 leading-tight mt-0.5">{formatINR(totalAchievedSA)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-emerald-950 rounded-full h-3 overflow-hidden border border-emerald-800 p-0.5">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </section>

      {/* 2. Agent Profile Settings & Live ID Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {t(language, 'profileTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-5">
            {t(language, 'profileDesc')}
          </p>

          {toastMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{toastMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t(language, 'agentName')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t(language, 'designation')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. GDS BPM / ABPM / Direct Agent"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t(language, 'agentPhone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t(language, 'branchOffice')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chandragiri SO"
                  value={formData.branchOffice}
                  onChange={(e) => setFormData({ ...formData, branchOffice: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t(language, 'division')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tirupati Division"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t(language, 'monthlyTarget')}
              </label>
              <input
                type="number"
                step={50000}
                value={formData.monthlyTargetSA}
                onChange={(e) => setFormData({ ...formData, monthlyTargetSA: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-full text-xs font-bold transition shadow-sm cursor-pointer"
            >
              {t(language, 'saveProfile')}
            </button>
          </form>
        </div>

        {/* Right Column: Live Poster Footer Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
              Live Poster Sign-off Preview
            </p>
            <p className="text-xs text-slate-400 mb-3">
              Here is how your credentials look on generated high-resolution posters and PDF slips:
            </p>

            <div className="bg-emerald-950 p-4 rounded-lg border-t-2 border-amber-400 text-center space-y-1 shadow-inner">
              <p className="text-sm font-black text-white">
                Contact: {formData.name || 'Your Name'}
              </p>
              <p className="text-xs text-emerald-300 font-medium">
                {formData.designation || 'Postal Advisor'}, {formData.branchOffice || 'Post Office'} • {formData.division || 'Postal Division'}
              </p>
              <p className="text-xs font-black text-amber-300 pt-1">
                📞 91-{formData.phone || 'XXXXXXXXXX'}
              </p>
            </div>
          </div>

          {/* 3. Encrypted Vault Data Management */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {t(language, 'vaultDataMgmt')}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                All leads are 256-bit AES-GCM encrypted locally. You can export a secure backup file or restore on another device.
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {/* Export Encrypted Backup */}
              <button
                type="button"
                onClick={onExportBackup}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition border border-slate-200 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>{t(language, 'exportBackup')}</span>
              </button>

              {/* Import Backup */}
              <label className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition border border-slate-200 cursor-pointer">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>{t(language, 'importBackup')}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  className="hidden"
                />
              </label>

              {/* Clear All Data */}
              <button
                type="button"
                onClick={onClearVault}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition border border-red-200 mt-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>{t(language, 'clearVault')}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
