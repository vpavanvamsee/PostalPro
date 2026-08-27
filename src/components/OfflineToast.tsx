import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X, CheckCircle2, CloudOff } from 'lucide-react';
import { ThemeDefinition } from '../utils/themeConfig';

interface OfflineToastProps {
  themeObj: ThemeDefinition;
}

export const OfflineToast: React.FC<OfflineToastProps> = ({ themeObj }) => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  const [showToast, setShowToast] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  const [justReconnected, setJustReconnected] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      setShowToast(true);
      setDismissed(false);

      const timer = setTimeout(() => {
        setJustReconnected(false);
        setShowToast(false);
      }, 4000);

      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
      setShowToast(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showToast || dismissed) {
    return null;
  }

  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  return (
    <aside
      id="offline-connectivity-toast"
      aria-label="Network status notification"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border shadow-xl flex items-start gap-3 transition-all ${
          justReconnected
            ? isRetro
              ? 'bg-[#F0FDF4] border-[#86EFAC] text-emerald-950'
              : isLight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-emerald-950/90 border-emerald-700 text-emerald-100 backdrop-blur-md'
            : isRetro
            ? 'bg-[#FFFDF7] border-[#E8DCB8] text-amber-950'
            : isLight
            ? 'bg-white border-amber-300 text-slate-900'
            : 'bg-slate-900/95 border-amber-600/50 text-slate-100 backdrop-blur-md'
        }`}
      >
        {/* Status Icon */}
        <div
          className={`p-2 rounded-xl shrink-0 mt-0.5 ${
            justReconnected
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
          }`}
        >
          {justReconnected ? (
            <Wifi className="w-5 h-5 animate-pulse" />
          ) : (
            <WifiOff className="w-5 h-5 animate-pulse" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                justReconnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
              }`}
            />
            <h4 className="text-xs sm:text-sm font-black tracking-tight leading-none">
              {justReconnected ? 'Connection Restored' : 'Offline Mode Active'}
            </h4>
          </div>

          <p
            className={`text-xs mt-1 leading-snug font-medium ${
              justReconnected
                ? isLight
                  ? 'text-emerald-800'
                  : 'text-emerald-200'
                : isLight
                ? 'text-slate-700'
                : 'text-slate-300'
            }`}
          >
            {justReconnected
              ? 'Internet connection re-established. All services are fully synchronized.'
              : 'Working seamlessly without internet. All calculators, forms, and local vaults remain 100% operational on your device.'}
          </p>

          {!justReconnected && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
              <CloudOff className="w-3 h-3 shrink-0" />
              <span>Zero data loss guarantee • Rural BO Offline Ready</span>
            </div>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss offline notification"
          className={`p-1.5 rounded-lg transition cursor-pointer shrink-0 -mr-1 -mt-1 ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
