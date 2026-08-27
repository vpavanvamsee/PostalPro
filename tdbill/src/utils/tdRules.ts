import { TDTerm, TDTermConfig, TDAccountItem } from '../types';

/**
 * Official Department of Posts India - Time Deposit (TD) Incentive Structure
 * 1 Year TD: 0.5%
 * 2 Year TD: 1.0%
 * 3 Year TD: 1.0%
 * 5 Year TD: 2.0%
 */
export const TD_TERM_CONFIGS: Record<TDTerm, TDTermConfig> = {
  '1Y': {
    term: '1Y',
    termYears: 1,
    ratePercent: 0.5,
    label: '1-Year TD (0.5%)',
    interestRate: 6.9,
    minDeposit: 1000,
    description: '1 Year Time Deposit (0.5% BPM Commission)'
  },
  '2Y': {
    term: '2Y',
    termYears: 2,
    ratePercent: 1.0,
    label: '2-Year TD (1.0%)',
    interestRate: 7.0,
    minDeposit: 1000,
    description: '2 Year Time Deposit (1.0% BPM Commission)'
  },
  '3Y': {
    term: '3Y',
    termYears: 3,
    ratePercent: 1.0,
    label: '3-Year TD (1.0%)',
    interestRate: 7.1,
    minDeposit: 1000,
    description: '3 Year Time Deposit (1.0% BPM Commission)'
  },
  '5Y': {
    term: '5Y',
    termYears: 5,
    ratePercent: 2.0,
    label: '5-Year TD (2.0%)',
    interestRate: 7.5,
    minDeposit: 1000,
    description: '5 Year Time Deposit (2.0% BPM Commission + 80C Tax Rebate)'
  }
};

/**
 * Maximum single deposit limit at Branch Post Office (B.O.) per transaction
 */
export const MAX_SINGLE_DEPOSIT = 50000;
export const MIN_SINGLE_DEPOSIT = 1000;

/**
 * Calculates BPM incentive for a TD account
 */
export function calculateIncentive(depositAmount: number, term: TDTerm): number {
  if (!depositAmount || depositAmount <= 0) return 0;
  const config = TD_TERM_CONFIGS[term];
  const rate = config ? config.ratePercent : 0.5;
  const rawIncentive = (depositAmount * rate) / 100;
  return Math.round(rawIncentive * 100) / 100;
}

/**
 * Strict 12-digit Indian Postal Account Number cleaner
 * Filters only numeric characters and limits length to 12 digits
 */
export function clean12DigitInput(val: string): string {
  if (!val) return '';
  return val.replace(/\D/g, '').slice(0, 12);
}

/**
 * Validates whether the account number is exactly 12 digits
 */
export function isValid12DigitAccount(acc: string): boolean {
  return /^\d{12}$/.test(acc.trim());
}

/**
 * Formats 12-digit account with spacing for high readability (e.g., 3012 3456 7890)
 */
export function format12DigitAccount(acc: string): string {
  const cleaned = clean12DigitInput(acc);
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`;
}

/**
 * Indian Rupee Number Formatter (e.g., 50,000)
 */
export function formatCurrency(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹ 0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Converts Indian Rupee number to Words (Standard Official Banking / Postal Format)
 */
export function numberToIndianWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return 'Zero Rupees Only';

  const singleDigits = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 20) return singleDigits[n];
    const unit = n % 10;
    const ten = Math.floor(n / 10);
    return tens[ten] + (unit > 0 ? ' ' + singleDigits[unit] : '');
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    let str = '';
    if (hundred > 0) {
      str += singleDigits[hundred] + ' Hundred';
      if (remainder > 0) str += ' and ';
    }
    if (remainder > 0) {
      str += convertTwoDigits(remainder);
    }
    return str;
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) return 'Zero Rupees Only';

  let remaining = integerPart;
  const parts: string[] = [];

  // Crores
  const crores = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  if (crores > 0) {
    parts.push(convertThreeDigits(crores) + ' Crore');
  }

  // Lakhs
  const lakhs = Math.floor(remaining / 100000);
  remaining %= 100000;
  if (lakhs > 0) {
    parts.push(convertTwoDigits(lakhs) + ' Lakh');
  }

  // Thousands
  const thousands = Math.floor(remaining / 1000);
  remaining %= 1000;
  if (thousands > 0) {
    parts.push(convertTwoDigits(thousands) + ' Thousand');
  }

  // Hundreds & units
  if (remaining > 0) {
    parts.push(convertThreeDigits(remaining));
  }

  let words = 'Rupees ' + parts.join(' ');

  if (decimalPart > 0) {
    words += ' and ' + convertTwoDigits(decimalPart) + ' Paise';
  }

  words += ' Only';
  return words;
}

/**
 * Duplicate Account / PR Number Analyzer
 * Returns map of duplicate account numbers and PR numbers
 */
export interface DuplicateAnalysisResult {
  hasDuplicates: boolean;
  duplicateAccountNos: Set<string>;
  duplicatePrNos: Set<string>;
  duplicateItemsCount: number;
  duplicateDetails: {
    accountNumber?: string;
    prNumber?: string;
    count: number;
    names: string[];
  }[];
}

export function analyzeDuplicates(accounts: TDAccountItem[]): DuplicateAnalysisResult {
  const accMap = new Map<string, TDAccountItem[]>();
  const prMap = new Map<string, TDAccountItem[]>();

  accounts.forEach((item) => {
    const accKey = item.accountNumber.trim();
    if (accKey) {
      const existing = accMap.get(accKey) || [];
      existing.push(item);
      accMap.set(accKey, existing);
    }

    const prKey = item.prNumber ? item.prNumber.trim().toLowerCase() : '';
    if (prKey && prKey !== '-' && prKey !== 'none') {
      const existingPr = prMap.get(prKey) || [];
      existingPr.push(item);
      prMap.set(prKey, existingPr);
    }
  });

  const duplicateAccountNos = new Set<string>();
  const duplicatePrNos = new Set<string>();
  const duplicateDetails: DuplicateAnalysisResult['duplicateDetails'] = [];

  accMap.forEach((items, accNo) => {
    if (items.length > 1) {
      duplicateAccountNos.add(accNo);
      duplicateDetails.push({
        accountNumber: accNo,
        count: items.length,
        names: items.map(i => i.depositorName)
      });
    }
  });

  prMap.forEach((items, prNo) => {
    if (items.length > 1) {
      duplicatePrNos.add(prNo);
      // Only add if not already added by account
      const alreadyHas = duplicateDetails.some(d => d.prNumber === prNo);
      if (!alreadyHas) {
        duplicateDetails.push({
          prNumber: prNo,
          count: items.length,
          names: items.map(i => i.depositorName)
        });
      }
    }
  });

  const duplicateItemsCount = accounts.filter(
    (item) =>
      duplicateAccountNos.has(item.accountNumber.trim()) ||
      (item.prNumber && duplicatePrNos.has(item.prNumber.trim().toLowerCase()))
  ).length;

  return {
    hasDuplicates: duplicateAccountNos.size > 0 || duplicatePrNos.size > 0,
    duplicateAccountNos,
    duplicatePrNos,
    duplicateItemsCount,
    duplicateDetails
  };
}
