import { calcStaticIqByStats } from "./calc-iq.js";
import { getAllResults, getResultById } from "./endpoints/get-stats.js";
import {
  findCognitiveGroup,
  findCognitiveSubgroup,
} from "./helpers/cognitive-classification-system.js";
import { formatTimeSpan } from "./helpers/common.js";
import { getHashParameter, updateHashParameter } from "./helpers/hash-param.js";
import { getNormalizedSeed } from "./helpers/seeded-random.js";
import {
  calculateIQ,
  calculateMean,
  calculateStandardDeviation,
} from "./helpers/statistics.js";
import { getArchetype } from "./helpers/archetypes.js";
import { getModifiers } from "./helpers/modifiers.js";

import "./result.fbq.js";
import "./result.ga.js";
import { analytics, logEvent } from "./endpoints/firebase.init.js";
import { signAnonUser, getCurrentUser } from "./endpoints/auth.js";
import { saveFeedback } from "./endpoints/save-feedback.endpoint.js";
import { getUserData } from "./endpoints/user-data.js";
import { getCached } from "./helpers/local-cache.helper.js";
import { fetchClientIpInfo } from "./endpoints/ip-info.js";
import { initChart } from "./chart.js";
import { getBestIqPerUser, calcRankingStats } from "./helpers/ranking.js";

function revealStat($el) {
  $el?.classList.remove("empty-loader");
  $el?.classList.add("stat-revealed");
}

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
    // ===== Demo mode =====
    const TOTAL_QUESTIONS = 40;

    function buildMockData({ correct, timeSec }) {
      const mockTimeSpent = timeSec * 1000;
      const avgTimePerQ = mockTimeSpent / TOTAL_QUESTIONS;

      const zAnswers = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => ({
        questionIndex: i,
        isAnswered: true,
        isCorrect: i < correct,
        timeSpent: avgTimePerQ,
      }));

      const userResult = {
        _userId: "demo-user",
        zAnswers,
        stats: {
          isCorrect: correct,
          isAnswered: TOTAL_QUESTIONS,
          total: TOTAL_QUESTIONS,
          timeSpent: mockTimeSpent,
        },
        datePassed: { toDate: () => new Date() },
      };

      // mock population to get meaningful ranking
      const allResults = [
        60, 65, 70, 75, 80, 85, 90, 95, 100, 100, 105, 110, 115, 120, 130, 140,
      ].map((mockIq, i) => {
        const c = Math.round(((mockIq - 60) / 80) * TOTAL_QUESTIONS);
        return {
          _userId: `mock-${i}`,
          stats: {
            isCorrect: c,
            isAnswered: TOTAL_QUESTIONS,
            total: TOTAL_QUESTIONS,
            timeSpent: 300_000,
          },
          datePassed: { toDate: () => new Date() },
        };
      });

      // inject current user into population
      allResults.push(userResult);

      return { userResult, allResults };
    }

    async function renderResultDemo() {
      const correct = Number($demoCorrectSlider.value);
      const timeSec = Number($demoTimeSlider.value);
      const { userResult, allResults } = buildMockData({ correct, timeSec });

      await displayResult({ userResult, allResults });
    }

    $resultDemo.hidden = false;
    renderResultDemo();

    $demoCorrectSlider.addEventListener("input", () => {
      $demoCorrectValue.textContent = `${$demoCorrectSlider.value}/${TOTAL_QUESTIONS}`;
      renderResultDemo();
    });

    $demoTimeSlider.addEventListener("input", () => {
      $demoTimeValue.textContent = formatTimeSpan(
        Number($demoTimeSlider.value) * 1000,
      );
      renderResultDemo();
    });

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

    await displayResult({ userResult, allResults });
  })();
}

async function displayResult({ userResult, allResults }) {
  $testShareLink.value = `${location.origin}#ref=${userResult._userId}`;

  const userData = (await getUserData(userResult._userId)) ?? {};
  const playerName = userData.displayName?.trim() || "Anonymous player";

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

  const bestIqByUser = getBestIqPerUser(allResults);
  const allBestIqs = Object.values(bestIqByUser);
  initChart({ chartData: allBestIqs, highlightValue: staticIq });

  const {
    globalRank,
    percentileRank: percetileRank,
    topPercent: topPt,
  } = calcRankingStats(allBestIqs, staticIq);
  console.log("🔥 [RANK DEBUG] staticIq:", staticIq);
  console.log("🔥 [RANK DEBUG] globalRank:", globalRank);

  //update values
  $iqScoreValue.textContent = `${staticIq.toFixed(0)}`;
  $scientificIqValue.textContent = `${scientificIq.toFixed(0)}`;
  $cognitiveGroupValue.textContent = findCognitiveGroup(staticIq).name;
  $cognitiveSubgroupValue.textContent = findCognitiveSubgroup(staticIq).name;

  // ===== GA: view_result =====
  logEvent(analytics, "view_result", {
    iq_score: Math.round(staticIq),
    percentile: Math.round(percetileRank),
    correct_answers: resultsStats.isCorrect,
    total_questions: resultsStats.total,
  });

  //

  const { isAnswered, isCorrect, timeSpent, total } = resultsStats;

  $brainImg.parentElement.classList.remove("blurred");

  $completionTimeValue.textContent = formatTimeSpan(timeSpent);

  $dateTakenValue.textContent = datePassed.toDate().toLocaleDateString();
  $globalRankValue.textContent = `#${globalRank.toFixed(0)}`;

  // percentile rank card
  $percentileValue.textContent = `${topPt.toFixed(0)}%`;
  $percentileDesc.textContent = `You are smarter than ${percetileRank.toFixed(0)}% of people`;
  updatePercentileGauge(percetileRank);

  // reveal stat values
  revealStat($percentileValue);
  revealStat($globalRankValue);
  revealStat($completionTimeValue);

  const accuracyRate = (isCorrect / total) * 100;
  const answerSpeed = timeSpent / 1000 / total;

  // ===== Archetype =====
  const archetype = getArchetype(answerSpeed, isCorrect / total);
  $cognitiveTypeName.textContent = archetype.name;
  $cognitiveTypeDesc.textContent = archetype.desc;
  $cognitiveTypeMotto.textContent = archetype.motto;

  $cognitiveTypeName.classList.remove("empty-loader");
  $cognitiveTypeDesc.classList.remove("empty-loader");
  $cognitiveTypeMotto.classList.remove("empty-loader");

  if (archetype.imgName) {
    $archetypeImg.src = `./images/archetypes/${archetype.imgName}`;
    $archetypeImg.hidden = false;
  }

  // ===== Modifiers =====
  const answers = userResult.zAnswers ?? [];
  const modifiers = getModifiers(answers);

  // brain image based on modifiers (last match wins)
  const BRAIN_BY_MODIFIER = {
    Glitch: "brain-smoker.png",
    "Coinflip Master": "brain-dead.png",
    Bot: "brain-dummy.png",
    "Reptile Brain": "brain-reptilian.png",
  };
  for (const m of modifiers) {
    if (BRAIN_BY_MODIFIER[m.label]) {
      $brainImg.src = `./images/brains/${BRAIN_BY_MODIFIER[m.label]}`;
    }
  }

  $cognitiveTypeTags.innerHTML = modifiers
    .map(
      (m) =>
        `<span class="tag flex-row align-center gap-5" style="--color: ${m.color}">` +
        `${m.emoji} ${m.label}</span>`,
    )
    .join("");

  $correctAnswersValue.textContent = `${isCorrect}/${isAnswered}`; ///${total}`;
  // $topRankValue.textContent = `${topPt.toFixed(0)}%`;
  $accuracyRateValue.textContent = `${accuracyRate.toFixed(1)}%`;
  $answerSpeedValue.textContent = `${answerSpeed.toFixed(2)}s`;

  revealStat($correctAnswersValue);
  revealStat($accuracyRateValue);
  revealStat($answerSpeedValue);

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

function showToast(message) {
  $toast.textContent = message;
  $toast.hidden = false;
  setTimeout(() => {
    $toast.hidden = true;
  }, 2000);
}

$btnShareResult.addEventListener("click", async () => {
  const url = $testResultLink.value;
  const shareData = {
    title: "My IQ Test Result",
    text: `I scored ${$iqScoreValue.textContent} on the IQ test! Can you beat me?`,
    url,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    }
  }
});

$btnChallengeFriend.addEventListener("click", async () => {
  const url = $testShareLink.value;
  const shareData = {
    title: "IQ Test Challenge",
    text: "Think you're smarter than me? Take this IQ test and find out!",
    url,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    }
  }
});

$btnDownloadCertificate.addEventListener("click", () => {
  const resultId = getHashParameter("id");
  if (resultId) {
    window.open(`./certificate.html#id=${resultId}`, "_blank");
  }
});

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

  const $$emojiInputs = document.querySelectorAll(".feedback-emoji");

  $$emojiInputs.forEach(($input) => {
    $input.addEventListener("change", () => {
      $feedbackExtra.hidden = false;
    });
  });

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
