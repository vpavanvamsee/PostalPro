import { LanguageCode } from '../types';

export interface LanguageDef {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageDef[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' }
];

export interface TranslationDict {
  siteTitle: string;
  hubSubtitle: string;
  nav: {
    home: string;
    tools: string;
    marketing: string;
    theme: string;
    language: string;
    vault: string;
  };
  hero: {
    badge: string;
    exploreTools: string;
    exploreMarketing: string;
  };
  pliSection: {
    badge: string;
    title: string;
    subtitle: string;
    ctaBtn: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    liveDemo: string;
    prospectCard: string;
    sumAssured: string;
    monthlyPremium: string;
    maturityVal: string;
    quoteSent: string;
    bpmCommission: string;
  };
  tdSection: {
    badge: string;
    title: string;
    subtitle: string;
    ctaBtn: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    liveDemo: string;
    officialSchedule: string;
    accNo: string;
    depositor: string;
    deposit: string;
    incentive: string;
    signatures: string;
  };
  toolsSection: {
    badge: string;
    title: string;
    subtitle: string;
    launchBtn: string;
  };
  marketingSection: {
    badge: string;
    title: string;
    subtitle: string;
    ctaBtn: string;
    viewScript: string;
    copyScript: string;
    copied: string;
    scriptHeader: string;
    stepsHeader: string;
  };
  footer: {
    aboutTitle: string;
    privacyTitle: string;
    noticeTitle: string;
    sitemapTitle: string;
    toolsTitle: string;
    legalTitle: string;
    copyright: string;
    followUs: string;
    disclaimer: string;
    story: string;
    madeWith: string;
    creator: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  // 1. English
  en: {
    siteTitle: 'POSTALPRO',
    hubSubtitle: 'Postal Utility Hub',
    nav: {
      home: 'Home',
      tools: 'Tools',
      marketing: 'Marketing',
      theme: 'Theme',
      language: 'Language',
      vault: 'Encrypted Vault'
    },
    hero: {
      badge: 'Postal Utility Hub',
      exploreTools: 'Explore Tools →',
      exploreMarketing: 'Marketing Strategies →'
    },
    pliSection: {
      badge: 'PLI Leads Pro WebApp',
      title: 'PLI & RPLI Smart Leads Management',
      subtitle: 'Streamline insurance prospecting, door-to-door lead capture, instant quote calculation, and policy tracking for Branch Postmasters & Agents.',
      ctaBtn: 'Launch PLI Leads App ↗',
      step1Title: 'Prospect Capture & Profiling',
      step1Desc: 'Capture prospect name, age, village, and budget in under 30 seconds.',
      step2Title: 'Instant Bonus & Quote Math',
      step2Desc: 'Auto-calculates Santosh / Suraksha premium & guaranteed maturity bonus.',
      step3Title: '1-Click WhatsApp Pitch',
      step3Desc: 'Dispatches personalized regional quotation flyer to customer mobile.',
      step4Title: 'Commission & Policy Tracking',
      step4Desc: 'Tracks proposal completion, medical clearing, and BPM commission credits.',
      liveDemo: 'Live WebApp Preview',
      prospectCard: 'Active Prospect Record',
      sumAssured: 'Sum Assured',
      monthlyPremium: 'Monthly Premium',
      maturityVal: 'Maturity (Age 58)',
      quoteSent: 'Quote Dispatched via WhatsApp',
      bpmCommission: 'BPM Commission'
    },
    tdSection: {
      badge: 'TD Bill Generator Studio',
      title: 'TD Commission BPM Incentive Bill Generator',
      subtitle: 'Department of Posts official monthly claim schedule with 12-digit Finacle validation, ₹50,000 deposit rule, and strict 20 entries per A4 page pagination.',
      ctaBtn: 'Open TD Bill Generator ↗',
      feature1Title: '12-Digit Finacle Account Sanitization',
      feature1Desc: 'Automatic 12-digit validation, duplicate check, and PR/SB-103 matching.',
      feature2Title: 'Automated 1Y / 2Y / 3Y / 5Y Rate Engine',
      feature2Desc: 'Instant rule compliance: 0.5% for 1Y, 1.0% for 2Y/3Y, and 2.0% for 5Y TD.',
      feature3Title: 'Strict 20 Entries per A4 Page Schedule',
      feature3Desc: 'Smart pagination splits large registers into exact 20-row standard A4 sheets.',
      feature4Title: 'Official Department Print & Signatures',
      feature4Desc: 'Includes DOP Header, BPM Acceptance, SPM Sanction & BPM Acquittance receipts.',
      liveDemo: 'Official Schedule Replica',
      officialSchedule: 'DEPARTMENT OF POSTS INDIA • TD INCENTIVE SCHEDULE',
      accNo: 'Account No',
      depositor: 'Depositor',
      deposit: 'Deposit',
      incentive: 'Incentive',
      signatures: 'BPM & SPM Signature Blocks Included'
    },
    toolsSection: {
      badge: 'Interactive Postal Suite',
      title: 'Interactive Postal Utilities & Calculators',
      subtitle: 'Instant POSB calculations, DIGIPIN lookups, GDS salary estimators, and departmental tools.',
      launchBtn: 'Launch Utility'
    },
    marketingSection: {
      badge: 'Grassroots GDS Growth Playbooks',
      title: 'High-Conversion Postal Marketing Strategies',
      subtitle: 'Proven grassroots promotional tactics, campaign toolkits, and pitch scripts designed for GDS & Postmasters to double branch deposits.',
      ctaBtn: 'Explore All Strategies →',
      viewScript: 'View Campaign Script',
      copyScript: 'Copy Script',
      copied: 'Copied!',
      scriptHeader: 'Ready-to-Use Customer Pitch Script',
      stepsHeader: 'Implementation Steps:'
    },
    footer: {
      aboutTitle: 'About Us',
      privacyTitle: 'Privacy Policy',
      noticeTitle: 'Public Notice',
      sitemapTitle: 'Sitemap',
      toolsTitle: 'Postal Tools & Apps',
      legalTitle: 'Legal & Transparency',
      copyright: '© 2026 PostalPro India. Built by tech-enthusiastic GDS.',
      followUs: 'Connect With PostalPro Community',
      disclaimer: 'Independent postal utility portal designed exclusively to assist Department of Posts employees and GDS.',
      story: 'Built for India Post Branch Postmasters, Postal Assistants, and GDS. Empowering daily branch operations with modern, secure, offline-first digital tools.',
      madeWith: 'Crafted with passion for',
      creator: 'India Post'
    }
  },

  // 2. Hindi (हिन्दी)
  hi: {
    siteTitle: 'POSTALPRO',
    hubSubtitle: 'पोस्टल यूटिलिटी हब',
    nav: {
      home: 'होम',
      tools: 'उपकरण',
      marketing: 'मार्केटिंग',
      theme: 'थीम',
      language: 'भाषा',
      vault: 'एन्क्रिप्टेड वॉल्ट'
    },
    hero: {
      badge: 'पोस्टल यूटिलिटी हब',
      exploreTools: 'उपकरण देखें →',
      exploreMarketing: 'मार्केटिंग रणनीतियाँ →'
    },
    pliSection: {
      badge: 'PLI लीड्स प्रो वेबऐप',
      title: 'PLI एवं RPLI स्मार्ट लीड्स प्रबंधन',
      subtitle: 'शाखा डाकपालों (BPM) एवं एजेंटों के लिए आसान बीमा प्रोस्पेक्टिंग, घर-घर लीड कैप्चर, त्वरित प्रीमियम गणना और पॉलिसी ट्रैकिंग।',
      ctaBtn: 'PLI लीड्स ऐप खोलें ↗',
      step1Title: 'लीड प्रविष्टि और प्रोफाइलिंग',
      step1Desc: '30 सेकंड से कम समय में ग्राहक का नाम, आयु, गाँव और बजट दर्ज करें।',
      step2Title: 'त्वरित बोनस एवं कोटेशन गणना',
      step2Desc: 'संतोष / सुरक्षा का प्रीमियम और गारंटीड मैच्योरिटी बोनस तुरंत निकालें।',
      step3Title: '1-क्लिक व्हाट्सएप कोटेशन',
      step3Desc: 'ग्राहक के मोबाइल पर व्यक्तिगत रीजनल कोटेशन तुरंत भेजें।',
      step4Title: 'कमीशन और पॉलिसी ट्रैकिंग',
      step4Desc: 'प्रपोजल पूर्णता, मेडिकल क्लियरेंस और BPM कमीशन क्रेडिट ट्रैक करें।',
      liveDemo: 'लाइव वेबऐप पूर्वावलोकन',
      prospectCard: 'सक्रिय ग्राहक रिकॉर्ड',
      sumAssured: 'बीमा राशि (Sum Assured)',
      monthlyPremium: 'मासिक प्रीमियम',
      maturityVal: 'परिपक्वता राशि (58 वर्ष)',
      quoteSent: 'व्हाट्सएप पर कोटेशन भेजा गया',
      bpmCommission: 'BPM कमीशन'
    },
    tdSection: {
      badge: 'TD बिल जेनरेटर स्टूडियो',
      title: 'TD कमीशन BPM इंसेंटिव बिल जेनरेटर',
      subtitle: 'डाक विभाग का आधिकारिक मासिक क्लेम शेड्यूल, 12-अंक फिनाकल सत्यापन, ₹50,000 जमा नियम और प्रति पृष्ठ 20 प्रविष्टियों का A4 प्रिंट।',
      ctaBtn: 'TD बिल जेनरेटर खोलें ↗',
      feature1Title: '12-अंकीय फिनाकल खाता सत्यापन',
      feature1Desc: 'स्वचालित 12-अंक चेक, डुप्लीकेट पहचान और PR/SB-103 मिलान।',
      feature2Title: 'स्वचालित 1Y / 2Y / 3Y / 5Y दर गणना',
      feature2Desc: 'सटीक नियम: 1 वर्ष के लिए 0.5%, 2/3 वर्ष के लिए 1.0% और 5 वर्ष के लिए 2.0% कमीशन।',
      feature3Title: 'प्रति पृष्ठ 20 प्रविष्टियों का A4 शेड्यूल',
      feature3Desc: 'बड़े रजिस्टरों को मानक 20-पंक्तियों वाले A4 पेजों में स्वतः विभाजित करता है।',
      feature4Title: 'आधिकारिक डाक विभाग प्रिंट एवं हस्ताक्षर',
      feature4Desc: 'DOP हेडर, BPM स्वीकृति, SPM मंजूरी और हस्ताक्षरित रसीद शामिल।',
      liveDemo: 'आधिकारिक शेड्यूल प्रतिकृति',
      officialSchedule: 'भारतीय डाक विभाग • TD प्रोत्साहन बिल शेड्यूल',
      accNo: 'खाता संख्या',
      depositor: 'जमाकर्ता का नाम',
      deposit: 'जमा राशि',
      incentive: 'इंसेंटिव',
      signatures: 'BPM और SPM हस्ताक्षर ब्लॉक सहित'
    },
    toolsSection: {
      badge: 'इंटरएक्टिव पोस्टल सुइट',
      title: 'इंटरएक्टिव पोस्टल टूल्स और कैलकुलेटर',
      subtitle: 'त्वरित POSB गणना, DIGIPIN खोज, GDS वेतन अनुमानक और विभागीय उपयोगिताएं।',
      launchBtn: 'टूल शुरू करें'
    },
    marketingSection: {
      badge: 'GDS विकास रणनीतियाँ',
      title: 'उच्च-रूपांतरण पोस्टल मार्केटिंग रणनीतियाँ',
      subtitle: 'शाखा डाकपालों के लिए तैयार किए गए सिद्ध प्रचार अभियान, टूल्स और पिच स्क्रिप्ट्स।',
      ctaBtn: 'सभी रणनीतियाँ देखें →',
      viewScript: 'अभियान स्क्रिप्ट देखें',
      copyScript: 'स्क्रिप्ट कॉपी करें',
      copied: 'कॉपी हो गया!',
      scriptHeader: 'उपयोग के लिए तैयार ग्राहक पिच स्क्रिप्ट',
      stepsHeader: 'कार्यान्वयन के चरण:'
    },
    footer: {
      aboutTitle: 'हमारे बारे में',
      privacyTitle: 'गोपनीयता नीति',
      noticeTitle: 'सार्वजनिक सूचना',
      sitemapTitle: 'साइटमैप',
      toolsTitle: 'पोस्टल टूल्स एवं ऐप्स',
      legalTitle: 'कानूनी एवं पारदर्शिता',
      copyright: '© 2026 PostalPro India. डाक कर्मचारियों एवं GDS द्वारा निर्मित।',
      followUs: 'PostalPro समुदाय से जुड़ें',
      disclaimer: 'डाक विभाग के कर्मचारियों और GDS की सहायता के लिए स्वतंत्र पोस्टल यूटिलिटी पोर्टल।',
      story: 'भारतीय डाक शाखा डाकपालों और GDS के लिए निर्मित आधुनिक, सुरक्षित, ऑफलाइन डिजिटल टूल्स।',
      madeWith: 'भारतीय डाक परिवार के लिए समर्पित',
      creator: 'भारतीय डाक (India Post)'
    }
  },

  // 3. Telugu (తెలుగు)
  te: {
    siteTitle: 'POSTALPRO',
    hubSubtitle: 'పోస్టల్ యుటిలిటీ హబ్',
    nav: {
      home: 'హోమ్',
      tools: 'టూల్స్',
      marketing: 'మార్కెటింగ్',
      theme: 'థీమ్',
      language: 'భాష',
      vault: 'ఎన్‌క్రిప్టెడ్ వాల్ట్'
    },
    hero: {
      badge: 'పోస్టల్ యుటిలిటీ హబ్',
      exploreTools: 'టూల్స్ చూడండి →',
      exploreMarketing: 'మార్కెటింగ్ వ్యూహాలు →'
    },
    pliSection: {
      badge: 'PLI లీడ్స్ ప్రో వెబ్‌యాప్',
      title: 'PLI & RPLI స్మార్ట్ లీడ్స్ నిర్వహణ',
      subtitle: 'బ్రాంచ్ పోస్ట్‌మాస్టర్లు (BPM) & ఏజెంట్ల కోసం సులభమైన ఇన్సూరెన్స్ ప్రోస్పెక్టింగ్, డోర్-టు-డోర్ లీడ్స్ సేకరణ, తక్షణ కోట్ లెక్కింపు మరియు పాలసీ ట్రాకింగ్.',
      ctaBtn: 'PLI లీడ్స్ యాప్ ప్రారంభించండి ↗',
      step1Title: 'కస్టమర్ ప్రొఫైల్ నమోదు',
      step1Desc: '30 సెకన్లలో కస్టమర్ పేరు, వయస్సు, గ్రామం మరియు బడ్జెట్ నమోదు చేయండి.',
      step2Title: 'తక్షణ బోనస్ & ప్రీమియం లెక్కింపు',
      step2Desc: 'సంతోష్ / సురక్ష ప్రీమియం మరియు గ్యారంటీడ్ మెచ్యూరిటీ బోనస్ క్షణాల్లో లెక్కించండి.',
      step3Title: '1-క్లిక్ వాట్సాప్ కొటేషన్',
      step3Desc: 'కస్టమర్ మొబైల్‌కు వ్యక్తిగత తెలుగు కొటేషన్ ఫ్లైయర్ పంపించండి.',
      step4Title: 'కమిషన్ & పాలసీ ట్రాకింగ్',
      step4Desc: 'ప్రపోజల్ పూర్తి, మెడికల్ క్లియరెన్స్ మరియు BPM కమిషన్ వివరాలు ట్రాక్ చేయండి.',
      liveDemo: 'లైవ్ వెబ్‌యాప్ ప్రివ్యూ',
      prospectCard: 'యాక్టివ్ లీడ్ రికార్డు',
      sumAssured: 'బీమా మొత్తం (Sum Assured)',
      monthlyPremium: 'నెలవారీ ప్రీమియం',
      maturityVal: 'మెచ్యూరిటీ మొత్తం (58 ఏళ్లకు)',
      quoteSent: 'వాట్సాప్‌లో కొటేషన్ పంపబడింది',
      bpmCommission: 'BPM కమిషన్'
    },
    tdSection: {
      badge: 'TD బిల్ జనరేటర్ స్టూడియో',
      title: 'TD కమిషన్ BPM ఇన్సెంటివ్ బిల్ జనరేటర్',
      subtitle: 'తపాలా శాఖ అధికారిక క్లెయిమ్ షెడ్యూల్, 12-అంకెల ఫినాకిల్ ఖాతా ధృవీకరణ, ₹50,000 డిపాజిట్ నియమం మరియు పేజీకి 20 ఎంట్రీల A4 ప్రింట్.',
      ctaBtn: 'TD బిల్ జనరేటర్ తెరవండి ↗',
      feature1Title: '12-అంకెల ఫినాకిల్ ఖాతా ధృవీకరణ',
      feature1Desc: 'ఆటోమేటిక్ 12-అంకెల చెక్, డూప్లికేట్ గుర్తింపు మరియు PR/SB-103 సరిపోల్చడం.',
      feature2Title: 'ఆటోమేటెడ్ 1Y / 2Y / 3Y / 5Y రేట్ల లెక్కింపు',
      feature2Desc: 'ఖచ్చితమైన నియమాలు: 1 సం. కి 0.5%, 2/3 సం. లకు 1.0%, 5 సం. TD కి 2.0% ఇన్సెంటివ్.',
      feature3Title: 'పేజీకి ఖచ్చితంగా 20 ఎంట్రీల A4 షెడ్యూల్',
      feature3Desc: 'పెద్ద రిజిస్టర్లను అధికారిక 20-వరుసల A4 షీట్లుగా ఆటోమేటిక్‌గా విభజిస్తుంది.',
      feature4Title: 'అధికారిక తపాలా శాఖ ప్రింట్ & సంతకాలు',
      feature4Desc: 'DOP హెడర్, BPM అంగీకారం, SPM మంజూరు & రసీదు సంతకాల బ్లాకులు కలవు.',
      liveDemo: 'అధికారిక షెడ్యూల్ ప్రతిరూపం',
      officialSchedule: 'భారత తపాలా శాఖ • TD ప్రోత్సాహక బిల్లు షెడ్యూల్',
      accNo: 'ఖాతా సంఖ్య',
      depositor: 'డిపాజిటర్ పేరు',
      deposit: 'డిపాజిట్ మొత్తం',
      incentive: 'ఇన్సెంటివ్',
      signatures: 'BPM & SPM సంతకాల బ్లాకులతో సహా'
    },
    toolsSection: {
      badge: 'ఇంటరాక్టివ్ పోస్టల్ సూట్',
      title: 'ఇంటరాక్టివ్ పోస్టల్ టూల్స్ & కాలిక్యులేటర్లు',
      subtitle: 'తక్షణ POSB లెక్కలు, డిజిపిన్ (DIGIPIN) శోధన, GDS జీతం ఎస్టిమేటర్ మరియు శాఖాపరమైన సాధనాలు.',
      launchBtn: 'టూల్ ఓపెన్ చేయండి'
    },
    marketingSection: {
      badge: 'GDS ప్రమోషన్ వ్యూహాలు',
      title: 'డిపాజిట్లు పెంచే పోస్టల్ మార్కెటింగ్ వ్యూహాలు',
      subtitle: 'గ్రామీణ డాక్ సేవకులు మరియు పోస్ట్‌మాస్టర్ల కోసం రూపొందించిన క్షేత్రస్థాయి ప్రచార వ్యూహాలు మరియు పిచ్ స్క్రిప్టులు.',
      ctaBtn: 'అన్ని వ్యూహాలు చూడండి →',
      viewScript: 'పిచ్ స్క్రిప్ట్ చూడండి',
      copyScript: 'స్క్రిప్ట్ కాపీ చేయండి',
      copied: 'కాపీ అయ్యింది!',
      scriptHeader: 'కస్టమర్లకు వివరించడానికి సిద్ధంగా ఉన్న పిచ్ స్క్రిప్ట్',
      stepsHeader: 'అమలు చేయవలసిన దశలు:'
    },
    footer: {
      aboutTitle: 'మా గురించి',
      privacyTitle: 'గోప్యతా విధానం',
      noticeTitle: 'ప్రజా ప్రకటన',
      sitemapTitle: 'సైట్‌మ్యాప్',
      toolsTitle: 'పోస్టల్ టూల్స్ & యాప్స్',
      legalTitle: 'చట్టపరమైన & పారదర్శకత',
      copyright: '© 2026 PostalPro India. సాంకేతిక నిపుణులైన GDS మిత్రులచే రూపొందించబడింది.',
      followUs: 'PostalPro కమ్యూనిటీతో కనెక్ట్ అవ్వండి',
      disclaimer: 'తపాలా శాఖ ఉద్యోగులు మరియు GDSలకు సహాయం చేయడానికి రూపొందించిన స్వతంత్ర పోస్టల్ యుటిలిటీ పోర్టల్.',
      story: 'తపాలా శాఖ బ్రాంచ్ పోస్ట్‌మాస్టర్లు మరియు GDSల రోజువారీ సేవల కొరకు రూపొందించిన ఆధునిక డిజిటల్ టూల్స్.',
      madeWith: 'తపాలా శాఖ మిత్రుల కొరకు',
      creator: 'ఇండియా పోస్ట్ (India Post)'
    }
  },

  // 4. Tamil (தமிழ்)
  ta: {
    siteTitle: 'POSTALPRO',
    hubSubtitle: 'அஞ்சல் பயன்பாட்டு மையம்',
    nav: {
      home: 'முகப்பு',
      tools: 'கருவிகள்',
      marketing: 'சந்தைப்படுத்தல்',
      theme: 'தீம்',
      language: 'மொழி',
      vault: 'பாதுகாப்பான பெட்டகம்'
    },
    hero: {
      badge: 'அஞ்சல் பயன்பாட்டு மையம்',
      exploreTools: 'கருவிகளை காண்க →',
      exploreMarketing: 'சந்தைப்படுத்தல் உத்திகள் →'
    },
    pliSection: {
      badge: 'PLI லீட்ஸ் புரோ வலைச்செயலி',
      title: 'PLI & RPLI ஸ்மார்ட் லீட்ஸ் மேலாண்மை',
      subtitle: 'கிளை அஞ்சலக தலைவர்கள் (BPM) & முகவர்களுக்கான எளிதான காப்பீட்டு கணக்கீடு, வீடு வீடாக லீட் சேகரிப்பு மற்றும் பாலிசி கண்காணிப்பு.',
      ctaBtn: 'PLI லீட்ஸ் செயலியைத் திறக்கவும் ↗',
      step1Title: 'வாடிக்கையாளர் விவர பதிவு',
      step1Desc: '30 வினாடிகளுக்குள் வாடிக்கையாளர் பெயர், வயது, கிராமம் ஆகியவற்றை பதிவு செய்யவும்.',
      step2Title: 'உடனடி போனஸ் & பிரீமியம் கணக்கீடு',
      step2Desc: 'சந்தோஷ் / சுரக்ஷா பிரீமியம் மற்றும் முதிர்வு போனஸை உடனடியாக கணக்கிடுங்கள்.',
      step3Title: '1-கிளிக் வாட்ஸ்அப் கொட்டேஷன்',
      step3Desc: 'வாடிக்கையாளரின் மொபைலுக்கு தனிப்பயனாக்கப்பட்ட தமிழ் கொட்டேஷனை அனுப்பவும்.',
      step4Title: 'கமிஷன் & பாலிசி கண்காணிப்பு',
      step4Desc: 'முன்மொழிவு முடிவு மற்றும் BPM கமிஷன் வரவுகளை கண்காணிக்கவும்.',
      liveDemo: 'நேரலை செயலி முன்னோட்டம்',
      prospectCard: 'செயலில் உள்ள வாடிக்கையாளர் பதிவு',
      sumAssured: 'காப்பீட்டு தொகை (Sum Assured)',
      monthlyPremium: 'மாத பிரீமியம்',
      maturityVal: 'முதிர்வுத் தொகை (வயது 58)',
      quoteSent: 'வாட்ஸ்அப் மூலம் அனுப்பப்பட்டது',
      bpmCommission: 'BPM கமிஷன்'
    },
    tdSection: {
      badge: 'TD பில் ஜெனரேட்டர்',
      title: 'TD கமிஷன் BPM ஊக்கத்தொகை பில் ஜெனரேட்டர்',
      subtitle: 'அஞ்சல் துறையின் அதிகாரப்பூர்வ கோரிக்கை அட்டவணை, 12-இலக்க பினாகில் சரிபார்ப்பு, ₹50,000 வைப்பு விதி மற்றும் பக்கத்திற்கு 20 பதிவுகள் A4 அச்சு.',
      ctaBtn: 'TD பில் ஜெனரேட்டரைத் திற ↗',
      feature1Title: '12-இலக்க பினாகில் கணக்கு சரிபார்ப்பு',
      feature1Desc: 'தானியங்கி 12-இலக்க சரிபார்ப்பு, நகல் கண்டறிதல் மற்றும் PR/SB-103 பொருத்தம்.',
      feature2Title: 'தானியங்கி 1Y / 2Y / 3Y / 5Y ஊக்கத்தொகை கணக்கீடு',
      feature2Desc: 'துல்லியமான விதிகள்: 1 வருடத்திற்கு 0.5%, 2/3 வருடத்திற்கு 1.0%, 5 வருட TDக்கு 2.0%.',
      feature3Title: 'பக்கத்திற்கு 20 பதிவுகள் கொண்ட A4 அட்டவணை',
      feature3Desc: 'பெரிய பதிவேடுகளை தானாகவே நிலையான 20 வரிசை A4 தாள்களாகப் பிரிக்கிறது.',
      feature4Title: 'அதிகாரப்பூர்வ அஞ்சல் துறை அச்சு & கையொப்பங்கள்',
      feature4Desc: 'DOP தலைப்பு, BPM ஏற்பு, SPM அனுமதி & ரசீது கையொப்பங்கள் அடங்கும்.',
      liveDemo: 'அதிகாரப்பூர்வ அட்டவணை மாதிரி',
      officialSchedule: 'இந்திய அஞ்சல் துறை • TD ஊக்கத்தொகை பட்டியல்',
      accNo: 'கணக்கு எண்',
      depositor: 'வைப்பாளர் பெயர்',
      deposit: 'வைப்புத் தொகை',
      incentive: 'ஊக்கத்தொகை',
      signatures: 'BPM & SPM கையொப்ப கட்டங்களுடன்'
    },
    toolsSection: {
      badge: 'ஊடாடும் அஞ்சல் கருவிகள்',
      title: 'ஊடாடும் அஞ்சல் கருவிகள் மற்றும் கால்குலேட்டர்கள்',
      subtitle: 'உடனடி POSB கணக்கீடுகள், DIGIPIN தேடல், GDS சம்பள மதிப்பீட்டாளர் மற்றும் துறைசார் கருவிகள்.',
      launchBtn: 'கருவியைத் தொடங்கு'
    },
    marketingSection: {
      badge: 'GDS வளர்ச்சி உத்திகள்',
      title: 'அதிக பலனளிக்கும் அஞ்சல் சந்தைப்படுத்தல் உத்திகள்',
      subtitle: 'GDS மற்றும் அஞ்சலக தலைவர்களுக்கான களப்பணி உத்திகள் மற்றும் வாடிக்கையாளர் உரையாடல் ஸ்கிரிப்டுகள்.',
      ctaBtn: 'அனைத்து உத்திகளையும் காண்க →',
      viewScript: 'பேச்சு ஸ்கிரிப்டைக் காண்க',
      copyScript: 'நகலெடு',
      copied: 'நகலெடுக்கப்பட்டது!',
      scriptHeader: 'வாடிக்கையாளர் பேச்சு ஸ்கிரிப்ட்',
      stepsHeader: 'செயல்படுத்தும் படிகள்:'
    },
    footer: {
      aboutTitle: 'எங்களைப் பற்றி',
      privacyTitle: 'தனியுரிமைக் கொள்கை',
      noticeTitle: 'பொது அறிவிப்பு',
      sitemapTitle: 'தள வரைபடம்',
      toolsTitle: 'அஞ்சல் கருவிகள்',
      legalTitle: 'சட்டம் & வெளிப்படைத்தன்மை',
      copyright: '© 2026 PostalPro India. தொழில் நுட்ப ஆர்வமுள்ள GDS ஆல் உருவாக்கப்பட்டது.',
      followUs: 'PostalPro சமூகத்துடன் இணையுங்கள்',
      disclaimer: 'அஞ்சல் துறை ஊழியர்கள் மற்றும் GDS-களுக்கு உதவ உருவாக்கப்பட்ட சுயாதீன போர்டல்.',
      story: 'அஞ்சல் துறை ஊழியர்கள் மற்றும் GDSகளின் தினசரி பணிகளை எளிதாக்க உருவாக்கப்பட்ட நவீன டிஜிட்டல் கருவிகள்.',
      madeWith: 'அஞ்சல் ஊழியர்களுக்காக',
      creator: 'இந்தியா போஸ்ட் (India Post)'
    }
  },

  // 5. Kannada (ಕನ್ನಡ)
  kn: {
    siteTitle: 'POSTALPRO',
    hubSubtitle: 'ಅಂಚೆ ಯುಟಿಲಿಟಿ ಹಬ್',
    nav: {
      home: 'ಮುಖಪುಟ',
      tools: 'ಉಪಕರಣಗಳು',
      marketing: 'ಮಾರ್ಕೆಟಿಂಗ್',
      theme: 'ಥೀಮ್',
      language: 'ಭಾಷೆ',
      vault: 'ಎನ್‌ಕ್ರಿಪ್ಟೆಡ್ ವಾಲ್ಟ್'
    },
    hero: {
      badge: 'ಅಂಚೆ ಯುಟಿಲಿಟಿ ಹಬ್',
      exploreTools: 'ಉಪಕರಣಗಳನ್ನು ನೋಡಿ →',
      exploreMarketing: 'ಮಾರ್ಕೆಟಿಂಗ್ ತಂತ್ರಗಳು →'
    },
    pliSection: {
      badge: 'PLI ಲೀಡ್ಸ್ ಪ್ರೊ ವೆಬ್‌ಆ್ಯಪ್',
      title: 'PLI & RPLI ಸ್ಮಾರ್ಟ್ ಲೀಡ್ಸ್ ನಿರ್ವಹಣೆ',
      subtitle: 'ಬ್ರಾಂಚ್ ಪೋಸ್ಟ್‌ಮಾಸ್ಟರ್‌ಗಳು (BPM) ಮತ್ತು ಏಜೆಂಟ್‌ಗಳಿಗಾಗಿ ಸುಲಭ ವಿಮಾ ಲೆಕ್ಕಾಚಾರ, ಲೀಡ್ ಸಂಗ್ರಹ ಮತ್ತು ಪಾಲಿಸಿ ಟ್ರ್ಯಾಕಿಂಗ್.',
      ctaBtn: 'PLI ಲೀಡ್ಸ್ ಆ್ಯಪ್ ತೆರೆಯಿರಿ ↗',
      step1Title: 'ಗ್ರಾಹಕರ ವಿವರ ನೋಂದಣಿ',
      step1Desc: '30 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಗ್ರಾಹಕರ ಹೆಸರು, ವಯಸ್ಸು, ಗ್ರಾಮ ಮತ್ತು ಬಜೆಟ್ ನಮೂದಿಸಿ.',
      step2Title: 'ತ್ವರಿತ ಬೋನಸ್ & ಪ್ರೀಮಿಯಂ ಲೆಕ್ಕಾಚಾರ',
      step2Desc: 'ಸಂತೋಷ್ / ಸುರಕ್ಷಾ ಪ್ರೀಮಿಯಂ ಮತ್ತು ಗ್ಯಾರಂಟಿ ಮೆಚ್ಯೂರಿಟಿ ಬೋನಸ್ ಲೆಕ್ಕಹಾಕಿ.',
      step3Title: '1-ಕ್ಲಿಕ್ ವಾಟ್ಸಾಪ್ ಕೊಟೇಶನ್',
      step3Desc: 'ಗ್ರಾಹಕರ ಮೊಬೈಲ್‌ಗೆ ವೈಯಕ್ತಿಕ ಕನ್ನಡ ಕೊಟೇಶನ್ ಕಳುಹಿಸಿ.',
      step4Title: 'ಕಮಿಷನ್ & ಪಾಲಿಸಿ ಟ್ರ್ಯಾಕಿಂಗ್',
      step4Desc: 'ಪ್ರಸ್ತಾವನೆ ಪೂರ್ಣತೆ ಮತ್ತು BPM ಕಮಿಷನ್ ಕ್ರೆಡಿಟ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
      liveDemo: 'ಲೈವ್ ವೆಬ್‌ಆ್ಯಪ್ ಪೂರ್ವವೀಕ್ಷಣೆ',
      prospectCard: 'ಸಕ್ರಿಯ ಲೀಡ್ ದಾಖಲೆ',
      sumAssured: 'ವಿಮಾ ಮೊತ್ತ (Sum Assured)',
      monthlyPremium: 'ಮಾಸಿಕ ಪ್ರೀಮಿಯಂ',
      maturityVal: 'ಮೆಚ್ಯೂರಿಟಿ ಮೊತ್ತ (58 ವರ್ಷಕ್ಕೆ)',
      quoteSent: 'ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಕಳುಹಿಸಲಾಗಿದೆ',
      bpmCommission: 'BPM ಕಮಿಷನ್'
    },
    tdSection: {
      badge: 'TD ಬಿಲ್ ಜನರೇಟರ್',
      title: 'TD ಕಮಿಷನ್ BPM ಇನ್ಸೆಂಟಿವ್ ಬಿಲ್ ಜನರೇಟರ್',
      subtitle: 'ಅಂಚೆ ಇಲಾಖೆಯ ಅಧಿಕೃತ ಕ್ಲೈಮ್ ಶೆಡ್ಯೂಲ್, 12-ಅಂಕಿಯ ಫಿನಾಕಲ್ ಖಾತೆ ಪರಿಶೀಲನೆ, ₹50,000 ಠೇವಣಿ ನಿಯಮ ಮತ್ತು ಪುಟಕ್ಕೆ 20 ನಮೂದುಗಳ A4 ಮುದ್ರಣ.',
      ctaBtn: 'TD ಬಿಲ್ ಜನರೇಟರ್ ತೆರೆಯಿರಿ ↗',
      feature1Title: '12-ಅಂಕಿಯ ಫಿನಾಕಲ್ ಖಾತೆ ಪರಿಶೀಲನೆ',
      feature1Desc: 'ಸ್ವಯಂಚಾಲಿತ 12-ಅಂಕಿ ಚೆಕ್, ನಕಲಿ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು PR/SB-103 ತಾಳೆ.',
      feature2Title: 'ಸ್ವಯಂಚಾಲಿತ 1Y / 2Y / 3Y / 5Y ದರ ಲೆಕ್ಕಾಚಾರ',
      feature2Desc: 'ನಿಖರ ನಿಯಮಗಳು: 1 ವರ್ಷಕ್ಕೆ 0.5%, 2/3 ವರ್ಷಕ್ಕೆ 1.0%, 5 ವರ್ಷದ TDಗೆ 2.0%.',
      feature3Title: 'ಪುಟಕ್ಕೆ ನಿಖರವಾಗಿ 20 ನಮೂದುಗಳ A4 ಶೆಡ್ಯೂಲ್',
      feature3Desc: 'ದೊಡ್ಡ ರಿಜಿಸ್ಟರ್‌ಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ 20 ಸಾಲುಗಳ A4 ಶೀಟ್‌ಗಳಾಗಿ ವಿಭಜಿಸುತ್ತದೆ.',
      feature4Title: 'ಅಧಿಕೃತ ಅಂಚೆ ಇಲಾಖೆ ಮುದ್ರಣ & ಸಹಿಗಳು',
      feature4Desc: 'DOP ಹೆಡರ್, BPM ಸ್ವೀಕಾರ, SPM ಮಂಜೂರಾತಿ ಮತ್ತು ರಸೀದಿ ಸಹಿ ಬ್ಲಾಕ್‌ಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.',
      liveDemo: 'ಅಧಿಕೃತ ಶೆಡ್ಯೂಲ್ ಪ್ರತಿರೂಪ',
      officialSchedule: 'ಭಾರತೀಯ ಅಂಚೆ ಇಲಾಖೆ • TD ಪ್ರೋತ್ಸಾಹಕ ಬಿಲ್ ಶೆಡ್ಯೂಲ್',
      accNo: 'ಖಾತೆ ಸಂಖ್ಯೆ',
      depositor: 'ಠೇವಣಿದಾರರ ಹೆಸರು',
      deposit: 'ಠೇವಣಿ ಮೊತ್ತ',
      incentive: 'ಇನ್ಸೆಂಟಿವ್',
      signatures: 'BPM ಮತ್ತು SPM ಸಹಿ ಬ್ಲಾಕ್‌ಗಳೊಂದಿಗೆ'
    },
    toolsSection: {
      badge: 'ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಅಂಚೆ ಸೂಟ್',
      title: 'ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಅಂಚೆ ಉಪಕರಣಗಳು ಮತ್ತು ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು',
      subtitle: 'ತ್ವರಿತ POSB ಲೆಕ್ಕಾಚಾರ, DIGIPIN ಹುಡುಕಾಟ, GDS ವೇತನ ಅಂದಾಜುಗಾರ ಮತ್ತು ಇಲಾಖಾ ಉಪಕರಣಗಳು.',
      launchBtn: 'ಉಪಕರಣ ಪ್ರಾರಂಭಿಸಿ'
    },
    marketingSection: {
      badge: 'GDS ಪ್ರಚಾರ ತಂತ್ರಗಳು',
      title: 'ಹೆಚ್ಚಿನ ಠೇವಣಿ ತರುವ ಅಂಚೆ ಮಾರ್ಕೆಟಿಂಗ್ ತಂತ್ರಗಳು',
      subtitle: 'ಗ್ರಾಮೀಣ ಡಾಕ್ ಸೇವಕರು ಮತ್ತು ಪೋಸ್ಟ್‌ಮಾಸ್ಟರ್‌ಗಳಿಗಾಗಿ ಕ್ಷೇತ್ರ ಮಟ್ಟದ ಪ್ರಚಾರ ತಂತ್ರಗಳು ಮತ್ತು ಸಂಭಾಷಣಾ ಸ್ಕ್ರಿಪ್ಟ್‌ಗಳು.',
      ctaBtn: 'ಎಲ್ಲಾ ತಂತ್ರಗಳನ್ನು ವೀಕ್ಷಿಸಿ →',
      viewScript: 'ಪಿಚ್ ಸ್ಕ್ರಿಪ್ಟ್ ನೋಡಿ',
      copyScript: 'ಸ್ಕ್ರಿಪ್ಟ್ ಕಾಪಿ ಮಾಡಿ',
      copied: 'ಕಾಪಿಯಾಗಿದೆ!',
      scriptHeader: 'ಗ್ರಾಹಕರೊಂದಿಗೆ ಮಾತನಾಡಲು ಸಿದ್ಧ ಸ್ಕ್ರಿಪ್ಟ್',
      stepsHeader: 'ಅನುಷ್ಠಾನದ ಹಂತಗಳು:'
    },
    footer: {
      aboutTitle: 'ನಮ್ಮ ಬಗ್ಗೆ',
      privacyTitle: 'ಗೌಪ್ಯತೆ ನೀತಿ',
      noticeTitle: 'ಸಾರ್ವಜನಿಕ ಸೂಚನೆ',
      sitemapTitle: 'ಸೈಟ್‌ಮ್ಯಾಪ್',
      toolsTitle: 'ಅಂಚೆ ಉಪಕರಣಗಳು',
      legalTitle: 'ಕಾನೂನು ಮತ್ತು ಪಾರದರ್ಶಕತೆ',
      copyright: '© 2026 PostalPro India. ತಂತ್ರಜ್ಞಾನ ಉತ್ಸಾಹಿ GDS ನಿರ್ಮಿಸಿದ್ದಾರೆ.',
      followUs: 'PostalPro ಸಮುದಾಯದೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ',
      disclaimer: 'ಅಂಚೆ ಇಲಾಖೆಯ ಉದ್ಯೋಗಿಗಳು ಮತ್ತು GDS ಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು ರಚಿಸಲಾದ ಸ್ವತಂತ್ರ ಪೋರ್ಟಲ್.',
      story: 'ಅಂಚೆ ಇಲಾಖೆಯ ಸಿಬ್ಬಂದಿಯ ದೈನಂದಿನ ಸೇವೆಗಳಿಗಾಗಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾದ ಆಧುನಿಕ ಆಫ್‌ಲೈನ್ ಡಿಜಿಟಲ್ ಟೂಲ್ಸ್.',
      madeWith: 'ಅಂಚೆ ಸಿಬ್ಬಂದಿಗಾಗಿ',
      creator: 'ಭಾರತೀಯ ಅಂಚೆ (India Post)'
    }
  },

  // 6. Bengali (বাংলা)
  bn: {
    siteTitle: 'POSTALPRO',
    hubSubtitle: 'পোস্টাল ইউটিলিটি হাব',
    nav: {
      home: 'হোম',
      tools: 'টুলস',
      marketing: 'মার্কেটিং',
      theme: 'থিম',
      language: 'ভাষা',
      vault: 'এনক্রিপ্ট করা ভল্ট'
    },
    hero: {
      badge: 'পোস্টাল ইউটিলিটি হাব',
      exploreTools: 'টুলস দেখুন →',
      exploreMarketing: 'মার্কেটিং কৌশল →'
    },
    pliSection: {
      badge: 'PLI লিডস প্রো ওয়েবঅ্যাপ',
      title: 'PLI ও RPLI স্মার্ট লিডস ম্যানেজমেন্ট',
      subtitle: 'শাখা পোস্টমাস্টার (BPM) এবং এজেন্টদের জন্য সহজ বীমা লিড সংগ্রহ, তাত্ক্ষণিক প্রিমিয়াম গণনা এবং পলিসি ট্র্যাকিং।',
      ctaBtn: 'PLI লিডস অ্যাপ খুলুন ↗',
      step1Title: 'গ্রাহকের তথ্য সংগ্রহ',
      step1Desc: '৩০ সেকেন্ডের মধ্যে গ্রাহকের নাম, বয়স, গ্রাম এবং বাজেট এন্ট্রি করুন।',
      step2Title: 'তাত্ক্ষণিক বোনাস ও প্রিমিয়াম গণনা',
      step2Desc: 'সন্তোষ / সুরক্ষার প্রিমিয়াম ও গ্যারান্টিযুক্ত ম্যাচিউরিটি বোনাস সাথে সাথে পান।',
      step3Title: '১-ক্লিক হোয়াটসঅ্যাপ কোটেশন',
      step3Desc: 'গ্রাহকের মোবাইলে বাংলায় ব্যক্তিগত কোটেশন পাঠান।',
      step4Title: 'কমিশন ও পলিসি ট্র্যাকিং',
      step4Desc: 'প্রস্তাব নিষ্পত্তি এবং BPM কমিশন ক্রেডিট ট্র্যাক করুন।',
      liveDemo: 'লাইভ ওয়েবঅ্যাপ প্রিভিউ',
      prospectCard: 'সক্রিয় লিড রেকর্ড',
      sumAssured: 'বীমা রাশি (Sum Assured)',
      monthlyPremium: 'মাসিক প্রিমিয়াম',
      maturityVal: 'ম্যাচিউরিটি রাশি (৫৮ বছর)',
      quoteSent: 'হোয়াটসঅ্যাপে কোটেশন পাঠানো হয়েছে',
      bpmCommission: 'BPM কমিশন'
    },
    tdSection: {
      badge: 'TD বিল জেনারেটর স্টুডিও',
      title: 'TD কমিশন BPM ইনসেন্টিভ বিল জেনারেটর',
      subtitle: 'ডাক বিভাগের অফিসিয়াল মাসিক দাবি শিডিউল, ১২-সংখ্যার ফিন্যাকল যাচাইকরণ, ₹৫০,০০০ আমানত নিয়ম এবং প্রতি পৃষ্ঠায় ২০টি এন্ট্রি সম্বলিত A4 প্রিন্ট।',
      ctaBtn: 'TD বিল জেনারেটর খুলুন ↗',
      feature1Title: '১২-সংখ্যার ফিন্যাকল অ্যাকাউন্ট যাচাই',
      feature1Desc: 'স্বয়ংক্রিয় ১২-সংখ্যার চেক, ডুপ্লিকেট শনাক্তকরণ এবং PR/SB-103 মিল।',
      feature2Title: 'স্বয়ংক্রিয় 1Y / 2Y / 3Y / 5Y হার গণনা',
      feature2Desc: 'সঠিক নিয়ম: ১ বছরের জন্য ০.৫%, ২/৩ বছরের জন্য ১.০%, ৫ বছরের TD-তে ২.০%।',
      feature3Title: 'প্রতি পৃষ্ঠায় ২০টি এন্ট্রির A4 শিডিউল',
      feature3Desc: 'বড় রেজিস্টারগুলিকে স্বয়ংক্রিয়ভাবে ২০ লাইনের A4 শিটে বিভক্ত করে।',
      feature4Title: 'অফিসিয়াল ডাক বিভাগ প্রিন্ট ও স্বাক্ষর',
      feature4Desc: 'DOP হেডার, BPM স্বীকৃতি, SPM অনুমোদন ও রসিদ স্বাক্ষর ব্লক অন্তর্ভুক্ত।',
      liveDemo: 'অফিসিয়াল শিডিউল রেপ্লিকা',
      officialSchedule: 'ভারতীয় ডাক বিভাগ • TD প্রণোদনা বিল শিডিউল',
      accNo: 'অ্যাকাউন্ট নম্বর',
      depositor: 'আমানতকারীর নাম',
      deposit: 'আমানত রাশি',
      incentive: 'ইনসেন্টিভ',
      signatures: 'BPM ও SPM স্বাক্ষর ব্লক সহ'
    },
    toolsSection: {
      badge: 'ইন্টারেক্টিভ পোস্টাল স্যুট',
      title: 'ইন্টারেক্টিভ পোস্টাল টুলস ও ক্যালকুলেটর',
      subtitle: 'তাত্ক্ষণিক POSB হিসাব, DIGIPIN অনুসন্ধান, GDS বেতন অনুমানকারী এবং বিভাগীয় সরঞ্জাম।',
      launchBtn: 'টুল চালু করুন'
    },
    marketingSection: {
      badge: 'GDS বিকাশ কৌশল',
      title: 'আমানত বৃদ্ধির পোস্টাল মার্কেটিং কৌশল',
      subtitle: 'গ্রামীণ ডাক সেবক এবং পোস্টমাস্টারদের জন্য মাঠ পর্যায়ের প্রচারমূলক কৌশল এবং পিচ স্ক্রিপ্ট।',
      ctaBtn: 'সকল কৌশল দেখুন →',
      viewScript: 'প্রচার স্ক্রিপ্ট দেখুন',
      copyScript: 'স্ক্রিপ্ট কপি করুন',
      copied: 'কপি হয়েছে!',
      scriptHeader: 'গ্রাহকদের জন্য প্রস্তুত পিচ স্ক্রিপ্ট',
      stepsHeader: 'বাস্তবায়নের ধাপসমূহ:'
    },
    footer: {
      aboutTitle: 'আমাদের সম্পর্কে',
      privacyTitle: 'গোপনীয়তা নীতি',
      noticeTitle: 'পাবলিক নোটিশ',
      sitemapTitle: 'সাইটম্যাপ',
      toolsTitle: 'পোস্টাল সরঞ্জাম ও অ্যাপস',
      legalTitle: 'আইনি ও স্বচ্ছতা',
      copyright: '© 2026 PostalPro India. প্রযুক্তিপ্রেমী GDS দ্বারা নির্মিত।',
      followUs: 'PostalPro সম্প্রদায়ে যুক্ত হন',
      disclaimer: 'ডাক বিভাগের কর্মী এবং GDS-দের সহায়তার জন্য তৈরি স্বাধীন পোস্টাল ইউটিলিটি পোর্টাল।',
      story: 'ডাক বিভাগের শাখা পোস্টমাস্টার ও GDS-দের জন্য নির্মিত আধুনিক অফলাইন ডিজিটাল টুলস।',
      madeWith: 'ডাক পরিবারের জন্য নিবেদিত',
      creator: 'ভারতীয় ডাক (India Post)'
    }
  }
};

