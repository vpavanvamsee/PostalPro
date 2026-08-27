import { ThemeType } from '../types';

export interface ThemeDefinition {
  id: ThemeType;
  name: string;
  badge: string;
  description: string;
  isLight?: boolean;
  isRetro?: boolean;
  bg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  headerBg: string;
  headerBorder: string;
  headerText: string;
  headerTagline: string;
  headerNavActive: string;
  headerNavInactive: string;
  headerButton: string;
  brandTextPrimary: string;
  brandTextAccent: string;
  pillBg: string;
  pillText: string;
  buttonPrimary: string;
  buttonSecondary: string;
  tagColor: string;
  highlightCardBg: string;
  previewColors: {
    bg: string;
    header: string;
    accent: string;
  };
}

export const THEME_CONFIGS: Record<ThemeType, ThemeDefinition> = {
  // 1. Retro Warm Paper / Vintage Cream (Default)
  retroCream: {
    id: 'retroCream',
    name: 'Retro Warm Cream',
    badge: 'Vintage Postal',
    description: 'Vintage postal stationery background with sharp dark typography & terracotta accents',
    isLight: true,
    isRetro: true,
    bg: 'bg-[#FAF5EB] text-[#1E1B18]',
    cardBg: 'bg-white',
    cardBorder: 'border-[#E6DCB8]',
    textPrimary: 'text-[#1A1815]',
    textSecondary: 'text-[#6B6358]',
    accent: 'text-[#F95724]',
    accentBg: 'bg-[#F95724]',
    accentBorder: 'border-[#F95724]',
    headerBg: 'bg-[#FAF5EB]/98 border-b border-[#E6DCB8]',
    headerBorder: 'border-[#E6DCB8]',
    headerText: 'text-[#1E1B18]',
    headerTagline: 'text-[#6B6358]',
    headerNavActive: 'bg-[#FEECE6] text-[#F95724] font-black border border-[#FFBB96]',
    headerNavInactive: 'text-[#6B6358] hover:text-[#1A1815] hover:bg-[#F4ECE0]',
    headerButton: 'bg-white hover:bg-[#F5EFE0] border-[#E6DCB8] text-[#1E1B18] shadow-sm',
    brandTextPrimary: 'text-[#1A1815]',
    brandTextAccent: 'text-[#F95724]',
    pillBg: 'bg-[#FEECE6]',
    pillText: 'text-[#F95724]',
    buttonPrimary: 'bg-[#F95724] hover:bg-[#E04515] text-white shadow-orange-500/20 font-black',
    buttonSecondary: 'bg-white hover:bg-[#F5EFE0] text-[#1E1B18] border border-[#D9CEBC] font-bold',
    tagColor: 'bg-[#FEECE6] text-[#D4380D] border-[#FFBB96]',
    highlightCardBg: 'bg-white border-[#E0D4C0] shadow-sm',
    previewColors: {
      bg: '#FAF5EB',
      header: '#F4ECE0',
      accent: '#F95724'
    }
  },

  // 2. Postal Emerald (Official India Post Green)
  emerald: {
    id: 'emerald',
    name: 'Postal Emerald',
    badge: 'Official Green',
    description: 'Traditional Indian Post green with warm gold & amber accents',
    isLight: false,
    bg: 'bg-[#031E17] text-emerald-50',
    cardBg: 'bg-[#062D23]',
    cardBorder: 'border-emerald-800/60',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-200/80',
    accent: 'text-amber-400',
    accentBg: 'bg-emerald-800',
    accentBorder: 'border-emerald-600',
    headerBg: 'bg-[#04241C]/98 border-b border-emerald-800/60',
    headerBorder: 'border-emerald-800/60',
    headerText: 'text-white',
    headerTagline: 'text-emerald-300/80',
    headerNavActive: 'bg-emerald-500/25 text-amber-300 font-bold border border-amber-400/40',
    headerNavInactive: 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40',
    headerButton: 'bg-black/30 hover:bg-black/50 border-emerald-700/60 text-white',
    brandTextPrimary: 'text-white',
    brandTextAccent: 'text-amber-400',
    pillBg: 'bg-emerald-500/20',
    pillText: 'text-emerald-300',
    buttonPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-950/60',
    buttonSecondary: 'bg-[#0B3A2E] hover:bg-[#0E493B] text-emerald-100 border border-emerald-700/60',
    tagColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    highlightCardBg: 'bg-gradient-to-br from-[#0B3A2E] to-[#04241C] border-emerald-700/50',
    previewColors: {
      bg: '#031E17',
      header: '#062D23',
      accent: '#f59e0b'
    }
  },

  // 3. India Post Classic Red & Gold
  indiaPostRed: {
    id: 'indiaPostRed',
    name: 'India Post Carmine Red',
    badge: 'Iconic Post',
    description: 'Iconic India Post deep carmine red with royal amber and crisp contrast',
    isLight: false,
    bg: 'bg-[#1A0A0C] text-rose-50',
    cardBg: 'bg-[#280F12]',
    cardBorder: 'border-rose-900/60',
    textPrimary: 'text-white',
    textSecondary: 'text-rose-200/80',
    accent: 'text-amber-400',
    accentBg: 'bg-[#C41230]',
    accentBorder: 'border-rose-700',
    headerBg: 'bg-[#200C0F]/98 border-b border-rose-900/60',
    headerBorder: 'border-rose-900/60',
    headerText: 'text-white',
    headerTagline: 'text-rose-300/80',
    headerNavActive: 'bg-rose-900/60 text-amber-300 font-bold border border-amber-400/40',
    headerNavInactive: 'text-rose-100/80 hover:text-white hover:bg-rose-900/40',
    headerButton: 'bg-black/30 hover:bg-black/50 border-rose-800/60 text-white',
    brandTextPrimary: 'text-white',
    brandTextAccent: 'text-amber-400',
    pillBg: 'bg-rose-900/40',
    pillText: 'text-rose-300',
    buttonPrimary: 'bg-[#C41230] hover:bg-[#A30D26] text-white shadow-rose-950/60 font-black',
    buttonSecondary: 'bg-[#3A161A] hover:bg-[#4D1D23] text-rose-100 border border-rose-800/60',
    tagColor: 'bg-rose-900/50 text-rose-300 border-rose-700/50',
    highlightCardBg: 'bg-gradient-to-br from-[#3A161A] to-[#1A0A0C] border-rose-800/60',
    previewColors: {
      bg: '#1A0A0C',
      header: '#280F12',
      accent: '#fbbf24'
    }
  },

  // 4. Midnight Dark Postal Navy
  midnightNavy: {
    id: 'midnightNavy',
    name: 'Midnight Postal Navy',
    badge: 'Deep Modern',
    description: 'Deep midnight blue with futuristic cyan & gold neon glow',
    isLight: false,
    bg: 'bg-[#0A1128] text-slate-100',
    cardBg: 'bg-[#121F42]',
    cardBorder: 'border-blue-900/60',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-600',
    accentBorder: 'border-cyan-500',
    headerBg: 'bg-[#0D1735]/98 border-b border-blue-900/60',
    headerBorder: 'border-blue-900/60',
    headerText: 'text-white',
    headerTagline: 'text-slate-300',
    headerNavActive: 'bg-blue-900/60 text-cyan-300 font-bold border border-cyan-400/40',
    headerNavInactive: 'text-slate-300 hover:text-white hover:bg-blue-900/40',
    headerButton: 'bg-black/30 hover:bg-black/50 border-blue-800/60 text-white',
    brandTextPrimary: 'text-white',
    brandTextAccent: 'text-cyan-400',
    pillBg: 'bg-cyan-500/20',
    pillText: 'text-cyan-300',
    buttonPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-cyan-950/50',
    buttonSecondary: 'bg-[#1A2C5B] hover:bg-[#233A75] text-cyan-100 border border-cyan-800/60',
    tagColor: 'bg-cyan-950/70 text-cyan-300 border-cyan-700/50',
    highlightCardBg: 'bg-gradient-to-br from-[#1A2C5B] to-[#0D1735] border-cyan-600/40',
    previewColors: {
      bg: '#0A1128',
      header: '#121F42',
      accent: '#06b6d4'
    }
  },

  // 5. Clean Modern Minimalist Slate
  cleanSlate: {
    id: 'cleanSlate',
    name: 'Clean Modern Slate',
    badge: 'Clean Tech',
    description: 'Crisp light slate background with high-contrast cobalt & indigo accents',
    isLight: true,
    bg: 'bg-[#F4F6F9] text-slate-900',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    accent: 'text-indigo-600',
    accentBg: 'bg-indigo-600',
    accentBorder: 'border-indigo-500',
    headerBg: 'bg-white/98 border-b border-slate-300',
    headerBorder: 'border-slate-300',
    headerText: 'text-slate-900',
    headerTagline: 'text-slate-500',
    headerNavActive: 'bg-indigo-50 text-indigo-700 font-black border border-indigo-200',
    headerNavInactive: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    headerButton: 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm',
    brandTextPrimary: 'text-slate-950',
    brandTextAccent: 'text-indigo-600',
    pillBg: 'bg-indigo-50',
    pillText: 'text-indigo-700',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 font-black',
    buttonSecondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    highlightCardBg: 'bg-white border-indigo-200 shadow-sm',
    previewColors: {
      bg: '#F4F6F9',
      header: '#ffffff',
      accent: '#4f46e5'
    }
  },

  // 6. Saffron & Forest Green Postal Pride
  saffronPride: {
    id: 'saffronPride',
    name: 'Saffron Postal Pride',
    badge: 'National Pride',
    description: 'Rich royal saffron and deep forest green reflecting postal heritage',
    isLight: false,
    bg: 'bg-[#121810] text-emerald-50',
    cardBg: 'bg-[#1A2417]',
    cardBorder: 'border-emerald-800/60',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-200/80',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-600',
    accentBorder: 'border-amber-500',
    headerBg: 'bg-[#151F12]/98 border-b border-emerald-800/60',
    headerBorder: 'border-emerald-800/60',
    headerText: 'text-white',
    headerTagline: 'text-emerald-300/80',
    headerNavActive: 'bg-amber-500/25 text-amber-300 font-bold border border-amber-400/40',
    headerNavInactive: 'text-emerald-100/80 hover:text-white hover:bg-emerald-950/40',
    headerButton: 'bg-black/30 hover:bg-black/50 border-emerald-800/60 text-white',
    brandTextPrimary: 'text-white',
    brandTextAccent: 'text-amber-400',
    pillBg: 'bg-amber-500/20',
    pillText: 'text-amber-300',
    buttonPrimary: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black shadow-orange-950/50',
    buttonSecondary: 'bg-[#253521] hover:bg-[#31462C] text-amber-100 border border-emerald-700/60',
    tagColor: 'bg-amber-950/70 text-amber-300 border-amber-700/50',
    highlightCardBg: 'bg-gradient-to-br from-[#253521] to-[#121810] border-amber-600/40',
    previewColors: {
      bg: '#121810',
      header: '#1A2417',
      accent: '#f59e0b'
    }
  }
};
