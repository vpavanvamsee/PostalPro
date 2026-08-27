import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Layers, Compass } from 'lucide-react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';
import { AppView } from '../types';
import { PostalProLogo } from './PostalProLogo';

interface HeroSectionProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onNavigate: (view: AppView) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  themeObj,
  t,
  onNavigate,
  onScrollToSection
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  // Choose stroke & text color for SVG strokes and fills based on theme
  const strokeColorPrimary = isLight ? (isRetro ? '#1A1815' : '#0F172A') : '#FFFFFF';
  const strokeColorAccent = isRetro 
    ? '#F95724' 
    : (themeObj.id === 'emerald' ? '#F59E0B' : (themeObj.id === 'midnightNavy' ? '#06B6D4' : (themeObj.id === 'cleanSlate' ? '#4F46E5' : '#F95724')));

  return (
    <section 
      id="hero-section" 
      className="relative pt-8 sm:pt-14 pb-10 sm:pb-16 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Catchy Hero Logo Crest with Ambient Pulse */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: -15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-4"
      >
        <PostalProLogo
          size="hero"
          showWordmark={false}
          themeObj={themeObj}
          animated={true}
          className="hover:scale-110 transition-transform cursor-pointer"
        />
      </motion.div>

      {/* Hub Pill Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 shadow-sm border"
        style={{
          backgroundColor: isLight ? (isRetro ? '#FEECE6' : '#EEF2FF') : 'rgba(249, 87, 36, 0.15)',
          color: isLight ? (isRetro ? '#F95724' : '#4F46E5') : '#FBBF24',
          borderColor: isLight ? (isRetro ? '#FFBB96' : '#C7D2FE') : 'rgba(249, 87, 36, 0.3)'
        }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{t.hubSubtitle}</span>
      </motion.div>

      {/* SVG Animated POSTALPRO Title */}
      <div className="w-full max-w-2xl px-2 my-2 flex justify-center items-center">
        <svg 
          viewBox="0 0 760 140" 
          className="w-full h-auto max-h-36 sm:max-h-48 drop-shadow-sm select-none"
          aria-label="POSTALPRO"
        >
          <defs>
            <linearGradient id="proGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isRetro ? '#F95724' : (themeObj.id === 'cleanSlate' ? '#4F46E5' : '#F95724')} />
              <stop offset="100%" stopColor={isRetro ? '#FB923C' : (themeObj.id === 'cleanSlate' ? '#818CF8' : '#FB923C')} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Animated Postal Wave Line */}
          <motion.path
            d="M 20,120 Q 200,135 380,120 T 740,120"
            fill="none"
            stroke={strokeColorAccent}
            strokeWidth="3"
            strokeDasharray="12 8"
            initial={{ strokeDashoffset: 100, opacity: 0.3 }}
            animate={{ strokeDashoffset: 0, opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* POSTALPRO Text with Unified Vector Stroke & Gradient */}
          <motion.text
            x="380"
            y="95"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="92"
            fontWeight="900"
            letterSpacing="1"
            initial={{ strokeDasharray: 700, strokeDashoffset: 700, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <tspan fill={strokeColorPrimary} stroke={strokeColorPrimary} strokeWidth="1.5">POSTAL</tspan>
            <tspan fill="url(#proGradient)" stroke={strokeColorAccent} strokeWidth="1.5">PRO</tspan>
          </motion.text>

          {/* Speed Indicator Dots */}
          <motion.circle
            cx="700"
            cy="40"
            r="6"
            fill={strokeColorAccent}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Dynamic Animated Underline Bar */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '120px', opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="h-1.5 rounded-full mt-1 mb-8"
        style={{ 
          backgroundColor: strokeColorAccent
        }}
      />

      {/* Clean Call-to-Action Quick Navigation (No redundant cards) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 max-w-md w-full"
      >
        <button
          id="hero-explore-tools-btn"
          onClick={() => onScrollToSection('tools-marquee-section')}
          className={`flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl text-sm sm:text-base font-black flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md active:scale-95 ${
            themeObj.buttonPrimary
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.hero.exploreTools}</span>
        </button>

        <button
          id="hero-explore-marketing-btn"
          onClick={() => onScrollToSection('marketing-section')}
          className={`flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border active:scale-95 ${
            themeObj.buttonSecondary
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t.hero.exploreMarketing}</span>
        </button>
      </motion.div>
    </section>
  );
};
