import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { TDTerm } from '../types';
import { 
  TD_TERM_CONFIGS, 
  calculateIncentive, 
  formatCurrency, 
  numberToIndianWords,
  MAX_SINGLE_DEPOSIT 
} from '../utils/tdRules';

interface QuickCalculatorCardProps {
  onAddCalculatedAccount?: (depositAmount: number, term: TDTerm) => void;
}

export const QuickCalculatorCard: React.FC<QuickCalculatorCardProps> = () => {
  const [term, setTerm] = useState<TDTerm>('5Y');
  const [depositAmount, setDepositAmount] = useState<number>(50000);
  const [errorMsg, setErrorMsg] = useState('');

  const config = TD_TERM_CONFIGS[term];
  const numAmount = depositAmount || 0;
  const incentive = calculateIncentive(numAmount, term);

  const presets = [5000, 10000, 20000, 30000, 50000];

  const handleAmountChange = (val: number) => {
    if (val > MAX_SINGLE_DEPOSIT) {
      setErrorMsg(`Maximum single deposit allowed at Branch Office is ₹50,000 per transaction.`);
    } else {
      setErrorMsg('');
    }
    setDepositAmount(val);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-emerald-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official TD Commission Calculator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Instant TD BPM Incentive Calculator
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              Calculate exact BPM commission payable under India Post rules (Max ₹50,000 single deposit limit).
            </p>
          </div>

          {/* Official Commission Rates Matrix */}
          <div className="bg-emerald-950/90 p-3 rounded-2xl border border-emerald-700/80 text-xs space-y-1 shrink-0">
            <p className="text-[10px] uppercase tracking-wider font-bold text-amber-300">BPM Incentive Rates:</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono">
              <span>1Y TD: <strong className="text-white">0.50%</strong></span>
              <span>2Y TD: <strong className="text-white">1.00%</strong></span>
              <span>3Y TD: <strong className="text-white">1.00%</strong></span>
              <span>5Y TD: <strong className="text-amber-300 font-bold">2.00%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Calculator Card */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Term Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>1. Select Time Deposit Term</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['1Y', '2Y', '3Y', '5Y'] as TDTerm[]).map((t) => {
              const conf = TD_TERM_CONFIGS[t];
              const active = term === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTerm(t)}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    active
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 font-extrabold shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base font-black">{t} TD</span>
                  <span className={`text-xs font-bold mt-0.5 ${active ? 'text-emerald-800' : 'text-slate-500'}`}>
                    {conf.ratePercent}% BPM Incentive
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {conf.interestRate}% Int.
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Amount Input with ₹50,000 Max Deposit Rule */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="quick-deposit-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Deposit Amount (₹50,000 Max per Transaction)*
            </label>
            <span className="text-xs font-bold text-emerald-700">
              {formatCurrency(numAmount)}
            </span>
          </div>
          
          <div className="relative">
            <span className="absolute left-4 top-3 text-lg font-black text-slate-400">₹</span>
            <input
              id="quick-deposit-input"
              type="number"
              min="1000"
              max={MAX_SINGLE_DEPOSIT}
              step="500"
              value={depositAmount || ''}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              placeholder="50000"
              className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-300 text-lg sm:text-xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100"
            />
          </div>

          {/* Quick Amount Chips up to 50k */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleAmountChange(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  depositAmount === p
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                ₹{(p / 1000)}k {p === 50000 ? '(Max)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Calculated BPM Incentive Result Card */}
        <div className="bg-linear-to-br from-amber-500/15 via-amber-50/80 to-emerald-50/50 p-5 sm:p-6 rounded-3xl border-2 border-amber-400 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-700" />
              <span>BPM Claimable Incentive</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
              {config.ratePercent}% Rate
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-600 font-medium">Incentive Amount Claimable by BPM:</p>
            <p className="text-3xl sm:text-4xl font-black text-amber-950 font-mono tracking-tight mt-0.5">
              ₹ {incentive.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-amber-900 font-bold italic mt-1">
              {numberToIndianWords(incentive)}
            </p>
          </div>

          <div className="pt-2 border-t border-amber-200/80 text-xs text-slate-700 flex items-center justify-between">
            <span>Deposit Amount: <strong>₹{numAmount.toLocaleString('en-IN')}</strong></span>
            <span>TD Term: <strong>{term}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
