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
  isThemeModalOpen?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  themeObj,
  t,
  onOpenThemeModal,
  isThemeModalOpen = false
}) => {
  const isLight = themeObj.isLight;

  const navItems = [
    {
      id: 'home',
      label: t.nav.home || 'Home',
      icon: Home,
      action: () => {
        onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentView === 'home' && !isThemeModalOpen
    },
    {
      id: 'tools',
      label: t.nav.tools || 'Tools',
      icon: Wrench,
      action: () => {
        onNavigate('tools');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentView === 'tools' && !isThemeModalOpen
    },
    {
      id: 'marketing',
      label: t.nav.marketing || 'Marketing',
      icon: TrendingUp,
      action: () => {
        onNavigate('marketing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentView === 'marketing' && !isThemeModalOpen
    },
    {
      id: 'theme',
      label: t.nav.theme || 'Theme',
      icon: Palette,
      action: onOpenThemeModal,
      isActive: isThemeModalOpen
    }
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className={`fixed bottom-0 inset-x-0 z-50 md:hidden border-t shadow-[0_-4px_25px_rgba(0,0,0,0.08)] transition-colors duration-200 w-full max-w-full pb-safe ${
        isLight 
          ? 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-800' 
          : 'bg-slate-950/95 backdrop-blur-md border-slate-800 text-slate-200'
      }`}
    >
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={item.action}
              className={`flex-1 pt-1.5 pb-1 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 cursor-pointer select-none relative ${
                active 
                  ? (isLight 
                      ? 'text-amber-600 font-semibold' 
                      : 'text-amber-400 font-semibold') 
                  : (isLight 
                      ? 'text-slate-500 hover:text-slate-900 font-medium' 
                      : 'text-slate-400 hover:text-slate-200 font-medium')
              }`}
            >
              {active && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-amber-500 shadow-sm" />
              )}
              <div className="p-0.5">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

