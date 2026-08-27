import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ArrowUp } from 'lucide-react';
import { ThemeDefinition } from '../utils/themeConfig';

interface ScrollToTopRocketProps {
  themeObj: ThemeDefinition;
}

export const ScrollToTopRocket: React.FC<ScrollToTopRocketProps> = ({ themeObj }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const isLight = themeObj?.isLight ?? false;
  const isRetro = themeObj?.id === 'retroCream';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollPos > 120) {
        setIsVisible(true);
      } else {
        if (!isLaunching) {
          setIsVisible(false);
        }
      }
    };

    // Check immediately on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isLaunching]);

  const handleLaunchToTop = () => {
    if (isLaunching) return;

    setIsLaunching(true);

    // 1. Native scrollIntoView on top anchor
    const topAnchor = document.getElementById('top-of-page') || document.getElementById('header-brand-postalpro-home') || document.body;
    if (topAnchor && typeof topAnchor.scrollIntoView === 'function') {
      try {
        topAnchor.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } catch (e) {}
    }

    // 2. Native window and document scrollTo
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    try {
      if (document.documentElement) {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } catch (e) {}
    try {
      if (document.body) {
        document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } catch (e) {}

    // 3. Hardware-assisted smooth scroll loop fallback (ensures 100% scrolling in sandboxed iframes & mobile)
    const initialY = window.scrollY || window.pageYOffset || document.documentElement?.scrollTop || document.body?.scrollTop || 0;
    if (initialY > 0) {
      const startTime = performance.now();
      const duration = 750; // ms

      const stepScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease-out curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentY = Math.max(0, initialY * (1 - easeOut));

        window.scrollTo(0, currentY);
        if (document.documentElement) document.documentElement.scrollTop = currentY;
        if (document.body) document.body.scrollTop = currentY;

        if (progress < 1) {
          requestAnimationFrame(stepScroll);
        } else {
          window.scrollTo(0, 0);
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) document.body.scrollTop = 0;
        }
      };

      requestAnimationFrame(stepScroll);
    }

    // Reset after launch rocket has flown off the top screen
    setTimeout(() => {
      setIsLaunching(false);
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement?.scrollTop || 0;
      if (scrollPos <= 80) {
        setIsVisible(false);
      }
    }, 950);
  };

  return (
    <AnimatePresence>
      {(isVisible || isLaunching) && (
        <div 
          className="fixed bottom-20 md:bottom-7 right-4 sm:right-7 z-40 print:hidden pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={
              isLaunching 
                ? {
                    y: -window.innerHeight - 200,
                    x: [0, -3, 3, -2, 0],
                    scale: [1, 1.2, 1, 0.6],
                    opacity: [1, 1, 0.9, 0],
                    transition: { duration: 0.9, ease: [0.32, 0, 0.67, 0] }
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    x: 0,
                    transition: { type: 'spring', damping: 16, stiffness: 280 }
                  }
            }
            exit={{ scale: 0, opacity: 0, y: 15, transition: { duration: 0.2 } }}
            className="relative"
          >
            {/* Launch Exhaust Rocket Trail during flight */}
            {isLaunching && (
              <motion.div 
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: [1, 1.8, 2.2, 1] }}
                transition={{ duration: 0.8 }}
                className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none -mt-1"
              >
                {/* Core Fiery Jet */}
                <div className="w-3.5 h-14 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent rounded-full blur-[1px] animate-pulse" />
                {/* Outer Ambient Glow */}
                <div className="w-8 h-20 bg-gradient-to-b from-amber-400/80 via-red-500/50 to-transparent rounded-full blur-sm -mt-12" />
                {/* Micro Spark Particles */}
                <div className="flex gap-1.5 -mt-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-200 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                </div>
              </motion.div>
            )}

            {/* Interactive Button */}
            <button
              id="scroll-to-top-rocket-btn"
              onClick={handleLaunchToTop}
              title="Back to top"
              aria-label="Scroll back to top of page"
              disabled={isLaunching}
              className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl border backdrop-blur-md cursor-pointer transition-all duration-200 group flex items-center justify-center select-none active:scale-90 ${
                isLight 
                  ? (isRetro 
                      ? 'bg-[#FAF5EB] border-[#E6DCB8] text-[#F95724] hover:bg-[#F95724] hover:text-white hover:border-[#F95724] shadow-orange-950/15' 
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 shadow-slate-900/15') 
                  : 'bg-slate-900/95 border-slate-700/90 text-amber-300 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 shadow-black/40'
              }`}
            >
              {isLaunching ? (
                /* Rocket Form during Launch */
                <Rocket className="w-5 h-5 -rotate-45 scale-110 text-orange-500 fill-amber-300 drop-shadow animate-pulse" />
              ) : (
                /* Sleek Upward Arrow in Idle State */
                <ArrowUp className="w-5 h-5 stroke-[2.75] group-hover:-translate-y-1 transition-transform" />
              )}

              {/* Hover Pulse Dot */}
              {!isLaunching && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping opacity-75 group-hover:opacity-100" />
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
