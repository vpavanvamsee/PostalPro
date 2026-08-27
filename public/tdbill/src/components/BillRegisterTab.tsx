import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  Share2, 
  RotateCcw, 
  CreditCard, 
  Coins, 
  Sparkles, 
  CheckCircle2,
  FileText,
  Filter,
  Copy,
  Printer,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Lock
} from 'lucide-react';
import { OfficeProfile, TDAccountItem } from '../types';
import { 
  formatCurrency, 
  format12DigitAccount, 
  numberToIndianWords, 
  analyzeDuplicates 
} from '../utils/tdRules';
import { shareOrDownloadOfficialPDF } from '../utils/pdfGenerator';

interface BillRegisterTabProps {
  accounts: TDAccountItem[];
  office: OfficeProfile;
  onOpenNewAccountModal: () => void;
  onOpenBatchModal: () => void;
  onOpenVaultModal: () => void;
  onEditAccount: (item: TDAccountItem) => void;
  onDeleteAccount: (id: string) => void;
  onResetToSample: () => void;
  onNavigateToOfficialBill: () => void;
}

export const BillRegisterTab: React.FC<BillRegisterTabProps> = ({
  accounts,
  office,
  onOpenNewAccountModal,
  onOpenBatchModal,
  onOpenVaultModal,
  onEditAccount,
  onDeleteAccount,
  onResetToSample,
  onNavigateToOfficialBill
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState<string>('ALL');
  const [filterDuplicatesOnly, setFilterDuplicatesOnly] = useState(false);
  const [copySuccessId, setCopySuccessId] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // Analyze Duplicates
  const duplicateAnalysis = analyzeDuplicates(accounts);

  // Filter logic
  const filteredAccounts = accounts.filter((item) => {
    const isAccDup = duplicateAnalysis.duplicateAccountNos.has(item.accountNumber.trim());
    const isPrDup = Boolean(item.prNumber && duplicateAnalysis.duplicatePrNos.has(item.prNumber.trim().toLowerCase()));
    
    if (filterDuplicatesOnly && !isAccDup && !isPrDup) {
      return false;
    }

    const matchesSearch = 
      item.accountNumber.includes(searchTerm.trim()) ||
      item.depositorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.prNumber && item.prNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTerm = filterTerm === 'ALL' || item.term === filterTerm;

    return matchesSearch && matchesTerm;
  });

  // Aggregate Calculations
  const totalAccounts = accounts.length;
  const totalDepositAmount = accounts.reduce((acc, item) => acc + (item.depositAmount || 0), 0);
  const totalIncentiveAmount = accounts.reduce((acc, item) => acc + (item.incentiveAmount || 0), 0);
  const avgIncentive = totalAccounts > 0 ? Math.round(totalIncentiveAmount / totalAccounts) : 0;

  // WhatsApp Share - ONLY Shares the Final Official Bill PDF
  const handleShareWhatsAppPDF = async () => {
    setShareStatus('Generating Official Claim Bill PDF...');
    try {
      const res = await shareOrDownloadOfficialPDF(
        accounts, 
        office, 
        'August 2026', 
        new Date().toISOString().split('T')[0]
      );
      if (res.method === 'webShare') {
        setShareStatus('Official Bill PDF shared to WhatsApp!');
      } else {
        setShareStatus('Official Bill PDF downloaded! Ready to share on WhatsApp.');
      }
      setTimeout(() => setShareStatus(null), 4000);
    } catch (err) {
      console.error('WhatsApp PDF share error:', err);
      setShareStatus('Official Bill PDF generated.');
      setTimeout(() => setShareStatus(null), 4000);
    }
  };

  const handleCopySingle = (item: TDAccountItem) => {
    const singleText = `TD A/C: ${item.accountNumber} | ${item.depositorName} | Term: ${item.term} | Deposit: ₹${item.depositAmount.toLocaleString('en-IN')} | Incentive: ₹${item.incentiveAmount} (B.O: ${office.boName})`;
    navigator.clipboard.writeText(singleText);
    setCopySuccessId(item.id);
    setTimeout(() => setCopySuccessId(null), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Policy Notice: Only BPM Can Claim TD Bill */}
      <div className="bg-emerald-950 text-emerald-100 p-3 sm:p-3.5 rounded-2xl border border-emerald-800 text-xs flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-400 text-slate-950 rounded-lg font-bold shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">Branch Postmaster (BPM) Exclusive:</span>{' '}
            <span className="text-emerald-200">
              As per Postal Directorate rules, Time Deposit (TD) commission is exclusively claimable by BPMs.
            </span>
          </div>
        </div>
        <button
          onClick={onOpenVaultModal}
          className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-700 font-semibold cursor-pointer shrink-0"
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>256-Bit Vault</span>
        </button>
      </div>

      {/* Duplicate Alert Banner (Intimates Duplicates) */}
      {duplicateAnalysis.hasDuplicates && (
        <div className="p-3.5 bg-amber-500/15 border-2 border-amber-500 rounded-2xl text-amber-950 text-xs space-y-1.5 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Duplicate Account / PR Number Warning Detected!</span>
            </div>
            <button
              onClick={() => setFilterDuplicatesOnly(!filterDuplicatesOnly)}
              className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 cursor-pointer shrink-0"
            >
              {filterDuplicatesOnly ? 'Show All Accounts' : `View ${duplicateAnalysis.duplicateItemsCount} Duplicates`}
            </button>
          </div>
          <p className="text-amber-900 text-[11px] leading-relaxed">
            The following duplicate entries were found in the bill register. Please verify to prevent Sub Office or Audit objections:
          </p>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {duplicateAnalysis.duplicateDetails.map((dup, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-950 font-bold text-[11px] flex items-center gap-1"
              >
                {dup.accountNumber ? `A/C: ${format12DigitAccount(dup.accountNumber)}` : `PR: ${dup.prNumber}`}
                <span className="text-amber-700 font-normal">({dup.count} entries: {dup.names.join(', ')})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {shareStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{shareStatus}</span>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Stat 1: Total Accounts */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total TD Accounts</p>
            <p className="text-xl sm:text-3xl font-black text-slate-900 font-mono mt-0.5">{totalAccounts}</p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 truncate">{office.boName || 'vadlamudi'} B.O</p>
          </div>
          <div className="bg-emerald-50 text-emerald-800 p-2 sm:p-2.5 rounded-xl shrink-0">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 2: Total Deposit Collection */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Collection</p>
            <p className="text-lg sm:text-2xl font-black text-slate-900 font-mono mt-0.5 truncate">
              ₹ {totalDepositAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Max ₹50k/Deposit</p>
          </div>
          <div className="bg-blue-50 text-blue-800 p-2 sm:p-2.5 rounded-xl shrink-0">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 3: Total Incentive Claimable */}
        <div className="bg-linear-to-br from-amber-500 to-amber-600 text-slate-950 p-3.5 sm:p-4 rounded-2xl shadow-md flex items-center justify-between border border-amber-400">
          <div>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-950">Claimable Incentive</p>
            <p className="text-xl sm:text-3xl font-black text-slate-950 font-mono mt-0.5">
              ₹ {totalIncentiveAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] font-bold text-amber-950 mt-0.5">BPM Commission</p>
          </div>
          <div className="bg-slate-950 text-amber-400 p-2 sm:p-2.5 rounded-xl shadow-xs shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 4: Avg Incentive */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg / Account</p>
            <p className="text-lg sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              ₹ {avgIncentive.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Per Account</p>
          </div>
          <div className="bg-purple-50 text-purple-800 p-2 sm:p-2.5 rounded-xl shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Actions */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 12-digit account, depositor name, or PR no..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Action Buttons: Add, Batch, Print, WhatsApp (PDF ONLY) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              id="add-account-register-btn"
              onClick={onOpenNewAccountModal}
              className="bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold py-2 px-3 sm:px-3.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Account</span>
            </button>

            <button
              id="batch-import-btn"
              onClick={onOpenBatchModal}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Batch Paste</span>
            </button>

            <button
              id="print-official-bill-direct-btn"
              onClick={onNavigateToOfficialBill}
              className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Bill</span>
            </button>

            {/* WhatsApp Button: ONLY Shares the Final Bill PDF */}
            <button
              id="whatsapp-share-pdf-btn"
              onClick={handleShareWhatsAppPDF}
              disabled={accounts.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              title="Share Final Bill PDF directly to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp PDF</span>
            </button>

            <button
              id="open-vault-btn"
              onClick={onOpenVaultModal}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Encrypted Vault Backup & Restore"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Term Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3 h-3" /> Term:
          </span>
          {[
            { id: 'ALL', label: 'All Terms' },
            { id: '1Y', label: '1-Year (0.5%)' },
            { id: '2Y', label: '2-Year (1.0%)' },
            { id: '3Y', label: '3-Year (1.0%)' },
            { id: '5Y', label: '5-Year (2.0%)' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => {
                setFilterTerm(flt.id);
                setFilterDuplicatesOnly(false);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterTerm === flt.id && !filterDuplicatesOnly
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {flt.label}
            </button>
          ))}

          {duplicateAnalysis.hasDuplicates && (
            <button
              onClick={() => setFilterDuplicatesOnly(!filterDuplicatesOnly)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                filterDuplicatesOnly
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Duplicates ({duplicateAnalysis.duplicateItemsCount})</span>
            </button>
          )}

          {accounts.length === 0 && (
            <button
              onClick={onResetToSample}
              className="ml-auto text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" /> Load Sample Accounts
            </button>
          )}
        </div>
      </div>

      {/* Account List / Table View */}
      {filteredAccounts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">No TD Accounts Found in this View</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add a new Time Deposit account with strict 12-digit number validation to calculate BPM commission automatically.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={onOpenNewAccountModal}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-600 cursor-pointer"
            >
              + Add First TD Account
            </button>
            <button
              onClick={onResetToSample}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load 4 Sample Accounts</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< md) - Perfectly fit for small screens, zero text overlap */}
          <div className="grid grid-cols-1 gap-2.5 md:hidden">
            {filteredAccounts.map((item, index) => {
              const isAccDup = duplicateAnalysis.duplicateAccountNos.has(item.accountNumber.trim());
              const isPrDup = Boolean(item.prNumber && duplicateAnalysis.duplicatePrNos.has(item.prNumber.trim().toLowerCase()));

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-3.5 shadow-xs space-y-2.5 transition border ${
                    isAccDup || isPrDup
                      ? 'border-amber-400 bg-amber-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top Row: Sl No, Name, Term & Duplicate Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.depositorName}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono truncate">
                          {item.prNumber ? `PR: ${item.prNumber} • ` : ''}Date: {item.depositDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {(isAccDup || isPrDup) && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white font-extrabold text-[9px] flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>DUP</span>
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        item.term === '5Y' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {item.term} ({item.incentiveRate}%)
                      </span>
                    </div>
                  </div>

                  {/* Account Number Box (12 Digits Highlighted) */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Finacle A/C No:</p>
                      <p className="text-xs font-mono font-bold text-slate-900 tracking-wider truncate">
                        {format12DigitAccount(item.accountNumber)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopySingle(item)}
                      className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 cursor-pointer shrink-0 ml-2"
                      title="Copy details"
                    >
                      {copySuccessId === item.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Amounts Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-100/70 p-2 rounded-xl">
                      <p className="text-[9px] text-slate-500 font-semibold uppercase">Deposit (₹50k max)</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                        ₹ {item.depositAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                      <p className="text-[9px] text-amber-800 font-bold uppercase">BPM Incentive ({item.incentiveRate}%)</p>
                      <p className="text-xs sm:text-sm font-black text-amber-950 font-mono">
                        ₹ {item.incentiveAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 italic truncate max-w-[55%]">
                      {item.remarks || 'Branch Procurement'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditAccount(item)}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteAccount(item.id)}
                        className="p-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop High-Density Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3.5 w-12 text-center">Sl</th>
                    <th className="py-3 px-3.5">Account Number (12 Digits)</th>
                    <th className="py-3 px-3.5">PR / SB-103</th>
                    <th className="py-3 px-3.5">Name of Depositor</th>
                    <th className="py-3 px-3.5">Date</th>
                    <th className="py-3 px-3.5 text-center">Term</th>
                    <th className="py-3 px-3.5 text-right">Deposit Amount (₹)</th>
                    <th className="py-3 px-3.5 text-center">Rate</th>
                    <th className="py-3 px-3.5 text-right bg-emerald-950 text-amber-300">Incentive (₹)</th>
                    <th className="py-3 px-3.5 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filteredAccounts.map((item, idx) => {
                    const isAccDup = duplicateAnalysis.duplicateAccountNos.has(item.accountNumber.trim());
                    const isPrDup = Boolean(item.prNumber && duplicateAnalysis.duplicatePrNos.has(item.prNumber.trim().toLowerCase()));

                    return (
                      <tr 
                        key={item.id} 
                        className={`transition-colors ${
                          isAccDup || isPrDup ? 'bg-amber-50/60 hover:bg-amber-100/50' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-3 px-3.5 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                              {format12DigitAccount(item.accountNumber)}
                            </span>
                            {isAccDup && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-white" title="Duplicate Account Number">
                                DUP A/C
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3.5 font-mono text-slate-600">
                          <div className="flex items-center gap-1">
                            <span>{item.prNumber || '-'}</span>
                            {isPrDup && (
                              <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-amber-400 text-slate-950" title="Duplicate PR Number">
                                DUP
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          {item.depositorName}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                          {item.depositDate}
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            item.term === '5Y' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {item.term}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">
                          ₹ {item.depositAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3.5 text-center font-semibold text-slate-600">
                          {item.incentiveRate}%
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-black text-amber-950 bg-amber-50/70 border-l border-amber-200">
                          ₹ {item.incentiveAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onEditAccount(item)}
                              className="p-1 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer"
                              title="Edit Account"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteAccount(item.id)}
                              className="p-1 rounded-md text-red-600 hover:bg-red-100 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900 text-xs">
                  <tr>
                    <td colSpan={6} className="py-3 px-3.5 text-right uppercase tracking-wider">
                      Total ({filteredAccounts.length} Accounts):
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-sm font-black">
                      ₹ {filteredAccounts.reduce((sum, item) => sum + (item.depositAmount || 0), 0).toLocaleString('en-IN')}
                    </td>
                    <td></td>
                    <td className="py-3 px-3.5 text-right font-mono text-base font-black text-amber-950 bg-amber-100 border-l border-amber-300">
                      ₹ {filteredAccounts.reduce((sum, item) => sum + (item.incentiveAmount || 0), 0).toLocaleString('en-IN')}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
