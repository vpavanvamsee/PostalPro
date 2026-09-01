import React from 'react';
import { HeroSection } from './HeroSection';
import { PLILeadsSection } from './PLILeadsSection';
import { TDBillSection } from './TDBillSection';
import { ToolsMarqueeSection } from './ToolsMarqueeSection';
import { MarketingSection } from './MarketingSection';
import { FooterSection } from './FooterSection';
import { ThemeDefinition } from '../utils/themeConfig';
import { TranslationDict } from '../utils/languages';
import { AppView, PostalToolItem } from '../types';

interface LandingPageProps {
  themeObj: ThemeDefinition;
  t: TranslationDict;
  onNavigate: (view: AppView, param?: string) => void;
  onSelectTool: (tool: PostalToolItem) => void;
  onOpenLegalModal: (view: AppView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  themeObj,
  t,
  onNavigate,
  onSelectTool,
  onOpenLegalModal
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-300">
      {/* SECTION 1: Hero & 3 Animated Category Cards (Tools, Guides, Quizzes) */}
      <HeroSection
        themeObj={themeObj}
        t={t}
        onNavigate={onNavigate}
        onScrollToSection={scrollToSection}
      />

      {/* SECTION 2: PLI Leads WebApp Highlight (Workflow Animation + Launch in New Tab) */}
      <PLILeadsSection
        themeObj={themeObj}
        t={t}
      />

      {/* SECTION 3: TD Bill WebApp Highlight (Workflow Animation + Launch TD Bill App) */}
      <TDBillSection
        themeObj={themeObj}
        t={t}
      />

      {/* SECTION 4: Tools Section that Auto Moves Horizontally (Clickable to Launch Tool) */}
      <ToolsMarqueeSection
        themeObj={themeObj}
        t={t}
        onSelectTool={onSelectTool}
        onNavigate={onNavigate}
      />

      {/* SECTION 5: Marketing Strategies with Floating Animation (Pitch Scripts & Melas) */}
      <MarketingSection
        themeObj={themeObj}
        t={t}
        onOpenMarketingHub={(strategyId) => onNavigate('marketing', strategyId)}
      />

      {/* SECTION 6: Footer Section with Social Links, Public Notice, Privacy Policy, About Us, Sitemap */}
      <FooterSection
        themeObj={themeObj}
        t={t}
        onOpenModal={onOpenLegalModal}
        onNavigate={onNavigate}
      />
    </div>
  );
};
