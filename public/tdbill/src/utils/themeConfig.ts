import { ThemeType } from '../types';

export interface ThemeColors {
  id: ThemeType;
  name: string;
  badgeBg: string;
  badgeText: string;
  headerBg: string;
  headerBorder: string;
  headerText: string;
  accentBg: string;
  accentHover: string;
  accentText: string;
  accentBorder: string;
  highlightText: string;
  cardBg: string;
  cardBorder: string;
  subHeaderBg: string;
}

export const THEMES: Record<ThemeType, ThemeColors> = {
  emerald: {
    id: 'emerald',
    name: 'Postal Emerald & Gold',
    badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    badgeText: 'text-amber-300',
    headerBg: 'bg-emerald-950',
    headerBorder: 'border-emerald-800',
    headerText: 'text-white',
    accentBg: 'bg-emerald-600',
    accentHover: 'hover:bg-emerald-500',
    accentText: 'text-white',
    accentBorder: 'border-emerald-700',
    highlightText: 'text-emerald-400',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-100',
    subHeaderBg: 'bg-emerald-900/95'
  },
  postalRed: {
    id: 'postalRed',
    name: 'India Post Red & Navy',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-400/40',
    badgeText: 'text-red-300',
    headerBg: 'bg-slate-950',
    headerBorder: 'border-red-900/60',
    headerText: 'text-white',
    accentBg: 'bg-red-600',
    accentHover: 'hover:bg-red-500',
    accentText: 'text-white',
    accentBorder: 'border-red-700',
    highlightText: 'text-red-400',
    cardBg: 'bg-white',
    cardBorder: 'border-red-100',
    subHeaderBg: 'bg-red-950/90'
  },
  royalNavy: {
    id: 'royalNavy',
    name: 'Royal Postal Navy',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    badgeText: 'text-sky-300',
    headerBg: 'bg-slate-900',
    headerBorder: 'border-slate-800',
    headerText: 'text-white',
    accentBg: 'bg-blue-600',
    accentHover: 'hover:bg-blue-500',
    accentText: 'text-white',
    accentBorder: 'border-blue-700',
    highlightText: 'text-sky-400',
    cardBg: 'bg-white',
    cardBorder: 'border-blue-100',
    subHeaderBg: 'bg-slate-950'
  },
  slateDark: {
    id: 'slateDark',
    name: 'High Contrast Dark',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    badgeText: 'text-emerald-300',
    headerBg: 'bg-black',
    headerBorder: 'border-neutral-800',
    headerText: 'text-white',
    accentBg: 'bg-emerald-500',
    accentHover: 'hover:bg-emerald-400',
    accentText: 'text-black',
    accentBorder: 'border-emerald-400',
    highlightText: 'text-emerald-400',
    cardBg: 'bg-neutral-900',
    cardBorder: 'border-neutral-800',
    subHeaderBg: 'bg-neutral-950'
  }
};
