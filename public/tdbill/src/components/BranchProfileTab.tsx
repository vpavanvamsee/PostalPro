import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Lock,
  FileText,
  ShieldCheck,
  Award
} from 'lucide-react';
import { OfficeProfile } from '../types';
import { DEFAULT_OFFICE_PROFILE } from '../utils/sampleTDData';

interface BranchProfileTabProps {
  office: OfficeProfile;
  onSaveProfile: (profile: OfficeProfile) => void;
  onResetDefaults: () => void;
}

export const BranchProfileTab: React.FC<BranchProfileTabProps> = ({
  office,
  onSaveProfile,
  onResetDefaults
}) => {
  const [profile, setProfile] = useState<OfficeProfile>(office);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof OfficeProfile, val: string) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setProfile(DEFAULT_OFFICE_PROFILE);
    onSaveProfile(DEFAULT_OFFICE_PROFILE);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white p-5 sm:p-6 rounded-3xl shadow-md border border-emerald-800 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Eligible Claimant: BPM Only</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Branch Office & BPM Profile</h2>
          <p className="text-xs text-emerald-200">
            These office details are automatically populated onto your official printed TD Commission Bill & PDF.
          </p>
        </div>
        <div className="bg-amber-400 text-slate-950 p-3 rounded-2xl font-bold shrink-0 shadow-sm">
          <Building2 className="w-6 h-6" />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Branch Profile details saved and updated successfully!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Section 1: BPM Personal Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <User className="w-4 h-4 text-emerald-700" />
            <span>1. Branch Postmaster (BPM) Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="bpmName" className="text-xs font-bold text-slate-700">
                BPM Name*
              </label>
              <input
                id="bpmName"
                type="text"
                value={profile.bpmName}
                onChange={(e) => handleChange('bpmName', e.target.value)}
                placeholder="e.g. vamsee"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="designation" className="text-xs font-bold text-slate-700">
                Designation (Fixed to BPM)*
              </label>
              <input
                id="designation"
                type="text"
                readOnly
                value="BPM (Branch Postmaster)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs sm:text-sm font-bold text-slate-700 cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-500">Only BPM is eligible to claim TD Commission.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="employeeId" className="text-xs font-bold text-slate-700">
                Employee ID / CSI ID
              </label>
              <input
                id="employeeId"
                type="text"
                value={profile.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                placeholder="e.g. 50****43"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="mobile" className="text-xs font-bold text-slate-700">
                Contact Mobile Number
              </label>
              <input
                id="mobile"
                type="text"
                value={profile.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="e.g. 630*****53"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Postal Jurisdiction */}
        <div className="space-y-3 pt-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>2. Postal Jurisdiction & Offices</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="boName" className="text-xs font-bold text-slate-700">
                Branch Post Office (B.O)*
              </label>
              <input
                id="boName"
                type="text"
                value={profile.boName}
                onChange={(e) => handleChange('boName', e.target.value)}
                placeholder="e.g. vadlamudi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-emerald-900 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="soName" className="text-xs font-bold text-slate-700">
                Account / Sub Post Office (S.O)*
              </label>
              <input
                id="soName"
                type="text"
                value={profile.soName}
                onChange={(e) => handleChange('soName', e.target.value)}
                placeholder="e.g. sjmudi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label htmlFor="hoName" className="text-xs font-bold text-slate-700">
                Head Post Office (H.O)
              </label>
              <input
                id="hoName"
                type="text"
                value={profile.hoName}
                onChange={(e) => handleChange('hoName', e.target.value)}
                placeholder="e.g. tenali"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="divisionName" className="text-xs font-bold text-slate-700">
                Postal Division
              </label>
              <input
                id="divisionName"
                type="text"
                value={profile.divisionName}
                onChange={(e) => handleChange('divisionName', e.target.value)}
                placeholder="e.g. tenali"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="pincode" className="text-xs font-bold text-slate-700">
                PIN Code
              </label>
              <input
                id="pincode"
                type="text"
                maxLength={6}
                value={profile.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="e.g. 522201"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults (vamsee / vadlamudi)</span>
          </button>

          <button
            id="save-branch-profile-submit-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
