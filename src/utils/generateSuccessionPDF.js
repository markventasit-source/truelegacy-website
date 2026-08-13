import jsPDF from 'jspdf';

export const generateSuccessionPDF = async (summaryData, successionData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  doc.setFillColor(19, 47, 44);
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setTextColor(244, 213, 126);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Succession Summary Report', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  doc.setTextColor(0, 0, 0);
  yPosition = 70;

  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${currentDate}`, margin, yPosition);
  yPosition += 15;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Estate Distribution Summary', margin, yPosition);
  yPosition += 15;

  const tableHeaders = ['Relationship', 'Name', 'Status', 'Share %'];

  const relationshipOrder = {
    you: 1,
    mother: 2,
    father: 3,
    son: 4,
    daughter: 5,
    brother: 6,
    sister: 7,
    wife: 8,
  };

  const tableData = summaryData
    .map((person) => [
      person.relationship?.charAt(0).toUpperCase() + (person.relationship || '').slice(1),
      person.name || '',
      person.status === 'alive' ? 'Alive' : 'Deceased',
      person.value > 0 ? `${person.value}%` : '0%',
      (person.relationship || '').toLowerCase(),
    ])
    .sort((a, b) => {
      const orderA = relationshipOrder[a[4]] || 999;
      const orderB = relationshipOrder[b[4]] || 999;
      return orderA - orderB;
    })
    .map((row) => row.slice(0, 4));

  const colWidths = [45, 65, 35, 25];
  const rowHeight = 10;
  const tableTop = yPosition;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin, tableTop, pageWidth - 2 * margin, rowHeight, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  let xPosition = margin;
  tableHeaders.forEach((header, index) => {
    doc.text(header, xPosition + 2, tableTop + 7);
    xPosition += colWidths[index];
  });

  yPosition = tableTop + rowHeight;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  tableData.forEach((row, rowIndex) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;

      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      xPosition = margin;
      tableHeaders.forEach((header, index) => {
        doc.text(header, xPosition + 2, yPosition + 7);
        xPosition += colWidths[index];
      });

      yPosition += rowHeight;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
    }

    doc.setFillColor(rowIndex % 2 === 0 ? 250 : 255, rowIndex % 2 === 0 ? 250 : 255, rowIndex % 2 === 0 ? 250 : 255);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F');

    xPosition = margin;
    row.forEach((cell, cellIndex) => {
      let displayText = String(cell ?? '');
      if (cellIndex === 1 && displayText.length > 15) {
        displayText = displayText.substring(0, 15) + '...';
      }
      doc.text(displayText, xPosition + 2, yPosition + 7);
      xPosition += colWidths[cellIndex];
    });

    yPosition += rowHeight;
  });

  yPosition += 15;

  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const totalMembers = summaryData.length;
  const aliveMembers = summaryData.filter((p) => p.status === 'alive').length;
  const deceasedMembers = summaryData.filter((p) => p.status === 'deceased').length;
  const membersWithShares = summaryData.filter((p) => (p.value || 0) > 0).length;
  const totalShare = summaryData.reduce((sum, p) => sum + (p.value || 0), 0);

  doc.text(`Total Family Members: ${totalMembers}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Alive: ${aliveMembers}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Deceased: ${deceasedMembers}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Members with Shares: ${membersWithShares}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Total Distribution: ${totalShare}%`, margin, yPosition);
  yPosition += 15;

  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');

  const disclaimer = 'Disclaimer: This visualization is for informational purposes only and not a substitute for legal advice. Consult a qualified legal professional for personalized guidance.';
  const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);

  doc.text(splitDisclaimer, margin, yPosition);

  const survey = successionData?.survey;
  if (survey?.matched_case_description) {
    yPosition += 20;
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`Case: ${survey.matched_case_description}`, margin, yPosition);
  }

  doc.save('succession-summary-report.pdf');
};
