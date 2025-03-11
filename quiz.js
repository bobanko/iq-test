import {
  getLetter,
  getSafeIndex,
  preventSvgCache,
  wait,
} from "./helpers/helpers.js";
import { quizQuestionConfigs } from "./configs/quiz/quiz.config.js";
import { SeededRandom } from "./helpers/random.helpers.js";

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
import { calcStaticIqByStats } from "./calc-iq.js";

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

function formatTimeSpan(timeMs) {
  const totalSeconds = Math.floor(timeMs / 1000); // Convert ms to seconds
  const minutes = Math.floor(totalSeconds / 60); // Get minutes
  const seconds = totalSeconds % 60; // Get remaining seconds
  return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Format as "MM:SS"
}

timer.onUpdate((diff) => {
  const oneMinMs = 60 * 1000;
  const timeGivenMs = currentQuiz.questions.length * oneMinMs;

  if (timeGivenMs <= diff) {
    console.log("stopping timer", timer.getDiff());

    if (timer.isRunning) timer.stop();

    // todo(vmyshko): stop quiz
    return;
  }

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
  const nextQuestion = getSafeIndex({
    length: currentQuiz.questions.length,
    index: _currentQuestionIndex + shift,
  });

  $questionList.children[nextQuestion].click();
}

$btnPrevQuestion.addEventListener("click", () => navigateQuestions(-1));
$btnNextQuestion.addEventListener("click", () => navigateQuestions(1));

// question buttons

function questionButtonClick($currentButton) {
  const questionButtons = [
    ...$questionList.querySelectorAll(".question-button"),
  ];
  questionButtons.forEach(($button) => {
    $button.classList.remove("selected");
  });

  $currentButton.classList.add("selected");

  // todo(vmyshko): load question
}

function addQuestionButton({ text = "x", callbackFn = () => void 0 }) {
  const $questionButton =
    $tmplQuestionButton.content.firstElementChild.cloneNode(true);

  $questionButton.textContent = text;
  $questionList.appendChild($questionButton);

  $questionButton.addEventListener("click", async () => {
    questionButtonClick($questionButton);

    // console.log("start");
    // $patternArea.style.opacity = 0;
    // $answerList.style.opacity = 0;
    // await wait(100);
    callbackFn($questionButton);
    // await wait(100);
    // $patternArea.style.opacity = 1;
    // $answerList.style.opacity = 1;

    // console.log("end");
  });
}

function generateSeed() {
  const seed = Math.random();

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

  svgLinks.forEach((link) => preloadImageByLink(link));
  // svgLinks.forEach((link) => preloadImageByImg(link));
}

function onHashChanged() {
  const seedRaw = getHashParameter("seed");

  const seed = +seedRaw;

  generateQuiz({ seed });
}

const currentQuiz = {
  questions: [],
  answers: new Map(),
  seed: null,
};

function toggleControls(isEnabled = true) {
  $answerList.toggleAttribute("disabled", !isEnabled);
  $btnFinishQuiz.disabled = !isEnabled;
  $questionInfo.hidden = isEnabled;
}

function generateQuiz({ seed }) {
  const $prevQuestion = $questionList.querySelector(".selected");
  toggleControls(true);

  const questionIndexToSelect = $prevQuestion
    ? [...$questionList.children].indexOf($prevQuestion)
    : 0;

  $seed.value = seed;

  currentQuiz.seed = seed;

  currentQuiz.answers.clear();

  $questionList.replaceChildren(); // delete all question buttons

  const questionConfigEntries = Object.entries(quizQuestionConfigs);

  const generatingQuestionsTimeTestString = `⏱️🍀 generating ${questionConfigEntries.length} questions`;
  console.time(generatingQuestionsTimeTestString);

  const _questions = questionConfigEntries.map(
    ([configName, config], questionIndex) => {
      console.group(`🍀 generation: %c${configName}`, "color: gold");

      const questionData = config.generator({
        config,
        seed,
        questionIndex,
      });

      console.log({
        seed,
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
        callbackFn: function _selectQuestion() {
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

          //--- end -----------

          wrapAnswers({
            seed: seed + questionIndex,
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

function markAnsweredQuestions(quizResults) {
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
        // todo(vmyshko): add seed?
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

$seed.addEventListener("click", () => {
  $seed.select();
  document.execCommand("copy");
});

$btnFinishQuiz.addEventListener("click", () => {
  $modalOverlayFinishConfirm.hidden = false;
});

$btnFinishConfirm.addEventListener("click", () => {
  $modalOverlayFinishConfirm.hidden = true;
  $modalOverlayPostQuiz.hidden = false;
  timer.stop();

  toggleControls(false);

  const quizResults = getQuizResults();

  const resultsStats = getResultsStats(quizResults);

  const currentIq = calcStaticIqByStats(resultsStats);

  $msgTestResults.innerHTML = `
  ⚪️ total questions answered: ${resultsStats.isAnswered} of ${
    resultsStats.total
  } </br>
  🟢 correct answers: ${resultsStats.isCorrect}  </br>
  🔴 wrong answers: ${resultsStats.isAnswered - resultsStats.isCorrect}  </br>
  ⏱️ time spent: ${formatTimeSpan(resultsStats.timeSpent)} </br>
  🧠 your static iq: ${currentIq}
  `;

  markAnsweredQuestions(quizResults);

  saveQuizResults({
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
  const random = new SeededRandom(seed + questionIndex);

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
        //first not-answered in question list
        $questionList.querySelector(":not(.answered)");
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
    });

    $answerList.appendChild($answerButton);
  });

  // select previously selected answer if possible
  if (currentQuiz.answers.has(questionIndex)) {
    $answerList
      .querySelector(`[data-id='${currentQuiz.answers.get(questionIndex)}']`)
      ?.classList.add("selected");
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

$debugCheckbox.click();

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

  // todo(vmyshko): save quiz results
});

{
  preloadSvgs();
  prepareQuiz();

  loadFormSelects();

  prefillQuizForm();
}
