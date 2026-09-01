import React from 'react';
import { 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Info
} from 'lucide-react';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';
import { AppView } from '../types';
import { PostalProLogo } from './PostalProLogo';

interface FooterSectionProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onOpenModal: (view: AppView) => void;
  onNavigate?: (view: AppView) => void;
}

// Official Authentic SVG Icons
const OfficialWhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path 
      d="M23.6 8.4C21.6 6.4 18.9 5.3 16 5.3C9.9 5.3 5 10.2 5 16.3C5 18.2 5.5 20.1 6.5 21.8L5 27L10.4 25.6C12 26.5 13.9 27 16 27C22.1 27 27 22.1 27 16C27 13.1 25.9 10.4 23.6 8.4ZM16 25.2C14.2 25.2 12.5 24.7 11.1 23.9L10.7 23.7L7.5 24.5L8.4 21.4L8.1 20.9C7.2 19.5 6.7 17.9 6.7 16.3C6.7 11.2 10.9 7 16 7C18.5 7 20.8 8 22.5 9.7C24.2 11.4 25.2 13.7 25.2 16.2C25.2 21.2 21.1 25.2 16 25.2ZM21 18.5C20.7 18.4 19.4 17.7 19.1 17.6C18.9 17.5 18.7 17.5 18.5 17.8C18.3 18.1 17.8 18.7 17.6 18.9C17.5 19.1 17.3 19.1 17 19C16.7 18.9 15.8 18.6 14.7 17.6C13.8 16.8 13.2 15.8 13.1 15.5C12.9 15.2 13.1 15.1 13.2 14.9C13.3 14.8 13.5 14.6 13.6 14.4C13.8 14.3 13.8 14.1 13.9 14C14 13.8 14 13.7 13.9 13.5C13.8 13.4 13.3 12.1 13.1 11.6C12.9 11.1 12.7 11.1 12.5 11.1C12.3 11.1 12.1 11.1 11.9 11.1C11.7 11.1 11.4 11.2 11.2 11.4C11 11.6 10.3 12.3 10.3 13.7C10.3 15.1 11.3 16.5 11.5 16.7C11.6 16.9 13.5 19.8 16.4 21C17.1 21.3 17.6 21.5 18.1 21.6C18.8 21.8 19.4 21.8 20 21.7C20.6 21.6 21.8 21 22 20.3C22.3 19.6 22.3 19 22.2 18.9C22.1 18.8 21.9 18.7 21.6 18.5H21Z" 
      fill="white" 
    />
  </svg>
);

const OfficialInstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad-radial" cx="30%" cy="107%" r="130%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#ig-grad-radial)" />
    <rect x="7" y="7" width="18" height="18" rx="5" stroke="white" strokeWidth="2.2" fill="none" />
    <circle cx="16" cy="16" r="4.2" stroke="white" strokeWidth="2.2" fill="none" />
    <circle cx="21.5" cy="10.5" r="1.2" fill="white" />
  </svg>
);

const OfficialFacebookIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#1877F2" />
    <path 
      d="M21.5 16.5H18V27H13.5V16.5H11.5V12.7H13.5V10.2C13.5 8.2 14.7 6.5 17.8 6.5C19.1 6.5 20.1 6.7 20.1 6.7L19.8 10.2C19.8 10.2 18.8 10.1 17.8 10.1C16.8 10.1 16.5 10.6 16.5 11.5V12.7H20.3L21.5 16.5Z" 
      fill="white" 
    />
  </svg>
);

const OfficialTelegramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#229ED9" />
    <path 
      d="M8.2 15.6L22.5 10.1C23.2 9.8 23.8 10.3 23.6 11.1L21.2 22.4C21 23.2 20.5 23.4 19.8 23L16.2 20.3L14.5 21.9C14.3 22.1 14.1 22.3 13.7 22.3L14 18.1L21.6 11.2C21.9 10.9 21.5 10.8 21.1 11L11.7 16.9L7.6 15.6C6.7 15.3 6.7 14.7 8.2 15.6Z" 
      fill="white" 
    />
  </svg>
);

export const FooterSection: React.FC<FooterSectionProps> = ({
  themeObj,
  t,
  onOpenModal,
  onNavigate
}) => {
  const isLight = themeObj.isLight;
  const isRetro = themeObj.id === 'retroCream';

  const handleNavOrModal = (target: AppView) => {
    if (onNavigate) {
      onNavigate(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onOpenModal(target);
    }
  };

  // Social Links (all redirect / open in new tab)
  const socialLinks = [
    {
      name: 'WhatsApp Community',
      subtitle: '+91 6309833253',
      href: 'https://wa.me/916309833253?text=Hello%20PostalPro%20Team!%20I%20am%20using%20PostalPro%20tools.',
      icon: OfficialWhatsAppIcon,
      badge: 'Active Chat'
    },
    {
      name: 'Instagram Channel',
      subtitle: '@pavan048',
      href: 'https://www.instagram.com/pavan048/',
      icon: OfficialInstagramIcon,
      badge: 'Visual Guides'
    },
    {
      name: 'Facebook Group',
      subtitle: 'Vemula Pavan Vamsee',
      href: 'https://www.facebook.com/vemulapavanvamsee/',
      icon: OfficialFacebookIcon,
      badge: 'Discussion'
    },
    {
      name: 'Telegram Channel',
      subtitle: '@postalproindia',
      href: 'https://t.me/postalproindia',
      icon: OfficialTelegramIcon,
      badge: 'Alerts'
    }
  ];

  return (
    <footer 
      id="postalpro-footer" 
      className={`border-t transition-colors duration-300 ${
        isLight 
          ? (isRetro ? 'bg-[#FAF5EB] border-[#E6DCB8] text-[#1E1B18]' : 'bg-slate-50 border-slate-200 text-slate-900')
          : 'bg-slate-950 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Main Footer Top Grid (Responsive: 1 col on mobile, 2 cols on tablet, 12-col grid on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Brand & Story Column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <PostalProLogo
              size="lg"
              showWordmark={true}
              showTagline={true}
              themeObj={themeObj}
              animated={true}
            />

            <p className={`text-xs leading-relaxed max-w-md ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {t.footer.story || 'Built for India Post Branch Postmasters, Postal Assistants, and GDS. Empowering daily branch operations with modern, secure, offline-first digital tools.'}
            </p>

            <div className={`pt-1 text-xs font-medium flex flex-wrap items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span>{t.footer.madeWith || 'Crafted with passion for'}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline shrink-0" />
                {t.footer.creator || 'India Post'}
              </span>
            </div>
          </div>

          {/* Core Navigation Links */}
          <div className="sm:col-span-1 lg:col-span-3 space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.footer.toolsTitle || 'Postal Tools & Apps'}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a 
                  href="https://postalpro.in/tdbill/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`hover:text-amber-500 transition inline-flex items-center gap-1.5 ${
                    isLight ? 'text-slate-600 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  <span>TD Commission Bill Generator</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a 
                  href="https://postalpro.in/plileads/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`hover:text-amber-500 transition inline-flex items-center gap-1.5 ${
                    isLight ? 'text-slate-600 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  <span>PLI Leads Management Pro</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a 
                  href="https://postalpro.in/schemeshare/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`hover:text-amber-500 transition inline-flex items-center gap-1.5 ${
                    isLight ? 'text-slate-600 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  <span>SchemeShare Post-Delivery Intimations</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <button 
                  type="button"
                  id="footer-tools-suite-link"
                  onClick={() => handleNavOrModal('tools')}
                  className={`hover:text-amber-500 transition cursor-pointer text-left ${
                    isLight ? 'text-slate-600 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  Postal Utilities Suite
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  id="footer-marketing-playbook-link"
                  onClick={() => handleNavOrModal('marketing')}
                  className={`hover:text-amber-500 transition cursor-pointer text-left ${
                    isLight ? 'text-slate-600 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  Grassroots Marketing Playbook
                </button>
              </li>
            </ul>
          </div>

          {/* Legal, Privacy & Transparency */}
          <div className="sm:col-span-1 lg:col-span-2 space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.footer.legalTitle || 'Legal & Transparency'}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button 
                  id="footer-about-us-link"
                  onClick={() => onOpenModal('about')}
                  className={`transition flex items-center gap-1.5 cursor-pointer text-left ${
                    isLight ? 'text-slate-600 hover:text-blue-600' : 'text-slate-400 hover:text-blue-400'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{t.footer.aboutTitle || 'About Us'}</span>
                </button>
              </li>

              <li>
                <button 
                  id="footer-public-notice-link"
                  onClick={() => onOpenModal('publicNotice')}
                  className={`transition flex items-center gap-1.5 cursor-pointer text-left ${
                    isLight ? 'text-slate-600 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t.footer.noticeTitle || 'Public Notice'}</span>
                </button>
              </li>

              <li>
                <button 
                  id="footer-privacy-policy-link"
                  onClick={() => onOpenModal('privacy')}
                  className={`transition flex items-center gap-1.5 cursor-pointer text-left ${
                    isLight ? 'text-slate-600 hover:text-emerald-600' : 'text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{t.footer.privacyTitle || 'Privacy Policy'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Social Media Community Links */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.footer.followUs || 'Connect With PostalPro Community'}
            </h4>

            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className={`p-2.5 rounded-2xl border flex items-center justify-center transition-all cursor-pointer shadow-xs hover:shadow-md hover:scale-110 active:scale-95 ${
                      isLight 
                        ? 'bg-white border-slate-200 hover:border-slate-400' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6 shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Official Disclaimer Note */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-colors ${
          isLight 
            ? 'bg-amber-500/5 border-amber-500/20 text-slate-700' 
            : 'bg-amber-500/10 border-amber-500/20 text-slate-300'
        }`}>
          <p className="text-center font-normal">
            <strong className="font-semibold text-amber-700 dark:text-amber-400">Disclaimer: </strong>
            PostalPro.in is an independent informational and utility initiative created for Indian postal staff. This platform is not officially affiliated with, endorsed by, or connected to India Post, the Department of Posts, or the United States Postal Service (USPS).
          </p>
        </div>

        {/* Bottom Copyright Strip */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
        }`}>
          <p className="text-center sm:text-left">
            © 2026 <strong>PostalPro.in</strong> • {t.footer.copyright}
          </p>

          <p className="text-center sm:text-right">
            Independent Postal Utility & Productivity Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

