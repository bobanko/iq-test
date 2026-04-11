import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js";
import { jsPDF } from "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm";

const CERT_HTML_URL = "./certificate.html";
const CERT_CSS_URL = "./styles/certificate.css";

const PAGE_WIDTH_PX = 1122;
const PAGE_HEIGHT_PX = 793;

async function loadCertificateTemplate() {
  const [htmlRes, cssRes] = await Promise.all([
    fetch(CERT_HTML_URL),
    fetch(CERT_CSS_URL),
  ]);

  const [html, css] = await Promise.all([htmlRes.text(), cssRes.text()]);
  return { html, css };
}

function fillTemplate($root, data) {
  const $$slots = $root.querySelectorAll("[data-cert]");
  $$slots.forEach(($el) => {
    const key = $el.dataset.cert;
    if (key in data) {
      $el.textContent = data[key];
    }
  });
}

// ===== Certificate PDF Generation (HTML -> PDF) =====
export async function generateCertificatePdf(certificateData) {
  if (!certificateData) {
    alert("Result data is not ready yet.");
    return;
  }

  const { html, css } = await loadCertificateTemplate();

  const playerName = certificateData.playerName || "Anonymous player";
  const safeDate = String(certificateData.dateTaken || "date").replaceAll(
    "/",
    "-",
  );

  const $container = document.createElement("div");
  $container.style.position = "fixed";
  $container.style.left = "0";
  $container.style.top = "0";
  $container.style.width = `${PAGE_WIDTH_PX}px`;
  $container.style.height = `${PAGE_HEIGHT_PX}px`;
  $container.style.zIndex = "-1";
  $container.style.overflow = "hidden";
  $container.style.opacity = "0";
  $container.style.pointerEvents = "none";

  $container.innerHTML = `<style>${css}</style>${html}`;

  fillTemplate($container, {
    iq: certificateData.iq,
    playerName,
    percentileLabel: certificateData.percentileLabel,
    globalRank: certificateData.globalRank,
    cognitiveSubgroup: certificateData.cognitiveSubgroup,
    dateTaken: certificateData.dateTaken,
    correctAnswers: certificateData.correctAnswers,
    completionTime: certificateData.completionTime,
    answerSpeed: certificateData.answerSpeed,
  });

  document.body.append($container);

  try {
    const $certPage = $container.querySelector(".cert-page");

    const canvas = await html2canvas($certPage, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0f1022",
      windowWidth: PAGE_WIDTH_PX,
      windowHeight: PAGE_HEIGHT_PX,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "landscape",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`iq-certificate-${safeDate}.pdf`);
  } finally {
    $container.remove();
  }
}
