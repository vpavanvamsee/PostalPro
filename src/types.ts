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

export type ThemeType = 
  | 'emerald'        // Postal Emerald (Original Default)
  | 'retroCream'      // Retro Warm Vintage Paper (From Screenshot)
  | 'indiaPostRed'   // Classic India Post Carmine Red & Gold
  | 'midnightNavy'   // Midnight Dark Postal Navy
  | 'cleanSlate'     // Clean Modern Minimalist Slate
  | 'saffronPride';  // Saffron & Forest Green Postal Pride

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'bn';

export type AppView = 
  | 'home' 
  | 'tdbill' 
  | 'plileads' 
  | 'schemeshare'
  | 'marketing' 
  | 'quizzes' 
  | 'guides'
  | 'tools'
  | 'about' 
  | 'privacy' 
  | 'publicNotice';

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

export interface PostalToolItem {
  id: string;
  title: string;
  badge?: string;
  category: 'Calculators' | 'Official Utilities' | 'EdTech & Prep' | 'Marketing';
  description: string;
  iconName: string;
  targetView?: AppView;
  externalUrl?: string;
  featured?: boolean;
}

export interface MarketingStrategyItem {
  id: string;
  title: string;
  tag: string;
  targetAudience: string;
  keyHighlight: string;
  description: string;
  iconName: string;
  steps: string[];
  pitchScript: string;
  realLifeExample?: string;
}

export interface PLILeadItem {
  id: string;
  prospectName: string;
  mobile: string;
  village: string;
  scheme: 'PLI - Santosh (EA)' | 'PLI - Suraksha (WLA)' | 'RPLI - Gram Priya' | 'RPLI - Gram Santosh' | 'RPLI - Yugal Suraksha';
  sumAssured: number;
  termYears: number;
  estimatedMonthlyPremium: number;
  status: 'New Prospect' | 'Proposal Filled' | 'Medical Cleared' | 'Policy Issued' | 'Follow-up Needed';
  date: string;
}
