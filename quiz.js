import { getLetter, preventSvgCache, wait } from "./helpers/helpers.js";
import { quizQuestionConfigs } from "./configs/quiz/quiz.config.js";
import { SeededRandom } from "./helpers/random.helpers.js";
import { stringToHash } from "./helpers/hash-string.js";

import { Timer } from "./helpers/timer.js";
import { updateHashParameter, getHashParameter } from "./helpers/hash-param.js";
import {
  preloadImageByImg,
  preloadImageByLink,
} from "./helpers/preload-image.helper.js";

import { getCurrentUser, signAnonUser } from "./endpoints/auth.js";
import { saveQuizResults } from "./endpoints/save-quiz-results.endpoint.js";
import { countries, emojiFlags } from "./countries.mapping.js";
import { getCached } from "./helpers/local-cache.helper.js";
import { fetchClientIpInfo } from "./endpoints/ip-info.js";
import { getUserData, updateUserData } from "./endpoints/user-data.js";
import { getSafeIndex } from "./helpers/safe-index.js";
import { getNormalizedSeed } from "./helpers/seeded-random.js";
import { formatTimeSpan } from "./helpers/common.js";
import { exitTheFullscreen, requestFullScreen } from "./helpers/fullscreen.js";
import { copyTextFrom } from "./helpers/copy.js";

import "./quiz.fbq.js";

// globals
const patternsInRowDefault = 3;
const patternsInColDefault = 3;
const timer = new Timer();

const clockEmojis = [
  "🕛",
  "🕐",
  "🕑",
  "🕒",
  "🕓",
  "🕔",
  "🕕",
  "🕖",
  "🕗",
  "🕘",
  "🕙",
  "🕚",
];

timer.onUpdate((diff) => {
  const oneMinMs = 60 * 1000;
  const timeGivenMs = currentQuiz.questions.length * oneMinMs;

  $timerIcon.textContent =
    clockEmojis[Math.floor(diff / 1000) % clockEmojis.length];

  $timer.textContent = formatTimeSpan(timeGivenMs - diff);

  currentQuiz.questions[_currentQuestionIndex].timeSpent += 1;

  // debug

  if (document.debugMode) {
    const questionButtons = [
      ...$questionList.querySelectorAll(".question-button"),
    ];

    questionButtons[_currentQuestionIndex].dataset.time =
      // todo(vmyshko): make it based on timer interval?
      // todo(vmyshko): calc based on diff? complex
      // todo(vmyshko): stop when all answered? is it cheat?
      (currentQuiz.questions[_currentQuestionIndex].timeSpent / 10).toFixed(1);
  }

  if (timeGivenMs <= diff) {
    console.log("stopping timer", timer.getDiff());
    if (timer.isRunning) timer.stop();

    // todo(vmyshko): stop quiz?
    return;
  }
});

// ***

let _currentQuestionIndex;
function updateCurrentQuestionLabel({
  current,
  total = currentQuiz.questions.length,
}) {
  _currentQuestionIndex = current;
  $currentQuestionLabel.textContent = `${current + 1}/${total}`;
}

function updateProgressQuiz({
  answered,
  total = currentQuiz.questions.length,
}) {
  $progressQuiz.max = total;
  $progressQuiz.value = answered;

  $quizProgressAnswered.textContent = `${answered}/${total}`;
}

// todo(vmyshko): rename
function navigateQuestions(shift = 1) {
  const nextQuestionIndex = getSafeIndex({
    length: currentQuiz.questions.length,
    index: _currentQuestionIndex + shift,
  });

  $questionList.children[nextQuestionIndex].click();
}

$btnPrevQuestion.addEventListener("click", () => navigateQuestions(-1));
$btnNextQuestion.addEventListener("click", () => navigateQuestions(1));

// question buttons

function selectQuestionButton($currentButton) {
  const questionButtons = [
    ...$questionList.querySelectorAll(".question-button"),
  ];
  questionButtons.forEach(($button) => {
    $button.classList.remove("selected");
  });

  $currentButton.classList.add("selected");
}

function addQuestionButton({
  text = "x",
  onQuestionButtonClick = () => void 0,
}) {
  const $questionButton =
    $tmplQuestionButton.content.firstElementChild.cloneNode(true);

  $questionButton.textContent = text;
  $questionList.appendChild($questionButton);

  $questionButton.addEventListener("click", async () => {
    selectQuestionButton($questionButton);

    // console.log("start");
    // $patternArea.style.opacity = 0;
    // $answerList.style.opacity = 0;
    // await wait(100);
    onQuestionButtonClick($questionButton);
    // await wait(100);
    // $patternArea.style.opacity = 1;
    // $answerList.style.opacity = 1;

    // console.log("end");
  });
}

function generateSeed() {
  const seed = getNormalizedSeed();

  updateHashParameter("seed", seed);
}

function preloadSvgs() {
  const questionConfigList = Object.values(quizQuestionConfigs);

  const svgLinks = new Set();

  questionConfigList.forEach((cfg) => {
    if (cfg.figureLink) {
      svgLinks.add(cfg.figureLink);
    }
  });

  // return Promise.all([...svgLinks].map(preloadImageByLink))
  return Promise.all([...svgLinks].map(preloadImageByImg))
    .then((loadedUrls) => {
      console.log("All images loaded:", loadedUrls);
    })
    .catch((error) => console.error("Error preloading images:", error));
}

function onHashChanged() {
  const seed = +getHashParameter("seed");

  generateQuiz({ seed });
}

const currentQuiz = {
  isFinished: false,
  questions: [],
  answers: new Map(),
  seed: null,
};

function toggleControls(isEnabled = true) {
  $answerList.toggleAttribute("disabled", !isEnabled);
  $btnFinishQuiz.disabled = !isEnabled;
}

function generateQuiz({ seed }) {
  const $prevQuestion = $questionList.querySelector(".selected");
  toggleControls(true);

  const questionIndexToSelect = $prevQuestion
    ? [...$questionList.children].indexOf($prevQuestion)
    : 0;

  $seed.value = seed;

  currentQuiz.seed = seed;
  currentQuiz.isFinished = false;
  currentQuiz.answers.clear();

  $questionList.replaceChildren(); // delete all question buttons

  const questionConfigEntries = Object.entries(quizQuestionConfigs);

  const generatingQuestionsTimeTestString = `⏱️🍀 generating ${questionConfigEntries.length} questions`;
  console.time(generatingQuestionsTimeTestString);

  const _questions = questionConfigEntries.map(
    ([configName, config], questionIndex) => {
      console.group(`🍀 generation: %c${configName}`, "color: gold");

      const seedSalted = seed + stringToHash(configName);

      const questionData = config.generator({
        config,
        seed: seedSalted,
      });

      console.log({
        seed,
        seedSalted,
        config,
        questionData,
      });

      console.groupEnd();

      return { questionData, configName, questionIndex, timeSpent: 0 };
    }
  );
  currentQuiz.questions.splice(0, currentQuiz.questions.length, ..._questions);

  console.timeEnd(generatingQuestionsTimeTestString);

  // add question buttons
  currentQuiz.questions.forEach(
    ({ questionData, configName, questionIndex }) => {
      addQuestionButton({
        text: `${questionIndex + 1}`,
        onQuestionButtonClick: function _selectQuestion($questionButton) {
          const config = quizQuestionConfigs[configName];

          console.log("🔮", configName);

          // todo(vmyshko): based on current/config
          const { questionPatterns, answerPatterns } = config.renderer({
            config,
            questionData,
            questionIndex,
          });

          // todo(vmyshko): put replace with append for fast rendering
          $patternArea.style.setProperty(
            "--size",
            questionData.patternsInRow ?? patternsInRowDefault
          );

          {
            const {
              patternsInRow = patternsInRowDefault,
              patternsInCol = patternsInColDefault,
            } = questionData;
            // todo(vmyshko): extract this to common, cause other question-types should reset this
            // 100 + 10 + 100 + 10 + 100 + 10

            const rowColMaxPatterns = patternsInRow;
            // todo(vmyshko): fix and re-check for cutouts and in-row-2/in-col-3 configs
            // Math.max(patternsInRow, patternsInCol);
            const targetWidthPx = 340; //px - total width that we want to get
            const maxPatternSizePx = 320;
            const outerBorderPx = 10 * 2; //px
            const gapsPx = 10 * (rowColMaxPatterns - 1);
            const patternSizePx =
              (targetWidthPx - outerBorderPx - gapsPx) / rowColMaxPatterns;

            $patternArea.style.setProperty(
              "--pattern-size",
              `${Math.min(patternSizePx, maxPatternSizePx)}px`
            );
          }

          $patternArea.replaceChildren(...questionPatterns);

          const seedSalted = seed + stringToHash(configName);

          //--- end -----------

          wrapAnswers({
            seed: seedSalted,
            $answerList,
            $tmplAnswer,
            answerPatterns,
            questionIndex,
          });

          updateCurrentQuestionLabel({
            current: questionIndex,
          });

          if ($disableSvgCacheCheckbox.checked) {
            preventSvgCache(performance.now());
          }
        },
      });
    }
  );

  updateProgressQuiz({
    answered: 0,
    total: currentQuiz.questions.length,
  });

  // select question to start from

  $questionList.children[questionIndexToSelect].click();

  timer.start();
}

function markAnsweredQuestions() {
  const quizResults = getQuizResults();

  quizResults
    .filter((answer) => answer.isAnswered)
    .forEach((answerData) => {
      const { isCorrect, questionIndex } = answerData;
      $questionList.children[questionIndex].classList.toggle(
        "correct",
        isCorrect
      );

      $questionList.children[questionIndex].classList.toggle(
        "wrong",
        isCorrect === false
      );
    });
}

function getQuizResults() {
  // todo(vmyshko): swap loops
  return currentQuiz.questions.map(
    ({ questionIndex, configName, questionData, timeSpent = null }) => {
      const selectedAnswerId = currentQuiz.answers.get(questionIndex) ?? null;
      const isAnswered = selectedAnswerId !== null;

      const correctAnswer = questionData.answers.find(
        (answer) => answer.isCorrect
      );

      const isCorrect = isAnswered
        ? correctAnswer.id === selectedAnswerId
        : null;
      return {
        configName,
        questionIndex,
        isAnswered,
        selectedAnswerId,
        correctAnswerId: correctAnswer.id,
        isCorrect,
        timeSpent,
      };
    }
  );
}

function getResultsStats(quizResults) {
  const stats = {
    isAnswered: 0,
    isCorrect: 0,
    total: quizResults.length,
    timeSpent: 0,
  };

  quizResults.forEach((answerData) => {
    const { isAnswered, isCorrect, timeSpent = 0 } = answerData;

    if (isAnswered) stats.isAnswered++;
    if (isCorrect) stats.isCorrect++;

    stats.timeSpent += timeSpent;
  });

  stats.timeSpent *= 100; //to ms

  return stats;
}

// apply handlers

$btnGenerate.addEventListener("click", () => generateSeed());

window.addEventListener("hashchange", onHashChanged);

$seed.addEventListener("click", () => copyTextFrom($seed));

$btnFinishQuiz.addEventListener("click", () => {
  $modalOverlayFinishConfirm.hidden = false;
});

function finishCurrentQuiz() {
  timer.stop();

  toggleControls(false);
  currentQuiz.isFinished = true;

  $questionList.firstElementChild.click(); // go to start
}

let resultId = null;

$btnFinishConfirm.addEventListener("click", async () => {
  $modalOverlayFinishConfirm.hidden = true;
  $modalOverlayPostQuiz.hidden = false;

  finishCurrentQuiz();

  const quizResults = getQuizResults();
  const resultsStats = getResultsStats(quizResults);

  resultId = await saveQuizResults({
    quizResults,
    seed: currentQuiz.seed,
    stats: resultsStats,
  });
});

function wrapAnswers({
  seed,
  $answerList,
  $tmplAnswer,
  answerPatterns,
  questionIndex,
}) {
  const random = new SeededRandom(seed);

  $answerList.replaceChildren();

  random.shuffle(answerPatterns).forEach(({ $pattern, id }, answerIndex) => {
    const $answerButton = wrapAnswerPattern({
      $tmplAnswer,
      $pattern,
      letter: getLetter(answerIndex),
    });
    $answerButton.dataset.id;
    $answerButton.dataset.id = id;

    $answerButton.addEventListener("click", async () => {
      toggleAnswerSelect({ $answer: $answerButton, $answerList });

      currentQuiz.answers.set(questionIndex, id);
      $questionList.children[questionIndex]?.classList.add("answered");

      // todo(vmyshko): not the best solution, but quizAnswers collection is bad
      const answeredCount = $questionList.querySelectorAll(".answered").length;

      updateProgressQuiz({
        answered: answeredCount,
      });

      const $nextQuestion =
        // search first not-answered in question list, starting from current
        [...$questionList.children]
          .slice(questionIndex + 1)
          .find(($q) => !$q.classList.contains("answered")) ??
        // ...if not-found, then from start
        [...$questionList.children]
          .slice(0, questionIndex + 1)
          .find(($q) => !$q.classList.contains("answered"));

      $answerList.toggleAttribute("disabled", true);
      await wait(500);

      if ($nextQuestion) {
        // go to next question
        $nextQuestion.click();
      } else {
        // no quesitons left - finish
        $btnFinishQuiz.click();
      }
      $answerList.toggleAttribute("disabled", false);
    }); //$answerButton

    $answerList.appendChild($answerButton);
  });

  // select previously selected answer if possible
  if (currentQuiz.answers.has(questionIndex)) {
    const $answerButton = $answerList.querySelector(
      `[data-id='${currentQuiz.answers.get(questionIndex)}']`
    );

    $answerButton?.classList.add("selected");

    const answerId = currentQuiz.answers.get(questionIndex);

    if (currentQuiz.isFinished) {
      const answer = currentQuiz.questions[
        questionIndex
      ].questionData.answers.find((a) => a.id === answerId);
      if (answer.isCorrect) {
        $answerButton.classList.add("correct");
      } else {
        $answerButton.classList.add("wrong");
      }
    }
  }
}

function wrapAnswerPattern({ $tmplAnswer, $pattern, letter = "x" }) {
  const $answer = $tmplAnswer.content.firstElementChild.cloneNode(true);

  const $answerLetter = $answer.querySelector(".answer-letter");
  $answerLetter.textContent = letter;

  $answer.appendChild($pattern);

  return $answer;
}

function toggleAnswerSelect({ $answer, $answerList }) {
  $answerList
    .querySelectorAll(".answer")
    .forEach(($answer) => $answer.classList.remove("selected"));

  $answer.classList.add("selected");
}

$debugCheckbox.addEventListener("change", (event) => {
  document.debugMode = $debugCheckbox.checked;
  document.body.classList.toggle("debug", document.debugMode);
});

// hotkeys
function bindingsOnKeypress({ code, target }) {
  const targetTagsToIgnore = ["INPUT", "SELECT"];
  if (targetTagsToIgnore.includes(target.tagName)) return;

  const questionsInRow = 10; // depends on layout
  const keyBindingsMap = new Map([
    ["ArrowRight", () => navigateQuestions(1)],
    ["ArrowLeft", () => navigateQuestions(-1)],
    // for quick navigation
    ["ArrowDown", () => navigateQuestions(questionsInRow)],
    ["ArrowUp", () => navigateQuestions(-questionsInRow)],

    ["KeyG", () => $btnGenerate.click()],
    ["Escape", () => $btnDebug.click()],
    ["KeyD", () => $debugCheckbox.click()],
    ["KeyF", () => $btnFinishQuiz.click()],
  ]);

  keyBindingsMap.get(code)?.();
}

document.addEventListener("keydown", bindingsOnKeypress);

$btnDebug.addEventListener("click", () => {
  $debugControlPanel.hidden = !$debugControlPanel.hidden;
});

$btnFinishCancel.addEventListener("click", () => {
  $modalOverlayFinishConfirm.hidden = true;
});

function prepareQuiz() {
  // on load
  const seed = +getHashParameter("seed");

  if (!Number.isFinite(seed) || seed === 0) {
    generateSeed();
    return;
  }

  generateQuiz({ seed });
}

function fillSelect({ $select, dataEntries }) {
  for (let [key, text] of dataEntries) {
    const $option = document.createElement("option");

    $option.textContent = text;
    $option.value = key;

    $select.appendChild($option);
  }
}

async function loadFormSelects() {
  const countryEntries = Object.entries(countries).map(
    ([countryCode, countryName]) => {
      return [countryCode, `${emojiFlags[countryCode]} ${countryName}`];
    }
  );

  fillSelect({ $select: $selectCountry, dataEntries: countryEntries });

  // todo(vmyshko): translate? or put into data-translate?
  const studies = {
    highschool: "High School",
    agriculture: "Agriculture",
    architecture: "Architecture and urbanism",
    art: "Art and design",
    business: "Commercial and management",
    education: "Education",
    engineering: "Engineering and technology",
    geography: "Geography and geology",
    humanities: "Letters and culture",
    languages: "Languages and philology",
    law: "Law",
    maths: "Math and Computer Science",
    medical: "Medical sciences",
    natural: "Natural Sciences",
    social: "Social sciences",
    com: "Communication and information",
  };

  fillSelect({ $select: $selectStudy, dataEntries: Object.entries(studies) });

  const genders = {
    male: "male",
    female: "female",
    other: "other",
  };

  fillSelect({ $select: $selectGender, dataEntries: Object.entries(genders) });

  const diplomas = {
    none: "No diploma",
    bac1: "High school diploma",
    bac2: "2 years studies degree",
    bac3: "3 years studies degree",
    bac4: "4 years studies degree",
    bac5: "5 years studies degree",
    bac6: "more than 5 years studies degree",

    //
  };
  fillSelect({
    $select: $selectDiploma,
    dataEntries: Object.entries(diplomas),
  });

  const maxYearsOld = 120;
  const currentYear = new Date().getFullYear();
  const birthYearsEntries = Array.from({ length: maxYearsOld }, (_, index) => {
    return currentYear - index;
  }).map((year) => [year, year]);

  fillSelect({
    $select: $selectBirth,
    dataEntries: birthYearsEntries,
  });
}

async function prefillQuizForm() {
  await signAnonUser();

  const ipCountryCode =
    // load user data from fb or ipinfo?
    await getCached({
      fn: fetchClientIpInfo,
      cacheKey: "client-ip-info",
    }).then((ipInfo) => {
      return ipInfo.location.country.code ?? "__";
    });

  $fieldset.disabled = true;

  const user = await getCurrentUser();

  const userData = (await getUserData(user.uid)) ?? {};

  const {
    displayName = "",
    email = "",
    countryCode = ipCountryCode,
    diploma,
    gender,
    study,
    //
    birth, //= 2025 - (50 - 14) / 2,
    newsletter,
  } = userData;
  const formData = {
    displayName,
    email,
    countryCode,
    diploma,
    gender,
    study,
    birth,
    newsletter,
  };

  for (let [key, value] of Object.entries(formData)) {
    const input = $formPostQuiz.elements[key];

    if (input.type === "checkbox") {
      input.checked = !!value;
    } else {
      input.value = value ?? "";
    }
  }

  //loaded
  $fieldset.disabled = false;
}

$btnCancelPostQuiz.addEventListener("click", (e) => {
  e.preventDefault();
  $modalOverlayPostQuiz.hidden = true;
  // todo(vmyshko): do stuff, decide wether user should or not see correct+stats

  redirectToResultPage();
});

function redirectToResultPage() {
  const resultEndpoint = location.pathname.replace("quiz.html", "result.html");

  location.href = `${resultEndpoint}#id=${resultId}`;
}

$formPostQuiz.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData($formPostQuiz);
  //disabling fieldset disables formdata fields from reading
  $fieldset.disabled = true;

  const formEntries = [...formData.entries()];

  const ipInfo = await getCached({
    fn: fetchClientIpInfo,
    cacheKey: "client-ip-info",
  });

  const userData = {
    ...Object.fromEntries(formEntries),

    ipInfo,
  };

  const user = await getCurrentUser();
  const result = await updateUserData({
    userId: user.uid,
    userData,
  });

  console.log("result", result);

  $fieldset.disabled = false;

  $modalOverlayPostQuiz.hidden = true;

  redirectToResultPage();
});

{
  Promise.all([
    // todo(vmyshko): re-check preload, seems <use> with hash not work
    // preloadSvgs(),
    prepareQuiz(),

    loadFormSelects(),

    prefillQuizForm(),
  ]).then(() => {
    $quizLoader.hidden = true;
  });
}

$btnFullscreen.addEventListener("click", () => {
  const isFullscreen = !!document.fullscreenElement;

  const fsElem = document.documentElement;

  isFullscreen ? exitTheFullscreen(fsElem) : requestFullScreen(fsElem);

  $btnFullscreen.classList.toggle("fullscreen-on", !isFullscreen);

  $iconFullscreenOn.hidden = !isFullscreen;
  $iconFullscreenOff.hidden = isFullscreen;
});
