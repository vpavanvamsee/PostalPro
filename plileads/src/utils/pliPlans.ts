import { PlanDefinition, PolicyCategory } from '../types';

export const PLI_PLANS: PlanDefinition[] = [
  {
    id: 'pli_santosh',
    name: 'Santosh (Endowment Assurance - EA)',
    code: 'EA',
    category: 'PLI',
    bonusRate: 52, // ₹52 per ₹1,000 SA per year
    minAge: 19,
    maxAge: 55,
    minSA: 20000,
    maxSA: 5000000,
    description: 'Guaranteed lump sum maturity payout + highest regular bonus with life cover throughout policy term.'
  },
  {
    id: 'pli_suraksha',
    name: 'Suraksha (Whole Life Assurance - WLA)',
    code: 'WLA',
    category: 'PLI',
    bonusRate: 76, // ₹76 per ₹1,000 SA per year
    minAge: 19,
    maxAge: 55,
    minSA: 20000,
    maxSA: 5000000,
    description: 'Maximum bonus rate in the industry. Full maturity sum + bonus payable at age 80 or on death to nominee.'
  },
  {
    id: 'pli_suvidha',
    name: 'Suvidha (Convertible Whole Life Assurance)',
    code: 'CWLA',
    category: 'PLI',
    bonusRate: 76,
    minAge: 19,
    maxAge: 50,
    minSA: 20000,
    maxSA: 5000000,
    description: 'Whole life security with flexible conversion option into Endowment Assurance after 5 years.'
  },
  {
    id: 'pli_yugal',
    name: 'Yugal Suraksha (Joint Life Assurance)',
    code: 'JLA',
    category: 'PLI',
    bonusRate: 52,
    minAge: 21,
    maxAge: 45,
    minSA: 20000,
    maxSA: 5000000,
    description: 'Single policy providing dual life coverage for husband and wife under one affordable premium.'
  },
  {
    id: 'pli_sumangal',
    name: 'Sumangal (Anticipated Endowment Assurance)',
    code: 'AEA',
    category: 'PLI',
    bonusRate: 48,
    minAge: 19,
    maxAge: 45,
    minSA: 20000,
    maxSA: 5000000,
    description: 'Money-back policy with periodic survival payouts (20% at intervals) + full SA bonus on maturity.'
  },
  {
    id: 'pli_bal',
    name: 'Bal Jeevan Bima (Children Policy)',
    code: 'BJB',
    category: 'PLI',
    bonusRate: 52,
    minAge: 5,
    maxAge: 20,
    minSA: 20000,
    maxSA: 300000,
    description: 'Child life coverage with waiver of premium on demise of the main policyholder parent.'
  }
];

export const RPLI_PLANS: PlanDefinition[] = [
  {
    id: 'rpli_santosh',
    name: 'Gram Santosh (Endowment Assurance - EA)',
    code: 'GEA',
    category: 'RPLI',
    bonusRate: 48, // ₹48 per ₹1,000 SA per year
    minAge: 19,
    maxAge: 55,
    minSA: 10000,
    maxSA: 1000000,
    description: 'Affordable rural endowment policy with high declared bonus for rural youth and families.'
  },
  {
    id: 'rpli_suraksha',
    name: 'Gram Suraksha (Whole Life Assurance - WLA)',
    code: 'GWLA',
    category: 'RPLI',
    bonusRate: 60, // ₹60 per ₹1,000 SA per year
    minAge: 19,
    maxAge: 55,
    minSA: 10000,
    maxSA: 1000000,
    description: 'Highest bonus rural policy payable on attaining age 80 or to nominee with full life cover.'
  },
  {
    id: 'rpli_suvidha',
    name: 'Gram Suvidha (Convertible Whole Life Assurance)',
    code: 'GCWLA',
    category: 'RPLI',
    bonusRate: 60,
    minAge: 19,
    maxAge: 45,
    minSA: 10000,
    maxSA: 1000000,
    description: 'Convertible rural whole life plan allowing switch to endowment assurance at 5th policy year.'
  },
  {
    id: 'rpli_sumangal',
    name: 'Gram Sumangal (Anticipated Endowment Assurance)',
    code: 'GAEA',
    category: 'RPLI',
    bonusRate: 45,
    minAge: 19,
    maxAge: 45,
    minSA: 10000,
    maxSA: 500000,
    description: 'Rural money-back policy with periodic survival benefit cashbacks at 15 or 20 year terms.'
  },
  {
    id: 'rpli_priya',
    name: 'Gram Priya (10 Years Rural Policy)',
    code: 'GP',
    category: 'RPLI',
    bonusRate: 45,
    minAge: 20,
    maxAge: 45,
    minSA: 10000,
    maxSA: 500000,
    description: 'Short 10-year term rural policy with survival benefits after 4, 7, and 10 years.'
  },
  {
    id: 'rpli_bal',
    name: 'Gram Bal Jeevan Bima (Children Policy)',
    code: 'GBJB',
    category: 'RPLI',
    bonusRate: 48,
    minAge: 5,
    maxAge: 20,
    minSA: 10000,
    maxSA: 100000,
    description: 'Guaranteed child education and security fund for rural families with low monthly savings.'
  }
];

export const ALL_PLANS: PlanDefinition[] = [...PLI_PLANS, ...RPLI_PLANS];

export function getPlanById(id: string): PlanDefinition {
  const found = ALL_PLANS.find(p => p.id === id || p.code.toLowerCase() === id.toLowerCase());
  return found || PLI_PLANS[0];
}

export type PaymentMode = 'monthly' | 'quarterly' | 'halfYearly' | 'annual';

// ==========================================
// 1. OFFICIAL TABULAR RATE MATRICES (PDF DATA)
// ==========================================

/**
 * PLI (Santosh) Modal Tabular Unit Rates (per ₹5,000 Sum Assured)
 * Source: Department of Posts PLI & RPLI Official Modal Tabular Rate Tables (Page 1)
 */
export const PLI_TABULAR_RATES: Record<PaymentMode, Record<number, Record<number, number>>> = {
  monthly: {
    19: { 35: 24.00, 40: 19.00, 45: 15.00, 50: 12.00, 55: 10.00, 58: 9.00, 60: 8.00 },
    20: { 35: 26.00, 40: 20.00, 45: 16.00, 50: 13.00, 55: 10.00, 58: 9.00, 60: 8.00 },
    23: { 35: 33.00, 40: 24.00, 45: 18.00, 50: 14.00, 55: 11.00, 58: 10.00, 60: 9.00 },
    25: { 35: 39.00, 40: 27.00, 45: 20.00, 50: 16.00, 55: 12.00, 58: 11.00, 60: 10.00 },
    30: { 40: 39.00, 45: 26.00, 50: 20.00, 55: 16.00, 58: 13.00, 60: 12.00 },
    35: { 45: 40.00, 50: 27.00, 55: 20.00, 58: 17.00, 60: 15.00 },
    40: { 50: 41.00, 55: 28.00, 58: 22.00, 60: 19.00 },
    45: { 55: 43.00, 58: 30.00, 60: 26.00 }
  },
  quarterly: {
    19: { 35: 71.80, 40: 56.90, 45: 44.90, 50: 35.90, 55: 29.90, 58: 26.90, 60: 23.90 },
    20: { 35: 77.80, 40: 59.90, 45: 47.90, 50: 38.90, 55: 29.90, 58: 26.90, 60: 23.90 },
    23: { 35: 98.70, 40: 71.80, 45: 53.90, 50: 41.90, 55: 32.90, 58: 29.90, 60: 26.90 },
    25: { 35: 116.70, 40: 80.80, 45: 59.90, 50: 47.90, 55: 35.90, 58: 32.90, 60: 29.90 },
    30: { 40: 116.70, 45: 77.80, 50: 59.90, 55: 47.90, 58: 38.90, 60: 35.90 },
    35: { 45: 119.70, 50: 80.80, 55: 59.90, 58: 50.90, 60: 44.90 },
    40: { 50: 122.70, 55: 83.80, 58: 65.80, 60: 56.90 },
    45: { 55: 128.60, 58: 89.80, 60: 77.80 }
  },
  halfYearly: {
    19: { 35: 142.30, 40: 112.70, 45: 89.00, 50: 71.20, 55: 59.30, 58: 53.40, 60: 47.50 },
    20: { 35: 154.20, 40: 118.60, 45: 94.90, 50: 77.10, 55: 59.30, 58: 53.40, 60: 47.50 },
    23: { 35: 195.70, 40: 142.30, 45: 106.80, 50: 83.00, 55: 65.20, 58: 59.30, 60: 53.40 },
    25: { 35: 231.20, 40: 160.10, 45: 118.60, 50: 94.90, 55: 71.20, 58: 65.20, 60: 59.30 },
    30: { 40: 231.20, 45: 154.20, 50: 118.60, 55: 94.90, 58: 77.10, 60: 71.20 },
    35: { 45: 237.10, 50: 160.10, 55: 118.60, 58: 100.80, 60: 89.00 },
    40: { 50: 243.00, 55: 166.00, 58: 130.40, 60: 112.70 },
    45: { 55: 254.90, 58: 177.90, 60: 154.20 }
  },
  annual: {
    19: { 35: 279.40, 40: 221.20, 45: 174.70, 50: 139.70, 55: 116.40, 58: 104.80, 60: 93.20 },
    20: { 35: 302.70, 40: 232.90, 45: 186.30, 50: 151.40, 55: 116.40, 58: 104.80, 60: 93.20 },
    23: { 35: 384.20, 40: 279.40, 45: 209.60, 50: 163.00, 55: 128.10, 58: 116.40, 60: 104.80 },
    25: { 35: 454.00, 40: 314.30, 45: 232.90, 50: 186.30, 55: 139.70, 58: 128.10, 60: 116.40 },
    30: { 40: 454.00, 45: 302.70, 50: 232.90, 55: 186.30, 58: 151.40, 60: 139.70 },
    35: { 45: 465.70, 50: 314.30, 55: 232.90, 58: 197.90, 60: 174.70 },
    40: { 50: 477.30, 55: 326.00, 58: 256.10, 60: 221.20 },
    45: { 55: 500.60, 58: 349.30, 60: 302.70 }
  }
};

/**
 * RPLI (Gram Santosh) Modal Tabular Unit Rates (per ₹1,000 Sum Assured)
 * Source: Department of Posts PLI & RPLI Official Modal Tabular Rate Tables (Page 2)
 */
export const RPLI_TABULAR_RATES: Record<PaymentMode, Record<number, Record<number, number>>> = {
  monthly: {
    19: { 35: 4.80, 40: 3.80, 45: 3.00, 50: 2.40, 55: 2.00, 58: 1.80, 60: 1.60 },
    20: { 35: 5.20, 40: 4.00, 45: 3.20, 50: 2.60, 55: 2.00, 58: 1.80, 60: 1.60 },
    23: { 35: 6.60, 40: 4.80, 45: 3.60, 50: 2.80, 55: 2.20, 58: 2.00, 60: 1.80 },
    25: { 35: 7.80, 40: 5.40, 45: 4.00, 50: 3.20, 55: 2.40, 58: 2.20, 60: 2.00 },
    30: { 40: 7.80, 45: 5.20, 50: 4.00, 55: 3.20, 58: 2.60, 60: 2.40 },
    35: { 45: 8.00, 50: 5.40, 55: 4.00, 58: 3.40, 60: 3.00 },
    40: { 50: 8.20, 55: 5.60, 58: 4.40, 60: 3.80 },
    45: { 55: 8.60, 58: 6.00, 60: 5.20 }
  },
  quarterly: {
    19: { 35: 14.36, 40: 11.37, 45: 8.98, 50: 7.18, 55: 5.99, 58: 5.39, 60: 4.79 },
    20: { 35: 15.56, 40: 11.97, 45: 9.58, 50: 7.78, 55: 5.99, 58: 5.39, 60: 4.79 },
    23: { 35: 19.75, 40: 14.36, 45: 10.78, 50: 8.38, 55: 6.58, 58: 5.99, 60: 5.39 },
    25: { 35: 23.34, 40: 16.16, 45: 11.97, 50: 9.58, 55: 7.18, 58: 6.58, 60: 5.99 },
    30: { 40: 23.34, 45: 15.56, 50: 11.97, 55: 9.58, 58: 7.78, 60: 7.18 },
    35: { 45: 23.94, 50: 16.16, 55: 11.97, 58: 10.18, 60: 8.98 },
    40: { 50: 24.54, 55: 16.76, 58: 13.17, 60: 11.37 },
    45: { 55: 25.74, 58: 17.96, 60: 15.56 }
  },
  halfYearly: {
    19: { 35: 28.46, 40: 22.53, 45: 17.79, 50: 14.23, 55: 11.86, 58: 10.67, 60: 9.49 },
    20: { 35: 30.83, 40: 23.72, 45: 18.98, 50: 15.42, 55: 11.86, 58: 10.67, 60: 9.49 },
    23: { 35: 39.13, 40: 28.46, 45: 21.36, 50: 16.60, 55: 13.05, 58: 11.86, 60: 10.67 },
    25: { 35: 46.24, 40: 32.02, 45: 23.72, 50: 18.98, 55: 14.23, 58: 13.05, 60: 11.86 },
    30: { 40: 46.24, 45: 30.83, 50: 23.72, 55: 18.98, 58: 15.42, 60: 14.23 },
    35: { 45: 47.42, 50: 32.02, 55: 23.72, 58: 20.16, 60: 17.79 },
    40: { 50: 48.61, 55: 33.21, 58: 26.09, 60: 22.53 },
    45: { 55: 50.98, 58: 35.58, 60: 30.83 }
  },
  annual: {
    19: { 35: 55.87, 40: 44.23, 45: 34.93, 50: 27.95, 55: 23.29, 58: 20.96, 60: 18.63 },
    20: { 35: 60.53, 40: 46.56, 45: 37.26, 50: 30.27, 55: 23.29, 58: 20.96, 60: 18.63 },
    23: { 35: 76.83, 40: 55.87, 45: 41.92, 50: 32.60, 55: 25.62, 58: 23.29, 60: 20.96 },
    25: { 35: 90.80, 40: 62.86, 45: 46.56, 50: 37.26, 55: 27.95, 58: 25.62, 60: 23.29 },
    30: { 40: 90.80, 45: 60.53, 50: 46.56, 55: 37.26, 58: 30.27, 60: 27.95 },
    35: { 45: 93.13, 50: 62.86, 55: 46.56, 58: 39.57, 60: 34.93 },
    40: { 50: 95.46, 55: 65.19, 58: 51.22, 60: 44.23 },
    45: { 55: 100.12, 58: 69.85, 60: 60.53 }
  }
};

export const STANDARD_ENTRY_AGES = [19, 20, 23, 25, 30, 35, 40, 45];
export const STANDARD_MATURITY_AGES = [35, 40, 45, 50, 55, 58, 60];

// ==========================================
// 2. ACTUARIAL TABULAR LOOKUP & INTERPOLATION
// ==========================================

/**
 * Exact tabular lookup with bilinear interpolation for intermediate ages/maturities
 */
export function getModalTabularUnitRate(
  scheme: PolicyCategory | string,
  mode: PaymentMode,
  entryAge: number,
  maturityAge: number
): number {
  const isPLI = typeof scheme === 'string' && (scheme.toUpperCase().includes('PLI') || scheme.toUpperCase() === 'EA' || scheme.includes('santosh'));
  const table = isPLI ? PLI_TABULAR_RATES[mode] : RPLI_TABULAR_RATES[mode];

  // 1. Direct match
  if (table[entryAge] && table[entryAge][maturityAge] !== undefined) {
    return table[entryAge][maturityAge];
  }

  // 2. Find closest bounding entry ages and maturity ages for smooth interpolation
  const sortedEntryAges = STANDARD_ENTRY_AGES;
  const sortedMatAges = STANDARD_MATURITY_AGES;

  const validMatAge = Math.max(35, Math.min(60, maturityAge));
  const validEntryAge = Math.max(19, Math.min(Math.min(45, validMatAge - 1), entryAge));

  // Find lower & upper entry age
  let lowAge = sortedEntryAges[0];
  let highAge = sortedEntryAges[sortedEntryAges.length - 1];

  for (let i = 0; i < sortedEntryAges.length; i++) {
    if (sortedEntryAges[i] <= validEntryAge) lowAge = sortedEntryAges[i];
    if (sortedEntryAges[i] >= validEntryAge) {
      highAge = sortedEntryAges[i];
      break;
    }
  }

  // Find lower & upper maturity age
  let lowMat = sortedMatAges[0];
  let highMat = sortedMatAges[sortedMatAges.length - 1];

  for (let i = 0; i < sortedMatAges.length; i++) {
    if (sortedMatAges[i] <= validMatAge) lowMat = sortedMatAges[i];
    if (sortedMatAges[i] >= validMatAge) {
      highMat = sortedMatAges[i];
      break;
    }
  }

  const getExactOrFallback = (a: number, m: number): number => {
    if (table[a] && table[a][m] !== undefined) return table[a][m];
    // Fallback: estimate from monthly tabular formula
    const term = Math.max(1, m - a);
    const savings = (5000 / (term * 12)) * (isPLI ? 0.92 : 0.92 / 5);
    const mortality = (0.75 + (a * 0.075)) * (isPLI ? 1 : 0.2);
    const mRate = savings + mortality;
    if (mode === 'quarterly') return mRate * 3;
    if (mode === 'halfYearly') return mRate * 6 * 0.99;
    if (mode === 'annual') return mRate * 12 * 0.98;
    return mRate;
  };

  const q11 = getExactOrFallback(lowAge, lowMat);
  const q12 = getExactOrFallback(lowAge, highMat);
  const q21 = getExactOrFallback(highAge, lowMat);
  const q22 = getExactOrFallback(highAge, highMat);

  // If exact grid point
  if (lowAge === highAge && lowMat === highMat) return q11;

  // Single dimension interpolation
  if (lowAge === highAge) {
    const t = (validMatAge - lowMat) / (highMat - lowMat || 1);
    return q11 + t * (q12 - q11);
  }

  if (lowMat === highMat) {
    const t = (validEntryAge - lowAge) / (highAge - lowAge || 1);
    return q11 + t * (q21 - q11);
  }

  // 2D Bilinear interpolation
  const tx = (validEntryAge - lowAge) / (highAge - lowAge);
  const ty = (validMatAge - lowMat) / (highMat - lowMat);

  const interpolated = (1 - tx) * (1 - ty) * q11 +
                       tx * (1 - ty) * q21 +
                       (1 - tx) * ty * q12 +
                       tx * ty * q22;

  return Number(interpolated.toFixed(2));
}

// ==========================================
// 3. DATE OF BIRTH & AGE NEXT BIRTHDAY (ANB)
// ==========================================

/**
 * Calculates Age Next Birthday (ANB) from Date of Birth
 * In insurance actuarial practice:
 * If exact age is X years and Y days (Y > 0), Age Next Birthday is X + 1.
 */
export function calculateAgeNextBirthdayFromDOB(dobString: string, asOfDate: Date = new Date()): number {
  if (!dobString) return 28;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 28;
  
  let age = asOfDate.getFullYear() - dob.getFullYear();
  const m = asOfDate.getMonth() - dob.getMonth();
  const isBeforeBirthday = m < 0 || (m === 0 && asOfDate.getDate() < dob.getDate());
  const exactAge = isBeforeBirthday ? age - 1 : age;
  const isExactBirthday = m === 0 && asOfDate.getDate() === dob.getDate();
  
  return isExactBirthday ? Math.max(1, exactAge) : Math.max(1, exactAge + 1);
}

// ==========================================
// 4. CORE ENGINE INTERFACES & CALCULATIONS
// ==========================================

export interface PolicyQuoteResult {
  category: PolicyCategory;
  schemeName: string;
  entryAge: number; // Age Next Birthday
  maturityAge: number;
  term: number; // maturityAge - entryAge
  sumAssured: number;
  multiplier: number; // SA / 5000 (PLI) or SA / 1000 (RPLI)
  paymentMode: PaymentMode;
  modeMonths: number; // 1, 3, 6, 12
  unitTabularRate: number; // Tabular unit rate from PDF
  grossModalPremium: number; // Unit Rate * Multiplier
  monthlySARebate: number; // (SA / 100000) * 5
  modalSARebate: number; // Monthly Rebate * modeMonths
  netModalPremium: number; // Gross Modal - Modal SA Rebate
  gstRate: number; // 0% (NIL)
  gstAmount: number; // 0
  annualizedCost: number; // Net Modal Premium * (12 / modeMonths)
  totalPremiumPaidOverTerm: number; // Net Modal Premium * ((term * 12) / modeMonths)
  annualBonusRate: number; // ₹52 (PLI) or ₹48 (RPLI) per ₹1000 SA / yr
  reversionaryBonus: number; // (SA / 1000) * bonusRate * Term
  terminalBonus: number; // If Term >= 20: min(1000, (SA / 10000) * 20), else 0
  totalBonus: number; // Reversionary + Terminal
  totalMaturityPayout: number; // SA + Reversionary Bonus + Terminal Bonus
  netProfit: number; // Total Maturity Payout - Total Premium Paid
  wealthMultiplier: string; // e.g. "2.4x Growth"
}

export interface ModalComparisonRow {
  mode: PaymentMode;
  modeLabel: string;
  modeMonths: number;
  frequencyName: string;
  unitRate: number;
  multiplier: number;
  grossPremium: number;
  highSARebate: number;
  netPayablePremium: number;
  annualizedPremium: number;
  totalTermPremium: number;
  termSavingsVsMonthly: number;
  annualSavingsVsMonthly: number;
}

export interface ModalComparisonTable {
  category: PolicyCategory;
  schemeName: string;
  entryAge: number;
  maturityAge: number;
  term: number;
  sumAssured: number;
  rows: ModalComparisonRow[];
  totalMaturityPayout: number;
  reversionaryBonus: number;
  terminalBonus: number;
  netProfitAnnualMode: number;
  maxModalSavings: number; // Monthly total term paid - Annual total term paid
}

/**
 * 1. Helper function: calculatePLIPolicy
 * Calculates single modal policy quote strictly following official PDF rules.
 */
export function calculatePLIPolicy(
  dobOrAge: string | number,
  sumAssured: number,
  maturityAge: number,
  mode: PaymentMode = 'monthly',
  scheme: PolicyCategory | string = 'PLI'
): PolicyQuoteResult {
  const sa = Math.max(0, sumAssured || 0);
  const entryAge = typeof dobOrAge === 'number' 
    ? dobOrAge 
    : calculateAgeNextBirthdayFromDOB(dobOrAge);
  
  const term = Math.max(1, maturityAge - entryAge);
  const isPLI = typeof scheme === 'string' && (scheme.toUpperCase().includes('PLI') || scheme.toUpperCase() === 'EA' || scheme.includes('santosh'));
  const category: PolicyCategory = isPLI ? 'PLI' : 'RPLI';
  const plan = getPlanById(isPLI ? 'pli_santosh' : 'rpli_santosh');

  // Multiplier Factor: PLI = SA / 5000, RPLI = SA / 1000
  const multiplier = isPLI ? sa / 5000 : sa / 1000;

  // Mode Frequency in months
  const modeMonthsMap: Record<PaymentMode, number> = {
    monthly: 1,
    quarterly: 3,
    halfYearly: 6,
    annual: 12
  };
  const modeMonths = modeMonthsMap[mode] || 1;

  // Gross Modal Premium: Unit Table Rate * Multiplier (Exact from PDF)
  const unitTabularRate = getModalTabularUnitRate(category, mode, entryAge, maturityAge);
  const grossModalPremium = Number((unitTabularRate * multiplier).toFixed(2));

  // High Sum Assured Rebate Engine:
  // Monthly Rebate: (Sum Assured / 100000) * 5
  const monthlySARebate = Math.floor((sa / 100000) * 5);
  // Modal SA Rebate: Monthly Rebate * modeMonths
  const modalSARebate = monthlySARebate * modeMonths;

  // Net Modal Premium: Gross Modal Premium - Modal SA Rebate (0% GST)
  const netModalPremium = Math.max(0, Number((grossModalPremium - modalSARebate).toFixed(2)));

  // Financial Projections
  const installmentsPerYear = 12 / modeMonths;
  const totalInstallments = (term * 12) / modeMonths;
  const annualizedCost = Number((netModalPremium * installmentsPerYear).toFixed(2));
  const totalPremiumPaidOverTerm = Number((netModalPremium * totalInstallments).toFixed(2));

  // Bonus & Maturity Engine
  // Simple Reversionary Bonus: (SA / 1000) * bonusRate * Term
  const reversionaryBonus = Math.round((sa / 1000) * plan.bonusRate * term);

  // Terminal Bonus: Applies ONLY if Term >= 20 years. Rate: ₹20 / ₹10,000 SA capped at ₹1,000.
  const terminalBonus = term >= 20 
    ? Math.min(1000, Math.round((sa / 10000) * 20))
    : 0;

  const totalBonus = reversionaryBonus + terminalBonus;
  const totalMaturityPayout = sa + totalBonus;
  const netProfit = Math.max(0, totalMaturityPayout - totalPremiumPaidOverTerm);
  const multiplierNum = totalPremiumPaidOverTerm > 0 ? (totalMaturityPayout / totalPremiumPaidOverTerm) : 1;
  const wealthMultiplier = `${multiplierNum.toFixed(2)}x Growth`;

  return {
    category,
    schemeName: plan.name,
    entryAge,
    maturityAge,
    term,
    sumAssured: sa,
    multiplier,
    paymentMode: mode,
    modeMonths,
    unitTabularRate,
    grossModalPremium,
    monthlySARebate,
    modalSARebate,
    netModalPremium,
    gstRate: 0,
    gstAmount: 0,
    annualizedCost,
    totalPremiumPaidOverTerm,
    annualBonusRate: plan.bonusRate,
    reversionaryBonus,
    terminalBonus,
    totalBonus,
    totalMaturityPayout,
    netProfit,
    wealthMultiplier
  };
}

/**
 * 2. Helper function: getComparisonTable
 * Returns complete side-by-side modal figures across all 4 modes (Monthly, Quarterly, Half-Yearly, Annual)
 * with exact unit rates, gross premiums, high SA deductions, net amounts, and total modal savings.
 */
export function getComparisonTable(
  dobOrAge: string | number,
  sumAssured: number,
  maturityAge: number,
  scheme: PolicyCategory | string = 'PLI'
): ModalComparisonTable {
  const sa = Math.max(0, sumAssured || 0);
  const entryAge = typeof dobOrAge === 'number' 
    ? dobOrAge 
    : calculateAgeNextBirthdayFromDOB(dobOrAge);
  const term = Math.max(1, maturityAge - entryAge);
  const isPLI = typeof scheme === 'string' && (scheme.toUpperCase().includes('PLI') || scheme.toUpperCase() === 'EA' || scheme.includes('santosh'));
  const category: PolicyCategory = isPLI ? 'PLI' : 'RPLI';
  const plan = getPlanById(isPLI ? 'pli_santosh' : 'rpli_santosh');

  const modes: PaymentMode[] = ['monthly', 'quarterly', 'halfYearly', 'annual'];
  const modeLabels: Record<PaymentMode, string> = {
    monthly: 'Monthly (1M)',
    quarterly: 'Quarterly (3M)',
    halfYearly: 'Half-Yearly (6M)',
    annual: 'Yearly / Annual (12M)'
  };
  const frequencyNames: Record<PaymentMode, string> = {
    monthly: '12 payments / yr',
    quarterly: '4 payments / yr',
    halfYearly: '2 payments / yr',
    annual: '1 payment / yr'
  };

  const results = modes.map(m => calculatePLIPolicy(entryAge, sa, maturityAge, m, category));
  const monthlyTotalTerm = results[0].totalPremiumPaidOverTerm;
  const monthlyAnnualized = results[0].annualizedCost;

  const rows: ModalComparisonRow[] = results.map(r => ({
    mode: r.paymentMode,
    modeLabel: modeLabels[r.paymentMode],
    modeMonths: r.modeMonths,
    frequencyName: frequencyNames[r.paymentMode],
    unitRate: r.unitTabularRate,
    multiplier: r.multiplier,
    grossPremium: r.grossModalPremium,
    highSARebate: r.modalSARebate,
    netPayablePremium: r.netModalPremium,
    annualizedPremium: r.annualizedCost,
    totalTermPremium: r.totalPremiumPaidOverTerm,
    termSavingsVsMonthly: Math.max(0, Number((monthlyTotalTerm - r.totalPremiumPaidOverTerm).toFixed(2))),
    annualSavingsVsMonthly: Math.max(0, Number((monthlyAnnualized - r.annualizedCost).toFixed(2)))
  }));

  const reversionaryBonus = results[0].reversionaryBonus;
  const terminalBonus = results[0].terminalBonus;
  const totalMaturityPayout = results[0].totalMaturityPayout;
  const annualTotalTerm = results[3].totalPremiumPaidOverTerm;
  const netProfitAnnualMode = Math.max(0, totalMaturityPayout - annualTotalTerm);
  const maxModalSavings = Math.max(0, Number((monthlyTotalTerm - annualTotalTerm).toFixed(2)));

  return {
    category,
    schemeName: plan.name,
    entryAge,
    maturityAge,
    term,
    sumAssured: sa,
    rows,
    totalMaturityPayout,
    reversionaryBonus,
    terminalBonus,
    netProfitAnnualMode,
    maxModalSavings
  };
}

// ==========================================
// 5. BACKWARD-COMPATIBLE ADAPTERS FOR UI
// ==========================================

export interface PremiumEstimate {
  multiplier: number;
  monthlyTabularRatePer5k: number;
  quarterlyTabularRatePer5k: number;
  halfYearlyTabularRatePer5k: number;
  annualTabularRatePer5k: number;
  grossMonthly: number;
  grossQuarterly: number;
  grossHalfYearly: number;
  grossYearly: number;
  monthlyRebateSA: number;
  quarterlyRebateSA: number;
  halfYearlyRebateSA: number;
  annualRebateSA: number;
  annualSARebateTotal: number;
  monthly: number;
  quarterly: number;
  halfYearlyGross: number;
  halfYearlyDiscount: number;
  halfYearly: number;
  yearlyGross: number;
  yearlyDiscount: number;
  yearly: number;
  gstRate: number;
  gstAmount: number;
}

export interface QuoteMathResult {
  dailyCost: number;
  totalInstallments: number;
  totalMonthlyPaid: number;
  totalAnnualPaid: number;
  totalPremiumPaid: number;
  modeSavings: number;
  reversionaryBonus: number;
  terminalBonus: number;
  totalBonus: number;
  estimatedMaturity: number;
  bonusProfit: number;
  wealthMultiplier: string;
  multiplierNum: number;
  monthlySARebate: number;
  yearlySARebate: number;
  totalSARebateOverTerm: number;
  halfYearlyAdvanceDiscount: number;
  yearlyAdvanceDiscount: number;
  gstPolicy: string;
  tax80CEligibleAmount: number;
  estimatedTaxSavings: number;
  taxRebateSummary: string;
}

export function estimateMonthlyPremium(
  category: PolicyCategory,
  planId: string,
  entryAge: number,
  term: number,
  sumAssured: number
): PremiumEstimate {
  const sa = Math.max(0, sumAssured || 0);
  const maturityAge = entryAge + term;
  
  const mQuote = calculatePLIPolicy(entryAge, sa, maturityAge, 'monthly', category);
  const qQuote = calculatePLIPolicy(entryAge, sa, maturityAge, 'quarterly', category);
  const hQuote = calculatePLIPolicy(entryAge, sa, maturityAge, 'halfYearly', category);
  const yQuote = calculatePLIPolicy(entryAge, sa, maturityAge, 'annual', category);

  const halfYearlyDiscount = Math.max(0, (mQuote.netModalPremium * 6) - hQuote.netModalPremium);
  const yearlyDiscount = Math.max(0, (mQuote.netModalPremium * 12) - yQuote.netModalPremium);

  return {
    multiplier: mQuote.multiplier,
    monthlyTabularRatePer5k: mQuote.unitTabularRate,
    quarterlyTabularRatePer5k: qQuote.unitTabularRate,
    halfYearlyTabularRatePer5k: hQuote.unitTabularRate,
    annualTabularRatePer5k: yQuote.unitTabularRate,
    grossMonthly: mQuote.grossModalPremium,
    grossQuarterly: qQuote.grossModalPremium,
    grossHalfYearly: hQuote.grossModalPremium,
    grossYearly: yQuote.grossModalPremium,
    monthlyRebateSA: mQuote.modalSARebate,
    quarterlyRebateSA: qQuote.modalSARebate,
    halfYearlyRebateSA: hQuote.modalSARebate,
    annualRebateSA: yQuote.modalSARebate,
    annualSARebateTotal: yQuote.modalSARebate,
    monthly: mQuote.netModalPremium,
    quarterly: qQuote.netModalPremium,
    halfYearlyGross: hQuote.grossModalPremium,
    halfYearlyDiscount,
    halfYearly: hQuote.netModalPremium,
    yearlyGross: yQuote.grossModalPremium,
    yearlyDiscount,
    yearly: yQuote.netModalPremium,
    gstRate: 0,
    gstAmount: 0
  };
}

export function calculateQuoteMath(
  sumAssured: number,
  term: number,
  bonusRate: number,
  monthlyPremium: number,
  yearlyPremium?: number
): QuoteMathResult {
  const sa = Math.max(0, sumAssured || 0);
  const years = Math.max(1, term || 1);
  const monthly = Math.max(0, monthlyPremium || 0);

  const totalInstallments = years * 12;

  // High SA Rebate: ₹1/mo per ₹20,000 SA = ₹5/mo per ₹1,00,000 SA
  const monthlySARebate = Math.floor((sa / 100000) * 5);
  const yearlySARebate = monthlySARebate * 12;
  const totalSARebateOverTerm = yearlySARebate * years;

  const halfYearlyAdvanceDiscount = Math.round((monthly * 6) * 0.01);
  const yearlyAdvanceDiscount = Math.round((monthly * 12) * 0.02);

  const yearly = yearlyPremium && yearlyPremium > 0 
    ? yearlyPremium 
    : Math.round((monthly * 12) - yearlyAdvanceDiscount);

  const dailyCost = yearly > 0 ? Math.round(yearly / 365) : Math.round(monthly / 30);

  const totalMonthlyPaid = monthly * totalInstallments;
  const totalAnnualPaid = yearly * years;
  const totalPremiumPaid = totalAnnualPaid;
  const modeSavings = Math.max(0, totalMonthlyPaid - totalAnnualPaid);

  // Simple Reversionary Bonus = (SA / 1000) * bonusRate * Term
  const reversionaryBonus = Math.round((bonusRate * (sa / 1000)) * years);

  // Terminal Bonus: Applies ONLY if Policy Term >= 20 years. Rate: ₹20 per ₹10,000 SA capped at ₹1,000.
  const terminalBonus = years >= 20 
    ? Math.min(1000, Math.round((sa / 10000) * 20))
    : 0;

  const totalBonus = reversionaryBonus + terminalBonus;
  const estimatedMaturity = sa + totalBonus;
  const bonusProfit = Math.max(0, estimatedMaturity - totalPremiumPaid);

  const multiplierNum = totalPremiumPaid > 0 ? (estimatedMaturity / totalPremiumPaid) : 1;
  const wealthMultiplier = multiplierNum.toFixed(1) + 'x Growth';

  const gstPolicy = '0% GST (NIL - Gazette Life Insurance Exemption)';
  const tax80CEligibleAmount = Math.min(150000, yearly);
  const estimatedTaxSavings = Math.round(tax80CEligibleAmount * 0.20);
  const taxRebateSummary = 'Section 80C Tax Deduction up to ₹1.5 Lakhs + 100% Tax-Free Maturity Payout under Section 10(10D)';

  return {
    dailyCost,
    totalInstallments,
    totalMonthlyPaid,
    totalAnnualPaid,
    totalPremiumPaid,
    modeSavings,
    reversionaryBonus,
    terminalBonus,
    totalBonus,
    estimatedMaturity,
    bonusProfit,
    wealthMultiplier,
    multiplierNum,
    monthlySARebate,
    yearlySARebate,
    totalSARebateOverTerm,
    halfYearlyAdvanceDiscount,
    yearlyAdvanceDiscount,
    gstPolicy,
    tax80CEligibleAmount,
    estimatedTaxSavings,
    taxRebateSummary
  };
}

// Indian currency formatter (₹ 12,50,000)
export function formatINR(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '₹ 0';
  const num = Math.round(val);
  return '₹ ' + num.toLocaleString('en-IN');
}
