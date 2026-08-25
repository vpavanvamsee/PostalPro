import { AgentProfile, LanguageCode, ObjectionBuster, StatusTemplate } from '../types';

export const OBJECTION_BUSTERS: ObjectionBuster[] = [
  {
    id: 'lic_comparison',
    titleKey: 'Already have LIC / Private Insurance',
    objectionKey: 'Customer says: "I already have an LIC / HDFC / SBI Life policy, why should I take PLI/RPLI?"',
    strategyKey: 'Strategy: Highlight the huge bonus gap (~₹52-76 per ₹1,000 vs ~₹38-44) and lowest operational expense ratio.',
    scriptKey: `Sir, Postal Life Insurance is the oldest life insurer in India (since 1884) backed directly by the Ministry of Communications, Govt of India. 
Because India Post operates on low administrative expense ratios, we pass the highest bonus rate in the country back to policyholders (~₹52 to ₹76 per ₹1,000 SA compared to ₹38-45 in conventional policies). 
For the exact same premium, your final maturity amount in PLI is significantly higher!`,
    iconName: 'ShieldCheck'
  },
  {
    id: 'low_budget',
    titleKey: 'No Money / Low Budget Right Now',
    objectionKey: 'Customer says: "I don\'t have lump sum money or enough savings right now."',
    strategyKey: 'Strategy: Micro-savings reframe — convert the yearly cost into a daily cup of tea / snack budget (₹30-40/day).',
    scriptKey: `You don't need a huge lump sum to secure your family, sir. We can start with just ₹30 to ₹40 a day — less than the cost of a daily tea and snack. 
By putting aside just ₹1,000 to ₹1,200 a month in a PLI/RPLI Santosh plan, you build a guaranteed ₹5 to ₹10 Lakh fund with 100% Sovereign Guarantee and life protection from day one!`,
    iconName: 'Coins'
  },
  {
    id: 'gold_mutual_funds',
    titleKey: 'Gold / Land / Mutual Funds are Better',
    objectionKey: 'Customer says: "I get better returns by investing in Gold or Shares or Land."',
    strategyKey: 'Strategy: Triple safety triangle — Day-1 full life cover + zero market crash risk + Section 80C tax deduction.',
    scriptKey: `Gold and shares are great investments, but if an unforeseen emergency happens tomorrow, gold doesn't pay your family 10 times its value. 
PLI gives you instant ₹10 Lakhs life cover from day 1, zero market risk, guaranteed bonus every single year, Section 80C tax exemption, and you can even take a low-interest loan against it at the post office. It is the safest foundation for your family.`,
    iconName: 'TrendingUp'
  },
  {
    id: 'claim_process',
    titleKey: 'Post Office Claims Take Too Long',
    objectionKey: 'Customer says: "Govt post office paperwork and claim settlement must be slow."',
    strategyKey: 'Strategy: Explain modern McCamish Core Insurance Solution (CIS) computerized pan-India network.',
    scriptKey: `That was in the old days, sir! Today, all 1.5+ Lakh post offices across India are 100% computerized under Core Insurance Solution (CIS - McCamish). 
You can pay premiums online, track policies on the India Post portal, and maturity/claim payouts are credited directly to your bank account via NEFT without any hassle.`,
    iconName: 'Zap'
  }
];

export const STATUS_TEMPLATES: StatusTemplate[] = [
  {
    id: 'daily_savings',
    category: 'Daily Micro Savings',
    titleKey: '☕ Just ₹40/Day $\\rightarrow$ ₹12,50,000 Guaranteed Fund',
    bodyKey: `📮 *POSTAL LIFE INSURANCE (PLI / RPLI)*
🌟 *100% Government of India Sovereign Guarantee*

💡 *What can ₹40 a day do for your future?*
🔹 Daily Savings Budget: ₹40 / day (₹1,200/month)
🔹 Instant Life Protection: ₹5,00,000
🔹 Guaranteed Maturity Fund: *₹12,50,000+* (with highest Govt Bonus!)
🔹 Tax Rebate under Sec 80C & 10(10D)
🔹 Easy Loan facility at your local Post Office

📞 *Get your personalized quote today:*
`
  },
  {
    id: 'child_education',
    category: 'Child Education & Marriage',
    titleKey: '🎓 Secure Your Child\'s College Fund (Bal Jeevan Bima)',
    bodyKey: `👶 *SECURE YOUR CHILD'S HIGHER EDUCATION & FUTURE*
📮 *Postal Life Insurance - Bal Jeevan Bima & Santosh Plan*

🎯 Don't let rising inflation stop your child's dreams of becoming a Doctor / Engineer / Officer!
✨ High Govt bonus (~₹52/1000 SA/Yr)
✨ Premium waiver protection on parent
✨ Guaranteed lump sum payout on reaching age 18/21

📲 *Reply with your child's age for a free custom quotation slip!*
`
  },
  {
    id: 'highest_bonus',
    category: 'Bonus Comparison',
    titleKey: '🏆 Why PLI Pays the Highest Bonus in India (~₹52-76/1000 SA)',
    bodyKey: `🏆 *DID YOU KNOW?*
Postal Life Insurance (est. 1884) declares the HIGHEST BONUS RATES in India among all life insurers:

📈 *PLI Whole Life (Suraksha):* ₹76 per ₹1,000 SA/Yr
📈 *PLI Endowment (Santosh):* ₹52 per ₹1,000 SA/Yr
📈 *RPLI Whole Life:* ₹60 per ₹1,000 SA/Yr
📈 *RPLI Endowment:* ₹48 per ₹1,000 SA/Yr

💰 *Lowest Premium + Highest Return + 100% Sovereign Safety.*
Invest with India Post today!
`
  },
  {
    id: 'tax_saving',
    category: 'Tax Saving 80C',
    titleKey: '🛡️ Save Income Tax under 80C with 100% Govt Safety',
    bodyKey: `⏳ *LAST CALL FOR TAX SAVING UNDER SECTION 80C*
📮 *Invest in Postal Life Insurance (PLI)*

✅ Maximize ₹1.5 Lakhs tax deduction under Sec 80C
✅ Tax-Free Maturity Payout under Sec 10(10D)
✅ Zero market volatility / 100% Sovereign Safety
✅ Guaranteed life cover for your loved ones

📞 *Contact your local Postal Advisor today:*
`
  },
  {
    id: 'postal_rebates',
    category: 'Special Postal Rebates',
    titleKey: '🏷️ Double Rebate Advantage (Sum Assured + Advance Pay Rebates)',
    bodyKey: `📮 *SPECIAL POSTAL REBATES IN PLI / RPLI*
💡 *Save maximum on your policy premiums!*

1️⃣ *Sum Assured Rebate:*
₹1/- rebate every month for every ₹20,000 Sum Assured!
👉 e.g. For ₹1,00,000 SA $\\rightarrow$ ₹5/month (₹60/yr) instant discount
👉 e.g. For ₹10,00,000 SA $\\rightarrow$ ₹50/month (₹600/yr) instant discount

2️⃣ *Advance Payment Rebates:*
👉 Pay 6 months advance $\\rightarrow$ Get *1% Rebate*
👉 Pay 12 months advance $\\rightarrow$ Get *2% Rebate*

3️⃣ *Income Tax Department Rebate:*
👉 Tax deduction on premium under *Section 80C* (up to ₹1.5 Lakhs)
👉 100% Tax-Free Maturity & Claims under *Section 10(10D)*

📞 *Get your discounted policy quotation today:*
`
  }
];

export function generateWhatsAppMessage(
  leadName: string,
  category: string,
  planName: string,
  age: number,
  term: number,
  saFormatted: string,
  dailyCost: number,
  monthlyFormatted: string,
  maturityFormatted: string,
  bonusFormatted: string,
  multiplier: string,
  agent: AgentProfile,
  lang: LanguageCode
): string {
  const isRegional = lang === 'te' || lang === 'hi' || lang === 'ta' || lang === 'kn' || lang === 'ml' || lang === 'mr' || lang === 'bn' || lang === 'gu' || lang === 'or';

  return `📮 *DEPARTMENT OF POSTS, INDIA*
*POSTAL LIFE INSURANCE (${category}) QUOTATION*
━━━━━━━━━━━━━━━━━━━━
👤 *Proposer:* ${leadName} (Age ${age} Yrs)
📋 *Plan:* ${planName}
⏳ *Policy Term:* ${term} Years (Maturity at Age ${age + term})
━━━━━━━━━━━━━━━━━━━━
💰 *KEY FINANCIAL HIGHLIGHTS:*
▫️ *Daily Savings Budget:* ₹${dailyCost} / day
▫️ *Monthly Premium:* ${monthlyFormatted} (Net after SA rebate)
▫️ *Guaranteed Life Cover (SA):* ${saFormatted}
▫️ *Estimated Maturity Payout:* *${maturityFormatted}*
▫️ *Pure Govt Bonus Profit:* + ${bonusFormatted}
▫️ *Wealth Growth Multiplier:* ${multiplier}
━━━━━━━━━━━━━━━━━━━━
🏷️ *POSTAL REBATES & TAX BENEFITS:*
✓ *Sum Assured Rebate:* ₹1/month discount per every ₹20,000 SA allowed
✓ *Advance Payment Rebate:* 1% off on 6 months | 2% off on 12 months advance
✓ *Income Tax Department Rebate:* Tax deduction under Sec 80C (up to ₹1.5L) & 100% Tax-Free Maturity (Sec 10(10D))
✓ *100% Sovereign Safety:* Backed by Govt of India since 1884
✓ *Highest Bonus in India:* Declared @ ~₹52 to ₹76 per ₹1,000 SA/Yr
━━━━━━━━━━━━━━━━━━━━
📞 *Prepared by Your Postal Advisor:*
*${agent.name}*
${agent.designation} • ${agent.branchOffice}, ${agent.division}
📱 Mobile / WhatsApp: ${agent.phone}

_India Post • Trusted by Millions since 1884_`;
}
