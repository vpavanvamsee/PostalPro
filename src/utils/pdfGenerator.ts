import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OfficeProfile, TDAccountItem } from '../types';
import { numberToIndianWords } from './tdRules';

export const ENTRIES_PER_A4_PAGE = 20;

/**
 * Generates the Exact Department of Posts India TD Commission BPM Incentive Bill PDF
 * strictly limiting 20 entries per A4 page while keeping the official signatures block intact on each page.
 */
export function generateOfficialTDBillPDF(
  accounts: TDAccountItem[],
  office: OfficeProfile,
  billMonth = 'August 2026',
  billDate = new Date().toISOString().split('T')[0]
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  
  const totalPages = Math.max(1, Math.ceil(accounts.length / ENTRIES_PER_A4_PAGE));

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    if (pageIndex > 0) {
      doc.addPage();
    }

    const pageAccounts = accounts.slice(
      pageIndex * ENTRIES_PER_A4_PAGE,
      (pageIndex + 1) * ENTRIES_PER_A4_PAGE
    );

    const pageDeposit = pageAccounts.reduce((sum, item) => sum + (item.depositAmount || 0), 0);
    const pageIncentive = pageAccounts.reduce((sum, item) => sum + (item.incentiveAmount || 0), 0);
    const wordsPageIncentive = numberToIndianWords(pageIncentive).toUpperCase();

    // 1. Department Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('DEPARTMENT OF POST INDIA', pageWidth / 2, 15, { align: 'center' });

    // 2. BO / SO / HO Line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);

    const boText = `${office.boName || 'vadlamudi'} BO`;
    const soText = `${office.soName || 'sjmudi'} SO`;
    const hoText = `${office.hoName || 'tenali'} HO`;

    doc.text(boText, margin + 10, 22);
    doc.text(soText, pageWidth / 2, 22, { align: 'center' });
    doc.text(hoText, pageWidth - margin - 10, 22, { align: 'right' });

    // 3. Bill Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.text('TD COMMISSION BPM INCENTIVE BILL', pageWidth / 2, 29, { align: 'center' });

    // 4. Month & Date Line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const pageLabel = totalPages > 1 ? ` (PAGE ${pageIndex + 1}/${totalPages})` : '';
    doc.text(`FOR THE MONTH OF  ${billMonth.toUpperCase()}${pageLabel}`, margin, 35.5);
    doc.text(`DATED  ${billDate}`, pageWidth - margin, 35.5, { align: 'right' });

    // 5. Build exactly 20 rows table for this page
    const tableRows: (string | number)[][] = [];

    for (let r = 0; r < ENTRIES_PER_A4_PAGE; r++) {
      const globalSr = pageIndex * ENTRIES_PER_A4_PAGE + r + 1;
      const acc = pageAccounts[r];
      if (acc) {
        tableRows.push([
          globalSr,
          acc.accountNumber || '',
          acc.prNumber || '',
          acc.depositorName || '',
          acc.depositAmount ? acc.depositAmount.toLocaleString('en-IN') : '',
          acc.term || '',
          acc.incentiveRate ? `${acc.incentiveRate}%` : '',
          acc.incentiveAmount ? acc.incentiveAmount.toLocaleString('en-IN') : ''
        ]);
      } else {
        // Empty padded row
        tableRows.push([globalSr, '', '', '', '', '', '', '']);
      }
    }

    // Add TOTAL Row for this page
    const totalRowTitle = totalPages > 1 ? `PAGE ${pageIndex + 1} TOTAL` : 'TOTAL';
    tableRows.push([
      totalRowTitle,
      '',
      '',
      '',
      pageDeposit > 0 ? pageDeposit.toLocaleString('en-IN') : '',
      '',
      '',
      pageIncentive > 0 ? pageIncentive.toLocaleString('en-IN') : ''
    ]);

    // 6. Draw Table
    autoTable(doc, {
      startY: 38,
      margin: { left: margin, right: margin },
      head: [[
        'SR NO',
        'ACCOUNT NO',
        'PR NO',
        'NAME OF DEPOSITOR',
        'DEPOSIT\nAMOUNT',
        'TERM OF\nDEPOSIT',
        'RATE OF\nINCENTIVE',
        'INCENTIVE\nAMOUNT'
      ]],
      body: tableRows,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 7,
        cellPadding: 1.15,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.22,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 6.8,
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' }, // SR NO
        1: { cellWidth: 32, halign: 'center', font: 'courier', fontStyle: 'bold' }, // ACCOUNT NO
        2: { cellWidth: 20, halign: 'center' }, // PR NO
        3: { cellWidth: 42, halign: 'left', fontStyle: 'bold' }, // NAME OF DEPOSITOR
        4: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }, // DEPOSIT AMOUNT
        5: { cellWidth: 18, halign: 'center' }, // TERM OF DEPOSIT
        6: { cellWidth: 18, halign: 'center' }, // RATE OF INCENTIVE
        7: { cellWidth: 18, halign: 'right', fontStyle: 'bold' } // INCENTIVE AMOUNT
      },
      didParseCell: (data) => {
        // Highlight TOTAL row
        if (data.row.index === tableRows.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 7.5;
        }
      }
    });

    // 7. Bottom Clauses & Signatures Part
    // @ts-expect-error jspdf-autotable adds lastAutoTable to doc
    let finalY = (doc.lastAutoTable?.finalY || 155) + 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);

    // Clauses with clean vertical spacing
    doc.text('CERTIFIED THAT ALL THE ABOVE MENTIONED ACCOUNTS ARE OPENED AT BRANCH OFFICE AND NOT THROUGH ANY SAS AGENTS.', margin, finalY);
    finalY += 4;
    doc.text('CERTIFIED THAT INCENTIVE FOR ABOVE MENTIONED ACCOUNTS ARE NOT TAKEN EARLIER.', margin, finalY);
    finalY += 6;

    // Block 1: Acceptance Request (Separated lines so words never overlap signature)
    doc.text(`PLEASE GIVE THE ACCEPTANCE OF INCENTIVE AMOUNT RS :-  ${pageIncentive > 0 ? 'Rs. ' + pageIncentive.toLocaleString('en-IN') + '/-' : ''}`, margin, finalY);
    finalY += 4;
    doc.text(`RUPEES (IN WORDS) :-  ${pageIncentive > 0 ? wordsPageIncentive : ''}`, margin, finalY);
    finalY += 5;
    doc.text(`SIGNATURE OF BPM ____________________ BO`, pageWidth - margin, finalY, { align: 'right' });
    finalY += 7.5;

    // Block 2: Acceptance Granted by SPM
    doc.text(`ACCEPTANCE GRANTED FOR THE AMOUNT OF RS :-  ${pageIncentive > 0 ? 'Rs. ' + pageIncentive.toLocaleString('en-IN') + '/-' : ''}`, margin, finalY);
    finalY += 4;
    doc.text(`RUPEES (IN WORDS) :-  ${pageIncentive > 0 ? wordsPageIncentive : ''}`, margin, finalY);
    finalY += 5;
    doc.text(`SIGNATURE OF SPM ____________________ SO`, pageWidth - margin, finalY, { align: 'right' });
    finalY += 7.5;

    // Block 3: Acquittance / Receipt
    doc.text(`INCENTIVE AMOUNT OF RS :-  ${pageIncentive > 0 ? 'Rs. ' + pageIncentive.toLocaleString('en-IN') + '/-' : ''}`, margin, finalY);
    finalY += 4;
    doc.text(`RECEIVED RUPEES ( IN WORDS) :-  ${pageIncentive > 0 ? wordsPageIncentive : ''}`, margin, finalY);
    finalY += 5;
    doc.text(`SIGNATURE OF BPM ____________________ BO`, pageWidth - margin, finalY, { align: 'right' });
  }

  return doc;
}

/**
 * Shares or Downloads the Official Bill PDF for WhatsApp / Printing
 */
export async function shareOrDownloadOfficialPDF(
  accounts: TDAccountItem[],
  office: OfficeProfile,
  billMonth = 'August 2026',
  billDate = new Date().toISOString().split('T')[0]
): Promise<{ success: boolean; method: 'webShare' | 'download' }> {
  const doc = generateOfficialTDBillPDF(accounts, office, billMonth, billDate);
  const boClean = (office.boName || 'B_O').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `TD_COMMISSION_BPM_BILL_${boClean}_${billMonth.replace(/\s+/g, '_')}.pdf`;

  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

  // Check if Web Share API with files is supported (e.g. mobile browsers WhatsApp direct share)
  if (
    navigator.canShare &&
    navigator.canShare({ files: [pdfFile] })
  ) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: 'TD Commission BPM Incentive Bill',
        text: `Official TD Commission BPM Incentive Bill for ${office.boName || 'BO'}`
      });
      return { success: true, method: 'webShare' };
    } catch (err) {
      console.log('Share canceled or not allowed, falling back to download:', err);
    }
  }

  // Fallback: direct download
  doc.save(fileName);
  return { success: true, method: 'download' };
}

