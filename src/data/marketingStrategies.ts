import { MarketingStrategyItem } from '../types';

export const MARKETING_STRATEGIES: MarketingStrategyItem[] = [
  {
    id: 'door-to-door-pli',
    title: 'Door-to-Door PLI / RPLI Campaign Playbook',
    tag: 'Highest Commission & Bonus',
    targetAudience: 'Farmers, Village Youth, Govt & Semi-Govt Employees, Teachers',
    keyHighlight: 'Lowest premium in India + Highest bonus rate declared by Central Govt.',
    description: 'A structured 5-step conversational pitch that addresses customer skepticism about private insurance and emphasizes sovereign government guarantee.',
    iconName: 'Home',
    steps: [
      'Identify households with salaried or agricultural breadwinners aged 19 to 45.',
      'Highlight that PLI/RPLI bonus (up to ₹76/thousand for WLA) beats all private insurers.',
      'Show instant maturity comparison chart on PostalPro quote calculator.',
      'Offer doorstep medical clearance guidance and auto-debit facility.',
      'Schedule same-week policy proposal collection.'
    ],
    pitchScript: '"Namaste Ji! Central Govt offers Postal Life Insurance exclusively through our Post Office. While other companies charge high commissions, PLI gives the lowest premium with the highest government-backed bonus. Let me show you how just ₹1,200/month guarantees ₹10 Lakhs safety for your family."',
    realLifeExample: 'BPM Ramesh from Warangal Division visited 15 rural teacher households during summer vacation. By showing that PLI Suraksha (WLA) offers ₹76/thousand bonus vs ~₹40 from private insurers, he secured 9 high-value policies (₹45 Lakhs total sum assured) in 2 weeks.'
  },
  {
    id: 'sukanya-samriddhi-drive',
    title: 'Sukanya Samriddhi & Mahila Samman Village Drives',
    tag: '8.2% Compound Interest',
    targetAudience: 'Parents of girl children (0-10 years) and village women groups (SHGs)',
    keyHighlight: '8.2% Tax-Free Compound Growth + Sovereign Govt Security',
    description: 'Coordinate with local Anganwadi workers and primary schools to onboard girl children into SSA with minimal ₹250 initial deposit.',
    iconName: 'HeartHandshake',
    steps: [
      'Partner with village Anganwadi workers to compile birth records of girls under 10.',
      'Organize a special "Beti Bachao, Beti Padhao" savings camp at the Branch Post Office.',
      'Distribute pre-printed SSA passbook envelopes and celebratory certificates.',
      'Demonstrate how ₹1,000/month turns into over ₹5.5 Lakhs by daughter\'s college age.'
    ],
    pitchScript: '"Give your daughter the gift of financial independence! For just ₹250 deposit today, secure an unbeatable 8.2% interest guaranteed directly by the Government of India for her higher education and wedding."',
    realLifeExample: 'At Chittoor Branch Post Office, ABPM Priya coordinated with the village Anganwadi worker to identify all 28 girl children born in the village over 4 years. Hosting a special "Beti Utsav" mela on National Girl Child Day, they opened 24 SSA accounts with a ₹1,000 initial deposit each in a single day.'
  },
  {
    id: 'harvest-festival-td-mela',
    title: 'Harvest Season Time Deposit (TD) Mela',
    tag: 'Up to 7.5% Interest + BPM Commission',
    targetAudience: 'Crop-selling farmers, local traders, retired defense personnel',
    keyHighlight: 'Safe term deposit beating bank FDs with instant procurement incentive',
    description: 'Time your branch deposit mela immediately following crop procurement or festival bonus disbursements in your village jurisdiction.',
    iconName: 'Coins',
    steps: [
      'Monitor local Mandi crop payout dates or festival bonus weeks.',
      'Set up an attractive banner at the Branch Post Office outlining 1Y, 2Y, 3Y, and 5Y TD interest rates.',
      'Explain that 5-Year TD also offers 80C Income Tax rebate.',
      'Batch-enter procured accounts into PostalPro TD Bill Generator to claim full BPM incentive.'
    ],
    pitchScript: '"Why keep hard-earned harvest cash in risky local schemes? Post Office 5-Year Time Deposit gives 7.5% interest, sovereign government safety, and saves tax. Open your account today in just 5 minutes!"',
    realLifeExample: 'During the paddy harvest procurement week in Guntur District, BPM Satyanarayana set up a mobile desk near the agricultural market yard (Mandi). By explaining the 7.5% 5-Year TD rate and 80C income-tax rebates to farmers receiving direct bank transfers, he booked ₹18.5 Lakhs in TD deposits within 5 days.'
  },
  {
    id: 'whatsapp-broadcast-template',
    title: 'Post Office WhatsApp Business Outreach Kit',
    tag: 'Zero-Cost Digital Marketing',
    targetAudience: 'Village residents, youth groups, self-help groups, local business owners',
    keyHighlight: 'Engage 500+ villagers in 1 click with verified schemes & interest updates',
    description: 'Ready-to-copy WhatsApp broadcast messages in regional languages (Telugu, Hindi, Tamil, Kannada, Bengali) for seasonal announcements.',
    iconName: 'MessageSquare',
    steps: [
      'Create a dedicated Post Office Announcement WhatsApp Broadcast List.',
      'Share quarterly POSB interest rate revision flyers created via PostalPro.',
      'Remind villagers about Doorstep Aadhaar ATM (AePS) cash withdrawal services.',
      'Follow up on queries with direct PLI quotation cards.'
    ],
    pitchScript: '"📢 Public Notice from your local Branch Post Office: Now withdraw cash from ANY bank account right at your doorstep using Aadhaar ATM! Also avail 7.5% Post Office TD and 8.2% Sukanya Samriddhi interest. Contact your BPM today!"',
    realLifeExample: 'Dak Sevak Manoj created a 350-member "Gram Dak Sewa Helpline" WhatsApp broadcast list. Whenever POSB quarterly rates or AePS doorstep cash limits are updated, he broadcasts a bilingual graphic card. Over 40 villagers used the doorstep AePS cash withdrawal during the harvest rush.'
  },
  {
    id: 'mahila-samman-shg-drive',
    title: 'Mahila Samman Savings Certificate (MSSC) & SHG Group Drive',
    tag: '7.5% Guaranteed (2-Year Term)',
    targetAudience: 'Village Women Self-Help Groups (SHGs / DWCRA / NRLM), ASHA workers, rural homemakers',
    keyHighlight: 'Exclusive 2-year sovereign women deposit with 40% partial withdrawal after 1 year',
    description: 'Partner directly with village women’s Self-Help Groups (SHGs) and Anganwadi centers to promote the exclusive 2-Year Mahila Samman Savings Certificate (MSSC) as a safe, high-interest sovereign growth plan.',
    iconName: 'Users',
    steps: [
      'Obtain meeting schedules for village SHG federation (DWCRA/NRLM) meetings from the Gram Panchayat.',
      'Bring pre-printed MSSC application vouchers and POSB KYC guidelines to the group meeting.',
      'Demonstrate how a ₹10,000 deposit yields ₹11,602 in 2 years with quarterly compounding interest (7.5%).',
      'Highlight the 40% emergency withdrawal option after 1 year and complete on-the-spot biometric/KYC collection.'
    ],
    pitchScript: '"Namaste Didi! Under Central Government’s special Mahila Samman scheme, women get an unbeatable 7.5% guaranteed interest for 2 years. Keep your hard-earned savings safe with sovereign security, plus enjoy a 40% partial withdrawal facility after 1 year whenever needed!"',
    realLifeExample: 'In Tiruvannamalai Division, BPM Sangeetha attended the monthly DWCRA federation meeting of 6 women SHGs. By explaining how small collective poultry/tailoring profits can be safely parked for 2 years at 7.5% quarterly compounding with the flexibility to withdraw 40% after 1 year for festive or school expenses, she enrolled 38 women and collected ₹3.8 Lakhs in deposits in a single afternoon.'
  },
  {
    id: 'senior-citizen-mis-drive',
    title: 'Senior Citizen (SCSS) & Monthly Income (MIS) Pensioner Drive',
    tag: '8.2% SCSS / 7.4% Monthly Pension',
    targetAudience: 'Retired Govt & Defense pensioners, senior citizens (60+ yrs), VRS recipients, village elders',
    keyHighlight: 'Guaranteed monthly/quarterly passive income credited directly to Post Office SB passbook',
    description: 'Target retired military veterans, state/central pensioners, and senior citizens with a structured pension enhancement plan pairing 8.2% SCSS and 7.4% Monthly Income Scheme (MIS).',
    iconName: 'Landmark',
    steps: [
      'Set up a dedicated Senior Citizen Assistance Desk on the 1st to 7th of every month during pension disbursals.',
      'Present side-by-side comparison: 8.2% SCSS vs standard commercial bank term deposits (6.5% - 7.0%).',
      'Show how MIS provides a reliable, automatic monthly pension credit straight into the POSB SB account on the 1st of every month.',
      'Provide doorstep pickup of life certificates, KYC documents, and auto-credit mandate forms.'
    ],
    pitchScript: '"Pranam Uncle ji! Don’t let your retirement gratuity stay idle at low bank interest. Central Govt Senior Citizen Savings Scheme (SCSS) gives an unbeatable 8.2% interest, and MIS gives regular monthly pension credited straight to your Post Office account with sovereign safety!"',
    realLifeExample: 'On the 1st of the month during pension distribution at a Sub-Post Office in Ambala, BPM Gurpreet established a dedicated "Senior Citizen Lounge". He showcased how transferring ₹6 Lakhs into 8.2% SCSS gives ₹12,300 guaranteed quarterly income, plus ₹3 Lakhs into MIS gives ₹1,850 every single month. Five retired veterans booked ₹21 Lakhs total deposits within one week.'
  }
];
