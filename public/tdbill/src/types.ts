export type TDTerm = '1Y' | '2Y' | '3Y' | '5Y';

export interface TDTermConfig {
  term: TDTerm;
  termYears: number;
  ratePercent: number; // e.g. 0.5 for 0.5%, 1.0 for 1%, 2.0 for 2%
  label: string;
  interestRate: number; // Current Post Office interest rate %
  minDeposit: number;
  description: string;
}

export interface TDAccountItem {
  id: string;
  accountNumber: string; // Strictly 12 digits
  prNumber: string; // Receipt / PR No. / SB-103
  depositorName: string;
  depositDate: string; // YYYY-MM-DD
  term: TDTerm;
  depositAmount: number;
  incentiveRate: number; // %
  incentiveAmount: number; // ₹
  cifNumber?: string;
  remarks?: string;
  createdAt: string;
}

export interface OfficeProfile {
  bpmName: string;
  designation: string; // BPM / ABPM / Dak Sevak
  employeeId: string; // CSI / Employee ID
  mobile: string;
  boName: string; // Branch Post Office
  soName: string; // Sub Post Office / Account Office
  hoName: string; // Head Post Office
  divisionName: string; // Postal Division
  pincode: string;
}

export interface TDBillMetadata {
  id: string;
  billNumber: string;
  billDate: string; // YYYY-MM-DD
  billMonth: string; // e.g. "August 2026"
  remarks?: string;
}

export type ThemeType = 'emerald' | 'postalRed' | 'royalNavy' | 'slateDark';

export interface QuickCalcResult {
  depositAmount: number;
  term: TDTerm;
  termYears: number;
  incentiveRate: number;
  incentiveAmount: number;
  interestRate: number;
  annualInterest: number;
  totalInterest: number;
  maturityAmount: number;
}
