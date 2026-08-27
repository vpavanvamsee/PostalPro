import React from 'react';
import { Palette, Check, X } from 'lucide-react';
import { THEME_CONFIGS, ThemeDefinition } from '../utils/themeConfig';
import { ThemeType } from '../types';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92dvh] sm:max-h-[88dvh] bg-slate-900 border border-slate-800 text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Select Visual Color Theme
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
                Includes Retro Warm Cream (Default), Saffron Postal Pride & 4 postal palettes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Theme Modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes Grid - Scrolls smoothly across all devices */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
          {Object.values(THEME_CONFIGS).map((th: ThemeDefinition) => {
            const isSelected = currentTheme === th.id;

            return (
              <div
                key={th.id}
                onClick={() => {
                  onSelectTheme(th.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between min-h-[148px] ${
                  isSelected
                    ? 'border-amber-400 bg-slate-800/95 shadow-lg ring-2 ring-amber-400/25'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Upper Content: Swatches, Title & Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs" 
                        style={{ backgroundColor: th.previewColors.bg }} 
                        title="Background color"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs" 
                        style={{ backgroundColor: th.previewColors.header }} 
                        title="Header color"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs" 
                        style={{ backgroundColor: th.previewColors.accent }} 
                        title="Accent color"
                      />
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Active
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-black tracking-tight">
                      {th.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      {th.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Mockup Visual Bar */}
                <div 
                  className="mt-3.5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs shadow-xs"
                  style={{ backgroundColor: th.previewColors.bg, color: th.isLight ? '#0F172A' : '#FFFFFF' }}
                >
                  <span className="font-black text-xs tracking-tight">
                    POSTAL<span style={{ color: th.previewColors.accent }}>PRO</span>
                  </span>
                  <span 
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: th.previewColors.accent }}
                  >
                    Action
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="truncate pr-2">Theme preference persists automatically in your browser.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer shrink-0"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
