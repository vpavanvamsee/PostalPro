import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { TDAccountItem, TDTerm } from '../types';
import { calculateIncentive, clean12DigitInput, MAX_SINGLE_DEPOSIT, analyzeDuplicates } from '../utils/tdRules';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: TDAccountItem[]) => void;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [pasteData, setPasteData] = useState('');
  const [previewItems, setPreviewItems] = useState<TDAccountItem[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [cappedWarnings, setCappedWarnings] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!pasteData.trim()) {
      setErrorMsg('Please paste text or table rows containing account numbers, names, terms, and amounts.');
      return;
    }

    const lines = pasteData.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed: TDAccountItem[] = [];
    const warnings: string[] = [];

    lines.forEach((line, index) => {
      // Split by tab, comma, or multiple spaces
      const parts = line.split(/[\t,;|]+/).map(p => p.trim()).filter(Boolean);
      
      if (parts.length >= 2) {
        let accNo = '';
        let depositorName = `Depositor ${index + 1}`;
        let amount = 50000;
        let term: TDTerm = '5Y';
        let prNo = `PR-${Math.floor(1000 + Math.random() * 9000)}`;

        parts.forEach(part => {
          const digitsOnly = clean12DigitInput(part);
          if (digitsOnly.length === 12 && !accNo) {
            accNo = digitsOnly;
          } else if (part.toUpperCase().startsWith('PR-') || part.toUpperCase().startsWith('PR')) {
            prNo = part;
          } else if (['1y', '1 yr', '1 year', '1'].includes(part.toLowerCase())) {
            term = '1Y';
          } else if (['2y', '2 yr', '2 year', '2'].includes(part.toLowerCase())) {
            term = '2Y';
          } else if (['3y', '3 yr', '3 year', '3'].includes(part.toLowerCase())) {
            term = '3Y';
          } else if (['5y', '5 yr', '5 year', '5'].includes(part.toLowerCase())) {
            term = '5Y';
          } else if (!isNaN(Number(part.replace(/[₹, ]/g, ''))) && Number(part.replace(/[₹, ]/g, '')) >= 1000) {
            let parsedAmt = Number(part.replace(/[₹, ]/g, ''));
            if (parsedAmt > MAX_SINGLE_DEPOSIT) {
              warnings.push(`Row ${index + 1}: Amount ₹${parsedAmt.toLocaleString('en-IN')} was adjusted to ₹50,000 max single deposit limit.`);
              parsedAmt = MAX_SINGLE_DEPOSIT;
            }
            amount = parsedAmt;
          } else if (isNaN(Number(part)) && part.length > 2) {
            depositorName = part;
          }
        });

        // Fallback 12-digit account number if none found
        if (!accNo) {
          accNo = `30${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        }

        const rate = term === '5Y' ? 2.0 : term === '1Y' ? 0.5 : 1.0;
        const inc = calculateIncentive(amount, term);

        parsed.push({
          id: `batch-${Date.now()}-${index}`,
          accountNumber: accNo,
          prNumber: prNo,
          depositorName,
          depositDate: new Date().toISOString().split('T')[0],
          term,
          depositAmount: amount,
          incentiveRate: rate,
          incentiveAmount: inc,
          remarks: 'Batch Quick Import',
          createdAt: new Date().toISOString()
        });
      }
    });

    if (parsed.length === 0) {
      setErrorMsg('Could not parse valid records. Please check the format and try again.');
      return;
    }

    setPreviewItems(parsed);
    setCappedWarnings(warnings);
    setErrorMsg('');
  };

  const handleConfirmImport = () => {
    if (previewItems.length > 0) {
      onImport(previewItems);
      onClose();
    }
  };

  const batchDuplicateAnalysis = analyzeDuplicates(previewItems);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-emerald-950 px-5 py-4 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-400 text-slate-950 p-2.5 rounded-xl font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Batch Quick Import</h2>
              <p className="text-xs text-emerald-300">Paste Excel/CSI rows • 12-digit Finacle validation • Max ₹50,000/deposit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {cappedWarnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>₹50,000 Single Deposit Limit Applied:</span>
              </p>
              {cappedWarnings.slice(0, 3).map((w, idx) => (
                <p key={idx} className="text-[11px] text-amber-800">• {w}</p>
              ))}
            </div>
          )}

          {batchDuplicateAnalysis.hasDuplicates && (
            <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-950 text-xs flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Duplicate Alert: {batchDuplicateAnalysis.duplicateItemsCount} duplicate account/PR entries found in the pasted data.
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Paste Data (Tab / Comma separated rows from Excel / CSI / WhatsApp)
            </label>
            <textarea
              rows={5}
              value={pasteData}
              onChange={(e) => setPasteData(e.target.value)}
              placeholder="Example format (one per line):&#10;301234567890, Ramesh Kumar, 5Y, 50000&#10;309876543210, Anita Devi, 3Y, 40000&#10;304567891234, Suresh Babu, 1Y, 25000"
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-emerald-600"
            />
            <p className="text-[11px] text-slate-500">
              Supports: 12-digit Account No, Depositor Name, Term (1Y/2Y/3Y/5Y), Amount (up to ₹50k max).
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleParse}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Parse & Preview ({pasteData.split('\n').filter(Boolean).length} rows)</span>
            </button>
          </div>

          {/* Preview Parsed Items */}
          {previewItems.length > 0 && (
            <div className="space-y-2 border-t pt-3 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">
                  Parsed {previewItems.length} Accounts:
                </span>
                <span className="text-xs font-bold text-slate-700">
                  Total Incentive: ₹{previewItems.reduce((sum, item) => sum + item.incentiveAmount, 0).toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y text-xs">
                {previewItems.map((item, idx) => {
                  const isDup = batchDuplicateAnalysis.duplicateAccountNos.has(item.accountNumber.trim());
                  return (
                    <div key={item.id} className={`p-2.5 flex items-center justify-between ${isDup ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900">{idx + 1}. {item.depositorName}</p>
                          {isDup && <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white font-bold text-[9px]">DUP</span>}
                        </div>
                        <p className="font-mono text-[11px] text-slate-500">A/C: {item.accountNumber} • Term: {item.term}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">₹{item.depositAmount.toLocaleString('en-IN')}</p>
                        <p className="text-[11px] font-bold text-emerald-700">+₹{item.incentiveAmount} Inc.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action footer */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={previewItems.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import {previewItems.length} Accounts to Register</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
