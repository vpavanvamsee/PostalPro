export interface GuideItem {
  id: string;
  title: string;
  category: 'PO Guide' | 'Postal Volume' | 'Act & Amendment' | 'Operational Rules';
  summary: string;
  chapters: {
    name: string;
    description: string;
    keyRules: string[];
  }[];
}

export const POSTAL_GUIDES_DATA: GuideItem[] = [
  {
    id: 'po-guide-1',
    title: 'Post Office Guide Part I (Inland Post)',
    category: 'PO Guide',
    summary: 'Comprehensive rules regarding inland postal transmission, postage stamps, delivery, and transmission of parcels and letters.',
    chapters: [
      {
        name: 'Section I: General Rules',
        description: 'Hours of business, postal identity cards, treatment of unpaid and insufficiently paid articles.',
        keyRules: [
          'Unpaid articles are charged double the deficient postage on delivery.',
          'Post Restante articles are detained in the post office for a period not exceeding one month (except V.P. articles: 7 days).',
          'Certificate of Posting facility rules and window delivery procedures.'
        ]
      },
      {
        name: 'Section II: Packing & Addressing Rules',
        description: 'Proper methods of addressing, postal index numbers (PIN), and prohibited articles in transit.',
        keyRules: [
          'Sender’s address should preferably be written on the lower left-hand corner.',
          'Explosive, dangerous, noxious, or living creatures (except bees, silkworms) are strictly prohibited.',
          'Articles containing currency notes, bullion, or gold must be insured.'
        ]
      }
    ]
  },
  {
    id: 'postal-vol-5',
    title: 'Postal Volume V (Mail & Sorting)',
    category: 'Postal Volume',
    summary: 'Definitions and regulations regarding Railway Mail Service (RMS), Transit Sections, Sorting Sub Offices, and bag accounting.',
    chapters: [
      {
        name: 'Chapter 1: Definitions & Terminology',
        description: 'Key definitions of Head Record Office (HRO), Sub Record Office (SRO), Transit Mail Office (TMO).',
        keyRules: [
          'Work Papers: Daily documents maintained by RMS transit sections.',
          'Due Mails and Unusual Mails distinction.',
          'Station Bag vs Sorting Bag vs Direct Bag operations.'
        ]
      }
    ]
  },
  {
    id: 'postal-vol-6-7',
    title: 'Postal Volume VI (Part I & III) & Volume VII',
    category: 'Postal Volume',
    summary: 'Duties of Postmasters, Sub-Postmasters, Branch Postmasters, Delivery Agents, and Sorting assistants.',
    chapters: [
      {
        name: 'Branch Office Rules & DARPAN System',
        description: 'Daily account preparation, BO summary, and remittance limits between BO and SO.',
        keyRules: [
          'Branch Office daily maximum cash retention limit must be strictly adhered to.',
          'Special Error Book (SEB) entries for damaged or irregular mail receipts.',
          'BPM must tally daily deposit receipts with SB-103 receipt book count.'
        ]
      }
    ]
  },
  {
    id: 'po-act-2023',
    title: 'Post Office Act, 2023 & Amendments',
    category: 'Act & Amendment',
    summary: 'The modern legislative framework replacing the Indian Post Office Act of 1898 to facilitate digital governance and modern logistics.',
    chapters: [
      {
        name: 'Key Highlights of New Post Office Act',
        description: 'Citizen charters, removal of punitive archaic penalties, and digital addressing enablement.',
        keyRules: [
          'Empowers the Central Government to establish standards for postal addresses and digital geocoding (DIGIPIN).',
          'Modernized framework for private courier collaboration and multi-modal logistics.',
          'Streamlined liability provisions aligned with global Universal Postal Union (UPU) standards.'
        ]
      }
    ]
  }
];
