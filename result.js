import { calcStaticIqByStats } from "./calc-iq.js";
import { getAllResults, getResultById } from "./endpoints/get-stats.js";
import {
  findCognitiveGroup,
  findCognitiveSubgroup,
} from "./helpers/cognitive-classification-system.js";
import { formatTimeSpan } from "./helpers/common.js";
import { copyTextFrom } from "./helpers/copy.js";
import { getHashParameter, updateHashParameter } from "./helpers/hash-param.js";
import { SeededRandom } from "./helpers/random.helpers.js";
import { getNormalizedSeed } from "./helpers/seeded-random.js";

function getPairs(array) {
  return Array.from({ length: array.length - 1 }, (_, i) => [
    array[i],
    array[i + 1],
  ]);
}

function groupBySplitPoints({ numbers, splitPoints }) {
  const sortedNumbers = numbers.toSorted((a, b) => a - b);
  const sortedSplitPoints = [-Infinity, ...splitPoints, Infinity].toSorted(
    (a, b) => a - b
  );

  const resultGroups = [];

  let numberIndex = 0;
  for (const [min, max] of getPairs(sortedSplitPoints)) {
    const group = {
      min,
      max,
      items: [],
      name: getGroupRangeName({ min, max }),
    };

    while (
      sortedNumbers[numberIndex] < max - 1 &&
      numberIndex < numbers.length
    ) {
      group.items.push(sortedNumbers[numberIndex]);
      numberIndex++;
    }
    resultGroups.push(group);
  }

  return resultGroups;
}

function getGroupRangeName({ min, max }) {
  if (min === -Infinity) return `<${max}`;
  if (max === Infinity) return `>${min}`;

  return `${min}-${max - 1}`;
}

function initChart({ chartData, highlightValue = null }) {
  // todo(vmyshko): dynamically create chart as well
  const min = Math.min(...chartData);
  const max = Math.max(...chartData);

  console.log("🧠", chartData, min, max);

  const groups = groupBySplitPoints({
    numbers: chartData,
    splitPoints: [70, 80, 90, 110, 120, 130],
  });

  console.log("🍆", groups);

  const maxLinesY = 11;

  //
  const maxCount = Math.max(...groups.map(({ items }) => items.length));
  const chartYstep = Math.floor((maxCount - 1) / maxLinesY) + 1;

  const linesCount = Math.ceil(maxCount / chartYstep) + 1;

  // const maxY = maxCount + (maxCount % chartYstep);
  const maxY = Math.ceil(maxCount / chartYstep) * chartYstep;
  console.log(linesCount, maxY);

  const $bars = $chartMain.querySelector(".bars");
  const $lines = $chartMain.querySelector(".lines");

  $bars.replaceChildren();
  $lines.replaceChildren();

  groups.forEach(({ name, min, max, items }) => {
    const $bar = $tmplChartBar.content.firstElementChild.cloneNode(true);

    const groupTitle = getGroupRangeName({ min, max });
    const count = items.length;

    const countPt = ((count / maxY) * 100).toFixed(2);

    $bar.title = items.sort();

    if (
      Number.isFinite(highlightValue) &&
      highlightValue >= min &&
      highlightValue <= max - 1
    ) {
      $bar.style.setProperty("--color", "var(--pink)");
    }

    $bar.style.setProperty("--value", `${countPt}%`);

    $bar.querySelector(".value").textContent = `${groupTitle}`; // [${count}]

    $bars.appendChild($bar);
  });

  Array(linesCount)
    .fill(0)
    .map((_, i) => i * chartYstep)
    .reverse() // todo(vmyshko): do it with css?
    .forEach((value) => {
      const $line = $tmplChartLine.content.firstElementChild.cloneNode(true);

      //   $line.style.setProperty("--value", value);
      $line.querySelector(".value").textContent = `${value}`;

      $lines.appendChild($line);
    });
}

// const quizResults = getQuizResults();
// const resultsStats = getResultsStats(quizResults);

function updateSeed() {
  const seed = getNormalizedSeed();

  updateHashParameter("seed", seed);
}

function getFakeData() {
  const seed = +getHashParameter("seed");

  const random = new SeededRandom(seed);

  const fakeStatsGauss = [
    [60, 69, 2],
    [70, 79, 7],
    [80, 89, 16],
    [90, 109, 50],
    [110, 119, 16],
    [120, 129, 7],
    [130, 140, 2],
  ]
    .map(([min, max, count]) => {
      return Array.from({ length: count }, (_, index) =>
        random.fromRange(min, max)
      );
    })
    .flat();

  return fakeStatsGauss;
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
    const results = await getAllResults();
    console.log(results);

    const allResultsIqs = results
      .map((result) => result.stats)
      .map(calcStaticIqByStats);

    const userResult = await getResultById(resultId);

    $testShareLink.value = `${location.origin}#ref=${userResult._userId}`;

    displayResult({ userResult, allResultsIqs });
  })();

  //debug

  const fakeStatsGauss = getFakeData();

  initChart({ chartData: fakeStatsGauss });
}

function displayResult({ userResult, allResultsIqs }) {
  console.log({ result: userResult });

  const { stats: resultsStats, datePassed } = userResult;
  const currentIq = calcStaticIqByStats(resultsStats);

  initChart({ chartData: allResultsIqs, highlightValue: currentIq });

  const allResultsIqsSorted = allResultsIqs.toSorted((a, b) => a - b);

  // PR = [(N_below + 0.5 × N_equal) / N_total] × 100
  const resultsBelowCount = allResultsIqsSorted.filter(
    (iq) => iq < currentIq
  ).length;
  const sameResultsCount = allResultsIqsSorted.filter(
    (iq) => iq === currentIq
  ).length;
  const totalResultsCount = allResultsIqsSorted.length;
  const globalRank =
    totalResultsCount - (resultsBelowCount + sameResultsCount / 2);
  const percetileRank =
    ((resultsBelowCount + sameResultsCount / 2) / totalResultsCount) * 100;

  const topPt = 100 - percetileRank;

  //update values

  // const performanceClass = getCognitiveClassification(currentIq);
  const performanceClass = findCognitiveGroup(currentIq);
  // const performanceClass = findCognitiveSubgroup(currentIq);

  $iqScoreValue.textContent = currentIq;
  $percentileRankValue.textContent = `${percetileRank.toFixed(0)}%`;
  $cognitiveGroupValue.textContent = findCognitiveGroup(currentIq).name;
  $cognitiveSubgroupValue.textContent = findCognitiveSubgroup(currentIq).name;

  //

  const { isAnswered, isCorrect, timeSpent, total } = resultsStats;

  $completionTimeValue.textContent = formatTimeSpan(timeSpent, true);
  $questionsAnsweredValue.textContent = `${isAnswered}/${total}`;
  $dateTakenValue.textContent = datePassed.toDate().toLocaleDateString();
  $globalRankValue.textContent = `#${globalRank}`;
  //

  const accuracyRate = (isCorrect / total) * 100;
  const answerSpeed = timeSpent / 1000 / total;

  $correctAnswersValue.textContent = `${isCorrect}`;
  $percentileRankValue2.textContent = `${percetileRank.toFixed(0)}`;
  $accuracyRateValue.textContent = `${accuracyRate.toFixed(1)}%`;
  $answerSpeedValue.textContent = `${answerSpeed.toFixed(2)} sec`;

  $chartMainLegend.innerHTML = `
  You are among the <b>${topPt.toFixed(
    0
  )}%</b> of the smartest people in the world. 
  You are smarter than <b>${percetileRank.toFixed(0)}%</b> of the population.`;
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
  copyTextFrom($testResultLink)
);
$btnCopyTestShareLink.addEventListener("click", () =>
  copyTextFrom($testShareLink)
);
