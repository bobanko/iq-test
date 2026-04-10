import { calcStaticIqByStats } from "./calc-iq.js";
import { getAllResults, getResultById } from "./endpoints/get-stats.js";
import {
  findCognitiveGroup,
  findCognitiveSubgroup,
} from "./helpers/cognitive-classification-system.js";
import { formatTimeSpan } from "./helpers/common.js";
import { copyTextFrom } from "./helpers/copy.js";
import { getHashParameter, updateHashParameter } from "./helpers/hash-param.js";
import { getNormalizedSeed } from "./helpers/seeded-random.js";
import {
  calculateIQ,
  calculateMean,
  calculateStandardDeviation,
} from "./helpers/statistics.js";

import "./result.fbq.js";
import { signAnonUser, getCurrentUser } from "./endpoints/auth.js";
import { saveFeedback } from "./endpoints/save-feedback.endpoint.js";
import { getUserData } from "./endpoints/user-data.js";
import { getCached } from "./helpers/local-cache.helper.js";
import { fetchClientIpInfo } from "./endpoints/ip-info.js";
import { initChart } from "./chart.js";

let currentCertificateData = null;

function updatePercentileGauge(percentile) {
  const fraction = Math.min(Math.max(percentile / 100, 0), 1);

  // arc from (10,65) to (110,65) with radius 50 — semicircle
  const totalLength = Math.PI * 50; // ≈157
  const arcLength = totalLength * fraction;

  $gaugeArc.style.strokeDasharray = `${totalLength}`;
  $gaugeArc.style.strokeDashoffset = `${totalLength - arcLength}`;

  // position dot along the arc
  const angle = Math.PI * (1 - fraction); // π..0 (left to right)
  const cx = 60 - 50 * Math.cos(angle);
  const cy = 65 - 50 * Math.sin(angle);
  $gaugeDot.setAttribute("cx", cx);
  $gaugeDot.setAttribute("cy", cy);
}

function updateSeed() {
  const seed = getNormalizedSeed();

  updateHashParameter("seed", seed);
}

function generateCertificatePdf() {
  const jsPdfCtor = window.jspdf?.jsPDF;

  if (!jsPdfCtor) {
    alert("PDF library is not loaded yet. Please try again in a moment.");
    return;
  }

  if (!currentCertificateData) {
    alert("Result data is not ready yet.");
    return;
  }

  const doc = new jsPdfCtor({
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
  doc.text(`${currentCertificateData.iq}`, pageWidth / 2, 246, {
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
  doc.text(
    currentCertificateData.dateTaken,
    leftColumnX + leftValueOffset,
    rowStartY,
  );
  doc.text(
    currentCertificateData.percentileLabel,
    leftColumnX + leftValueOffset,
    rowStartY + rowGap,
  );
  doc.text(
    currentCertificateData.correctAnswers,
    leftColumnX + leftValueOffsetWide,
    rowStartY + rowGap * 2,
  );
  doc.text(
    currentCertificateData.cognitiveSubgroup,
    leftColumnX + leftValueOffsetWide,
    rowStartY + rowGap * 3,
  );

  doc.text(
    currentCertificateData.completionTime,
    rightColumnX + 112,
    rowStartY,
  );
  doc.text(
    currentCertificateData.answerSpeed,
    rightColumnX + 112,
    rowStartY + rowGap,
  );
  doc.text(
    currentCertificateData.globalRank,
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
    "Date: " + currentCertificateData.dateTaken,
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
  //   "Result link: " + currentCertificateData.resultUrl,
  //   margin + 10,
  //   pageHeight - 44,
  // );

  const safeDate = currentCertificateData.dateTaken.replaceAll("/", "-");
  doc.save(`iq-certificate-${safeDate}.pdf`);
}

function onHashChanged() {
  const resultId = getHashParameter("id");

  if (!resultId) {
    // todo(vmyshko): get current user id and request recent result id, then redir to it
    alert("no id");
    return;
  }

  $testResultLink.value = location.href;

  // todo(vmyshko): get requested id

  (async () => {
    //
    const allResults = await getAllResults();
    const userResult = await getResultById(resultId);

    console.log({ allResults });
    console.log({ userResult });

    displayResult({ userResult, allResults });
  })();
}

function displayResult({ userResult, allResults }) {
  $testShareLink.value = `${location.origin}#ref=${userResult._userId}`;

  const { stats: resultsStats, datePassed } = userResult;

  // all answer counts
  const sampleCorrectAnswers = allResults.map(
    (result) => result.stats.isCorrect,
  );

  const correctAnswersMean = calculateMean(sampleCorrectAnswers);
  const correctAnswersStd = calculateStandardDeviation(
    sampleCorrectAnswers,
    correctAnswersMean,
  );

  const scientificIq = calculateIQ({
    rawScore: userResult.stats.isCorrect,
    mean: correctAnswersMean,
    standardDeviation: correctAnswersStd,
  });

  const staticIq = calcStaticIqByStats(resultsStats);

  const allResultsIqs = allResults
    .map((result) => result.stats)
    .map(calcStaticIqByStats);

  initChart({ chartData: allResultsIqs, highlightValue: staticIq });

  const allResultsIqsSorted = allResultsIqs.toSorted((a, b) => a - b);

  // PR = [(N_below + 0.5 × N_equal) / N_total] × 100
  const resultsBelowCount = allResultsIqsSorted.filter(
    (iq) => iq < staticIq,
  ).length;
  const sameResultsCount = allResultsIqsSorted.filter(
    (iq) => iq === staticIq,
  ).length;
  const totalResultsCount = allResultsIqsSorted.length;
  const globalRank =
    totalResultsCount - (resultsBelowCount + sameResultsCount / 2);
  const percetileRank =
    ((resultsBelowCount + sameResultsCount / 2) / totalResultsCount) * 100;

  const topPt = 100 - percetileRank;

  //update values
  $iqScoreValue.textContent = `${staticIq.toFixed(0)}`;
  $scientificIqValue.textContent = `${scientificIq.toFixed(0)}`;
  $cognitiveGroupValue.textContent = findCognitiveGroup(staticIq).name;
  $cognitiveSubgroupValue.textContent = findCognitiveSubgroup(staticIq).name;

  //

  const { isAnswered, isCorrect, timeSpent, total } = resultsStats;

  $completionTimeValue.textContent = formatTimeSpan(timeSpent);

  $dateTakenValue.textContent = datePassed.toDate().toLocaleDateString();
  $globalRankValue.textContent = `#${globalRank.toFixed(0)}`;

  // percentile rank card
  $percentileValue.textContent = `Top ${topPt.toFixed(0)}%`;
  $percentileDesc.textContent = `You are smarter than ${percetileRank.toFixed(0)}% of people`;
  updatePercentileGauge(percetileRank);
  //

  const accuracyRate = (isCorrect / total) * 100;
  const answerSpeed = timeSpent / 1000 / total;

  $correctAnswersValue.textContent = `${isCorrect}/${isAnswered}`; ///${total}`;
  // $topRankValue.textContent = `${topPt.toFixed(0)}%`;
  $accuracyRateValue.textContent = `${accuracyRate.toFixed(1)}%`;
  $answerSpeedValue.textContent = `${answerSpeed.toFixed(2)}s`;

  // sublabels
  $topRankLabel.textContent = `Top ${topPt.toFixed(0)}% of test takers ✨`;

  $heroDescription.textContent =
    staticIq >= 120
      ? "Impressive! You're a sharp thinker."
      : staticIq >= 100
        ? "Solid score! You're doing great."
        : staticIq >= 80
          ? "You're picking things up. Keep training that brain."
          : "Every brain has potential. Keep going!";

  const timeMinutes = timeSpent / 1000 / 60;
  $completionTimeSub.textContent =
    timeMinutes < 2
      ? "Fast and clean"
      : timeMinutes < 5
        ? "Steady pace"
        : "Took your time";

  $accuracyRateSub.textContent =
    accuracyRate >= 80
      ? "Sharpshooter"
      : accuracyRate >= 50
        ? "Getting there"
        : "Room to improve";

  $correctAnswersSub.textContent =
    isCorrect === total
      ? "All or nothing 😎"
      : isCorrect >= total * 0.8
        ? "Almost perfect"
        : `${total - isCorrect} missed`;

  $chartMainLegend.innerHTML = `
  You are in the top  <b class="highlight">${topPt.toFixed(0)}%</b> of the smartest people in the world.`;

  currentCertificateData = {
    iq: staticIq.toFixed(0),
    dateTaken: datePassed.toDate().toLocaleDateString(),
    percentileLabel: `Top ${topPt.toFixed(0)}%`,
    correctAnswers: `${isCorrect}/${isAnswered}`,
    completionTime: formatTimeSpan(timeSpent),
    answerSpeed: `${answerSpeed.toFixed(2)}s per question`,
    globalRank: `#${globalRank.toFixed(0)}`,
    cognitiveSubgroup: findCognitiveSubgroup(staticIq).name,
    resultUrl: location.href,
  };
}

window.addEventListener("hashchange", onHashChanged);

// hotkeys
function bindingsOnKeypress({ code, target }) {
  const targetTagsToIgnore = ["INPUT", "SELECT"];
  if (targetTagsToIgnore.includes(target.tagName)) return;

  const keyBindingsMap = new Map([["KeyG", () => updateSeed()]]);

  keyBindingsMap.get(code)?.();
}

document.addEventListener("keydown", bindingsOnKeypress);

onHashChanged();

$testResultLink.addEventListener("click", () => copyTextFrom($testResultLink));
$testShareLink.addEventListener("click", () => copyTextFrom($testShareLink));

$btnCopyTestResultLink.addEventListener("click", () =>
  copyTextFrom($testResultLink),
);
$btnCopyTestShareLink.addEventListener("click", () =>
  copyTextFrom($testShareLink),
);

$btnDownloadCertificate.addEventListener("click", generateCertificatePdf);

{
  const $fieldset = $formContact.querySelector("fieldset");

  // ensure user is signed in (anon)
  await signAnonUser();

  // try to pre-fill form
  $fieldset.disabled = true;

  const user = await getCurrentUser();
  const userData = (await getUserData(user.uid)) ?? {};
  const { displayName = "", email = "" } = userData;

  $fieldset.disabled = false;

  const $emojiInputs = document.querySelectorAll(".feedback-emoji");
  let selectedReaction = null;

  $emojiInputs.forEach(($input) => {
    $input.addEventListener("change", () => {
      if ($input.checked) {
        selectedReaction = $input.getAttribute("content");
      }
    });
  });

  $fieldset.disabled = false;

  $formContact.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData($formContact);
    //disabling fieldset disables formdata fields from reading
    $fieldset.disabled = true;

    const resultId = getHashParameter("id");
    const message = formData.get("message");
    const selectedReaction = formData.get("reaction");

    const ipInfo = await getCached({
      fn: fetchClientIpInfo,
      cacheKey: "client-ip-info",
    });

    const userData = {
      message,
      resultId,

      reaction: selectedReaction,

      countryCode: ipInfo.location.country.code,

      ipInfo,
    };

    await saveFeedback(userData);
    // clear form
    $formContact.message.value = "";

    $fieldset.disabled = false;
  });
}
