import { AgentProfile, Lead, ProspectTask } from '../types';
import { calculateQuoteMath } from './pliPlans';

export const DEFAULT_AGENT: AgentProfile = {
  name: 'V. S. Prasad Rao',
  designation: 'GDS Branch Postmaster (BPM)',
  branchOffice: 'Chandragiri SO',
  division: 'Tirupati Division',
  phone: '9848022338',
  monthlyTargetSA: 2500000,
  customTagline: 'India Post • 100% Sovereign Safety Since 1884'
};

export const INITIAL_SAMPLE_LEADS: Lead[] = [
  {
    id: 'lead_sample_1',
    name: 'K. Rajesh Varma',
    phone: '9849123456',
    currentAge: 29,
    maturityAge: 58,
    term: 29,
    category: 'PLI',
    planId: 'pli_santosh',
    planName: 'Santosh (Endowment Assurance - EA)',
    sumAssured: 1000000,
    monthlyPremium: 2850,
    quarterlyPremium: 8500,
    halfYearlyPremium: 16900,
    yearlyPremium: 33500,
    dailyCost: 92,
    totalPremiumPaid: 991800,
    estimatedMaturity: 2508000, // SA (10L) + (52 * 1000 * 29) = 10L + 15.08L = 25.08L
    bonusProfit: 1516200,
    wealthMultiplier: '2.5x Growth',
    notes: 'Software Engineer in Hyderabad, interested in Sec 80C tax deduction and safe long term corpus.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead_sample_2',
    name: 'M. Venkata Lakshmi',
    phone: '9440556677',
    currentAge: 32,
    maturityAge: 55,
    term: 23,
    category: 'RPLI',
    planId: 'rpli_santosh',
    planName: 'Gram Santosh (Endowment Assurance - EA)',
    sumAssured: 500000,
    monthlyPremium: 1680,
    quarterlyPremium: 5010,
    halfYearlyPremium: 9980,
    yearlyPremium: 19750,
    dailyCost: 54,
    totalPremiumPaid: 463680,
    estimatedMaturity: 1052000, // SA (5L) + (48 * 500 * 23) = 5L + 5.52L = 10.52L
    bonusProfit: 588320,
    wealthMultiplier: '2.3x Growth',
    notes: 'Teacher at Zilla Parishad High School, Sukanya Samriddhi account holder for daughter.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead_sample_3',
    name: 'G. Srinivasulu Naidu',
    phone: '9988776655',
    currentAge: 35,
    maturityAge: 60,
    term: 25,
    category: 'PLI',
    planId: 'pli_suraksha',
    planName: 'Suraksha (Whole Life Assurance - WLA)',
    sumAssured: 2000000,
    monthlyPremium: 4200,
    quarterlyPremium: 12500,
    halfYearlyPremium: 24900,
    yearlyPremium: 49400,
    dailyCost: 135,
    totalPremiumPaid: 1260000,
    estimatedMaturity: 5800000, // SA (20L) + (76 * 2000 * 25) = 20L + 38L = 58L
    bonusProfit: 4540000,
    wealthMultiplier: '4.6x Growth',
    notes: 'Business owner, interested in whole life coverage with highest industry bonus.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_PROSPECTS: ProspectTask[] = [
  {
    id: 'pros_1',
    category: 'SSA',
    customerName: 'Anitha Reddy (SSA Parent)',
    phone: '9848112233',
    location: 'Chandragiri Counter',
    notes: 'Came for SSA ₹2000 deposit. Showed Bal Jeevan Bima chart for second daughter.',
    completed: true,
    date: new Date().toLocaleDateString('en-GB')
  },
  {
    id: 'pros_2',
    category: 'IPPB',
    customerName: 'K. Subrahmanyam (AEPS / Pensioner)',
    phone: '9440112233',
    location: 'Post Office AEPS Counter',
    notes: 'Withdrew ₹10,000 DBT cash. Explained ₹30/day Gram Santosh micro-savings.',
    completed: false,
    date: new Date().toLocaleDateString('en-GB')
  },
  {
    id: 'pros_3',
    category: 'SHOP',
    customerName: 'Babu Rao (Kirana Merchant)',
    phone: '9988223344',
    location: 'Main Bazaar',
    notes: 'Wants guaranteed maturity for son college in 15 years.',
    completed: false,
    date: new Date().toLocaleDateString('en-GB')
  }
];
