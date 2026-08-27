import { PostalToolItem } from '../types';

export const POSTAL_TOOLS: PostalToolItem[] = [
  {
    id: 'td-bill-gen',
    title: 'TD Bill Generator',
    badge: 'Official 20/Page A4',
    category: 'Official Utilities',
    description: 'Instant 1Y/2Y/3Y/5Y BPM TD incentive bill creator with 12-digit Finacle validation & signatures.',
    iconName: 'Receipt',
    targetView: 'tdbill',
    externalUrl: 'https://postalpro.in/tdbill/',
    featured: true
  },
  {
    id: 'pli-leads-pro',
    title: 'PLI Leads & Quote Pro',
    badge: 'Hot WebApp',
    category: 'Marketing',
    description: 'Endowment, Whole Life, Yugal Suraksha & Gram Priya instant premium calculation & lead manager.',
    iconName: 'ShieldCheck',
    targetView: 'plileads',
    externalUrl: 'https://postalpro.in/plileads/',
    featured: true
  }
];

