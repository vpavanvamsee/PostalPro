import React from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Info, 
  CheckCircle2 
} from 'lucide-react';
import { 
  ABOUT_US_DATA, 
  PUBLIC_NOTICE_DATA, 
  PRIVACY_POLICY_DATA 
} from '../data/legalContents';
import { AppView } from '../types';
import { ThemeDefinition } from '../utils/themeConfig';

interface LegalModalsProps {
  currentModal: AppView | null;
  onClose: () => void;
  themeObj: ThemeDefinition;
  onNavigate: (view: AppView) => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({
  currentModal,
  onClose,
  themeObj
}) => {
  if (!currentModal || !['about', 'privacy', 'publicNotice'].includes(currentModal)) {
    return null;
  }

  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  // Dynamic High-Contrast Color Variables based on current theme
  const modalBg = isRetro ? 'bg-[#FAF5EB]' : isLight ? 'bg-slate-50' : 'bg-slate-900';
  const modalBorder = isRetro ? 'border-[#E0D5C1]' : isLight ? 'border-slate-200' : 'border-slate-800';
  const headerBg = isRetro ? 'bg-white' : isLight ? 'bg-white' : 'bg-slate-950/90';
  const headerBorder = isRetro ? 'border-[#E6DCB8]' : isLight ? 'border-slate-200' : 'border-slate-800';
  const cardBg = isRetro ? 'bg-white' : isLight ? 'bg-white' : 'bg-slate-950/70';
  const cardBorder = isRetro ? 'border-[#E5DEC9]' : isLight ? 'border-slate-200' : 'border-slate-800';
  
  // Strict text colors ensuring high contrast (WCAG AAA)
  const titleColor = isLight ? 'text-slate-900 font-black' : 'text-white font-black';
  const subtitleColor = isLight ? 'text-slate-600' : 'text-slate-400';
  const bodyTextColor = isLight ? 'text-slate-800' : 'text-slate-200';
  const mutedTextColor = isLight ? 'text-slate-600' : 'text-slate-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className={`w-full max-w-4xl max-h-[92dvh] sm:max-h-[88dvh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${modalBg} ${modalBorder} my-auto`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${headerBg} ${headerBorder} shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-slate-100' : 'bg-slate-800'
            }`}>
              {currentModal === 'about' && <Info className="w-5 h-5 text-blue-500" />}
              {currentModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
              {currentModal === 'publicNotice' && <FileText className="w-5 h-5 text-amber-500" />}
            </div>

            <div>
              <h3 className={`text-base sm:text-xl ${titleColor} tracking-tight leading-tight`}>
                {currentModal === 'about' && ABOUT_US_DATA.title}
                {currentModal === 'privacy' && PRIVACY_POLICY_DATA.title}
                {currentModal === 'publicNotice' && PUBLIC_NOTICE_DATA.title}
              </h3>
              <p className={`text-[11px] sm:text-xs ${subtitleColor} leading-tight mt-0.5`}>
                {currentModal === 'about' && ABOUT_US_DATA.subtitle}
                {currentModal === 'privacy' && `Last revised: ${PRIVACY_POLICY_DATA.lastUpdated}`}
                {currentModal === 'publicNotice' && `Last revised: ${PUBLIC_NOTICE_DATA.lastUpdated}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 ml-2 ${
              isLight 
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-6 text-sm leading-relaxed flex-1 overscroll-contain">
          
          {/* 1. ABOUT US MODAL */}
          {currentModal === 'about' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-2xl border space-y-2 shadow-xs ${cardBg} ${cardBorder}`}>
                <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                  Our Mission & Vision
                </span>
                <p className={`text-sm sm:text-base font-bold leading-normal ${bodyTextColor}`}>
                  {ABOUT_US_DATA.mission}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className={`text-base sm:text-lg font-black tracking-tight ${titleColor}`}>
                  The Story of PostalPro
                </h4>
                {ABOUT_US_DATA.story.map((para, idx) => (
                  <p key={idx} className={`${bodyTextColor} leading-relaxed text-sm sm:text-base font-normal`}>
                    {para}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                {ABOUT_US_DATA.pillars.map((pillar, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border space-y-1.5 shadow-xs ${cardBg} ${cardBorder}`}
                  >
                    <h5 className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                      {pillar.title}
                    </h5>
                    <p className={`text-xs ${mutedTextColor} leading-relaxed`}>
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PUBLIC NOTICE MODAL */}
          {currentModal === 'publicNotice' && (
            <div className="space-y-5">
              {PUBLIC_NOTICE_DATA.sections.map((sec, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border space-y-3 shadow-xs ${cardBg} ${cardBorder}`}>
                  <h4 className="text-base font-black text-amber-600 dark:text-amber-400">
                    {sec.heading}
                  </h4>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={`${bodyTextColor} leading-relaxed text-sm`}>
                      {p}
                    </p>
                  ))}
                  {sec.bulletPoints && (
                    <ul className="space-y-2 pt-1">
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className={`text-xs sm:text-sm font-medium ${bodyTextColor}`}>
                            {bp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 3. PRIVACY POLICY MODAL */}
          {currentModal === 'privacy' && (
            <div className="space-y-5">
              {PRIVACY_POLICY_DATA.sections.map((sec, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border space-y-3 shadow-xs ${cardBg} ${cardBorder}`}>
                  <h4 className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {sec.heading}
                  </h4>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={`${bodyTextColor} leading-relaxed text-sm`}>
                      {p}
                    </p>
                  ))}
                  {sec.bulletPoints && (
                    <ul className="space-y-2 pt-1">
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className={`text-xs sm:text-sm font-medium ${bodyTextColor}`}>
                            {bp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-3.5 sm:p-4 flex items-center justify-between border-t ${headerBg} ${headerBorder} shrink-0`}>
          <span className={`text-xs ${mutedTextColor}`}>
            PostalPro India • Built with ❤️ for Postal Staff
          </span>
          <button
            onClick={onClose}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-xs ${
              isRetro 
                ? 'bg-[#F95724] text-white hover:bg-[#E04515]' 
                : `${themeObj.buttonPrimary}`
            }`}
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
