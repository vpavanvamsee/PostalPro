import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';
import { OfficeProfile, TDAccountItem } from '../types';
import { format12DigitAccount, numberToIndianWords } from '../utils/tdRules';
import { shareOrDownloadOfficialPDF, generateOfficialTDBillPDF, ENTRIES_PER_A4_PAGE } from '../utils/pdfGenerator';

interface OfficialBillPrintViewProps {
  accounts: TDAccountItem[];
  office: OfficeProfile;
  billMonth: string;
  billDate: string;
  onBackToRegister: () => void;
}

export const OfficialBillPrintView: React.FC<OfficialBillPrintViewProps> = ({
  accounts,
  office,
  billMonth: initialMonth,
  billDate: initialDate,
  onBackToRegister
}) => {
  const [billMonth, setBillMonth] = useState(initialMonth || 'August 2026');
  const [billDate, setBillDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const totalDeposits = accounts.reduce((sum, item) => sum + (item.depositAmount || 0), 0);
  const totalCommission = accounts.reduce((sum, item) => sum + (item.incentiveAmount || 0), 0);
  const grandWordsTotal = numberToIndianWords(totalCommission).toUpperCase();

  // Paginate into strict 20 entries per A4 page
  const totalPages = Math.max(1, Math.ceil(accounts.length / ENTRIES_PER_A4_PAGE));
  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const pageAccounts = accounts.slice(
      pageIndex * ENTRIES_PER_A4_PAGE,
      (pageIndex + 1) * ENTRIES_PER_A4_PAGE
    );
    const displayRows = Array.from({ length: ENTRIES_PER_A4_PAGE }, (_, rIndex) => pageAccounts[rIndex] || null);
    const pageDeposit = pageAccounts.reduce((sum, item) => sum + (item.depositAmount || 0), 0);
    const pageIncentive = pageAccounts.reduce((sum, item) => sum + (item.incentiveAmount || 0), 0);
    const pageWords = numberToIndianWords(pageIncentive).toUpperCase();

    return {
      pageIndex,
      pageNumber: pageIndex + 1,
      pageAccounts,
      displayRows,
      pageDeposit,
      pageIncentive,
      pageWords
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = generateOfficialTDBillPDF(accounts, office, billMonth, billDate);
    const boClean = (office.boName || 'BO').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`TD_COMMISSION_BPM_BILL_${boClean}_${billMonth.replace(/\s+/g, '_')}.pdf`);
  };

  const handleShareWhatsAppPDF = async () => {
    setShareStatus('Generating Official PDF...');
    try {
      const res = await shareOrDownloadOfficialPDF(accounts, office, billMonth, billDate);
      if (res.method === 'webShare') {
        setShareStatus('PDF shared successfully!');
      } else {
        setShareStatus('PDF downloaded! You can attach it directly to WhatsApp.');
      }
      setTimeout(() => setShareStatus(null), 4000);
    } catch (err) {
      console.error('Share error:', err);
      setShareStatus('PDF downloaded to your device.');
      setTimeout(() => setShareStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action & Control Bar (Hidden during printing) */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToRegister}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Register</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white">TD COMMISSION BPM INCENTIVE BILL</h2>
              {totalPages > 1 && (
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {totalPages} A4 Pages (20/page)
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-300">Department of Posts India Official Schedule • 20 Entries/Page</p>
          </div>
        </div>

        {/* Action Buttons: WhatsApp Share PDF, Download PDF, Print */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Month & Date controls */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-800/90 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Month:</span>
            <input
              type="text"
              value={billMonth}
              onChange={(e) => setBillMonth(e.target.value)}
              className="bg-slate-900 text-white px-2 py-0.5 rounded border border-slate-700 text-xs w-28 font-bold focus:outline-none"
              placeholder="e.g. August 2026"
            />
          </div>

          <button
            id="share-whatsapp-pdf-btn"
            onClick={handleShareWhatsAppPDF}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-black shadow-sm transition cursor-pointer flex items-center gap-1.5"
            title="Share final bill PDF directly to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share PDF on WhatsApp</span>
          </button>

          <button
            id="download-official-pdf-btn"
            onClick={handleDownloadPDF}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Download</span> PDF
          </button>

          <button
            id="trigger-print-btn"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print A4</span>
          </button>
        </div>
      </div>

      {shareStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 print:hidden animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{shareStatus}</span>
        </div>
      )}

      {/* Pages Container: Exactly 20 entries per A4 page sheet */}
      <div className="space-y-8 print:space-y-0">
        {pages.map((page) => (
          <div 
            key={`a4-page-sheet-${page.pageNumber}`}
            id={`printable-td-bill-page-${page.pageNumber}`}
            className="bg-white p-5 sm:p-9 rounded-2xl border-2 border-slate-400 shadow-xl text-black font-sans print:border-none print:shadow-none print:p-0 print:m-0 print:text-black print:break-after-page print:page-break-after-always"
            style={{ color: '#000000', fontFamily: 'Arial, Helvetica, sans-serif', pageBreakAfter: page.pageNumber < totalPages ? 'always' : 'auto' }}
          >
            {/* Page Index Banner on screen */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 border-b border-slate-200 pb-1.5 mb-3 print:hidden">
                <span>A4 SHEET {page.pageNumber} OF {totalPages} (ENTRIES {(page.pageNumber - 1) * ENTRIES_PER_A4_PAGE + 1} - {Math.min(page.pageNumber * ENTRIES_PER_A4_PAGE, accounts.length || 20)})</span>
                <span>20 Entries Form</span>
              </div>
            )}

            {/* 1. Top Centered Header */}
            <div className="text-center space-y-1">
              <h1 className="text-base sm:text-xl font-bold uppercase tracking-wider text-black">
                DEPARTMENT OF POST INDIA
              </h1>
              
              {/* BO, SO, HO Line */}
              <div className="flex items-center justify-between pt-1.5 px-2 sm:px-8 text-xs sm:text-sm font-bold uppercase text-black">
                <div>
                  <span className="border-b border-black inline-block min-w-[80px] text-center">{office.boName || 'vadlamudi'}</span> BO
                </div>
                <div>
                  <span className="border-b border-black inline-block min-w-[80px] text-center">{office.soName || 'sjmudi'}</span> SO
                </div>
                <div>
                  <span className="border-b border-black inline-block min-w-[80px] text-center">{office.hoName || 'tenali'}</span> HO
                </div>
              </div>

              <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight text-black pt-2 pb-0.5">
                TD COMMISSION BPM INCENTIVE BILL
              </h2>
            </div>

            {/* 2. Month & Dated Line */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold uppercase text-black pt-1.5 pb-1.5">
              <div>
                FOR THE MONTH OF <span className="border-b border-black inline-block min-w-[100px] pl-1 font-bold">{billMonth.toUpperCase()}{totalPages > 1 ? ` (PAGE ${page.pageNumber}/${totalPages})` : ''}</span>
              </div>
              <div>
                DATED <span className="border-b border-black inline-block min-w-[100px] pl-1 font-bold">{billDate}</span>
              </div>
            </div>

            {/* 3. Official 8-Column Schedule Table (Exactly 20 Entries per Page) */}
            <div className="overflow-x-auto my-1.5">
              <table className="w-full text-center border-collapse border border-black text-[10.5px] sm:text-xs">
                <thead>
                  <tr className="border-b border-black font-bold uppercase">
                    <th className="border border-black p-1 w-10">SR NO</th>
                    <th className="border border-black p-1 min-w-[105px]">ACCOUNT NO</th>
                    <th className="border border-black p-1 min-w-[65px]">PR NO</th>
                    <th className="border border-black p-1 min-w-[135px] text-left pl-2">NAME OF DEPOSITOR</th>
                    <th className="border border-black p-1 min-w-[80px] text-right pr-2">DEPOSIT<br/>AMOUNT</th>
                    <th className="border border-black p-1 min-w-[65px]">TERM OF<br/>DEPOSIT</th>
                    <th className="border border-black p-1 min-w-[65px]">RATE OF<br/>INCENTIVE</th>
                    <th className="border border-black p-1 min-w-[80px] text-right pr-2">INCENTIVE<br/>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {page.displayRows.map((row, index) => {
                    const srNo = (page.pageNumber - 1) * ENTRIES_PER_A4_PAGE + index + 1;
                    return (
                      <tr key={`bill-page-${page.pageNumber}-row-${srNo}`} className="h-5.5 border-b border-black">
                        <td className="border border-black p-0.5 font-bold">{srNo}</td>
                        <td className="border border-black p-0.5 font-mono font-bold whitespace-nowrap">
                          {row ? format12DigitAccount(row.accountNumber) : ''}
                        </td>
                        <td className="border border-black p-0.5 font-mono">
                          {row ? row.prNumber : ''}
                        </td>
                        <td className="border border-black p-0.5 text-left pl-2 font-bold truncate max-w-[180px]">
                          {row ? row.depositorName : ''}
                        </td>
                        <td className="border border-black p-0.5 text-right pr-2 font-mono font-bold">
                          {row && row.depositAmount ? row.depositAmount.toLocaleString('en-IN') : ''}
                        </td>
                        <td className="border border-black p-0.5 font-bold">
                          {row ? row.term : ''}
                        </td>
                        <td className="border border-black p-0.5">
                          {row && row.incentiveRate ? `${row.incentiveRate}%` : ''}
                        </td>
                        <td className="border border-black p-0.5 text-right pr-2 font-mono font-bold">
                          {row && row.incentiveAmount ? row.incentiveAmount.toLocaleString('en-IN') : ''}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Page TOTAL Row */}
                  <tr className="border-t-2 border-black font-bold uppercase bg-slate-50/50">
                    <td colSpan={4} className="border border-black p-1 text-center font-bold">
                      {totalPages > 1 ? `PAGE ${page.pageNumber} TOTAL` : 'TOTAL'}
                    </td>
                    <td className="border border-black p-1 text-right pr-2 font-mono font-bold">
                      {page.pageDeposit > 0 ? page.pageDeposit.toLocaleString('en-IN') : ''}
                    </td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1 text-right pr-2 font-mono font-bold">
                      {page.pageIncentive > 0 ? page.pageIncentive.toLocaleString('en-IN') : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Bottom Clauses & Signatures (Kept intact on every A4 page) */}
            <div className="pt-3 space-y-3 text-[10.5px] sm:text-xs font-bold leading-normal uppercase text-black">
              
              {/* Certification Statements */}
              <div className="space-y-1 border-t border-black/40 pt-2">
                <p>
                  CERTIFIED THAT ALL THE ABOVE MENTIONED ACCOUNTS ARE OPENED AT BRANCH OFFICE AND NOT THROUGH ANY SAS AGENTS.
                </p>
                <p>
                  CERTIFIED THAT INCENTIVE FOR ABOVE MENTIONED ACCOUNTS ARE NOT TAKEN EARLIER.
                </p>
              </div>

              {/* Block 1: BPM Acceptance Request */}
              <div className="pt-1.5 space-y-1.5">
                <p className="flex items-center flex-wrap gap-1">
                  <span>PLEASE GIVE THE ACCEPTANCE OF INCENTIVE AMOUNT RS :-</span>
                  <span className="border-b border-black font-bold px-1">{page.pageIncentive > 0 ? `Rs. ${page.pageIncentive.toLocaleString('en-IN')}/-` : ''}</span>
                </p>
                <p className="flex items-center flex-wrap gap-1">
                  <span>RUPEES (IN WORDS) :-</span>
                  <span className="border-b border-black font-bold px-1">{page.pageIncentive > 0 ? page.pageWords : ''}</span>
                </p>
                <div className="pt-0.5 flex justify-end">
                  <div className="text-right whitespace-nowrap">
                    <span>SIGNATURE OF BPM </span>
                    <span className="border-b border-black inline-block min-w-[130px] text-center font-bold">
                      {office.bpmName ? `${office.bpmName} (${office.boName || 'BO'})` : '____________________'}
                    </span>
                    <span> BO</span>
                  </div>
                </div>
              </div>

              {/* Block 2: SPM Acceptance Granted */}
              <div className="pt-2 space-y-1.5">
                <p className="flex items-center flex-wrap gap-1">
                  <span>ACCEPTANCE GRANTED FOR THE AMOUNT OF RS :-</span>
                  <span className="border-b border-black font-bold px-1">{page.pageIncentive > 0 ? `Rs. ${page.pageIncentive.toLocaleString('en-IN')}/-` : ''}</span>
                </p>
                <p className="flex items-center flex-wrap gap-1">
                  <span>RUPEES (IN WORDS) :-</span>
                  <span className="border-b border-black font-bold px-1">{page.pageIncentive > 0 ? page.pageWords : ''}</span>
                </p>
                <div className="pt-0.5 flex justify-end">
                  <div className="text-right whitespace-nowrap">
                    <span>SIGNATURE OF SPM </span>
                    <span className="border-b border-black inline-block min-w-[130px] text-center font-bold">
                      {office.soName ? `${office.soName} SO` : '____________________'}
                    </span>
                    <span> SO</span>
                  </div>
                </div>
              </div>

              {/* Block 3: BPM Acquittance Receipt */}
              <div className="pt-2 space-y-1.5">
                <p className="flex items-center flex-wrap gap-1">
                  <span>INCENTIVE AMOUNT OF RS :-</span>
                  <span className="border-b border-black font-bold px-1">{page.pageIncentive > 0 ? `Rs. ${page.pageIncentive.toLocaleString('en-IN')}/-` : ''}</span>
                </p>
                <p className="flex items-center flex-wrap gap-1">
                  <span>RECEIVED RUPEES ( IN WORDS) :-</span>
                  <span className="border-b border-black font-bold px-1">{page.pageIncentive > 0 ? page.pageWords : ''}</span>
                </p>
                <div className="pt-0.5 flex justify-end">
                  <div className="text-right whitespace-nowrap">
                    <span>SIGNATURE OF BPM </span>
                    <span className="border-b border-black inline-block min-w-[130px] text-center font-bold">
                      {office.bpmName ? `${office.bpmName} (${office.boName || 'BO'})` : '____________________'}
                    </span>
                    <span> BO</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

