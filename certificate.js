// ===== jsPDF library (loaded lazily) =====
let jsPdfReady = import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm").then(
  (m) => m.jsPDF,
);

// ===== Certificate PDF Generation =====

export async function generateCertificatePdf(certificateData) {
  let jsPDF;
  try {
    jsPDF = await jsPdfReady;
  } catch {
    alert("PDF library failed to load. Please try again.");
    return;
  }

  if (!certificateData) {
    alert("Result data is not ready yet.");
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 34;
  const gold = [172, 132, 58];
  const dark = [31, 27, 22];
  const parchment = [250, 245, 233];

  doc.setFillColor(parchment[0], parchment[1], parchment[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  for (let y = 0; y < pageHeight; y += 14) {
    doc.setDrawColor(243, 235, 219);
    doc.setLineWidth(0.4);
    doc.line(0, y, pageWidth, y);
  }

  doc.setDrawColor(120, 93, 42);
  doc.setLineWidth(2.5);
  doc.rect(
    margin,
    margin,
    pageWidth - margin * 2,
    pageHeight - margin * 2,
    "S",
  );

  doc.setDrawColor(gold[0], gold[1], gold[2]);
  doc.setLineWidth(1.1);
  doc.rect(
    margin + 8,
    margin + 8,
    pageWidth - (margin + 8) * 2,
    pageHeight - (margin + 8) * 2,
    "S",
  );

  const cornerOrnament = (x, y, flipX = 1, flipY = 1) => {
    doc.setDrawColor(gold[0], gold[1], gold[2]);
    doc.setLineWidth(1.2);
    doc.line(x, y, x + 30 * flipX, y);
    doc.line(x, y, x, y + 30 * flipY);
    doc.line(x + 10 * flipX, y + 10 * flipY, x + 22 * flipX, y + 10 * flipY);
    doc.line(x + 10 * flipX, y + 10 * flipY, x + 10 * flipX, y + 22 * flipY);
    doc.setFillColor(191, 152, 74);
    doc.circle(x + 6 * flipX, y + 6 * flipY, 2.4, "F");
  };

  cornerOrnament(margin + 10, margin + 10, 1, 1);
  cornerOrnament(pageWidth - margin - 10, margin + 10, -1, 1);
  cornerOrnament(margin + 10, pageHeight - margin - 10, 1, -1);
  cornerOrnament(pageWidth - margin - 10, pageHeight - margin - 10, -1, -1);

  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("IQ TEST CERTIFICATE", pageWidth / 2, 72, { align: "center" });

  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFont("times", "bold");
  doc.setFontSize(42);
  doc.text("Certificate of Excellence", pageWidth / 2, 124, {
    align: "center",
  });

  doc.setFont("times", "italic");
  doc.setFontSize(14);
  doc.text(
    "Presented for outstanding cognitive performance",
    pageWidth / 2,
    154,
    {
      align: "center",
    },
  );

  doc.setDrawColor(205, 178, 124);
  doc.setLineWidth(0.9);
  doc.line(pageWidth / 2 - 155, 170, pageWidth / 2 + 155, 170);

  doc.setFont("times", "bold");
  doc.setFontSize(64);
  doc.setTextColor(110, 79, 23);
  doc.text(`${certificateData.iq}`, pageWidth / 2, 246, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.text("IQ SCORE", pageWidth / 2, 274, { align: "center" });

  doc.setFillColor(255, 251, 242);
  doc.roundedRect(pageWidth / 2 - 265, 292, 530, 132, 8, 8, "F");
  doc.setDrawColor(214, 190, 144);
  doc.setLineWidth(0.8);
  doc.roundedRect(pageWidth / 2 - 265, 292, 530, 132, 8, 8, "S");

  const leftColumnX = pageWidth / 2 - 238;
  const rightColumnX = pageWidth / 2 + 28;
  const rowStartY = 324;
  const rowGap = 30;
  const leftValueOffset = 96;
  const leftValueOffsetWide = 126;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Date:", leftColumnX, rowStartY);
  doc.text("Percentile:", leftColumnX, rowStartY + rowGap);
  doc.text("Correct Answers:", leftColumnX, rowStartY + rowGap * 2);
  doc.text("Cognitive Profile:", leftColumnX, rowStartY + rowGap * 3);

  doc.text("Completion Time:", rightColumnX, rowStartY);
  doc.text("Average Speed:", rightColumnX, rowStartY + rowGap);
  doc.text("Global Rank:", rightColumnX, rowStartY + rowGap * 2);

  doc.setFont("helvetica", "normal");
  doc.text(certificateData.dateTaken, leftColumnX + leftValueOffset, rowStartY);
  doc.text(
    certificateData.percentileLabel,
    leftColumnX + leftValueOffset,
    rowStartY + rowGap,
  );
  doc.text(
    certificateData.correctAnswers,
    leftColumnX + leftValueOffsetWide,
    rowStartY + rowGap * 2,
  );
  doc.text(
    certificateData.cognitiveSubgroup,
    leftColumnX + leftValueOffsetWide,
    rowStartY + rowGap * 3,
  );

  doc.text(certificateData.completionTime, rightColumnX + 112, rowStartY);
  doc.text(certificateData.answerSpeed, rightColumnX + 112, rowStartY + rowGap);
  doc.text(
    certificateData.globalRank,
    rightColumnX + 112,
    rowStartY + rowGap * 2,
  );

  const sealX = pageWidth - margin - 96;
  const sealY = pageHeight - margin - 96;
  doc.setDrawColor(120, 93, 42);
  doc.setLineWidth(2);
  doc.circle(sealX, sealY, 42, "S");
  doc.setDrawColor(199, 160, 82);
  doc.setLineWidth(1);
  doc.circle(sealX, sealY, 37, "S");
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(120, 93, 42);
  doc.text("CERTIFIED", sealX, sealY - 3, { align: "center" });
  doc.text("IQ SCORE", sealX, sealY + 12, { align: "center" });

  doc.setDrawColor(166, 134, 63);
  doc.setLineWidth(1);
  doc.line(margin + 36, pageHeight - 92, margin + 220, pageHeight - 92);
  doc.line(
    pageWidth / 2 - 84,
    pageHeight - 92,
    pageWidth / 2 + 84,
    pageHeight - 92,
  );

  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(97, 87, 68);
  doc.text("Authorized by iq-test", margin + 36, pageHeight - 76);
  doc.text(
    "Date: " + certificateData.dateTaken,
    pageWidth / 2,
    pageHeight - 76,
    {
      align: "center",
    },
  );

  // doc.setFont("helvetica", "normal");
  // doc.setFontSize(9);
  // doc.setTextColor(126, 120, 106);
  // doc.text(
  //   "Result link: " + certificateData.resultUrl,
  //   margin + 10,
  //   pageHeight - 44,
  // );

  const safeDate = certificateData.dateTaken.replaceAll("/", "-");
  doc.save(`iq-certificate-${safeDate}.pdf`);
}
