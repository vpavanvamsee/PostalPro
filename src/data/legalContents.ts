export interface LegalSection {
  title: string;
  lastUpdated: string;
  sections: {
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
  }[];
}

export const ABOUT_US_DATA = {
  title: 'About PostalPro India',
  subtitle: 'Postal EdTech & Utility Hub • Made with ❤️ by one of your colleagues',
  tagline: 'Dedicated to providing accurate departmental knowledge, postal tools, and utility calculators for postal employees nationwide.',
  author: 'Vamsee',
  role: 'Tech Enthusiastic GDS & Postal Innovator',
  mission: 'To empower every Gramin Dak Sevak (GDS), Branch Postmaster (BPM), Assistant Branch Postmaster (ABPM), Postman, and Postal Assistant across India with AI-powered, friction-free digital tools, standardized claim bill generators, and exam preparation resources.',
  story: [
    'PostalPro was born out of a real grassroots challenge faced every single month at thousands of Branch Post Offices across India: manual, error-prone preparation of Time Deposit (TD) incentive bills, tedious commission math, fragmented departmental rules, and a lack of modern digital tools tailored specifically for the Department of Posts ecosystem.',
    'As a tech-enthusiastic Gramin Dak Sevak (GDS), Vamsee envisioned an all-in-one Postal EdTech & Utility Hub designed from the ground up to solve daily operational bottlenecks. Whether it is generating an official 20-entries-per-A4-page TD Commission Bill with instant Finacle validation, calculating complex PLI/RPLI bonuses, finding geocoded DIGIPIN coordinates, or practicing for departmental competitive exams (GDS to MTS / Postman / PA-SA), PostalPro provides accurate, zero-cost, and lightning-fast solutions.',
    'Today, PostalPro is proudly utilized by postal colleagues across Andhra Pradesh, Telangana, Tamil Nadu, Karnataka, Maharashtra, Uttar Pradesh, West Bengal, and nationwide circles—built with bank-grade client-side privacy, modern aesthetics, and sovereign reliability.'
  ],
  pillars: [
    {
      title: '100% Privacy by Design',
      desc: 'All Finacle account numbers, customer names, and official records remain strictly stored on your own device browser. Zero data is ever sent to or stored on external servers.'
    },
    {
      title: 'Departmental Accuracy',
      desc: 'Every incentive slab (0.5% for 1Y, 1% for 2Y/3Y, 2% for 5Y), POSB interest formula, and exam syllabus adheres strictly to Ministry of Communications & Department of Posts circulars.'
    },
    {
      title: 'Built by Postal Staff for Postal Staff',
      desc: 'Designed by people who actually understand the day-to-day realities of rural Branch Offices, Sub Offices, CSI Finacle portals, and DARPAN devices.'
    }
  ]
};

export const PUBLIC_NOTICE_DATA: LegalSection = {
  title: 'Public & User Notice',
  lastUpdated: 'August 2026',
  sections: [
    {
      heading: '1. Independent Community & Educational Utility Notice',
      paragraphs: [
        'PostalPro (https://postalpro.in) is an independent, community-driven educational technology (EdTech) and productivity utility hub developed to assist postal staff, GDS employees, and postal exam aspirants.',
        'PostalPro is NOT officially operated by or legally affiliated with the Government of India or the Department of Posts. All tools, bill formats, and calculators are provided as productivity aids to streamline departmental calculations.'
      ]
    },
    {
      heading: '2. Notice on Data Collection and Local Processing',
      paragraphs: [
        'We believe in radical data privacy and user sovereignty. PostalPro does NOT collect, harvest, transmit, or monetize any personal depositor data, Finacle account numbers, PR numbers, or employee credentials on remote backend servers.',
        'All computations, schedule tables, PDF creations, and database vault storage happen 100% locally on your browser using standard client-side Web Storage APIs and memory.'
      ],
      bulletPoints: [
        'No remote server databases exist for storing your accounts or customer lists.',
        'Your office profile and entered TD records stay in your local browser cache.',
        'Clearing your browser cache or clicking "Purge Vault" permanently deletes stored data.'
      ]
    },
    {
      heading: '3. Verification with Official Department Records',
      paragraphs: [
        'While all interest rates, incentive percentages, and bill formulas are meticulously updated according to official Directorate orders, users and Branch Postmasters are advised to cross-verify bills with their respective Sub-Post Offices (SO) and Head Post Offices (HO) before final submission.'
      ]
    }
  ]
};

export const PRIVACY_POLICY_DATA: LegalSection = {
  title: 'Privacy Policy & Data Security Guarantee',
  lastUpdated: 'August 2026',
  sections: [
    {
      heading: '1. Our Core Privacy Philosophy',
      paragraphs: [
        'At PostalPro (https://postalpro.in), we treat your data privacy with the highest level of responsibility and technical hygiene. As an application built by postal colleagues for postal colleagues, we understand the sensitive nature of financial accounting numbers, depositor identities, and employee details.'
      ]
    },
    {
      heading: '2. How Data is Processed & Handled',
      paragraphs: [
        'Our technical architecture is strictly client-side. When you enter a depositor account number, calculate TD commissions, or generate an A4 bill schedule, the JavaScript execution occurs entirely inside your web browser.'
      ],
      bulletPoints: [
        'Zero Remote Database: We do not maintain any cloud database of your entered records.',
        'Local Storage Encryption: Saved records are retained in your browser’s localStorage.',
        'Zero Ad Tracking: We do not deploy intrusive third-party ad networks or data scrapers.',
        'Offline Capable: Once loaded, tools like the TD Bill generator work seamlessly without requiring continuous data uploads.'
      ]
    },
    {
      heading: '3. PDF Generation & Document Creation',
      paragraphs: [
        'All PDF documents, schedules, and print layouts are generated on-the-fly using browser memory (jsPDF engine). Documents are saved directly into your device’s local Downloads directory.'
      ]
    },
    {
      heading: '4. Contact & Inquiries',
      paragraphs: [
        'For technical suggestions, feature requests, or privacy inquiries, you can reach out directly to Vamsee and the PostalPro development team via WhatsApp or social channels provided in the footer.'
      ]
    }
  ]
};
