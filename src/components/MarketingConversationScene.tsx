import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Copy, 
  Check, 
  Share2, 
  Play, 
  Pause, 
  RotateCcw, 
  Send,
  Sparkles,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';
import { MarketingStrategyItem } from '../types';

interface MarketingConversationSceneProps {
  strategy: MarketingStrategyItem;
  themeObj: ThemeDefinition;
  t: TranslationDict;
}

interface DialogMessage {
  speaker: 'bpm' | 'customer';
  name: string;
  avatarText: string;
  badge: string;
  text: string;
  actionTag?: string;
  timestamp: string;
}

const STRATEGY_CONVERSATIONS: Record<string, DialogMessage[]> = {
  'door-to-door-pli': [
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Namaste Sharma ji! 🇮🇳 Central Govt Postal Life Insurance offers the highest ₹76 bonus with 100% sovereign security.',
      actionTag: 'Doorstep Pitch',
      timestamp: '10:15 AM'
    },
    {
      speaker: 'customer',
      name: 'Ramesh Sharma (Villager)',
      avatarText: '👨‍🌾',
      badge: 'Resident',
      text: 'Namaste Postmaster ji! What is the monthly premium for ₹5 Lakhs sum assured for my family?',
      timestamp: '10:16 AM'
    },
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Just ₹1,200/month! Beats all private insurers and includes doorstep proposal processing with zero hassle.',
      actionTag: '₹76/Thousand Bonus Rate',
      timestamp: '10:16 AM'
    },
    {
      speaker: 'customer',
      name: 'Ramesh Sharma (Villager)',
      avatarText: '👨‍🌾',
      badge: 'Resident',
      text: '✓ Perfect! Let\'s fill the proposal form right now at home.',
      actionTag: 'Proposal Accepted 🎉',
      timestamp: '10:17 AM'
    }
  ],
  'sukanya-samriddhi-drive': [
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Namaste Anita ji! Give your 4-year-old daughter the gift of financial independence with 8.2% Tax-Free Compound Growth!',
      actionTag: 'Beti Bachao Initiative',
      timestamp: '11:00 AM'
    },
    {
      speaker: 'customer',
      name: 'Anita Devi (Mother)',
      avatarText: '👩‍👧',
      badge: 'SHG Member',
      text: 'Namaste! What is the initial deposit needed to open an SSA account at our local Branch Post Office?',
      timestamp: '11:01 AM'
    },
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Just ₹250 initial deposit! Plus you get doorstep passbook delivery & celebratory welcome certificate.',
      actionTag: '8.2% Sovereign Interest',
      timestamp: '11:01 AM'
    },
    {
      speaker: 'customer',
      name: 'Anita Devi (Mother)',
      avatarText: '👩‍👧',
      badge: 'SHG Member',
      text: '✓ Wonderful! Securing her education with SSA today. 🎓✨',
      actionTag: 'SSA Account Opened 🌸',
      timestamp: '11:02 AM'
    }
  ],
  'harvest-festival-td-mela': [
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Namaste Kisan bhai! Protect your hard-earned harvest earnings in 5-Year Post Office TD at guaranteed 7.5% interest!',
      actionTag: 'Harvest Deposit Mela',
      timestamp: '02:30 PM'
    },
    {
      speaker: 'customer',
      name: 'Balwinder Singh (Farmer)',
      avatarText: '🚜',
      badge: 'Local Farmer',
      text: 'Is the interest payout credited directly to my Post Office Savings Account every year?',
      timestamp: '02:31 PM'
    },
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Yes, 100% automated credit! Plus 5-Year TD gives complete 80C Tax benefits with zero risk.',
      actionTag: 'Finacle Auto-Credit',
      timestamp: '02:31 PM'
    },
    {
      speaker: 'customer',
      name: 'Balwinder Singh (Farmer)',
      avatarText: '🚜',
      badge: 'Local Farmer',
      text: '✓ Excellent! Depositing ₹1,00,000 in Post Office TD today.',
      actionTag: 'TD Sanctioned 💰',
      timestamp: '02:32 PM'
    }
  ],
  'whatsapp-broadcast-template': [
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: '📢 Broadcast: Doorstep Aadhaar ATM (AePS) cash withdrawal & POSB 7.5% TD now active at Branch Post Office!',
      actionTag: 'WhatsApp Broadcast',
      timestamp: '09:00 AM'
    },
    {
      speaker: 'customer',
      name: 'Suresh Kumar (Shopkeeper)',
      avatarText: '🏪',
      badge: 'Business Owner',
      text: 'Saw the message on WhatsApp! Can I withdraw ₹5,000 from my SBI account using fingerprint right at my shop?',
      timestamp: '09:05 AM'
    },
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Yes! Micro-ATM biometric scan takes just 60 seconds with instant SMS confirmation and zero fees.',
      actionTag: 'Doorstep AePS ATM',
      timestamp: '09:06 AM'
    },
    {
      speaker: 'customer',
      name: 'Suresh Kumar (Shopkeeper)',
      avatarText: '🏪',
      badge: 'Business Owner',
      text: '✓ Cash received at counter! Thank you Post Office for the great digital service! 📱👍',
      actionTag: 'Cash Delivered 💵',
      timestamp: '09:07 AM'
    }
  ],
  'mahila-samman-shg-drive': [
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Namaste Didi! 🇮🇳 Central Govt offers the Mahila Samman scheme giving 7.5% guaranteed interest exclusively for women for 2 years.',
      actionTag: '7.5% Women Growth Scheme',
      timestamp: '03:15 PM'
    },
    {
      speaker: 'customer',
      name: 'Lakshmi Devi (SHG President)',
      avatarText: '👩‍🌾',
      badge: 'SHG Leader',
      text: 'Namaste Postmaster ji! Can our 12 SHG members deposit our poultry earnings and withdraw if there is an emergency?',
      timestamp: '03:16 PM'
    },
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Yes! You get quarterly compounding, plus 40% partial withdrawal facility after 1 year with 100% sovereign guarantee.',
      actionTag: '40% Partial Withdrawal',
      timestamp: '03:16 PM'
    },
    {
      speaker: 'customer',
      name: 'Lakshmi Devi (SHG President)',
      avatarText: '👩‍🌾',
      badge: 'SHG Leader',
      text: '✓ Wonderful! All members in our Sangham are opening MSSC accounts today! 🌸🇮🇳',
      actionTag: 'SHG Accounts Enrolled 🎉',
      timestamp: '03:17 PM'
    }
  ],
  'senior-citizen-mis-drive': [
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Pranam Subedar Uncle! 🇮🇳 Govt of India offers 8.2% interest under SCSS and guaranteed monthly pension under Post Office MIS.',
      actionTag: '8.2% Senior Citizen Scheme',
      timestamp: '10:30 AM'
    },
    {
      speaker: 'customer',
      name: 'Subedar Singh (Retd. Veteran)',
      avatarText: '🎖️',
      badge: 'Defense Pensioner',
      text: 'Pranam Postmaster! Will ₹6 Lakhs investment provide guaranteed quarterly pension payout without bank market risks?',
      timestamp: '10:31 AM'
    },
    {
      speaker: 'bpm',
      name: 'BPM Vamsee (Post Office)',
      avatarText: '📮',
      badge: 'India Post Official',
      text: 'Yes! It provides ₹12,300 every quarter credited directly to your SB passbook with 80C tax rebate and sovereign safety.',
      actionTag: '₹12,300 Quarterly Pension',
      timestamp: '10:31 AM'
    },
    {
      speaker: 'customer',
      name: 'Subedar Singh (Retd. Veteran)',
      avatarText: '🎖️',
      badge: 'Defense Pensioner',
      text: '✓ Excellent! Transferring ₹6 Lakhs into SCSS today for lifelong peace of mind! 🛡️🇮🇳',
      actionTag: 'SCSS Sanctioned 💰',
      timestamp: '10:32 AM'
    }
  ]
};

export const MarketingConversationScene: React.FC<MarketingConversationSceneProps> = ({
  strategy,
  themeObj,
  t
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const messages = STRATEGY_CONVERSATIONS[strategy.id] || STRATEGY_CONVERSATIONS['door-to-door-pli'];

  // Auto-advance dialogue every 3.5 seconds
  useEffect(() => {
    setActiveStep(0);
    setIsPlaying(true);
  }, [strategy.id]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % messages.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isPlaying, messages.length, strategy.id]);

  const handleCopyScript = (scriptText: string) => {
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(strategy.pitchScript);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const currentMsg = messages[activeStep] || messages[0];

  return (
    <div className={`rounded-3xl p-4 sm:p-6 border shadow-xl flex flex-col gap-4 overflow-hidden select-none transition-all ${
      isLight 
        ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8]' : 'bg-slate-50 border-slate-200') 
        : 'bg-slate-900/90 border-slate-800'
    }`}>
      {/* Header Info */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3.5 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/20">
              <Sparkles className="w-3 h-3" />
              Live Conversation Demo
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              • Step {activeStep + 1} of {messages.length}
            </span>
          </div>
          <h3 className={`text-sm sm:text-base font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {strategy.title}
          </h3>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
            className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 ${
              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => { setActiveStep(0); setIsPlaying(true); }}
            title="Restart conversation"
            className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 ${
              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ANIMATED CONVERSATION SVG CANVAS (Officer + Customer + Dynamic Chat Cloud) */}
      {/* ========================================================================= */}
      <div className={`w-full aspect-[2.4/1] max-h-[300px] min-h-[240px] rounded-2xl border relative overflow-hidden shadow-inner flex items-center justify-center ${
        isLight 
          ? (isRetro 
              ? 'bg-gradient-to-b from-[#FAF5EB] via-[#F5EEDB] to-[#EFE5CD] border-[#E6DCB8]' 
              : 'bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 border-slate-200') 
          : 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800'
      }`}>
        
        {/* Top Badges */}
        <div className={`absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-black shadow-sm ${
          isLight 
            ? (isRetro ? 'bg-[#FAF5EB]/95 border-[#E6DCB8] text-[#F95724]' : 'bg-white/95 border-slate-200 text-amber-700')
            : 'bg-slate-950/85 border-amber-400/30 text-amber-300'
        }`}>
          <span>📮 BPM Doorstep Pitch</span>
        </div>

        <div className={`absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-black shadow-sm ${
          isLight 
            ? (isRetro ? 'bg-[#FAF5EB]/95 border-[#E6DCB8] text-emerald-700' : 'bg-white/95 border-slate-200 text-emerald-700')
            : 'bg-slate-950/85 border-emerald-500/30 text-emerald-400'
        }`}>
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>100% Grassroots Script</span>
        </div>

        {/* Vector SVG Scene */}
        <svg 
          viewBox="0 0 600 240" 
          preserveAspectRatio="none" 
          className="w-full h-full block"
        >
          <defs>
            {/* Background Sky Gradient */}
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isRetro ? '#FFFDF5' : (isLight ? '#F0F9FF' : '#0B132B')} />
              <stop offset="60%" stopColor={isRetro ? '#FDE68A' : (isLight ? '#E0F2FE' : '#1C2541')} />
              <stop offset="100%" stopColor={isRetro ? '#F5D061' : (isLight ? '#FED7AA' : '#0F172A')} />
            </linearGradient>

            {/* Officer Uniform Gradient */}
            <linearGradient id="bpmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Post Office Red Gradient */}
            <linearGradient id="poRedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>

            {/* Customer Grad */}
            <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="chatGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={isLight ? '#D97706' : '#000000'} floodOpacity={isLight ? 0.15 : 0.4} />
            </filter>
          </defs>

          {/* Background Elements */}
          <rect width="600" height="240" fill="url(#skyGrad)" />

          {/* Village Hills in Distance */}
          <path 
            d="M 0 190 Q 120 160 250 185 T 600 180 L 600 240 L 0 240 Z" 
            fill={isRetro ? '#E0CEAA' : (isLight ? '#CBD5E1' : '#0D1F2D')} 
            opacity={isLight ? 0.8 : 0.7} 
          />
          <path 
            d="M 0 200 Q 180 180 340 205 T 600 200 L 600 240 L 0 240 Z" 
            fill={isRetro ? '#C8B282' : (isLight ? '#94A3B8' : '#132A3E')} 
          />

          {/* Ground / Village Verandah Floor */}
          <rect 
            x="0" 
            y="210" 
            width="600" 
            height="30" 
            fill={isRetro ? '#8C6E43' : (isLight ? '#64748B' : '#1E293B')} 
          />
          <line 
            x1="0" 
            y1="210" 
            x2="600" 
            y2="210" 
            stroke={isRetro ? '#6E5028' : (isLight ? '#475569' : '#334155')} 
            strokeWidth="2" 
          />

          {/* Village Tree on Far Left */}
          <g transform="translate(15, 80)">
            <path d="M 25 130 Q 30 70 20 20 Q 35 60 40 130 Z" fill="#78350F" opacity="0.6" />
            <circle cx="25" cy="20" r="35" fill={isLight ? '#059669' : '#065F46'} opacity={isLight ? 0.8 : 0.6} />
            <circle cx="45" cy="15" r="28" fill={isLight ? '#10B981' : '#047857'} opacity={isLight ? 0.7 : 0.5} />
          </g>

          {/* India Post Red Letterbox in Background */}
          <g transform="translate(110, 140)">
            <rect x="0" y="20" width="22" height="50" rx="10" fill="url(#poRedGrad)" stroke="#FCA5A5" strokeWidth="1" />
            <rect x="4" y="32" width="14" height="3" fill="#1E293B" />
            <text x="11" y="52" fill="#FEF08A" fontSize="7" fontWeight="bold" textAnchor="middle">📮</text>
            <rect x="8" y="70" width="6" height="15" fill={isLight ? '#334155' : '#475569'} />
          </g>

          {/* ======================================================== */}
          {/* CHARACTER 1: POSTAL OFFICER / BPM (Left Side: x=140..200) */}
          {/* ======================================================== */}
          <g transform="translate(130, 115)">
            <motion.g
              animate={{ 
                y: currentMsg.speaker === 'bpm' ? [0, -3, 0] : 0,
                rotate: currentMsg.speaker === 'bpm' ? [0, 1, 0, -1, 0] : 0
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Officer Shadow */}
              <ellipse cx="40" cy="98" rx="26" ry="6" fill="#000000" opacity="0.4" />

              {/* Legs */}
              <rect x="28" y="65" width="9" height="32" rx="4" fill="#334155" />
              <rect x="43" y="65" width="9" height="32" rx="4" fill="#334155" />
              {/* Shoes */}
              <rect x="25" y="93" width="14" height="6" rx="3" fill="#0F172A" />
              <rect x="41" y="93" width="14" height="6" rx="3" fill="#0F172A" />

              {/* Body / Khaki Jacket */}
              <rect x="22" y="28" width="36" height="40" rx="7" fill="url(#bpmGrad)" stroke="#F59E0B" strokeWidth="1" />
              {/* India Post Ribbon Badge on chest */}
              <rect x="26" y="36" width="12" height="6" rx="2" fill="#DC2626" />
              <text x="32" y="41" fill="#FEF08A" fontSize="4.5" fontWeight="bold" textAnchor="middle">IP</text>

              {/* Post Satchel Strap across chest */}
              <line x1="24" y1="30" x2="56" y2="64" stroke="#78350F" strokeWidth="3" />
              {/* Satchel Bag on Hip */}
              <rect x="15" y="52" width="14" height="16" rx="3" fill="#92400E" stroke="#B45309" strokeWidth="1" />

              {/* Arms */}
              {/* Left Arm holding Micro-ATM tablet */}
              <path d="M 24 34 L 14 50 L 26 56" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
              {/* Micro-ATM Tablet Device */}
              <rect x="24" y="48" width="15" height="11" rx="2" fill="#0F172A" stroke="#10B981" strokeWidth="1" />
              <rect x="26" y="50" width="11" height="7" rx="1" fill="#064E3B" />
              <text x="31.5" y="55" fill="#34D399" fontSize="4" fontWeight="bold" textAnchor="middle">AePS ✓</text>

              {/* Right Arm (Waving or Gesticulating) */}
              <motion.path 
                animate={{ rotate: currentMsg.speaker === 'bpm' ? [0, -8, 8, 0] : [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '56px 34px' }}
                d="M 54 34 L 66 44 L 62 55" 
                fill="none" 
                stroke="#D97706" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />

              {/* Head / Face */}
              <circle cx="40" cy="18" r="12" fill="#FBBF24" />
              {/* Eyes */}
              <circle cx="37" cy="17" r="1.8" fill="#1E293B" />
              <circle cx="44" cy="17" r="1.8" fill="#1E293B" />
              {/* Smile */}
              <path d="M 37 22 Q 40.5 25 44 22" fill="none" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />

              {/* India Post Cap */}
              <path d="M 28 12 Q 40 4 52 12 L 54 14 L 26 14 Z" fill="#991B1B" />
              <rect x="25" y="13" width="30" height="3.5" rx="1" fill="#DC2626" />
              <circle cx="40" cy="9" r="2.5" fill="#FBBF24" />
            </motion.g>

            {/* Officer Name Plate Tag */}
            <g transform="translate(18, 108)">
              <rect x="0" y="0" width="44" height="12" rx="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="1" />
              <text x="22" y="8.5" fill="#FEF08A" fontSize="6" fontWeight="bold" textAnchor="middle">BPM Vamsee</text>
            </g>
          </g>

          {/* ========================================================== */}
          {/* CHARACTER 2: VILLAGER / CUSTOMER (Right Side: x=410..470) */}
          {/* ========================================================== */}
          <g transform="translate(410, 115)">
            <motion.g
              animate={{ 
                y: currentMsg.speaker === 'customer' ? [0, -3, 0] : 0,
                rotate: currentMsg.speaker === 'customer' ? [0, -1, 0, 1, 0] : 0
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Customer Shadow */}
              <ellipse cx="38" cy="98" rx="26" ry="6" fill="#000000" opacity="0.4" />

              {/* Legs */}
              <rect x="26" y="65" width="9" height="32" rx="4" fill="#1E293B" />
              <rect x="41" y="65" width="9" height="32" rx="4" fill="#1E293B" />
              {/* Shoes */}
              <rect x="23" y="93" width="14" height="6" rx="3" fill="#0F172A" />
              <rect x="39" y="93" width="14" height="6" rx="3" fill="#0F172A" />

              {/* Kurta / Shirt */}
              <rect x="20" y="28" width="36" height="42" rx="7" fill="url(#custGrad)" stroke="#60A5FA" strokeWidth="1" />
              
              {/* Arms */}
              {/* Left Arm holding Passbook/Document */}
              <path d="M 22 34 L 12 46 L 24 54" fill="none" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
              {/* Passbook / Proposal Form in Hand */}
              <rect x="18" y="47" width="13" height="15" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
              <line x1="21" y1="51" x2="28" y2="51" stroke="#854D0E" strokeWidth="1" />
              <line x1="21" y1="55" x2="28" y2="55" stroke="#854D0E" strokeWidth="1" />

              {/* Right Arm (Gesturing thumbs up or agreement) */}
              <motion.path 
                animate={{ rotate: currentMsg.speaker === 'customer' ? [0, 8, -6, 0] : [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '54px 34px' }}
                d="M 52 34 L 62 44 L 56 54" 
                fill="none" 
                stroke="#2563EB" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />

              {/* Head / Face */}
              <circle cx="38" cy="18" r="12" fill="#FED7AA" />
              {/* Eyes */}
              <circle cx="34" cy="17" r="1.8" fill="#1E293B" />
              <circle cx="41" cy="17" r="1.8" fill="#1E293B" />
              {/* Smile / Nod */}
              <path d="M 34 22 Q 37.5 25 41 22" fill="none" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />

              {/* Hair / Turban / Traditional Safa */}
              <path d="M 26 14 Q 38 6 50 14 Q 52 8 38 4 Q 24 8 26 14 Z" fill="#EA580C" />
            </motion.g>

            {/* Customer Name Tag */}
            <g transform="translate(16, 108)">
              <rect x="0" y="0" width="44" height="12" rx="4" fill="#0F172A" stroke="#3B82F6" strokeWidth="1" />
              <text x="22" y="8.5" fill="#93C5FD" fontSize="6" fontWeight="bold" textAnchor="middle">
                {currentMsg.speaker === 'customer' ? currentMsg.name.split(' ')[0] : 'Villager'}
              </text>
            </g>
          </g>

          {/* ======================================================= */}
          {/* DYNAMIC ANIMATED SPEECH BUBBLE (Center Floating Cloud)   */}
          {/* ======================================================= */}
          <g transform="translate(180, 24)" filter="url(#chatGlow)">
            {/* Bubble Base */}
            <rect 
              x="0" 
              y="0" 
              width="240" 
              height="86" 
              rx="16" 
              fill={isLight ? '#FFFFFF' : (currentMsg.speaker === 'bpm' ? '#0F172A' : '#0B1528')} 
              stroke={currentMsg.speaker === 'bpm' ? (isRetro ? '#F95724' : '#F59E0B') : '#3B82F6'} 
              strokeWidth="2" 
            />

            {/* Speech Bubble Pointer / Tail */}
            {currentMsg.speaker === 'bpm' ? (
              <path 
                d="M 16 86 L 8 98 L 28 86 Z" 
                fill={isLight ? '#FFFFFF' : '#0F172A'} 
                stroke={isRetro ? '#F95724' : '#F59E0B'} 
                strokeWidth="2" 
              />
            ) : (
              <path 
                d="M 212 86 L 232 98 L 224 86 Z" 
                fill={isLight ? '#FFFFFF' : '#0B1528'} 
                stroke="#3B82F6" 
                strokeWidth="2" 
              />
            )}

            {/* Bubble Header */}
            <g transform="translate(12, 10)">
              {/* Speaker Indicator Tag */}
              <rect 
                x="0" 
                y="0" 
                width="95" 
                height="14" 
                rx="4" 
                fill={currentMsg.speaker === 'bpm' ? (isRetro ? '#F95724' : '#D97706') : '#2563EB'} 
              />
              <text x="5" y="10" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
                {currentMsg.avatarText} {currentMsg.speaker === 'bpm' ? 'Postmaster' : 'Customer'}
              </text>

              {/* Timestamp */}
              <text x="210" y="10" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="6.5" textAnchor="end">
                {currentMsg.timestamp}
              </text>

              {/* Checkmarks */}
              <text x="214" y="10" fill="#0284C7" fontSize="7" fontWeight="bold">✓✓</text>
            </g>

            {/* Speech Message Body (Multi-line text simulation) */}
            <g transform="translate(14, 32)">
              <foreignObject x="0" y="0" width="212" height="48">
                <div className="text-[10px] leading-snug font-medium pr-1 flex flex-col justify-between h-full">
                  <p className={`line-clamp-2 ${isLight ? 'text-slate-800 font-semibold' : 'text-slate-200'}`}>
                    "{currentMsg.text}"
                  </p>
                  
                  {currentMsg.actionTag && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase ${
                        isLight
                          ? (currentMsg.speaker === 'bpm' 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300')
                          : (currentMsg.speaker === 'bpm' 
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')
                      }`}>
                        ★ {currentMsg.actionTag}
                      </span>
                    </div>
                  )}
                </div>
              </foreignObject>
            </g>
          </g>

          {/* Central Interactive Dialogue Timeline Track (Bottom center of SVG) */}
          <g transform="translate(230, 218)">
            {messages.map((_, idx) => (
              <circle
                key={idx}
                cx={idx * 26}
                cy="0"
                r={activeStep === idx ? 5 : 3.5}
                fill={activeStep === idx ? (isRetro ? '#F95724' : '#F59E0B') : (isLight ? '#CBD5E1' : '#475569')}
                stroke={activeStep === idx ? (isLight ? '#FFFFFF' : '#FEF08A') : 'none'}
                strokeWidth="1.5"
                className="cursor-pointer"
                onClick={() => setActiveStep(idx)}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* ACTION TRAY: 1-Click Copy Script & WhatsApp Direct Outreach              */}
      {/* ========================================================================= */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 ${
        isLight 
          ? (isRetro ? 'bg-white border-[#E6DCB8]' : 'bg-white border-slate-200 shadow-sm') 
          : 'bg-slate-950 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Verified Customer Pitch Script
          </span>

          <div className="flex items-center gap-2">
            {/* Direct WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm"
              title="Share script directly to WhatsApp Broadcast"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </button>

            {/* Copy Script */}
            <button
              onClick={() => handleCopyScript(strategy.pitchScript)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                copiedScript
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : (isLight 
                      ? (isRetro ? 'bg-[#FEECE6] text-[#F95724] hover:bg-[#F95724] hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200') 
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700')
              }`}
            >
              {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? t.marketingSection.copied : t.marketingSection.copyScript}</span>
            </button>
          </div>
        </div>

        {/* Selected Script Quote */}
        <p className={`text-xs italic leading-relaxed p-3 rounded-xl border font-medium ${
          isLight 
            ? 'text-slate-800 bg-slate-50 border-slate-200' 
            : 'text-slate-200 bg-slate-900/70 border-slate-800'
        }`}>
          "{strategy.pitchScript}"
        </p>

        {/* Real-Life Case Study Callout */}
        {strategy.realLifeExample && (
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
            isLight 
              ? (isRetro ? 'bg-[#FDF9EE] border-[#E6DCB8] text-[#3D3833]' : 'bg-amber-50/70 border-amber-200 text-amber-950')
              : 'bg-amber-950/30 border-amber-500/20 text-amber-200'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-black text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Real-Life Field Example & Result:
              </span>
              <p className="text-[11px] leading-relaxed font-medium">
                {strategy.realLifeExample}
              </p>
            </div>
          </div>
        )}

        {/* Quick Implementation Steps */}
        <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="font-bold text-amber-500">Key Steps:</span>
          {strategy.steps.slice(0, 2).map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
              <span className="text-amber-500 font-bold">{i+1}.</span> {s.length > 38 ? s.substring(0, 38) + '...' : s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
