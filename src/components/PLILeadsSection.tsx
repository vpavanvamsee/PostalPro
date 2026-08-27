import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  Share2, 
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';

interface PLILeadsSectionProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onOpenPLILeadsApp?: () => void;
}

export const PLILeadsSection: React.FC<PLILeadsSectionProps> = ({
  themeObj,
  t
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  return (
    <section 
      id="plileads-section" 
      className="py-8 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      <div className={`rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300 shadow-xl border ${
        isLight 
          ? (isRetro ? 'bg-white border-[#E6DCB8] text-[#1E1B18]' : 'bg-white border-slate-200 text-slate-900')
          : `${themeObj.cardBg} ${themeObj.cardBorder} text-white`
      }`}>
        {/* Subtle Ambient Background Light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image 2 Content (Badge, Title, Subtitle, Launch Button & Features) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
              style={{
                backgroundColor: isLight ? (isRetro ? '#FEECE6' : '#EEF2FF') : 'rgba(249, 87, 36, 0.15)',
                color: isLight ? (isRetro ? '#F95724' : '#4F46E5') : '#FBBF24'
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.pliSection.badge}</span>
            </div>

            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight ${
              isLight ? (isRetro ? 'text-[#1A1815]' : 'text-slate-900') : themeObj.textPrimary
            }`}>
              {t.pliSection.title}
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              {t.pliSection.subtitle}
            </p>

            {/* Launch Button */}
            <div className="pt-2">
              <a
                id="plileads-launch-webapp-btn"
                href="https://postalpro.in/plileads/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm sm:text-base transition-all shadow-lg cursor-pointer active:scale-95 ${
                  themeObj.buttonPrimary
                }`}
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>{t.pliSection.ctaBtn}</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-90" />
              </a>
            </div>

            {/* Key Capability Badges */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}>
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Instant Bonus Math</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}>
                <Share2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp Pitch Flyers</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}>
                <Lock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>100% Offline Vault</span>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Postal Illustration Scene */}
          <div className="lg:col-span-6">
            <div className={`rounded-3xl p-3 sm:p-4 border shadow-xl flex flex-col gap-4 overflow-hidden ${
              isLight 
                ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8]' : 'bg-slate-50 border-slate-200') 
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              
              {/* Animated Vector Scene (Parallax Scenery, Stationary Bouncing Van, Rotating Wheels, Moving Road) */}
              <div className="w-full h-56 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner">
                
                {/* 1. Left Floating PLI High Bonus Gold Coin Badge (Always visible on mobile & tablet) */}
                <motion.div 
                  animate={{ y: [0, -3, 0], scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 shadow-lg select-none"
                >
                  <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-yellow-200 flex items-center justify-center font-black text-amber-950 text-xs shadow ring-1 ring-amber-300/50">
                    ₹
                    <span className="absolute -top-1 -right-1 text-[9px] text-white">✦</span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-amber-300 tracking-wide pr-1">PLI BONUS</span>
                </motion.div>

                {/* 2. Right Floating 100% Govt Guarantee Badge (Always visible on mobile & tablet) */}
                <motion.div 
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 shadow-lg select-none"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-sm">
                    ✓
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-100 uppercase tracking-tight">100% GOVT</span>
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-emerald-400 uppercase tracking-tight mt-0.5">GUARANTEE</span>
                  </div>
                </motion.div>

                <svg 
                  viewBox="0 0 600 200" 
                  preserveAspectRatio="xMidYMid slice" 
                  className="w-full h-full select-none"
                >
                  <defs>
                    <linearGradient id="skyGradNight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F172A" />
                      <stop offset="60%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#0F283E" />
                    </linearGradient>
                    <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                    <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#B91C1C" />
                    </linearGradient>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="50%" stopColor="#EAB308" />
                      <stop offset="100%" stopColor="#CA8A04" />
                    </linearGradient>
                    <linearGradient id="headlightBeam" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lampGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Sky Canvas */}
                  <rect x="0" y="0" width="600" height="200" fill="url(#skyGradNight)" />

                  {/* Stars in Sky */}
                  <circle cx="70" cy="30" r="1" fill="#FFFFFF" opacity="0.6" />
                  <circle cx="150" cy="20" r="1.2" fill="#FFFFFF" opacity="0.8" />
                  <circle cx="230" cy="40" r="0.8" fill="#FFFFFF" opacity="0.5" />
                  <circle cx="310" cy="25" r="1" fill="#FFFFFF" opacity="0.7" />
                  <circle cx="490" cy="55" r="0.9" fill="#FFFFFF" opacity="0.6" />

                  {/* Distant Parallax Clouds (Slow Drift) */}
                  <motion.g
                    initial={{ x: 0 }}
                    animate={{ x: -600 }}
                    transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                    opacity={0.35}
                  >
                    <g transform="translate(40, 25)">
                      <path d="M 0,15 Q 15,0 30,15 Q 45,0 60,15 Q 70,25 55,30 Q 0,30 0,15 Z" fill="#94A3B8" />
                    </g>
                    <g transform="translate(320, 35)">
                      <path d="M 0,12 Q 12,0 25,12 Q 38,0 50,12 Q 58,22 46,26 Q 0,26 0,12 Z" fill="#94A3B8" />
                    </g>
                    {/* Duplicate for seamless wrap */}
                    <g transform="translate(640, 25)">
                      <path d="M 0,15 Q 15,0 30,15 Q 45,0 60,15 Q 70,25 55,30 Q 0,30 0,15 Z" fill="#94A3B8" />
                    </g>
                    <g transform="translate(920, 35)">
                      <path d="M 0,12 Q 12,0 25,12 Q 38,0 50,12 Q 58,22 46,26 Q 0,26 0,12 Z" fill="#94A3B8" />
                    </g>
                  </motion.g>

                  {/* Distant Horizon Mountains/Trees Line */}
                  <path d="M 0,152 Q 100,140 200,152 Q 300,138 400,152 Q 500,142 600,152 L 600,200 L 0,200 Z" fill="#064E3B" opacity="0.4" />
                  <path d="M 0,156 Q 150,146 300,156 Q 450,146 600,156 L 600,200 L 0,200 Z" fill="#047857" opacity="0.35" />

                  {/* Grass Verge */}
                  <rect x="0" y="152" width="600" height="14" fill="#059669" opacity="0.8" />
                  <rect x="0" y="157" width="600" height="5" fill="#047857" />

                  {/* Curb Edge */}
                  <rect x="0" y="162" width="600" height="5" fill="#64748B" />
                  <line x1="0" y1="162" x2="600" y2="162" stroke="#94A3B8" strokeWidth="1" />

                  {/* Asphalt Road Bed */}
                  <rect x="0" y="167" width="600" height="33" fill="url(#roadGrad)" />
                  
                  {/* Continuously Scrolling Road Center Dashes */}
                  <motion.line 
                    x1="0" y1="184" x2="600" y2="184" 
                    stroke="#FBBF24" 
                    strokeWidth="3.5" 
                    strokeDasharray="24 16"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -80 }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* ============================================================ */}
                  {/* SEAMLESS SCROLLING BACKGROUND SCENERY (Post Office & Trees) */}
                  {/* ============================================================ */}
                  <motion.g
                    initial={{ x: 0 }}
                    animate={{ x: -650 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  >
                    {/* SCENERY SET 1 */}
                    <g transform="translate(0, 0)">
                      {/* Post Office Building */}
                      <g transform="translate(30, 68)">
                        {/* Shadow */}
                        <rect x="10" y="93" width="105" height="4" rx="2" fill="#020617" opacity="0.6" />
                        
                        {/* Main Building Walls */}
                        <rect x="12" y="32" width="100" height="62" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" rx="2" />
                        <rect x="12" y="86" width="100" height="8" fill="#E2E8F0" />

                        {/* Pitched Roof */}
                        <polygon points="4,34 62,6 120,34" fill="url(#roofGrad)" />
                        <polygon points="8,34 62,9 116,34" fill="#DC2626" />
                        <rect x="4" y="32" width="116" height="4" fill="#991B1B" rx="1" />

                        {/* Department Header Badge */}
                        <rect x="22" y="15" width="80" height="12" fill="#DC2626" rx="2" stroke="#FFFFFF" strokeWidth="1" />
                        <text x="62" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="900" letterSpacing="0.5">INDIA POST</text>

                        {/* Branch Office Signboard */}
                        <rect x="20" y="38" width="84" height="9" fill="#1E293B" rx="2" />
                        <text x="62" y="44.5" textAnchor="middle" fill="#FDE047" fontSize="5.5" fontWeight="bold">BRANCH POST OFFICE</text>

                        {/* Windows with Warm Night Lighting */}
                        <rect x="22" y="52" width="18" height="20" fill="#38BDF8" rx="2" stroke="#334155" strokeWidth="1" />
                        <line x1="31" y1="52" x2="31" y2="72" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                        <line x1="22" y1="62" x2="40" y2="62" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />

                        <rect x="84" y="52" width="18" height="20" fill="#38BDF8" rx="2" stroke="#334155" strokeWidth="1" />
                        <line x1="93" y1="52" x2="93" y2="72" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                        <line x1="84" y1="62" x2="102" y2="62" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />

                        {/* Door */}
                        <rect x="48" y="52" width="28" height="42" fill="#334155" rx="1" />
                        <rect x="50" y="54" width="24" height="40" fill="#475569" rx="1" />
                        <circle cx="70" cy="74" r="1.5" fill="#FDE047" />

                        {/* Steps */}
                        <rect x="44" y="94" width="36" height="3" fill="#94A3B8" rx="0.5" />
                        <rect x="40" y="97" width="44" height="3" fill="#64748B" rx="0.5" />

                        {/* Red Post Box */}
                        <g transform="translate(118, 48)">
                          <rect x="2" y="32" width="4" height="16" fill="#334155" />
                          <rect x="0" y="47" width="8" height="3" fill="#1E293B" rx="1" />
                          <path d="M 0,10 Q 0,0 8,0 Q 16,0 16,10 L 16,32 L 0,32 Z" fill="#DC2626" />
                          <rect x="3" y="8" width="10" height="2" fill="#000000" rx="0.5" />
                          <text x="8" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="900">POST</text>
                        </g>
                      </g>

                      {/* Tree 1 */}
                      <g transform="translate(175, 75)">
                        <path d="M 14,87 L 18,35 L 24,35 L 28,87 Z" fill="#78350F" />
                        <circle cx="21" cy="36" r="24" fill="#15803D" opacity="0.95" />
                        <circle cx="10" cy="28" r="17" fill="#16A34A" />
                        <circle cx="32" cy="28" r="17" fill="#22C55E" />
                        <circle cx="21" cy="14" r="16" fill="#4ADE80" />
                      </g>

                      {/* Streetlamp 1 */}
                      <g transform="translate(230, 98)">
                        <rect x="2" y="0" width="3" height="64" fill="#475569" />
                        <path d="M 3,0 Q 3,-10 12,-10 L 14,-10" stroke="#475569" strokeWidth="2.5" fill="none" />
                        <polygon points="10,-10 18,-10 16,-5 12,-5" fill="#1E293B" />
                        <circle cx="14" cy="-4" r="3" fill="#FEF08A" />
                        <polygon points="8,-4 20,-4 32,64 -4,64" fill="url(#lampGlow)" />
                      </g>

                      {/* Rural Indian Postal Milestone */}
                      <g transform="translate(300, 142)">
                        <path d="M 0,6 Q 0,0 6,0 Q 12,0 12,6 L 12,20 L 0,20 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
                        <path d="M 0,6 Q 0,0 6,0 Q 12,0 12,6 L 12,9 L 0,9 Z" fill="#F59E0B" />
                        <text x="6" y="16" textAnchor="middle" fill="#0F172A" fontSize="3.8" fontWeight="bold">DOP</text>
                      </g>

                      {/* Tree 2 */}
                      <g transform="translate(370, 78)">
                        <path d="M 12,84 L 16,35 L 20,35 L 24,84 Z" fill="#78350F" />
                        <circle cx="18" cy="36" r="22" fill="#166534" />
                        <circle cx="8" cy="30" r="16" fill="#15803D" />
                        <circle cx="28" cy="30" r="16" fill="#16A34A" />
                        <circle cx="18" cy="16" r="15" fill="#22C55E" />
                      </g>

                      {/* Tree 3 */}
                      <g transform="translate(480, 80)">
                        <path d="M 14,82 L 18,38 L 22,38 L 26,82 Z" fill="#5A2E0C" />
                        <circle cx="20" cy="38" r="20" fill="#15803D" />
                        <circle cx="10" cy="32" r="14" fill="#22C55E" />
                        <circle cx="30" cy="32" r="14" fill="#16A34A" />
                      </g>

                      {/* Streetlamp 2 */}
                      <g transform="translate(560, 98)">
                        <rect x="2" y="0" width="3" height="64" fill="#475569" />
                        <path d="M 3,0 Q 3,-10 12,-10 L 14,-10" stroke="#475569" strokeWidth="2.5" fill="none" />
                        <polygon points="10,-10 18,-10 16,-5 12,-5" fill="#1E293B" />
                        <circle cx="14" cy="-4" r="3" fill="#FEF08A" />
                        <polygon points="8,-4 20,-4 32,64 -4,64" fill="url(#lampGlow)" />
                      </g>
                    </g>

                    {/* SCENERY SET 2 (Duplicate for Seamless Loop) */}
                    <g transform="translate(650, 0)">
                      {/* Post Office Building */}
                      <g transform="translate(30, 68)">
                        <rect x="10" y="93" width="105" height="4" rx="2" fill="#020617" opacity="0.6" />
                        <rect x="12" y="32" width="100" height="62" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" rx="2" />
                        <rect x="12" y="86" width="100" height="8" fill="#E2E8F0" />
                        <polygon points="4,34 62,6 120,34" fill="url(#roofGrad)" />
                        <polygon points="8,34 62,9 116,34" fill="#DC2626" />
                        <rect x="4" y="32" width="116" height="4" fill="#991B1B" rx="1" />
                        <rect x="22" y="15" width="80" height="12" fill="#DC2626" rx="2" stroke="#FFFFFF" strokeWidth="1" />
                        <text x="62" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="900" letterSpacing="0.5">INDIA POST</text>
                        <rect x="20" y="38" width="84" height="9" fill="#1E293B" rx="2" />
                        <text x="62" y="44.5" textAnchor="middle" fill="#FDE047" fontSize="5.5" fontWeight="bold">BRANCH POST OFFICE</text>
                        <rect x="22" y="52" width="18" height="20" fill="#38BDF8" rx="2" stroke="#334155" strokeWidth="1" />
                        <line x1="31" y1="52" x2="31" y2="72" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                        <line x1="22" y1="62" x2="40" y2="62" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                        <rect x="84" y="52" width="18" height="20" fill="#38BDF8" rx="2" stroke="#334155" strokeWidth="1" />
                        <line x1="93" y1="52" x2="93" y2="72" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                        <line x1="84" y1="62" x2="102" y2="62" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                        <rect x="48" y="52" width="28" height="42" fill="#334155" rx="1" />
                        <rect x="50" y="54" width="24" height="40" fill="#475569" rx="1" />
                        <circle cx="70" cy="74" r="1.5" fill="#FDE047" />
                        <rect x="44" y="94" width="36" height="3" fill="#94A3B8" rx="0.5" />
                        <rect x="40" y="97" width="44" height="3" fill="#64748B" rx="0.5" />
                        <g transform="translate(118, 48)">
                          <rect x="2" y="32" width="4" height="16" fill="#334155" />
                          <rect x="0" y="47" width="8" height="3" fill="#1E293B" rx="1" />
                          <path d="M 0,10 Q 0,0 8,0 Q 16,0 16,10 L 16,32 L 0,32 Z" fill="#DC2626" />
                          <rect x="3" y="8" width="10" height="2" fill="#000000" rx="0.5" />
                          <text x="8" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="900">POST</text>
                        </g>
                      </g>

                      {/* Tree */}
                      <g transform="translate(175, 75)">
                        <path d="M 14,87 L 18,35 L 24,35 L 28,87 Z" fill="#78350F" />
                        <circle cx="21" cy="36" r="24" fill="#15803D" opacity="0.95" />
                        <circle cx="10" cy="28" r="17" fill="#16A34A" />
                        <circle cx="32" cy="28" r="17" fill="#22C55E" />
                        <circle cx="21" cy="14" r="16" fill="#4ADE80" />
                      </g>

                      {/* Streetlamp */}
                      <g transform="translate(230, 98)">
                        <rect x="2" y="0" width="3" height="64" fill="#475569" />
                        <path d="M 3,0 Q 3,-10 12,-10 L 14,-10" stroke="#475569" strokeWidth="2.5" fill="none" />
                        <polygon points="10,-10 18,-10 16,-5 12,-5" fill="#1E293B" />
                        <circle cx="14" cy="-4" r="3" fill="#FEF08A" />
                        <polygon points="8,-4 20,-4 32,64 -4,64" fill="url(#lampGlow)" />
                      </g>

                      {/* Milestone */}
                      <g transform="translate(300, 142)">
                        <path d="M 0,6 Q 0,0 6,0 Q 12,0 12,6 L 12,20 L 0,20 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
                        <path d="M 0,6 Q 0,0 6,0 Q 12,0 12,6 L 12,9 L 0,9 Z" fill="#F59E0B" />
                        <text x="6" y="16" textAnchor="middle" fill="#0F172A" fontSize="3.8" fontWeight="bold">DOP</text>
                      </g>

                      {/* Trees */}
                      <g transform="translate(370, 78)">
                        <path d="M 12,84 L 16,35 L 20,35 L 24,84 Z" fill="#78350F" />
                        <circle cx="18" cy="36" r="22" fill="#166534" />
                        <circle cx="8" cy="30" r="16" fill="#15803D" />
                        <circle cx="28" cy="30" r="16" fill="#16A34A" />
                        <circle cx="18" cy="16" r="15" fill="#22C55E" />
                      </g>

                      <g transform="translate(480, 80)">
                        <path d="M 14,82 L 18,38 L 22,38 L 26,82 Z" fill="#5A2E0C" />
                        <circle cx="20" cy="38" r="20" fill="#15803D" />
                        <circle cx="10" cy="32" r="14" fill="#22C55E" />
                        <circle cx="30" cy="32" r="14" fill="#16A34A" />
                      </g>

                      <g transform="translate(560, 98)">
                        <rect x="2" y="0" width="3" height="64" fill="#475569" />
                        <path d="M 3,0 Q 3,-10 12,-10 L 14,-10" stroke="#475569" strokeWidth="2.5" fill="none" />
                        <polygon points="10,-10 18,-10 16,-5 12,-5" fill="#1E293B" />
                        <circle cx="14" cy="-4" r="3" fill="#FEF08A" />
                        <polygon points="8,-4 20,-4 32,64 -4,64" fill="url(#lampGlow)" />
                      </g>
                    </g>
                  </motion.g>

                  {/* ============================================================ */}
                  {/* STATIONARY INDIA POST VAN WITH SUSPENSION BOUNCE & SPINNING TYRES */}
                  {/* Centered at x=235 so van is 100% visible on mobile and desktop */}
                  {/* ============================================================ */}
                  <g transform="translate(235, 122)">
                    {/* Van Suspension Bouncing Container */}
                    <motion.g 
                      animate={{ y: [0, -1.6, 0.4, -0.8, 0] }}
                      transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {/* Exhaust Smoke Puffs */}
                      <motion.circle 
                        cx="12" cy="46" r="3" fill="#CBD5E1"
                        animate={{ opacity: [0.6, 0], scale: [0.8, 2], x: [-6, -22] }}
                        transition={{ duration: 0.45, repeat: Infinity, ease: 'easeOut' }}
                      />

                      {/* Van Ground Shadow */}
                      <ellipse cx="74" cy="54" rx="58" ry="4" fill="#020617" opacity="0.6" />

                      {/* Main Cargo Box */}
                      <rect x="20" y="10" width="75" height="42" rx="4" fill="#DC2626" />
                      <rect x="20" y="10" width="75" height="4" fill="#EF4444" rx="2" />
                      
                      {/* Driver Cab */}
                      <path d="M 95,20 L 112,20 Q 118,20 122,28 L 126,42 L 126,52 L 95,52 Z" fill="#DC2626" />
                      
                      {/* Front Bumper */}
                      <rect x="124" y="45" width="5" height="7" fill="#1E293B" rx="1" />

                      {/* Windshield / Driver Window (Clear and completely uncovered) */}
                      <path d="M 98,24 L 111,24 L 119,39 L 98,39 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.2" />
                      <line x1="102" y1="26" x2="114" y2="37" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />

                      {/* Cab Door Handle (Below Window) */}
                      <rect x="101" y="42" width="6" height="2" fill="#F8FAFC" rx="0.5" />

                      {/* Yellow India Post Speed Stripe (Neatly confined to Cargo Box, NOT covering the window) */}
                      <rect x="20" y="30" width="75" height="8" fill="#FBBF24" />
                      <text x="57.5" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="900" letterSpacing="0.5">INDIA POST</text>
                      <text x="57.5" y="36" textAnchor="middle" fill="#78350F" fontSize="4.8" fontWeight="900" letterSpacing="0.3">PLI LEADS PRO</text>

                      {/* Front Headlight with Forward Beam */}
                      <circle cx="125" cy="42" r="3.5" fill="#FEF08A" />
                      <polygon points="128,39 210,25 210,65 128,47" fill="url(#headlightBeam)" />

                      {/* Wheel Arches */}
                      <path d="M 32,52 A 11 11 0 0 1 52,52 Z" fill="#0F172A" />
                      <path d="M 98,52 A 11 11 0 0 1 118,52 Z" fill="#0F172A" />

                      {/* Spinning Rear Wheel */}
                      <g transform="translate(42, 52)">
                        <motion.g
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                        >
                          <circle cx="0" cy="0" r="10" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                          <circle cx="0" cy="0" r="6" fill="#64748B" />
                          <circle cx="0" cy="0" r="2.5" fill="#F8FAFC" />
                          <line x1="-5" y1="0" x2="5" y2="0" stroke="#0F172A" strokeWidth="1.5" />
                          <line x1="0" y1="-5" x2="0" y2="5" stroke="#0F172A" strokeWidth="1.5" />
                          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#0F172A" strokeWidth="1.2" />
                          <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" stroke="#0F172A" strokeWidth="1.2" />
                        </motion.g>
                      </g>

                      {/* Spinning Front Wheel */}
                      <g transform="translate(108, 52)">
                        <motion.g
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                        >
                          <circle cx="0" cy="0" r="10" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                          <circle cx="0" cy="0" r="6" fill="#64748B" />
                          <circle cx="0" cy="0" r="2.5" fill="#F8FAFC" />
                          <line x1="-5" y1="0" x2="5" y2="0" stroke="#0F172A" strokeWidth="1.5" />
                          <line x1="0" y1="-5" x2="0" y2="5" stroke="#0F172A" strokeWidth="1.5" />
                          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#0F172A" strokeWidth="1.2" />
                          <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" stroke="#0F172A" strokeWidth="1.2" />
                        </motion.g>
                      </g>
                    </motion.g>
                  </g>
                </svg>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
