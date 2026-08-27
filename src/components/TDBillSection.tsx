import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Sparkles, 
  Printer, 
  ShieldCheck, 
  ExternalLink,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';

interface TDBillSectionProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onOpenTDBillApp?: () => void;
}

export const TDBillSection: React.FC<TDBillSectionProps> = ({
  themeObj,
  t,
  onOpenTDBillApp
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  // Animation timeline phase (0 to 6)
  // 0: Check Row 1 (Green Tick)
  // 1: Check Row 2 -> Invalid 9 digits -> Red shake & error alert
  // 2: Auto-correct Row 2 -> Turns 12-digit & Green Tick
  // 3: Check Row 3 (Green Tick) & All Validated
  // 4: Official "SANCTIONED" rubber stamp slams down
  // 5: Money Credited (₹3,500 Credited to POSB SB A/c) + Rising Coins
  // 6: India Post Officer with cap celebrates with joy & confetti!
  const [animStage, setAnimStage] = useState<number>(0);

  useEffect(() => {
    const stageDurations = [1800, 2200, 1800, 1600, 2000, 2400, 2800];
    const timer = setTimeout(() => {
      setAnimStage((prev) => (prev + 1) % stageDurations.length);
    }, stageDurations[animStage]);

    return () => clearTimeout(timer);
  }, [animStage]);

  return (
    <section 
      id="tdbill-section" 
      className="py-8 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      <div className={`rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300 shadow-xl border ${
        isLight 
          ? (isRetro ? 'bg-white border-[#E6DCB8] text-[#1E1B18]' : 'bg-white border-slate-200 text-slate-900')
          : `${themeObj.cardBg} ${themeObj.cardBorder} text-white`
      }`}>
        {/* Subtle Ambient Background Light */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Badge, Title, Subtitle, Launch Button & Key Capability Badges */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
              style={{
                backgroundColor: isLight ? (isRetro ? '#FEECE6' : '#ECFDF5') : 'rgba(16, 185, 129, 0.15)',
                color: isLight ? (isRetro ? '#F95724' : '#059669') : '#34D399'
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.tdSection.badge}</span>
            </div>

            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight ${
              isLight ? (isRetro ? 'text-[#1A1815]' : 'text-slate-900') : themeObj.textPrimary
            }`}>
              {t.tdSection.title}
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              {t.tdSection.subtitle}
            </p>

            {/* Launch Button */}
            <div className="pt-2">
              <a
                id="tdbill-launch-webapp-btn"
                href="https://postalpro.in/tdbill/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm sm:text-base transition-all shadow-lg cursor-pointer active:scale-95 ${
                  themeObj.buttonPrimary
                }`}
              >
                <Receipt className="w-5 h-5 stroke-[2.5]" />
                <span>{t.tdSection.ctaBtn}</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-90" />
              </a>
            </div>

            {/* Key Capability Badges */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>12-Digit Finacle Check</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}>
                <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Auto 1Y-5Y TD Rates</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}>
                <Printer className="w-4 h-4 text-blue-500 shrink-0" />
                <span>20 Rows / A4 Page</span>
              </div>
            </div>

            {/* Live Animation Step Status Bar */}
            <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs truncate">
                  {animStage === 0 && "Step 1/6: Validating Row 1 Finacle ID..."}
                  {animStage === 1 && "Step 2/6: ⚠️ Invalid 9-Digit Entry Detected!"}
                  {animStage === 2 && "Step 3/6: Auto-Correcting to 12 Digits..."}
                  {animStage === 3 && "Step 4/6: All 3 TD Entries Verified ✓"}
                  {animStage === 4 && "Step 5/6: Sanctioned with Official Seal!"}
                  {animStage === 5 && "Step 6/6: 💰 ₹3,500 Credited to POSB Bank!"}
                  {animStage === 6 && "Celebration: Joyful Postal Officer 🎉"}
                </span>
              </div>
              <button 
                onClick={() => setAnimStage(0)}
                title="Replay from start"
                className="text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer p-1 shrink-0 ml-2"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Animated Interactive SVG Simulation */}
          <div className="lg:col-span-6">
            <div className={`rounded-3xl p-3 sm:p-4 border shadow-xl flex flex-col gap-4 overflow-hidden ${
              isLight 
                ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8]' : 'bg-slate-50 border-slate-200') 
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              
              {/* Animated Vector Scene */}
              <div className="w-full h-72 sm:h-80 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner">
                <svg 
                  viewBox="0 0 560 230" 
                  preserveAspectRatio="xMidYMid meet" 
                  className="w-full h-full select-none"
                >
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="50%" stopColor="#EAB308" />
                      <stop offset="100%" stopColor="#CA8A04" />
                    </linearGradient>
                    <linearGradient id="bankToastGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#064E3B" />
                      <stop offset="100%" stopColor="#0F766E" />
                    </linearGradient>
                    <filter id="tdGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Ledger Background Dashed Lines */}
                  <line x1="20" y1="20" x2="540" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
                  <line x1="20" y1="65" x2="540" y2="65" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
                  <line x1="20" y1="110" x2="540" y2="110" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
                  <line x1="20" y1="155" x2="540" y2="155" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
                  <line x1="20" y1="200" x2="540" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />

                  {/* ============================================================ */}
                  {/* TD CLAIM SCHEDULE DOCUMENT (Shakes on error in Stage 1) */}
                  {/* ============================================================ */}
                  <g transform="translate(30, 20)">
                    <motion.g
                      animate={
                        animStage === 1
                          ? { x: [0, -8, 8, -6, 6, -3, 3, 0], y: [0, -2, 2, -1, 1, 0] }
                          : { x: 0, y: 0 }
                      }
                      transition={{ duration: 0.5, repeat: animStage === 1 ? Infinity : 0, repeatDelay: 0.2 }}
                    >
                      {/* Document Card Base */}
                      <rect 
                        x="0" y="0" width="240" height="185" rx="8" 
                        fill="#FFFFFF" 
                        stroke={animStage === 1 ? "#EF4444" : "#CBD5E1"} 
                        strokeWidth={animStage === 1 ? "2.5" : "1.5"} 
                      />
                      
                      {/* Header Banner */}
                      <rect 
                        x="0" y="0" width="240" height="28" 
                        fill={animStage === 1 ? "#DC2626" : "#047857"} 
                        rx="7" 
                      />
                      <text x="120" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="900" letterSpacing="0.4">
                        INDIA POST • TD CLAIM SCHEDULE
                      </text>
                      
                      {/* ---------------------------------------------------- */}
                      {/* ROW 1: Checked and Valid in all stages */}
                      {/* ---------------------------------------------------- */}
                      <rect 
                        x="10" y="36" width="220" height="24" rx="4" 
                        fill="#F8FAFC" 
                        stroke={animStage >= 0 ? "#10B981" : "#E2E8F0"} 
                        strokeWidth={animStage >= 0 ? "1.2" : "1"}
                      />
                      <text x="18" y="51" fill="#1E293B" fontSize="8" fontWeight="bold">ACC: 301294829104</text>
                      <text x="145" y="51" fill="#047857" fontSize="8" fontWeight="bold">₹50,000 (5Y)</text>
                      {/* Green Tick Row 1 */}
                      {animStage >= 0 && (
                        <motion.g
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <circle cx="218" cy="48" r="6.5" fill="#10B981" />
                          <path d="M 215,48 L 217,50 L 221,46" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        </motion.g>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* ROW 2: Error in Stage 1, Auto-Corrected in Stage 2+ */}
                      {/* ---------------------------------------------------- */}
                      <rect 
                        x="10" y="65" width="220" height="24" rx="4" 
                        fill={animStage === 1 ? "#FEF2F2" : "#F8FAFC"} 
                        stroke={animStage === 1 ? "#EF4444" : (animStage >= 2 ? "#10B981" : "#E2E8F0")} 
                        strokeWidth={animStage === 1 || animStage >= 2 ? "1.5" : "1"}
                      />
                      
                      {animStage === 1 ? (
                        // Invalid 9-digit entry with warning
                        <>
                          <text x="18" y="80" fill="#DC2626" fontSize="8" fontWeight="900">ACC: 301294829</text>
                          <text x="145" y="80" fill="#DC2626" fontSize="8" fontWeight="bold">₹1,00,000 (5Y)</text>
                          {/* Red Error Cross Icon */}
                          <motion.g
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.4, repeat: Infinity }}
                          >
                            <circle cx="218" cy="77" r="6.5" fill="#EF4444" />
                            <line x1="215" y1="74" x2="221" y2="80" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                            <line x1="221" y1="74" x2="215" y2="80" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                          </motion.g>
                        </>
                      ) : (
                        // Validated 12-digit entry
                        <>
                          <text x="18" y="80" fill="#1E293B" fontSize="8" fontWeight="bold">ACC: 301294829105</text>
                          <text x="145" y="80" fill="#047857" fontSize="8" fontWeight="bold">₹1,00,000 (5Y)</text>
                          {animStage >= 2 && (
                            <motion.g
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 350 }}
                            >
                              <circle cx="218" cy="77" r="6.5" fill="#10B981" />
                              <path d="M 215,77 L 217,79 L 221,75" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                            </motion.g>
                          )}
                        </>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* ROW 3: Checked */}
                      {/* ---------------------------------------------------- */}
                      <rect 
                        x="10" y="94" width="220" height="24" rx="4" 
                        fill="#F8FAFC" 
                        stroke={animStage >= 3 ? "#10B981" : "#E2E8F0"} 
                        strokeWidth={animStage >= 3 ? "1.2" : "1"}
                      />
                      <text x="18" y="109" fill="#1E293B" fontSize="8" fontWeight="bold">ACC: 301294829106</text>
                      <text x="145" y="109" fill="#047857" fontSize="8" fontWeight="bold">₹50,000 (3Y)</text>
                      {animStage >= 3 && (
                        <motion.g
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <circle cx="218" cy="106" r="6.5" fill="#10B981" />
                          <path d="M 215,106 L 217,108 L 221,104" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        </motion.g>
                      )}

                      {/* Total Box */}
                      <rect x="10" y="123" width="220" height="24" fill="#FEF3C7" stroke="#FDE68A" rx="4" />
                      <text x="18" y="138" fill="#78350F" fontSize="8.5" fontWeight="900">TOTAL INCENTIVE: ₹3,500</text>
                      <text x="165" y="138" fill="#92400E" fontSize="8" fontWeight="bold">20 ROWS / A4</text>

                      {/* Signature Lines */}
                      <text x="20" y="162" fill="#64748B" fontSize="6.5" fontWeight="600">BPM Signature & Stamp</text>
                      <text x="135" y="162" fill="#64748B" fontSize="6.5" fontWeight="600">SPM Sanction & Date</text>

                      {/* Error Banner when in stage 1 */}
                      {animStage === 1 && (
                        <g transform="translate(10, 150)">
                          <rect x="0" y="0" width="220" height="22" rx="4" fill="#EF4444" />
                          <text x="110" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">
                            ⚠️ FINACLE ERROR: 9 DIGITS (REQUIRES 12 DIGITS)
                          </text>
                        </g>
                      )}
                    </motion.g>
                  </g>

                  {/* ============================================================ */}
                  {/* RIGHT SIDE DYNAMIC CONTENT: STAMP, MONEY NOTIFICATION, OR OFFICER */}
                  {/* ============================================================ */}

                  {/* 1. Finacle Validation Status Pill (Stage 0 to 3) */}
                  {animStage <= 3 && (
                    <g transform="translate(300, 35)">
                      <motion.g
                        animate={
                          animStage === 1
                            ? { scale: [1, 1.05, 1], y: [0, -2, 0] }
                            : { y: [0, -3, 0] }
                        }
                        transition={{ duration: animStage === 1 ? 0.4 : 2, repeat: Infinity }}
                      >
                        <rect 
                          x="0" y="0" width="230" height="34" rx="10" 
                          fill={animStage === 1 ? "#EF4444" : "#10B981"} 
                          stroke={animStage === 1 ? "#FCA5A5" : "#6EE7B7"}
                          strokeWidth="1.5"
                        />
                        <text x="20" y="21" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                          {animStage === 1 ? "✕ Invalid Finacle Acc Length" : "✓ 12-Digit Finacle Auto-Validator"}
                        </text>
                      </motion.g>

                      {/* Validation hints */}
                      <g transform="translate(10, 55)">
                        <text x="0" y="0" fill="#94A3B8" fontSize="8" fontWeight="600">
                          {animStage === 0 && "• Scanning Account No. 1..."}
                          {animStage === 1 && "• Alert: Row 2 has only 9 digits instead of 12"}
                          {animStage === 2 && "• Auto-corrected Row 2 to 301294829105 ✓"}
                          {animStage === 3 && "• All 3 entries certified with TD commission rate"}
                        </text>
                        <text x="0" y="16" fill="#64748B" fontSize="7.5">
                          Incentive rate: 5Y TD @ 2% | 3Y/2Y/1Y @ 1.5% / 1%
                        </text>
                      </g>
                    </g>
                  )}

                  {/* 2. Official Sanction Rubber Stamp (Stage 4, 5, 6) */}
                  {animStage >= 4 && (
                    <g transform="translate(305, 25)">
                      <motion.g 
                        initial={{ scale: 2.5, opacity: 0, rotate: 20 }}
                        animate={{ scale: 1, opacity: 1, rotate: -6 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                      >
                        {/* Stamp Outer Border */}
                        <circle cx="45" cy="45" r="42" fill="rgba(220, 38, 38, 0.08)" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="6 3" />
                        <circle cx="45" cy="45" r="34" fill="none" stroke="#DC2626" strokeWidth="1.5" />
                        
                        {/* Stamp Texts */}
                        <text x="45" y="30" textAnchor="middle" fill="#DC2626" fontSize="6.5" fontWeight="900" letterSpacing="0.4">
                          DEPARTMENT OF POSTS
                        </text>
                        <text x="45" y="47" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="900" letterSpacing="0.6">
                          SANCTIONED
                        </text>
                        <text x="45" y="61" textAnchor="middle" fill="#DC2626" fontSize="6.5" fontWeight="bold">
                          VADLAMUDI S.O.
                        </text>

                        {/* Stamp Impact Particles */}
                        <circle cx="90" cy="15" r="2" fill="#DC2626" opacity="0.6" />
                        <circle cx="5" cy="70" r="1.5" fill="#DC2626" opacity="0.6" />
                        <circle cx="85" cy="80" r="2" fill="#DC2626" opacity="0.6" />
                      </motion.g>
                    </g>
                  )}

                  {/* 3. Bank Account Money Credited Notification (Stage 5 & 6) */}
                  {animStage >= 5 && (
                    <g transform="translate(290, 115)">
                      <motion.g
                        initial={{ y: 25, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <rect 
                          x="0" y="0" width="250" height="42" rx="10" 
                          fill="url(#bankToastGrad)" 
                          stroke="#34D399" 
                          strokeWidth="1.5"
                          filter="url(#tdGlow)"
                        />
                        <g transform="translate(10, 10)">
                          {/* Rupee Coin Icon */}
                          <circle cx="12" cy="11" r="11" fill="url(#goldGrad)" stroke="#FEF08A" strokeWidth="1.2" />
                          <text x="12" y="15" textAnchor="middle" fill="#78350F" fontSize="11" fontWeight="900">₹</text>
                          
                          {/* Toast Text */}
                          <text x="32" y="9" fill="#F8FAFC" fontSize="8" fontWeight="bold">
                            POSB A/C CREDITED: ₹3,500.00
                          </text>
                          <text x="32" y="19" fill="#A7F3D0" fontSize="6.5" fontWeight="600">
                            BPM TD Incentive Claim Sanctioned • Ref: DOP-TD9182
                          </text>
                        </g>
                      </motion.g>

                      {/* Rising Money Coins */}
                      <motion.g
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: [-5, -35], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                      >
                        <circle cx="210" cy="15" r="7" fill="url(#goldGrad)" stroke="#FEF08A" strokeWidth="1" />
                        <text x="210" y="18" textAnchor="middle" fill="#78350F" fontSize="7" fontWeight="900">₹</text>
                      </motion.g>
                      <motion.g
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: [-2, -40], opacity: [1, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                      >
                        <circle cx="230" cy="20" r="5.5" fill="url(#goldGrad)" stroke="#FEF08A" strokeWidth="0.8" />
                        <text x="230" y="23" textAnchor="middle" fill="#78350F" fontSize="5.5" fontWeight="900">₹</text>
                      </motion.g>
                    </g>
                  )}

                  {/* 4. Joyful India Post Officer Celebrating (Stage 6) */}
                  {animStage === 6 && (
                    <g transform="translate(425, 12)">
                      <motion.g
                        initial={{ scale: 0, y: 15 }}
                        animate={{ 
                          scale: 1, 
                          y: [0, -10, 0, -6, 0] 
                        }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
                      >
                        {/* Confetti & Sparkles around the happy officer */}
                        <circle cx="-15" cy="20" r="2" fill="#F59E0B" />
                        <circle cx="95" cy="15" r="2.5" fill="#10B981" />
                        <circle cx="100" cy="45" r="2" fill="#EC4899" />
                        <circle cx="-10" cy="50" r="2" fill="#3B82F6" />
                        
                        {/* Floating Celebration Stars */}
                        <motion.path 
                          d="M -5,5 L -3,0 L -1,5 L 4,7 L -1,9 L -3,14 L -5,9 L -10,7 Z" 
                          fill="#FDE047"
                          animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.path 
                          d="M 85,0 L 87,-5 L 89,0 L 94,2 L 89,4 L 87,9 L 85,4 L 80,2 Z" 
                          fill="#38BDF8"
                          animate={{ rotate: -360, scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 2.2, repeat: Infinity }}
                        />

                        {/* Officer Character Body (Khaki / Post Uniform) */}
                        <g transform="translate(18, 0)">
                          {/* Raised Left Arm (Victory V) */}
                          <motion.path 
                            d="M 12,52 L -6,34 L -14,24" 
                            stroke="#D97706" 
                            strokeWidth="5" 
                            strokeLinecap="round" 
                            animate={{ rotate: [-6, 6, -6] }}
                            style={{ originX: '12px', originY: '52px' }}
                          />
                          <circle cx="-14" cy="24" r="3.5" fill="#FCD34D" />

                          {/* Raised Right Arm (Victory V) */}
                          <motion.path 
                            d="M 32,52 L 50,34 L 58,24" 
                            stroke="#D97706" 
                            strokeWidth="5" 
                            strokeLinecap="round" 
                            animate={{ rotate: [6, -6, 6] }}
                            style={{ originX: '32px', originY: '52px' }}
                          />
                          <circle cx="58" cy="24" r="3.5" fill="#FCD34D" />

                          {/* Uniform Torso */}
                          <rect x="12" y="46" width="20" height="30" rx="3" fill="#D97706" />
                          {/* Collar */}
                          <polygon points="12,46 22,54 32,46 22,48" fill="#B45309" />
                          {/* India Post Badge on Pocket */}
                          <rect x="14" y="56" width="6" height="5" fill="#DC2626" rx="1" />
                          <circle cx="17" cy="58.5" r="1" fill="#FDE047" />

                          {/* Neck */}
                          <rect x="19" y="38" width="6" height="10" fill="#FCD34D" />

                          {/* Happy Face */}
                          <circle cx="22" cy="30" r="13" fill="#FDE047" />

                          {/* Cheerful Blushing Cheeks */}
                          <circle cx="14" cy="33" r="2.5" fill="#F87171" opacity="0.6" />
                          <circle cx="30" cy="33" r="2.5" fill="#F87171" opacity="0.6" />

                          {/* Joyful Closed Curved Eyes */}
                          <path d="M 14,27 Q 17,23 20,27" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                          <path d="M 24,27 Q 27,23 30,27" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                          {/* Big Open Laughing Smile */}
                          <path d="M 16,33 Q 22,42 28,33 Z" fill="#DC2626" />
                          <path d="M 18,33 Q 22,37 26,33" fill="#FFFFFF" />

                          {/* Official India Post Red Cap */}
                          <path d="M 9,23 Q 22,10 35,23 Z" fill="#DC2626" />
                          {/* Cap Peak / Visor */}
                          <path d="M 6,24 Q 22,19 38,24 L 38,22 Q 22,17 6,22 Z" fill="#991B1B" />
                          {/* Golden India Post Emblem on Cap */}
                          <circle cx="22" cy="18" r="2.5" fill="#FDE047" />
                          <text x="22" y="20" textAnchor="middle" fill="#78350F" fontSize="3" fontWeight="900">★</text>
                        </g>

                        {/* "HURRAY! INCENTIVE RECEIVED!" Speech Bubble */}
                        <g transform="translate(0, 82)">
                          <rect x="-10" y="0" width="105" height="16" rx="8" fill="#10B981" />
                          <text x="42" y="11" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="900">
                            🎉 INCENTIVE CREDITED!
                          </text>
                        </g>
                      </motion.g>
                    </g>
                  )}
                </svg>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

