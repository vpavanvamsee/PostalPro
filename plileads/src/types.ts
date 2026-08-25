export type LanguageCode = 
  | 'en' 
  | 'te' 
  | 'hi' 
  | 'ta' 
  | 'kn' 
  | 'ml' 
  | 'mr' 
  | 'bn' 
  | 'gu' 
  | 'or';

export type PolicyCategory = 'PLI' | 'RPLI';

export interface PlanDefinition {
  id: string;
  name: string;
  code: string;
  category: PolicyCategory;
  bonusRate: number; // ₹ per ₹1000 Sum Assured per year
  minAge: number;
  maxAge: number;
  minSA: number;
  maxSA: number;
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  dob?: string;
  currentAge: number; // Age Next Birthday
  maturityAge: number;
  term: number;
  category: PolicyCategory;
  planId: string;
  planName: string;
  sumAssured: number;
  monthlyPremium: number;
  yearlyPremium: number;
  halfYearlyPremium: number;
  quarterlyPremium: number;
  dailyCost: number;
  totalPremiumPaid: number;
  totalMonthlyPaid?: number;
  totalAnnualPaid?: number;
  modeSavings?: number;
  reversionaryBonus?: number;
  terminalBonus?: number;
  estimatedMaturity: number;
  bonusProfit: number;
  wealthMultiplier: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentProfile {
  name: string;
  designation: string;
  branchOffice: string;
  division: string;
  phone: string;
  monthlyTargetSA: number; // in ₹
  customTagline?: string;
}

export interface ProspectTask {
  id: string;
  category: 'SSA' | 'IPPB' | 'SHOP' | 'FARMER';
  customerName: string;
  phone: string;
  location: string;
  notes: string;
  completed: boolean;
  convertedToLead?: boolean;
  date: string;
}

export interface ObjectionBuster {
  id: string;
  titleKey: string;
  objectionKey: string;
  strategyKey: string;
  scriptKey: string;
  iconName: string;
}

export interface StatusTemplate {
  id: string;
  category: string;
  titleKey: string;
  bodyKey: string;
}
