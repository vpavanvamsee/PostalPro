import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Calendar, 
  Sparkles, 
  FileText,
  ShieldCheck,
  User
} from 'lucide-react';
import { TDAccountItem, TDTerm } from '../types';
import { 
  TD_TERM_CONFIGS, 
  calculateIncentive, 
  clean12DigitInput, 
  isValid12DigitAccount, 
  format12DigitAccount,
  numberToIndianWords,
  MAX_SINGLE_DEPOSIT
} from '../utils/tdRules';

interface TDAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: TDAccountItem) => void;
  itemToEdit?: TDAccountItem | null;
  existingAccounts?: TDAccountItem[];
}

export const TDAccountModal: React.FC<TDAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
  existingAccounts = []
}) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [depositorName, setDepositorName] = useState('');
  const [depositDate, setDepositDate] = useState('');
  const [term, setTerm] = useState<TDTerm>('5Y');
  const [depositAmount, setDepositAmount] = useState<number>(50000);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (itemToEdit) {
      setAccountNumber(itemToEdit.accountNumber || '');
      setPrNumber(itemToEdit.prNumber || '');
      setDepositorName(itemToEdit.depositorName || '');
      setDepositDate(itemToEdit.depositDate || new Date().toISOString().split('T')[0]);
      setTerm(itemToEdit.term || '5Y');
      setDepositAmount(Math.min(itemToEdit.depositAmount || 50000, MAX_SINGLE_DEPOSIT));
      setRemarks(itemToEdit.remarks || '');
    } else {
      // Default new form values
      setAccountNumber('');
      setPrNumber('');
      setDepositorName('');
      setDepositDate(new Date().toISOString().split('T')[0]);
      setTerm('5Y');
      setDepositAmount(50000);
      setRemarks('');
    }
    setErrors({});
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = clean12DigitInput(raw);
    setAccountNumber(cleaned);
    if (errors.accountNumber) {
      setErrors((prev) => ({ ...prev, accountNumber: '' }));
    }
  };

  const handleAmountChange = (val: number) => {
    setDepositAmount(val);
    if (val > MAX_SINGLE_DEPOSIT) {
      setErrors((prev) => ({
        ...prev,
        depositAmount: `Maximum single deposit allowed at Branch Office is ₹50,000 per transaction.`
      }));
    } else if (errors.depositAmount) {
      setErrors((prev) => ({ ...prev, depositAmount: '' }));
    }
  };

  // Real-time Duplicate Check
  const cleanedAcc = accountNumber.trim();
  const cleanedPr = prNumber.trim().toLowerCase();

  const duplicateAccAccount = existingAccounts.find(
    (a) => a.id !== itemToEdit?.id && a.accountNumber.trim() === cleanedAcc && cleanedAcc.length > 0
  );

  const duplicatePrAccount = existingAccounts.find(
    (a) => a.id !== itemToEdit?.id && cleanedPr && cleanedPr !== '-' && a.prNumber?.trim().toLowerCase() === cleanedPr
  );

  const isDuplicate = Boolean(duplicateAccAccount || duplicatePrAccount);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!isValid12DigitAccount(accountNumber)) {
      errs.accountNumber = 'Finacle Account Number must be exactly 12 numeric digits.';
    }

    if (!depositorName.trim()) {
      errs.depositorName = 'Depositor name is required.';
    }

    if (!depositDate) {
      errs.depositDate = 'Deposit date is required.';
    }

    if (!depositAmount || depositAmount < 1000) {
      errs.depositAmount = 'Minimum deposit amount is ₹1,000.';
    } else if (depositAmount > MAX_SINGLE_DEPOSIT) {
      errs.depositAmount = 'Maximum single deposit allowed at Branch Office is ₹50,000 per transaction.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const rate = TD_TERM_CONFIGS[term].ratePercent;
    const incentive = calculateIncentive(depositAmount, term);

    const savedItem: TDAccountItem = {
      id: itemToEdit?.id || `td-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      accountNumber: accountNumber.trim(),
      prNumber: prNumber.trim() || undefined,
      depositorName: depositorName.trim(),
      depositDate,
      term,
      depositAmount,
      incentiveRate: rate,
      incentiveAmount: incentive,
      remarks: remarks.trim() || undefined,
      createdAt: itemToEdit?.createdAt || new Date().toISOString()
    };

    onSave(savedItem);
    onClose();
  };

  const calculatedIncentive = calculateIncentive(depositAmount || 0, term);
  const currentConfig = TD_TERM_CONFIGS[term];
  const presets = [5000, 10000, 20000, 30000, 50000];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-emerald-950 px-5 py-4 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-slate-950 p-2.5 rounded-xl font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {itemToEdit ? 'Edit TD Account Entry' : 'Add Time Deposit (TD) Account'}
              </h2>
              <p className="text-xs text-emerald-300">
                12-digit Finacle validation • Max ₹50,000 single deposit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Duplicate Warning Banner */}
          {isDuplicate && (
            <div className="p-3.5 bg-amber-500/15 border-2 border-amber-500 rounded-2xl text-amber-950 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">⚠️ Duplicate Account / PR Entry Detected!</p>
                {duplicateAccAccount && (
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Account No <strong>{accountNumber}</strong> already exists for depositor <em>&quot;{duplicateAccAccount.depositorName}&quot;</em>.
                  </p>
                )}
                {duplicatePrAccount && (
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    PR No <strong>{prNumber}</strong> already exists for depositor <em>&quot;{duplicatePrAccount.depositorName}&quot;</em>.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Account Number (Strict 12 Digits) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="accountNumber" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Finacle Account Number (12 Digits)*
              </label>
              <span className={`text-[11px] font-mono font-bold ${
                accountNumber.length === 12 ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {accountNumber.length} / 12 digits
              </span>
            </div>
            
            <div className="relative">
              <input
                id="accountNumber"
                type="text"
                maxLength={12}
                value={accountNumber}
                onChange={handleAccountChange}
                placeholder="e.g. 302489104512"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono tracking-wider focus:outline-none ${
                  errors.accountNumber 
                    ? 'border-red-500 bg-red-50/30' 
                    : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                }`}
              />
              {accountNumber.length === 12 && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
              )}
            </div>

            {errors.accountNumber ? (
              <p className="text-[11px] text-red-600 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.accountNumber}</span>
              </p>
            ) : (
              <p className="text-[10px] text-slate-400">
                Formatted preview: {format12DigitAccount(accountNumber) || '•••• •••• ••••'}
              </p>
            )}
          </div>

          {/* PR Number & Deposit Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="prNumber" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. PR Number / SB-103 Receipt
              </label>
              <input
                id="prNumber"
                type="text"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                placeholder="e.g. PR-8921 / 4510"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="depositDate" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Date of Deposit*
              </label>
              <input
                id="depositDate"
                type="date"
                value={depositDate}
                onChange={(e) => setDepositDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                  errors.depositDate ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          {/* Depositor Name */}
          <div className="space-y-1">
            <label htmlFor="depositorName" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>4. Name of Depositor*</span>
            </label>
            <input
              id="depositorName"
              type="text"
              value={depositorName}
              onChange={(e) => {
                setDepositorName(e.target.value);
                if (errors.depositorName) setErrors((prev) => ({ ...prev, depositorName: '' }));
              }}
              placeholder="e.g. M. Venkata Lakshmi"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none ${
                errors.depositorName ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600'
              }`}
            />
            {errors.depositorName && (
              <p className="text-[11px] text-red-600">{errors.depositorName}</p>
            )}
          </div>

          {/* Term Selection (1Y, 2Y, 3Y, 5Y) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              5. Term of Deposit & BPM Incentive Rate*
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['1Y', '2Y', '3Y', '5Y'] as TDTerm[]).map((t) => {
                const conf = TD_TERM_CONFIGS[t];
                const isSelected = term === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTerm(t)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 font-extrabold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm font-black">{t}</span>
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-500'}`}>
                      {conf.ratePercent}% Rate
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deposit Amount (Max ₹50,000 Limit) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="depositAmount" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                6. Deposit Amount (₹50,000 Max per transaction)*
              </label>
              <span className="text-xs font-bold text-emerald-800">
                ₹ {depositAmount ? depositAmount.toLocaleString('en-IN') : 0}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400">₹</span>
              <input
                id="depositAmount"
                type="number"
                min="1000"
                max={MAX_SINGLE_DEPOSIT}
                step="500"
                value={depositAmount || ''}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-base font-bold font-mono focus:outline-none ${
                  errors.depositAmount ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600'
                }`}
              />
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presets:</span>
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleAmountChange(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    depositAmount === p
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  ₹{(p / 1000)}k {p === 50000 ? '(Max)' : ''}
                </button>
              ))}
            </div>

            {errors.depositAmount && (
              <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.depositAmount}</span>
              </p>
            )}
          </div>

          {/* Live Calculated BPM Incentive Box */}
          <div className="bg-linear-to-r from-amber-50 to-emerald-50 p-3.5 rounded-2xl border border-amber-300 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Calculated BPM Incentive ({currentConfig.ratePercent}%):</p>
              <p className="text-xl font-black text-amber-950 font-mono">
                ₹ {calculatedIncentive.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-amber-900 font-semibold italic">
                {numberToIndianWords(calculatedIncentive)}
              </p>
            </div>
            <div className="bg-amber-400 text-slate-950 p-2 rounded-xl font-bold text-xs">
              {term} TD
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label htmlFor="remarks" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              7. Remarks (Optional)
            </label>
            <input
              id="remarks"
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Special TD Campaign / Mahila Samman"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-td-account-submit-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{itemToEdit ? 'Save Changes' : 'Add to Bill Register'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
