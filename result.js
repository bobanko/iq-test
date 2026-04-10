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
import { generateCertificatePdf } from "./certificate.js";

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
  $percentileValue.textContent = `${topPt.toFixed(0)}%`;
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

$btnShareResult.addEventListener("click", async () => {
  const shareData = {
    title: "My IQ Test Result",
    text: `I scored ${$iqScoreValue.textContent} on the IQ test! Can you beat me?`,
    url: $testResultLink.value,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Share failed:", err);
    }
  }
});

$btnChallengeFriend.addEventListener("click", async () => {
  const shareData = {
    title: "IQ Test Challenge",
    text: "Think you're smarter than me? Take this IQ test and find out!",
    url: $testShareLink.value,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Share failed:", err);
    }
  }
});

$btnDownloadCertificate.addEventListener("click", () =>
  generateCertificatePdf(currentCertificateData),
);

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
