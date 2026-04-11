import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js";
import { jsPDF } from "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm";

import { calcStaticIqByStats } from "./calc-iq.js";
import { getResultById, getAllResults } from "./endpoints/get-stats.js";
import { findCognitiveSubgroup } from "./helpers/cognitive-classification-system.js";
import { formatTimeSpan } from "./helpers/common.js";
import { getHashParameter } from "./helpers/hash-param.js";
import { getBestIqPerUser, calcRankingStats } from "./helpers/ranking.js";
import { getUserData } from "./endpoints/user-data.js";

const PAGE_WIDTH_PX = 1122;
const PAGE_HEIGHT_PX = 793;

// ===== Fill template slots =====

function fillTemplate($root, data) {
  const $$slots = $root.querySelectorAll("[data-cert]");
  $$slots.forEach(($el) => {
    const key = $el.dataset.cert;
    if (key in data) {
      $el.textContent = data[key];
    }
  });
}

// ===== Render canvas from cert page =====

async function renderCanvas() {
  return html2canvas($certPage, {
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
}

// ===== Download handlers =====

$btnDownloadPdf.addEventListener("click", async () => {
  const canvas = await renderCanvas();
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
});

$btnDownloadPng.addEventListener("click", async () => {
  const canvas = await renderCanvas();

  const $link = document.createElement("a");
  $link.download = `iq-certificate-${safeDate}.png`;
  $link.href = canvas.toDataURL("image/png");
  $link.click();
});

// ===== Load result and fill certificate =====

let safeDate = "certificate";

const resultId = getHashParameter("id");

if (!resultId) {
  $certLoading.hidden = true;
  $certError.hidden = false;
  $certError.textContent =
    "No result ID provided. Open this page from your results.";
} else {
  try {
    const [userResult, allResults] = await Promise.all([
      getResultById(resultId),
      getAllResults(),
    ]);

    const userData = (await getUserData(userResult._userId)) ?? {};
    const playerName = userData.displayName?.trim() || "Anonymous player";

    const { stats, datePassed } = userResult;
    const staticIq = calcStaticIqByStats(stats);

    const bestIqByUser = getBestIqPerUser(allResults);
    const allBestIqs = Object.values(bestIqByUser);
    const { globalRank, topPercent: topPt } = calcRankingStats(
      allBestIqs,
      staticIq,
    );

    const { isAnswered, isCorrect, timeSpent } = stats;
    const answerSpeed = timeSpent / 1000 / stats.total;

    const dateObj = datePassed.toDate();
    safeDate = dateObj.toLocaleDateString().replaceAll("/", "-");

    fillTemplate($certPage, {
      iq: staticIq.toFixed(0),
      playerName,
      percentileLabel: `Top ${topPt.toFixed(0)}%`,
      globalRank: `#${globalRank.toFixed(0)}`,
      cognitiveSubgroup: findCognitiveSubgroup(staticIq).name,
      dateTaken: dateObj.toLocaleDateString(),
      correctAnswers: `${isCorrect}/${isAnswered}`,
      completionTime: formatTimeSpan(timeSpent),
      answerSpeed: `${answerSpeed.toFixed(2)}s per question`,
    });

    $btnBackToResult.href = `./result.html#id=${resultId}`;

    $certLoading.hidden = true;
    $certActions.hidden = false;
  } catch (err) {
    console.error("🔥 Failed to load certificate:", err);
    $certLoading.hidden = true;
    $certError.hidden = false;
  }
}
