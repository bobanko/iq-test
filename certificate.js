import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js";
import { jsPDF } from "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm";

import { calcStaticIqByStats } from "./calc-iq.js";
import { getResultById, getAllResults } from "./endpoints/get-stats.js";
import {
  findCognitiveSubgroup,
  findCognitiveGroup,
} from "./helpers/cognitive-classification-system.js";
import { formatTimeSpan } from "./helpers/common.js";
import { getHashParameter } from "./helpers/hash-param.js";
import { getBestIqPerUser, calcRankingStats } from "./helpers/ranking.js";
import { getUserData } from "./endpoints/user-data.js";
import { generateCertificateText } from "./helpers/tier-generator.js";
import { stringToHash } from "./helpers/hash-string.js";
import { getArchetype } from "./helpers/archetypes.js";
import { getSeededRandom } from "./helpers/seeded-random.js";
import { initChart } from "./chart.js";

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

// ===== Fun stats generator =====

function generateFunStats({ accuracy, speed, seed }) {
  const rng = getSeededRandom(seed);
  const patternRecognition = Math.min(
    99,
    Math.max(5, Math.round(accuracy * 100 + (rng() * 10 - 5))),
  );
  const logicStability = Math.min(
    99,
    Math.max(5, Math.round(accuracy * 70 + rng() * 30)),
  );
  const reactionSpeed = Math.min(
    99,
    Math.max(5, Math.round(Math.max(0, 100 - speed * 2) + rng() * 10)),
  );
  const sanity = Math.round(rng() * 25 + 5);
  return { patternRecognition, logicStability, reactionSpeed, sanity };
}

// ===== Fill stat bars =====

function fillStatBars(stats) {
  const $$fills = $certPage.querySelectorAll("[data-stat]");
  $$fills.forEach(($fill) => {
    const key = $fill.dataset.stat;
    const value = stats[key] ?? 0;
    $fill.style.width = `${value}%`;
  });
}

// ===== Render canvas from cert page =====

async function renderCanvas() {
  return html2canvas($certPage, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#fafafa",
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

function fillCertificate({
  playerName,
  staticIq,
  topPt,
  percentileRank,
  isCorrect,
  isAnswered,
  timeSpent,
  seed,
  allBestIqs,
  dateStr,
  resultId: rid,
}) {
  const accuracy = isCorrect / isAnswered;
  const accuracyPct = Math.round(accuracy * 100);
  const answerSpeed = timeSpent / 1000 / isAnswered;

  const subgroup = findCognitiveSubgroup(staticIq);
  const group = findCognitiveGroup(staticIq);

  const certText = generateCertificateText({
    name: playerName,
    iq: staticIq,
    accuracy: accuracyPct,
    time: formatTimeSpan(timeSpent),
    correct: isCorrect,
    total: isAnswered,
    topPt: topPt.toFixed(0),
    subgroup: subgroup.name,
    seed,
  });

  const archetype = getArchetype(answerSpeed, accuracy);

  const funStats = generateFunStats({ accuracy, speed: answerSpeed, seed });

  // ===== Smarter Than =====
  const smarterGamers = Math.min(percentileRank * 0.95, 99);
  const smarterCoders = Math.min(percentileRank * 0.8, 95);

  // ===== Test ID =====
  const rng = getSeededRandom(seed);
  const testIdHex = Math.floor(rng() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
  const testId = `420-${testIdHex.slice(0, 2)}${staticIq.toFixed(0).slice(-1)}${testIdHex.slice(2)}-FF`;

  fillTemplate($certPage, {
    iqScore: staticIq.toFixed(0),
    playerName,
    status: `${group.name.toUpperCase()}`,
    percentile: `${percentileRank.toFixed(1)}%`,
    thinkingType: certText.thinkingType,
    archetype: archetype.name,
    archetypeTraits: certText.thinkingBullets.join(" | ").toUpperCase(),
    statPattern: `${funStats.patternRecognition}%`,
    statLogic: `${funStats.logicStability}%`,
    statSpeed: `${funStats.reactionSpeed}%`,
    statSanity: `${funStats.sanity}%`,
    percentileBig: `${percentileRank.toFixed(1)}%`,
    smarterGamers: `${smarterGamers.toFixed(0)}%`,
    smarterCoders: `${smarterCoders.toFixed(0)}%`,
    smarterGoldfish: "100%",
    testId,
    timestamp: dateStr || new Date().toISOString().slice(0, 10),
    verifiedBy: "NOBODY",
    trustedBy: "YOU",
  });

  fillStatBars({
    pattern: funStats.patternRecognition,
    logic: funStats.logicStability,
    speed: funStats.reactionSpeed,
    sanity: funStats.sanity,
  });

  // ===== Chart legend =====
  const $legend = $certPage.querySelector(".cert-chart-legend");
  if ($legend) {
    $legend.innerHTML = `You're in the top <b class="highlight">${topPt.toFixed(0)}%</b> of test takers.`;
  }

  // ===== Chart =====
  if (allBestIqs?.length) {
    initChart({
      chartData: allBestIqs,
      highlightValue: staticIq,
      $container: $certChart,
      $barTmpl: $tmplChartBar,
      $lineTmpl: $tmplChartLine,
    });
  }
}

const resultId = getHashParameter("id");

if (!resultId) {
  // ===== Demo mode =====
  let demoSeed = 42;
  const TOTAL_QUESTIONS = 40;
  const DEMO_IQS = [60, 70, 80, 90, 95, 100, 100, 105, 110, 115, 120, 130, 140];

  function getDemoValues() {
    return {
      correct: Number($demoCorrectSlider.value),
      timeSec: Number($demoTimeSlider.value),
    };
  }

  function renderDemo() {
    const { correct, timeSec } = getDemoValues();
    const timeSpent = timeSec * 1000;
    const iq = calcStaticIqByStats({
      isCorrect: correct,
      total: TOTAL_QUESTIONS,
    });

    const { topPercent: topPt, percentileRank } = calcRankingStats(
      DEMO_IQS,
      iq,
    );

    fillCertificate({
      playerName: "John Doe",
      staticIq: iq,
      isCorrect: correct,
      isAnswered: TOTAL_QUESTIONS,
      timeSpent,
      topPt,
      percentileRank,
      seed: demoSeed,
      allBestIqs: DEMO_IQS,
      dateStr: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
      resultId: null,
    });
  }

  renderDemo();

  $btnDemoShuffle.addEventListener("click", () => {
    demoSeed = Math.floor(Math.random() * 2 ** 32);
    renderDemo();
  });

  $demoCorrectSlider.addEventListener("input", () => {
    $demoCorrectValue.textContent = `${$demoCorrectSlider.value}/${TOTAL_QUESTIONS}`;
    renderDemo();
  });

  $demoTimeSlider.addEventListener("input", () => {
    $demoTimeValue.textContent = formatTimeSpan(
      Number($demoTimeSlider.value) * 1000,
    );
    renderDemo();
  });

  $certLoading.hidden = true;
  $certDemo.hidden = false;
  $certActions.hidden = false;
  $btnBackToResult.hidden = true;
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
    const { topPercent: topPt, percentileRank } = calcRankingStats(
      allBestIqs,
      staticIq,
    );

    const { isAnswered, isCorrect, timeSpent } = stats;
    const dateObj = datePassed.toDate();
    safeDate = dateObj.toLocaleDateString().replaceAll("/", "-");
    const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}`;

    fillCertificate({
      playerName,
      staticIq,
      topPt,
      percentileRank,
      isCorrect,
      isAnswered,
      timeSpent,
      seed: stringToHash(resultId),
      allBestIqs,
      dateStr,
      resultId,
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
