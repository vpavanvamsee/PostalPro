import { AgentProfile, LanguageCode, Lead } from '../types';
import { formatINR } from './pliPlans';
import { t } from './i18n';

/**
 * High-Resolution 2x Retina HTML5 Canvas Poster Renderer
 * Generates an exact pixel-perfect image matching the Postal Department visual layout
 */
export async function renderPosterToBlob(
  lead: Lead,
  agent: AgentProfile,
  lang: LanguageCode
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  // High-res dimensions (1080 x 1400 px for crisp mobile/desktop sharing)
  const width = 1080;
  const height = 1420;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Background
  ctx.fillStyle = '#f8fafc'; // Crisp slate 50
  ctx.fillRect(0, 0, width, height);

  // Outer Card with border
  const margin = 30;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;
  const cardRadius = 24;

  // Draw Card Background
  roundRect(ctx, margin, margin, cardW, cardH, cardRadius);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#e2e8f0';
  ctx.stroke();

  // 1. DEEP FOREST GREEN HEADER
  const headerH = 200;
  ctx.save();
  roundRect(ctx, margin, margin, cardW, headerH, [cardRadius, cardRadius, 0, 0]);
  ctx.clip();
  const grad = ctx.createLinearGradient(margin, margin, margin + cardW, margin + headerH);
  grad.addColorStop(0, '#043d2e'); // Deep forest green
  grad.addColorStop(1, '#064e3b');
  ctx.fillStyle = grad;
  ctx.fillRect(margin, margin, cardW, headerH);

  // Top Postal Emblem Icon / Stamp
  ctx.fillStyle = '#fbbf24'; // Amber Gold
  ctx.beginPath();
  ctx.arc(margin + 60, margin + 85, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#043d2e';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POST', margin + 60, margin + 85);

  // Subheader: DEPARTMENT OF POSTS, INDIA
  ctx.fillStyle = '#9ae6b4'; // Mint green
  ctx.font = '600 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(t(lang, 'deptOfPosts').toUpperCase(), margin + 105, margin + 68);

  // Main Title: POSTAL LIFE INSURANCE (PLI) or RPLI
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  const categoryFull = lead.category === 'PLI' 
    ? 'POSTAL LIFE INSURANCE (PLI)' 
    : 'RURAL POSTAL LIFE INSURANCE (RPLI)';
  ctx.fillText(categoryFull, margin + 105, margin + 115);

  // Top-Right Gold Badge: 100% GOVT GUARANTEE
  const badgeW = 280;
  const badgeH = 42;
  const badgeX = margin + cardW - badgeW - 30;
  const badgeY = margin + 50;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 21);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100% GOVT SOVEREIGN GUARANTEE', badgeX + badgeW / 2, badgeY + badgeH / 2);

  // Decorative bottom line of header
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(margin, margin + headerH - 6, cardW, 6);
  ctx.restore();

  let currentY = margin + headerH + 28;

  // 2. PROPOSER DETAILS PILL (Light mint background)
  const pillH = 100;
  const pillX = margin + 30;
  const pillW = cardW - 60;
  roundRect(ctx, pillX, currentY, pillW, pillH, 16);
  ctx.fillStyle = '#ecfdf5'; // Mint 50
  ctx.fill();
  ctx.strokeStyle = '#a7f3d0'; // Mint 200
  ctx.lineWidth = 2;
  ctx.stroke();

  // Proposer Name & Age
  ctx.fillStyle = '#065f46'; // Forest green dark
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`${t(lang, 'proposer')}: ${lead.name} (${t(lang, 'age')} ${lead.currentAge} ${t(lang, 'years')})`, pillX + 24, currentY + 18);

  // Maturity Age Pill
  ctx.fillStyle = '#047857';
  ctx.font = '600 20px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${t(lang, 'maturityAge')}: ${lead.maturityAge} ${t(lang, 'years')}`, pillX + pillW - 24, currentY + 18);

  // Plan & Term Line
  ctx.fillStyle = '#374151'; // Slate 700
  ctx.font = '500 21px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${t(lang, 'plan')}: ${lead.planName}   |   ${t(lang, 'term')}: ${lead.term} ${t(lang, 'years')}`, pillX + 24, currentY + 56);

  currentY += pillH + 26;

  // 3. TWIN HERO METRIC BOXES (Side by Side)
  const heroBoxW = (cardW - 60 - 24) / 2;
  const heroBoxH = 180;
  const leftBoxX = margin + 30;
  const rightBoxX = leftBoxX + heroBoxW + 24;

  // Left Hero Box: DAILY SAVINGS BUDGET (Green Theme)
  roundRect(ctx, leftBoxX, currentY, heroBoxW, heroBoxH, 18);
  ctx.fillStyle = '#f0fdf4'; // Light green
  ctx.fill();
  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#166534';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t(lang, 'dailySavingsBudget'), leftBoxX + heroBoxW / 2, currentY + 28);

  ctx.fillStyle = '#15803d'; // Rich green
  ctx.font = 'bold 50px sans-serif';
  ctx.fillText(`₹ ${lead.dailyCost} / day`, leftBoxX + heroBoxW / 2, currentY + 88);

  ctx.fillStyle = '#4b5563';
  ctx.font = '500 18px sans-serif';
  ctx.fillText(`${t(lang, 'monthlyPremSubtitle')}: ${formatINR(lead.monthlyPremium)}`, leftBoxX + heroBoxW / 2, currentY + 140);

  // Right Hero Box: ESTIMATED MATURITY PAYOUT (Amber/Gold Theme)
  roundRect(ctx, rightBoxX, currentY, heroBoxW, heroBoxH, 18);
  ctx.fillStyle = '#fffbeb'; // Amber 50
  ctx.fill();
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#92400e'; // Amber 800
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t(lang, 'estimatedMaturityPayout'), rightBoxX + heroBoxW / 2, currentY + 28);

  ctx.fillStyle = '#b45309'; // Amber 700
  ctx.font = 'bold 50px sans-serif';
  ctx.fillText(formatINR(lead.estimatedMaturity), rightBoxX + heroBoxW / 2, currentY + 88);

  ctx.fillStyle = '#6b7280';
  ctx.font = '500 18px sans-serif';
  ctx.fillText(t(lang, 'guaranteedPlusBonus'), rightBoxX + heroBoxW / 2, currentY + 140);

  currentY += heroBoxH + 26;

  // 4. FINANCIAL BREAKDOWN CARD (Clean White Table)
  const tableX = margin + 30;
  const tableW = cardW - 60;
  const tableH = 260;
  roundRect(ctx, tableX, currentY, tableW, tableH, 18);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Table Title Bar
  roundRect(ctx, tableX, currentY, tableW, 46, [18, 18, 0, 0]);
  ctx.fillStyle = '#f1f5f9';
  ctx.fill();
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`📊  ${t(lang, 'financialBreakdown')}`, tableX + 24, currentY + 30);

  // Table Rows
  const rowItems = [
    { label: t(lang, 'lifeCoverSA'), val: formatINR(lead.sumAssured), color: '#1e293b', bold: true },
    { label: `${t(lang, 'totalPremPaid')} (${lead.term} ${t(lang, 'years')})`, val: formatINR(lead.totalPremiumPaid), color: '#475569', bold: false },
    { label: `+ ${t(lang, 'pureBonusProfit')}`, val: `+ ${formatINR(lead.bonusProfit)}`, color: '#15803d', bold: true },
    { label: `🚀 ${t(lang, 'wealthMultiplierTitle')}`, val: `~ ${lead.wealthMultiplier}`, color: '#b45309', bold: true }
  ];

  let rowY = currentY + 54;
  rowItems.forEach((r, idx) => {
    // Divider
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tableX + 20, rowY);
    ctx.lineTo(tableX + tableW - 20, rowY);
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = '500 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(r.label, tableX + 24, rowY + 32);

    ctx.fillStyle = r.color;
    ctx.font = r.bold ? 'bold 22px sans-serif' : '600 20px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(r.val, tableX + tableW - 24, rowY + 32);

    rowY += 50;
  });

  currentY += tableH + 22;

  // 5. FLEXIBLE PAYMENT MODES PILL BOX
  const modesX = margin + 30;
  const modesW = cardW - 60;
  const modesH = 70;
  roundRect(ctx, modesX, currentY, modesW, modesH, 14);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px sans-serif';
  ctx.textAlign = 'center';
  const modesText = `${t(lang, 'modeMonthly')}: ${formatINR(lead.monthlyPremium)}  |  ${t(lang, 'modeQuarterly')}: ${formatINR(lead.quarterlyPremium)}  |  ${t(lang, 'modeHalfYearly')}: ${formatINR(lead.halfYearlyPremium)} (1% Rebate)  |  ${t(lang, 'modeYearly')}: ${formatINR(lead.yearlyPremium)} (2% Rebate)`;
  ctx.fillText(modesText, modesX + modesW / 2, currentY + 42);

  currentY += modesH + 22;

  // 6. BULLETED TRUST & REBATE BADGES
  const saRebatePerMo = Math.floor((lead.sumAssured || 0) / 20000);
  const trustList = [
    `SA Rebate: ₹1/mo rebate per ₹20,000 SA (${formatINR(lead.sumAssured)} = ₹${saRebatePerMo}/mo discount)`,
    `Advance Pay Rebate: 1% off on 6-month & 2% off on 12-month advance payments`,
    `Income Tax Rebate: Eligible for Sec 80C Tax Deduction & 100% Tax-Free Maturity (Sec 10(10D))`,
    t(lang, 'trust2')
  ];

  ctx.font = '500 16px sans-serif';
  ctx.textAlign = 'left';

  trustList.forEach((trustText, i) => {
    // Green Check Circle
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(margin + 50, currentY + (i * 26) + 8, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.fillText(trustText, margin + 68, currentY + (i * 26) + 14);
  });

  // 7. PERSONALIZED CONTACT FOOTER (Forest Green Banner)
  const footerH = 110;
  const footerY = margin + cardH - footerH;

  ctx.save();
  roundRect(ctx, margin, footerY, cardW, footerH, [0, 0, cardRadius, cardRadius]);
  ctx.clip();
  ctx.fillStyle = '#043d2e';
  ctx.fillRect(margin, footerY, cardW, footerH);

  // Top gold accent line
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(margin, footerY, cardW, 4);

  // Agent Name & Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  const agentLine = `${t(lang, 'contactAgent')}: ${agent.name} (${agent.designation || 'Postal Advisor'}, ${agent.branchOffice || 'Post Office'})`;
  ctx.fillText(agentLine, margin + cardW / 2, footerY + 42);

  // Phone CTA
  ctx.fillStyle = '#fde047'; // Bright Yellow
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`📞 Call / WhatsApp: ${agent.phone || 'Contact Postal Branch'}`, margin + cardW / 2, footerY + 80);

  ctx.restore();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png', 0.95);
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | number[]
) {
  let r = typeof radius === 'number' ? [radius, radius, radius, radius] : radius;
  if (r.length === 2) r = [r[0], r[1], r[0], r[1]];
  if (r.length === 1) r = [r[0], r[0], r[0], r[0]];

  const [rTL, rTR, rBR, rBL] = r;

  ctx.beginPath();
  ctx.moveTo(x + rTL, y);
  ctx.lineTo(x + width - rTR, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + rTR);
  ctx.lineTo(x + width, y + height - rBR);
  ctx.quadraticCurveTo(x + width, y + height, x + width - rBR, y + height);
  ctx.lineTo(x + rBL, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - rBL);
  ctx.lineTo(x, y + rTL);
  ctx.quadraticCurveTo(x, y, x + rTL, y);
  ctx.closePath();
}
