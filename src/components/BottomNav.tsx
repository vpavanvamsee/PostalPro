import React from 'react';
import { Home, Wrench, TrendingUp, Palette } from 'lucide-react';
import { AppView } from '../types';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onOpenThemeModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  themeObj,
  t,
  onOpenThemeModal
}) => {
  const isLight = themeObj.isLight;

  const navItems = [
    {
      id: 'home' as AppView,
      label: t.nav.home || 'Home',
      icon: Home,
      action: () => {
        onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentView === 'home'
    },
    {
      id: 'tools' as AppView,
      label: t.nav.tools || 'Tools',
      icon: Wrench,
      action: () => {
        onNavigate('tools');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentView === 'tools'
    },
    {
      id: 'marketing' as AppView,
      label: t.nav.marketing || 'Marketing',
      icon: TrendingUp,
      action: () => {
        onNavigate('marketing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentView === 'marketing'
    },
    {
      id: 'theme' as const,
      label: t.nav.theme || 'Theme',
      icon: Palette,
      action: () => onOpenThemeModal(),
      isActive: false
    }
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden border-t shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-colors duration-200 ${
        isLight 
          ? 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-800' 
          : 'bg-slate-950/95 backdrop-blur-md border-slate-800 text-slate-200'
      }`}
    >
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex-1 py-1 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer select-none relative ${
                active 
                  ? (isLight 
                      ? 'text-amber-600 font-bold' 
                      : 'text-amber-400 font-bold') 
                  : (isLight 
                      ? 'text-slate-500 hover:text-slate-900 font-medium' 
                      : 'text-slate-400 hover:text-slate-200 font-medium')
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${
                active 
                  ? (isLight ? 'bg-amber-100/80 scale-110' : 'bg-amber-400/20 scale-110') 
                  : ''
              }`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] leading-none tracking-tight">
                {item.label}
              </span>
              {active && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-amber-500 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
