import React from 'react';
import { motion } from 'motion/react';
import { ThemeDefinition } from '../utils/themeConfig';

interface PostalProLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showWordmark?: boolean;
  showTagline?: boolean;
  themeObj?: ThemeDefinition;
  animated?: boolean;
  className?: string;
  id?: string;
}

export const PostalProLogo: React.FC<PostalProLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  themeObj,
  animated = true,
  className = '',
  id = 'postalpro-brand-logo'
}) => {
  const isLight = themeObj?.isLight ?? false;
  const isRetro = themeObj?.id === 'retroCream';

  // Size dimensional map
  const sizeMap = {
    xs: { icon: 24, fontSize: 'text-sm', tagSize: 'text-[8px]', gap: 'gap-1.5' },
    sm: { icon: 32, fontSize: 'text-base', tagSize: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 40, fontSize: 'text-lg sm:text-xl', tagSize: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 48, fontSize: 'text-xl sm:text-2xl', tagSize: 'text-xs', gap: 'gap-3' },
    xl: { icon: 64, fontSize: 'text-2xl sm:text-3xl', tagSize: 'text-xs', gap: 'gap-3.5' },
    hero: { icon: 84, fontSize: 'text-4xl sm:text-5xl', tagSize: 'text-sm', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const iconPx = currentSize.icon;

  return (
    <div 
      id={id}
      className={`inline-flex items-center ${currentSize.gap} select-none group ${className}`}
    >
      {/* Dynamic Emblem Graphic */}
      <div 
        className="relative shrink-0 flex items-center justify-center filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
        style={{ width: iconPx, height: iconPx }}
      >
        <svg 
          viewBox="0 0 100 100" 
          width={iconPx} 
          height={iconPx}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Primary Postal Crimson to Amber Gradient */}
            <linearGradient id="logoEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Glowing Amber Coin Grad */}
            <linearGradient id="logoCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Wing Gradient */}
            <linearGradient id="logoWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.8" />
            </linearGradient>

            {/* Indian Tricolor Subtle Strip */}
            <linearGradient id="triColorSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#FF7700" />
            </linearGradient>

            <linearGradient id="triColorGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Shield Ambient Glow */}
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#EA580C" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* 1. Base Shield / Rounded Hexagon Crest */}
          <path
            d="M 50 4 
               C 74 4, 92 14, 92 34 
               C 92 64, 68 88, 50 96 
               C 32 88, 8 64, 8 34 
               C 8 14, 26 4, 50 4 Z"
            fill="url(#logoEmblemGrad)"
            stroke="#FEF08A"
            strokeWidth="2.5"
            filter="url(#logoGlow)"
          />

          {/* 2. Stylized Speed Envelope Wings (Upper Postal Crest) */}
          <path
            d="M 22 28 
               L 50 48 
               L 78 28 
               C 74 20, 62 14, 50 14 
               C 38 14, 26 20, 22 28 Z"
            fill="url(#logoWingGrad)"
            opacity="0.9"
          />

          {/* Envelope Fold Inner Lines */}
          <path
            d="M 22 28 L 50 48 L 78 28"
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. Golden Sovereign Rupee Coin (Financial Hub Emblem) */}
          <g transform="translate(50, 62)">
            {/* Outer Coin Ring */}
            <circle cx="0" cy="0" r="19" fill="url(#logoCoinGrad)" stroke="#FEF08A" strokeWidth="2" />
            <circle cx="0" cy="0" r="15" fill="none" stroke="#78350F" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* Indian Rupee Symbol (₹) */}
            <text
              x="0"
              y="5.5"
              textAnchor="middle"
              fill="#451A03"
              fontSize="16"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              ₹
            </text>

            {/* Sparkle Star on Coin */}
            {animated ? (
              <motion.polygon
                points="12,-12 14,-7 19,-5 14,-3 12,2 10,-3 5,-5 10,-7"
                fill="#FFFFFF"
                animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            ) : (
              <polygon
                points="12,-12 14,-7 19,-5 14,-3 12,2 10,-3 5,-5 10,-7"
                fill="#FFFFFF"
              />
            )}
          </g>

          {/* 4. Speed Swooshes / Postal Feathers on Left & Right */}
          <path
            d="M 12 36 Q 2 48 16 62 Q 10 50 18 42 Z"
            fill="#FEF08A"
            opacity="0.85"
          />
          <path
            d="M 88 36 Q 98 48 84 62 Q 90 50 82 42 Z"
            fill="#FEF08A"
            opacity="0.85"
          />

          {/* 5. Indian Tricolor Micro Seal Ribbon at Base */}
          <g transform="translate(38, 86)">
            <rect x="0" y="0" width="8" height="3" rx="1" fill="url(#triColorSaffron)" />
            <rect x="8" y="0" width="8" height="3" rx="0.5" fill="#FFFFFF" />
            <rect x="16" y="0" width="8" height="3" rx="1" fill="url(#triColorGreen)" />
          </g>
        </svg>
      </div>

      {/* Wordmark Typography */}
      {showWordmark && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black ${currentSize.fontSize} tracking-tight uppercase ${
              themeObj?.brandTextPrimary || (isLight ? 'text-slate-900' : 'text-white')
            }`}>
              POSTAL<span className={`bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent ${
                themeObj?.brandTextAccent || 'text-amber-500'
              }`}>PRO</span>
            </span>

            {/* India Post Sovereign Badge */}
            <span className={`hidden sm:inline-flex px-1.5 py-0.2 rounded-md font-black tracking-wider uppercase border text-[9px] ${
              isLight 
                ? (isRetro ? 'bg-[#FEECE6] text-[#F95724] border-[#F95724]/30' : 'bg-amber-100 text-amber-900 border-amber-300')
                : 'bg-amber-400/15 text-amber-300 border-amber-400/30'
            }`}>
              INDIA
            </span>
          </div>

          {/* Optional Tagline (Hidden on narrow mobile, shown on tablet/desktop) */}
          {showTagline && (
            <p className={`font-bold uppercase tracking-wider hidden sm:block ${currentSize.tagSize} ${
              themeObj?.headerTagline || (isLight ? 'text-slate-500' : 'text-slate-400')
            }`}>
              India Postal Utility Hub
            </p>
          )}
        </div>
      )}
    </div>
  );
};
