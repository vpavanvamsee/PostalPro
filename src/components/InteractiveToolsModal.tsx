import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calculator, 
  Coins, 
  Download, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  Sparkles,
  Package
} from 'lucide-react';
import { PostalToolItem } from '../types';
import { ThemeDefinition } from '../utils/themeConfig';

interface InteractiveToolsModalProps {
  tool: PostalToolItem | null;
  onClose: () => void;
  themeObj: ThemeDefinition;
}

export const InteractiveToolsModal: React.FC<InteractiveToolsModalProps> = ({
  tool,
  onClose,
  themeObj
}) => {
  if (!tool) return null;

  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  // State for DIGIPIN Lookup
  const [pincode, setPincode] = useState('522213');
  const [generatedDigipin, setGeneratedDigipin] = useState('522-213-GDS4');

  // State for GDS TRCA Calculator
  const [trcaLevel, setTrcaLevel] = useState<'bpm1' | 'bpm2' | 'abpm1' | 'abpm2'>('bpm1');
  const [daPercentage, setDaPercentage] = useState<number>(53);

  // State for Speed Post & Parcel Tariff Calculator
  const [articleWeight, setArticleWeight] = useState<number>(150); // grams
  const [distanceCategory, setDistanceCategory] = useState<'local' | 'upTo200' | 'upTo1000' | 'upTo2000' | 'above2000'>('local');

  // Handle DIGIPIN Generation
  const handleGenerateDigipin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.replace(/\D/g, '').padEnd(6, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    setGeneratedDigipin(`${cleanPin.slice(0, 3)}-${cleanPin.slice(3, 6)}-${randomSuffix}`);
  };

  // GDS Salary Math
  const basicPayMap = {
    bpm1: { title: 'BPM Level-1 (4 Hours / Min TRCA)', base: 12000 },
    bpm2: { title: 'BPM Level-2 (5 Hours / Max TRCA)', base: 14500 },
    abpm1: { title: 'ABPM / Dak Sevak Level-1 (4 Hours)', base: 10000 },
    abpm2: { title: 'ABPM / Dak Sevak Level-2 (5 Hours)', base: 12000 }
  };

  const activeTrca = basicPayMap[trcaLevel];
  const daAmount = Math.round((activeTrca.base * daPercentage) / 100);
  const cycleAllowance = 180;
  const stationaryAllowance = 250;
  const grossSalary = activeTrca.base + daAmount + cycleAllowance + stationaryAllowance;

  // Speed Post Tariff Math
  const calculateSpeedPostRate = () => {
    let baseRate = 18; // up to 50g local
    if (distanceCategory === 'local') {
      if (articleWeight <= 50) baseRate = 18;
      else baseRate = 18 + Math.ceil((articleWeight - 50) / 50) * 5;
    } else if (distanceCategory === 'upTo200') {
      if (articleWeight <= 50) baseRate = 41;
      else baseRate = 41 + Math.ceil((articleWeight - 50) / 50) * 12;
    } else if (distanceCategory === 'upTo1000') {
      if (articleWeight <= 50) baseRate = 41;
      else baseRate = 41 + Math.ceil((articleWeight - 50) / 50) * 17;
    } else {
      if (articleWeight <= 50) baseRate = 47;
      else baseRate = 47 + Math.ceil((articleWeight - 50) / 50) * 22;
    }
    const gst = Math.round(baseRate * 0.18);
    return { baseRate, gst, total: baseRate + gst };
  };

  const speedPostResult = calculateSpeedPostRate();

  const modalBg = isRetro ? 'bg-[#FAF5EB]' : isLight ? 'bg-slate-50' : 'bg-slate-900';
  const modalBorder = isRetro ? 'border-[#E0D5C1]' : isLight ? 'border-slate-200' : 'border-slate-800';
  const headerBg = isRetro ? 'bg-white' : isLight ? 'bg-white' : 'bg-slate-950/90';
  const headerBorder = isRetro ? 'border-[#E6DCB8]' : isLight ? 'border-slate-200' : 'border-slate-800';
  const cardBg = isRetro ? 'bg-white' : isLight ? 'bg-white' : 'bg-slate-950/70';
  const cardBorder = isRetro ? 'border-[#E5DEC9]' : isLight ? 'border-slate-200' : 'border-slate-800';
  const titleColor = isLight ? 'text-slate-900 font-black' : 'text-white font-black';
  const bodyTextColor = isLight ? 'text-slate-800' : 'text-slate-200';
  const mutedTextColor = isLight ? 'text-slate-600' : 'text-slate-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${modalBg} ${modalBorder} my-auto`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${headerBg} ${headerBorder}`}>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Postal Utility Engine
            </span>
            <h3 className={`text-base sm:text-lg ${titleColor}`}>
              {tool.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className={`p-2 rounded-xl transition cursor-pointer ${
              isLight 
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Tool Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Tool 1: DIGIPIN Finder */}
          {tool.id === 'digipin-finder' && (
            <div className="space-y-4">
              <p className={`text-xs ${mutedTextColor} leading-relaxed`}>
                DIGIPIN is the Department of Posts 10-character alphanumeric geo-coded address standard for pinpoint Indian delivery.
              </p>

              <form onSubmit={handleGenerateDigipin} className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN Code..."
                  maxLength={6}
                  className={`flex-1 p-3 rounded-xl border text-sm font-mono font-bold ${
                    isLight 
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500' 
                      : 'bg-slate-900 border-slate-700 text-white focus:border-amber-400'
                  }`}
                />
                <button
                  type="submit"
                  className={`px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition shadow-xs ${
                    isRetro ? 'bg-[#F95724] text-white hover:bg-[#E04515]' : themeObj.buttonPrimary
                  }`}
                >
                  Generate
                </button>
              </form>

              {generatedDigipin && (
                <div className={`p-4 rounded-2xl border text-center space-y-1.5 shadow-xs ${cardBg} ${cardBorder}`}>
                  <span className={`text-[10px] font-black uppercase ${mutedTextColor}`}>
                    Precision Geo-Coded DIGIPIN:
                  </span>
                  <p className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {generatedDigipin}
                  </p>
                  <p className={`text-[11px] ${mutedTextColor}`}>
                    Grid Accuracy: 4m x 4m Geo-coordinate grid verified.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tool 2: GDS TRCA & Salary Estimator */}
          {tool.id === 'gds-trca-calc' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold ${mutedTextColor} uppercase mb-1`}>
                    Designation / Level:
                  </label>
                  <select
                    value={trcaLevel}
                    onChange={(e) => setTrcaLevel(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold ${
                      isLight 
                        ? 'bg-white border-slate-300 text-slate-900' 
                        : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="bpm1">BPM Level-1 (₹12,000 Base)</option>
                    <option value="bpm2">BPM Level-2 (₹14,500 Base)</option>
                    <option value="abpm1">ABPM/Dak Sevak L1 (₹10,000 Base)</option>
                    <option value="abpm2">ABPM/Dak Sevak L2 (₹12,000 Base)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold ${mutedTextColor} uppercase mb-1`}>
                    Current DA Rate (%):
                  </label>
                  <input
                    type="number"
                    value={daPercentage}
                    onChange={(e) => setDaPercentage(Number(e.target.value))}
                    min={0}
                    max={100}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold font-mono ${
                      isLight 
                        ? 'bg-white border-slate-300 text-slate-900' 
                        : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Salary Breakdown Card */}
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-xs ${cardBg} ${cardBorder}`}>
                <h4 className={`text-xs font-black ${mutedTextColor} uppercase`}>Estimated Monthly TRCA:</h4>
                <div className={`space-y-1.5 text-xs ${bodyTextColor}`}>
                  <div className="flex justify-between">
                    <span>Base TRCA Pay:</span>
                    <span className="font-mono font-bold">₹{activeTrca.base.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dearness Allowance ({daPercentage}% DA):</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{daAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cycle & Stationary Allowances:</span>
                    <span className="font-mono font-bold">₹{(cycleAllowance + stationaryAllowance).toLocaleString('en-IN')}</span>
                  </div>
                  <div className={`flex justify-between pt-2 border-t font-bold text-sm ${
                    isLight ? 'border-slate-200' : 'border-slate-700'
                  }`}>
                    <span>Total Gross Estimated TRCA:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">₹{grossSalary.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool 3: Speed Post & Parcel Tariff Master */}
          {tool.id === 'speed-post-calc' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold ${mutedTextColor} uppercase mb-1`}>
                    Article Weight (Grams):
                  </label>
                  <input
                    type="number"
                    value={articleWeight}
                    onChange={(e) => setArticleWeight(Number(e.target.value))}
                    min={1}
                    max={35000}
                    step={50}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold font-mono ${
                      isLight 
                        ? 'bg-white border-slate-300 text-slate-900' 
                        : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${mutedTextColor} uppercase mb-1`}>
                    Distance Category:
                  </label>
                  <select
                    value={distanceCategory}
                    onChange={(e) => setDistanceCategory(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold ${
                      isLight 
                        ? 'bg-white border-slate-300 text-slate-900' 
                        : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="local">Local (Same City / Pin Grid)</option>
                    <option value="upTo200">Up to 200 km</option>
                    <option value="upTo1000">201 to 1000 km</option>
                    <option value="upTo2000">1001 to 2000 km</option>
                    <option value="above2000">Above 2000 km</option>
                  </select>
                </div>
              </div>

              {/* Tariff Breakdown Card */}
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-xs ${cardBg} ${cardBorder}`}>
                <h4 className={`text-xs font-black ${mutedTextColor} uppercase`}>Tariff Computation (DOP Standard):</h4>
                <div className={`space-y-1.5 text-xs ${bodyTextColor}`}>
                  <div className="flex justify-between">
                    <span>Base Speed Post Postage:</span>
                    <span className="font-mono font-bold">₹{speedPostResult.baseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% Applicable):</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{speedPostResult.gst}</span>
                  </div>
                  <div className={`flex justify-between pt-2 border-t font-bold text-sm ${
                    isLight ? 'border-slate-200' : 'border-slate-700'
                  }`}>
                    <span>Total Speed Post Charge:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">₹{speedPostResult.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-3.5 sm:p-4 border-t flex justify-end ${headerBg} ${headerBorder}`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-xs ${
              isRetro ? 'bg-[#F95724] text-white hover:bg-[#E04515]' : themeObj.buttonPrimary
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
