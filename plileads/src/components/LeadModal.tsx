import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calculator, Check, Shield, AlertCircle, ArrowRight, Calendar, Layers, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { LanguageCode, Lead, PolicyCategory } from '../types';
import { 
  ALL_PLANS, 
  calculateAgeNextBirthdayFromDOB, 
  calculatePLIPolicy,
  calculateQuoteMath, 
  estimateMonthlyPremium, 
  formatINR, 
  getComparisonTable,
  getPlanById, 
  PLI_PLANS, 
  RPLI_PLANS 
} from '../utils/pliPlans';
import { t } from '../utils/i18n';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  initialLead?: Lead | null;
  language: LanguageCode;
}

const SA_PRESETS = [100000, 200000, 500000, 1000000, 2000000, 5000000];
const MATURITY_AGE_PRESETS = [35, 40, 45, 50, 55, 58, 60];

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLead,
  language
}) => {
  // Form State
  const [name, setName] = useState(initialLead?.name || '');
  const [phone, setPhone] = useState(initialLead?.phone || '');
  const [dob, setDob] = useState(initialLead?.dob || '');
  const [category, setCategory] = useState<PolicyCategory>(initialLead?.category || 'PLI');
  
  const defaultPlan = category === 'PLI' ? PLI_PLANS[0].id : RPLI_PLANS[0].id;
  const [planId, setPlanId] = useState(initialLead?.planId || defaultPlan);
  
  const [currentAge, setCurrentAge] = useState<number>(initialLead?.currentAge || 28);
  const [maturityAge, setMaturityAge] = useState<number>(initialLead?.maturityAge || 58);
  const [sumAssured, setSumAssured] = useState<number>(initialLead?.sumAssured || 500000);
  
  const [calcMode, setCalcMode] = useState<'auto' | 'manual'>(initialLead?.yearlyPremium ? 'manual' : 'auto');
  const [showComparisonTable, setShowComparisonTable] = useState<boolean>(false);
  
  const [monthlyPremium, setMonthlyPremium] = useState<number>(initialLead?.monthlyPremium || 0);
  const [quarterlyPremium, setQuarterlyPremium] = useState<number>(initialLead?.quarterlyPremium || 0);
  const [halfYearlyPremium, setHalfYearlyPremium] = useState<number>(initialLead?.halfYearlyPremium || 0);
  const [yearlyPremium, setYearlyPremium] = useState<number>(initialLead?.yearlyPremium || 0);
  const [notes, setNotes] = useState(initialLead?.notes || '');
  const [error, setError] = useState<string | null>(null);

  // Synchronize state when initialLead or isOpen changes
  useEffect(() => {
    if (initialLead) {
      setName(initialLead.name);
      setPhone(initialLead.phone);
      setDob(initialLead.dob || '');
      setCategory(initialLead.category);
      setPlanId(initialLead.planId);
      setCurrentAge(initialLead.currentAge);
      setMaturityAge(initialLead.maturityAge);
      setSumAssured(initialLead.sumAssured);
      setMonthlyPremium(initialLead.monthlyPremium);
      setQuarterlyPremium(initialLead.quarterlyPremium);
      setHalfYearlyPremium(initialLead.halfYearlyPremium);
      setYearlyPremium(initialLead.yearlyPremium);
      setNotes(initialLead.notes || '');
      setCalcMode('manual');
      setError(null);
    } else if (isOpen) {
      // Reset for new lead creation
      setName('');
      setPhone('');
      setDob('');
      setCategory('PLI');
      setPlanId(PLI_PLANS[0].id);
      setCurrentAge(28);
      setMaturityAge(58);
      setSumAssured(500000);
      setNotes('');
      setCalcMode('auto');
      setShowComparisonTable(false);
      setError(null);
    }
  }, [initialLead, isOpen]);

  // Filter plans based on category
  const availablePlans = category === 'PLI' ? PLI_PLANS : RPLI_PLANS;
  const currentPlan = getPlanById(planId);

  // Term calculation: Maturity Age - Entry Age (Age Next Birthday)
  const term = Math.max(1, maturityAge - currentAge);

  // Handle DOB change and auto-derive Age Next Birthday
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const derivedAgeNextBday = calculateAgeNextBirthdayFromDOB(val);
      setCurrentAge(derivedAgeNextBday);
      if (derivedAgeNextBday >= maturityAge) {
        setMaturityAge(Math.min(60, derivedAgeNextBday + 10));
      }
    }
  };

  // Synchronize category switch
  const handleCategoryChange = (newCat: PolicyCategory) => {
    setCategory(newCat);
    const plans = newCat === 'PLI' ? PLI_PLANS : RPLI_PLANS;
    setPlanId(plans[0].id);
  };

  // Recalculate estimated premiums whenever age, term, plan, or SA changes in auto mode
  const currentEstimate = estimateMonthlyPremium(category, planId, currentAge, term, sumAssured);
  const comparisonData = getComparisonTable(dob || currentAge, sumAssured, maturityAge, category);

  useEffect(() => {
    if (calcMode === 'auto') {
      const est = estimateMonthlyPremium(category, planId, currentAge, term, sumAssured);
      setMonthlyPremium(est.monthly);
      setQuarterlyPremium(est.quarterly);
      setHalfYearlyPremium(est.halfYearly);
      setYearlyPremium(est.yearly);
    }
  }, [category, planId, currentAge, term, sumAssured, calcMode]);

  // Real-time live math calculation
  const math = calculateQuoteMath(
    sumAssured,
    term,
    currentPlan.bonusRate,
    monthlyPremium,
    yearlyPremium
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter insurant / proposer full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile / WhatsApp number');
      return;
    }
    if (currentAge >= maturityAge) {
      setError('Maturity age must be greater than current entry age');
      return;
    }
    if (sumAssured < currentPlan.minSA) {
      setError(`Minimum Sum Assured for this plan is ${formatINR(currentPlan.minSA)}`);
      return;
    }

    const leadData: Lead = {
      id: initialLead?.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      phone: phone.trim(),
      dob: dob || undefined,
      currentAge,
      maturityAge,
      term,
      category,
      planId,
      planName: currentPlan.name,
      sumAssured,
      monthlyPremium,
      quarterlyPremium: quarterlyPremium || Math.round(monthlyPremium * 3),
      halfYearlyPremium: halfYearlyPremium || Math.round(monthlyPremium * 6 * 0.99),
      yearlyPremium: yearlyPremium || Math.round(monthlyPremium * 12 * 0.98),
      dailyCost: math.dailyCost,
      totalPremiumPaid: math.totalPremiumPaid,
      totalMonthlyPaid: math.totalMonthlyPaid,
      totalAnnualPaid: math.totalAnnualPaid,
      modeSavings: math.modeSavings,
      reversionaryBonus: math.reversionaryBonus,
      terminalBonus: math.terminalBonus,
      estimatedMaturity: math.estimatedMaturity,
      bonusProfit: math.bonusProfit,
      wealthMultiplier: math.wealthMultiplier,
      notes: notes.trim(),
      createdAt: initialLead?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(leadData);
    onClose();
  };

  const multiplierBase = category === 'PLI' ? 5000 : 1000;
  const currentMultiplier = sumAssured / multiplierBase;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-emerald-900 px-5 sm:px-6 py-3.5 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xs shadow-xs">
              {category}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialLead ? t(language, 'modalTitleEdit') : t(language, 'modalTitleNew')}
              </h2>
              <p className="text-xs text-emerald-200/80 font-medium">
                Official Department of Posts Actuarial Engine • 0% GST (NIL)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Two Columns (Form + Live Summary) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Form Fields (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Category Selector Tabs */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t(language, 'policyCategory')}
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('PLI')}
                    className={`py-1.5 px-3 text-xs font-bold rounded-md transition cursor-pointer ${
                      category === 'PLI'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    📮 PLI (Postal Life)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('RPLI')}
                    className={`py-1.5 px-3 text-xs font-bold rounded-md transition cursor-pointer ${
                      category === 'RPLI'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    🌾 RPLI (Rural Postal)
                  </button>
                </div>
              </div>

              {/* Plan Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t(language, 'selectPlan')}
                </label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  {availablePlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Bonus: ₹{p.bonusRate}/₹1k/yr)
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                  {currentPlan.description}
                </p>
              </div>

              {/* Contact Info (Name + Phone) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t(language, 'leadName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t(language, 'leadPhone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Date of Birth & Age Next Birthday */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of Birth (DOB)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dob}
                        onChange={handleDobChange}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        {t(language, 'currentAge')} (Age Next Birthday)
                      </label>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ANB: {currentAge} Yrs
                      </span>
                    </div>
                    <input
                      type="number"
                      min={currentPlan.minAge}
                      max={currentPlan.maxAge}
                      value={currentAge}
                      onChange={(e) => {
                        const newAge = Number(e.target.value);
                        setCurrentAge(newAge);
                        if (newAge >= maturityAge) {
                          setMaturityAge(Math.min(60, newAge + 10));
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/70 pt-1.5">
                  <span>🎂 <strong>Actuarial Standard:</strong> Age Next Birthday (ANB)</span>
                  <span className="text-emerald-700 font-semibold">Min: {currentPlan.minAge}Y | Max: {currentPlan.maxAge}Y</span>
                </div>
              </div>

              {/* Maturity Age & Term */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {t(language, 'maturityAge')}
                  </label>
                  <span className="text-xs font-bold text-emerald-700">
                    Maturity: {maturityAge} Years (Term: {term} Yrs)
                  </span>
                </div>
                
                {/* Maturity Age Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  {MATURITY_AGE_PRESETS.map((ageVal) => (
                    <button
                      key={ageVal}
                      type="button"
                      disabled={ageVal <= currentAge}
                      onClick={() => setMaturityAge(ageVal)}
                      className={`py-1 px-2 text-xs font-bold rounded-md border transition cursor-pointer ${
                        maturityAge === ageVal
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                          : ageVal <= currentAge
                          ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ageVal} Yrs
                    </button>
                  ))}
                  <span className="ml-auto text-xs font-bold text-emerald-700">
                    Term: {term} Years ({math.totalInstallments} Mo)
                  </span>
                </div>
              </div>

              {/* Sum Assured (₹) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {t(language, 'sumAssuredLabel')}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700">{formatINR(sumAssured)}</span>
                    {math.monthlySARebate > 0 && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        🏷️ -₹{math.monthlySARebate}/mo SA Rebate
                      </span>
                    )}
                  </div>
                </div>
                
                {/* SA Preset Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2">
                  {SA_PRESETS.map((saVal) => (
                    <button
                      key={saVal}
                      type="button"
                      onClick={() => setSumAssured(saVal)}
                      className={`py-1 px-1.5 text-xs font-bold rounded-lg border transition text-center cursor-pointer ${
                        sumAssured === saVal
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {saVal >= 100000 ? `₹${saVal / 100000}L` : `₹${saVal / 1000}K`}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  step={5000}
                  min={currentPlan.minSA}
                  max={currentPlan.maxSA}
                  value={sumAssured}
                  onChange={(e) => setSumAssured(Math.max(10000, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold font-mono"
                />

                {/* Sum Assured Rebate Explanation Note */}
                <div className="mt-2 p-2 bg-slate-100 rounded-lg text-[11px] text-slate-700 space-y-1 border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-1 font-semibold">
                    <span>📐 <strong>Tabular Multiplier:</strong> {currentMultiplier}x (per {category === 'PLI' ? '₹5,000' : '₹1,000'} SA)</span>
                    <span className="text-emerald-800 font-bold">
                      Base Rate: ₹{currentEstimate.monthlyTabularRatePer5k.toFixed(2)} / {category === 'PLI' ? '₹5k' : '₹1k'} SA
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-600 border-t border-slate-200/80 pt-1">
                    <span>🏷️ <strong>High SA Rebate:</strong> ₹5/mo per ₹1 Lakh SA (₹1/mo per ₹20k SA)</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      -₹{math.monthlySARebate}/mo (-₹{math.yearlySARebate}/yr)
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Input Mode Toggle */}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Modal Tabular Premiums (0% GST)
                  </span>
                  <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setCalcMode('auto')}
                      className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                        calcMode === 'auto' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      ⚡ Tabular Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcMode('manual')}
                      className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                        calcMode === 'manual' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      ✏️ Manual CIS
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Monthly (₹)
                      </label>
                      <span className="text-[9px] font-bold text-emerald-700">Net (0% GST)</span>
                    </div>
                    <input
                      type="number"
                      value={monthlyPremium || ''}
                      disabled={calcMode === 'auto'}
                      onChange={(e) => {
                        const m = Number(e.target.value);
                        setMonthlyPremium(m);
                        setQuarterlyPremium(m * 3);
                        setHalfYearlyPremium(Math.round(m * 6 * 0.99));
                        setYearlyPremium(Math.round(m * 12 * 0.98));
                      }}
                      className={`w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border font-mono ${
                        calcMode === 'auto' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Quarterly (₹)
                      </label>
                      <span className="text-[9px] text-slate-500">3 Months</span>
                    </div>
                    <input
                      type="number"
                      value={quarterlyPremium || ''}
                      disabled={calcMode === 'auto'}
                      onChange={(e) => setQuarterlyPremium(Number(e.target.value))}
                      className={`w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border font-mono ${
                        calcMode === 'auto' ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Half-Yearly (₹)
                      </label>
                      <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1 rounded">
                        6 Months
                      </span>
                    </div>
                    <input
                      type="number"
                      value={halfYearlyPremium || ''}
                      disabled={calcMode === 'auto'}
                      onChange={(e) => setHalfYearlyPremium(Number(e.target.value))}
                      className={`w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border font-mono ${
                        calcMode === 'auto' ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Yearly (₹)
                      </label>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                        12 Months
                      </span>
                    </div>
                    <input
                      type="number"
                      value={yearlyPremium || ''}
                      disabled={calcMode === 'auto'}
                      onChange={(e) => setYearlyPremium(Number(e.target.value))}
                      className={`w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border font-mono ${
                        calcMode === 'auto' ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Advance Rebate Note & GST Exemption */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-600 bg-emerald-50/70 p-2 rounded-md border border-emerald-200">
                  <span>⚡ <strong>Modal Table Rates:</strong> Exact PDF Actuarial Matrices • Multiplier: {currentMultiplier}x</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">GST: 0% NIL (Gazette Exempt)</span>
                </div>

                {/* 4-Mode Comparison Table Toggle */}
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => setShowComparisonTable(!showComparisonTable)}
                    className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition cursor-pointer border border-slate-300/60"
                  >
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{showComparisonTable ? 'Hide 4-Mode Actuarial Comparison' : 'View Full 4-Mode Actuarial Breakdown (PDF Rates)'}</span>
                    </div>
                    {showComparisonTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showComparisonTable && (
                    <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 shadow-xs">
                      <table className="min-w-full divide-y divide-slate-200 text-[11px]">
                        <thead className="bg-slate-800 text-white">
                          <tr>
                            <th className="px-2 py-1.5 text-left font-semibold">Mode</th>
                            <th className="px-2 py-1.5 text-right font-semibold">Unit Rate</th>
                            <th className="px-2 py-1.5 text-right font-semibold">Gross (₹)</th>
                            <th className="px-2 py-1.5 text-right font-semibold">SA Rebate</th>
                            <th className="px-2 py-1.5 text-right font-semibold">Net Payable (₹)</th>
                            <th className="px-2 py-1.5 text-right font-semibold">Total Term Paid</th>
                            <th className="px-2 py-1.5 text-right font-semibold">Savings</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 font-mono">
                          {comparisonData.rows.map((row) => (
                            <tr key={row.mode} className={row.mode === 'annual' ? 'bg-emerald-50/60 font-semibold' : ''}>
                              <td className="px-2 py-1.5 text-left font-sans text-slate-800">
                                {row.modeLabel}
                              </td>
                              <td className="px-2 py-1.5 text-right text-slate-600">₹{row.unitRate.toFixed(2)}</td>
                              <td className="px-2 py-1.5 text-right text-slate-600">₹{row.grossPremium.toLocaleString('en-IN')}</td>
                              <td className="px-2 py-1.5 text-right text-amber-700">-₹{row.highSARebate}</td>
                              <td className="px-2 py-1.5 text-right font-bold text-emerald-800">₹{row.netPayablePremium.toLocaleString('en-IN')}</td>
                              <td className="px-2 py-1.5 text-right text-slate-700">₹{row.totalTermPremium.toLocaleString('en-IN')}</td>
                              <td className="px-2 py-1.5 text-right text-emerald-700 font-bold">
                                {row.termSavingsVsMonthly > 0 ? `+₹${row.termSavingsVsMonthly.toLocaleString('en-IN')}` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Live Math Summary Card (5 Cols) */}
            <div className="lg:col-span-5 bg-emerald-950 p-4 sm:p-5 rounded-xl text-white flex flex-col justify-between shadow-sm border border-emerald-800">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-emerald-800/80 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                      Actuarial Quote Engine
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-400 text-emerald-950 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {math.wealthMultiplier}
                  </span>
                </div>

                {/* Hero Twin Metric Cards inside modal preview */}
                <div className="grid grid-cols-2 gap-2 mb-3.5">
                  <div className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-700">
                    <p className="text-[10px] font-bold text-emerald-300 uppercase">Daily Budget</p>
                    <p className="text-base sm:text-lg font-black text-amber-300">₹{math.dailyCost} / day</p>
                    <p className="text-[10px] text-emerald-400 font-medium">₹{monthlyPremium}/mo</p>
                  </div>
                  <div className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-700">
                    <p className="text-[10px] font-bold text-emerald-300 uppercase">Maturity Payout</p>
                    <p className="text-base sm:text-lg font-black text-amber-300">{formatINR(math.estimatedMaturity)}</p>
                    <p className="text-[10px] text-emerald-400 font-medium">SA + Govt Bonus</p>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-emerald-800/60">
                    <span className="text-emerald-300">Sum Assured (Life Cover):</span>
                    <span className="font-bold text-white">{formatINR(sumAssured)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-emerald-800/60">
                    <span className="text-emerald-300">Policy Term:</span>
                    <span className="font-bold text-white">{term} Years ({math.totalInstallments} Mo)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-emerald-800/60">
                    <span className="text-emerald-300">Simple Reversionary Bonus:</span>
                    <span className="font-bold text-emerald-400">+ {formatINR(math.reversionaryBonus)} (₹{currentPlan.bonusRate}/₹1k)</span>
                  </div>
                  {term >= 20 && (
                    <div className="flex items-center justify-between py-1 border-b border-emerald-800/60 text-amber-300">
                      <span>Terminal Bonus (Term ≥ 20Y):</span>
                      <span className="font-bold">+ ₹{math.terminalBonus} (Max ₹1k)</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-1 border-b border-emerald-800/60">
                    <span className="text-emerald-300">Total Premium Paid:</span>
                    <span className="font-bold text-slate-200">{formatINR(math.totalPremiumPaid)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-emerald-800/60">
                    <span className="text-emerald-300">Net Gain (Bonus Profit):</span>
                    <span className="font-bold text-emerald-400">+ {formatINR(math.bonusProfit)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-emerald-800/60">
                    <span className="text-emerald-300">Total SA Rebate Over Term:</span>
                    <span className="font-bold text-amber-300">- {formatINR(math.totalSARebateOverTerm)}</span>
                  </div>
                  {math.modeSavings > 0 && (
                    <div className="flex items-center justify-between py-1 border-b border-emerald-800/60 text-amber-300">
                      <span>Annual Mode Extra Savings:</span>
                      <span className="font-bold">- {formatINR(math.modeSavings)}</span>
                    </div>
                  )}
                </div>

                {/* GST & Income Tax Department Rebate Badge */}
                <div className="mt-3 p-2.5 bg-emerald-900/80 rounded-lg border border-amber-400/40 text-[11px] text-emerald-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Tax & Sovereign Safety</span>
                    </div>
                    <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-700">
                      GST: 0% NIL
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-200/90 leading-relaxed">
                    • <strong>Section 80C:</strong> Save ~{formatINR(math.estimatedTaxSavings)}/yr in income tax on premiums paid.<br />
                    • <strong>Section 10(10D):</strong> 100% Tax-Free maturity payout with sovereign guarantee.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 mt-3 border-t border-emerald-800 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2 px-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold transition text-center cursor-pointer"
                >
                  {t(language, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>{initialLead ? t(language, 'updateLead') : t(language, 'saveLead')}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
