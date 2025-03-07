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

import { signAnonUser } from "./endpoints/firebase.init.js";
import { saveQuizResults } from "./endpoints/save-quiz-results.endpoint.js";

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

  if (timeGivenMs <= diff) {
    console.log("stopping timer", timer.getDiff());

    if (timer.isRunning) timer.stop();

    // todo(vmyshko): stop quiz
    return;
  }

  const timeStr = new Date(timeGivenMs - diff).toLocaleTimeString("en-US", {
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  $timerIcon.textContent =
    clockEmojis[Math.floor(diff / 1000) % clockEmojis.length];

  $timer.textContent = timeStr;
});

// ***

let _currentQuestion;
function updateCurrentQuestionLabel({
  current,
  total = currentQuiz.questions.length,
}) {
  _currentQuestion = current;
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
    index: _currentQuestion + shift,
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
  const seed = +getHashParameter("seed");

  generateQuiz({ seed });
}

const currentQuiz = {
  questions: [],
  answers: new Map(),
  seed: null,
};

function generateQuiz({ seed }) {
  const $prevQuestion = $questionList.querySelector(".selected");

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

      return { questionData, configName, questionIndex };
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
    ({ questionIndex, configName, questionData }) => {
      const selectedAnswerId = currentQuiz.answers.get(questionIndex) ?? null;
      const isAnswered = selectedAnswerId !== null;

      const correctAnswer = questionData.answers.find(
        (answer) => answer.isCorrect
      );

      const isCorrect = isAnswered
        ? correctAnswer.id === selectedAnswerId
        : null;
      return {
        // todo(vmyshko): add seed and type
        configName,
        questionIndex,
        isAnswered,
        selectedAnswerId,
        correctAnswerId: correctAnswer.id,
        isCorrect,
      };
    }
  );
}

function getResultsStats(quizResults) {
  const stats = {
    isAnswered: 0,
    isCorrect: 0,
    total: quizResults.length,
  };

  quizResults.forEach((answerData) => {
    const { isAnswered, isCorrect } = answerData;

    if (isAnswered) stats.isAnswered++;
    if (isCorrect) stats.isCorrect++;
  });

  return stats;
}

function checkAnswers() {
  const quizResults = getQuizResults();

  const resultsStats = getResultsStats(quizResults);

  $msgTestResults.innerHTML = `
  🟢 correct answers: ${resultsStats.isCorrect}  </br>
  🔴 wrong answers: ${resultsStats.isAnswered - resultsStats.isCorrect}  </br>
  ⚪️ total questions answered: ${resultsStats.isAnswered} of ${
    resultsStats.total
  }`;
  //

  $btnFinishConfirm.addEventListener(
    "click",
    () => {
      $modalOverlay.hidden = true;

      markAnsweredQuestions(quizResults);

      saveQuizResults({
        quizResults,
        seed: currentQuiz.seed,
        stats: resultsStats,
      });
    },
    { once: true }
  );
}

// apply handlers

$btnGenerate.addEventListener("click", () => generateSeed());

window.addEventListener("hashchange", onHashChanged);

$seed.addEventListener("click", () => {
  $seed.select();
  document.execCommand("copy");
});

$btnFinishQuiz.addEventListener("click", () => {
  checkAnswers();

  $modalOverlay.hidden = false;
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

      const $nextQuestion = $questionList.children[questionIndex].nextSibling;

      if ($nextQuestion) {
        // todo(vmyshko): bug when user is on last question and no nav happens, answers become disabled
        [...$answerList.children].forEach(($btn) => ($btn.disabled = true));

        await wait(500);
        // go to next question
        $questionList.children[questionIndex].nextSibling?.click();
      }
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
  document.body.classList.toggle("debug", $debugCheckbox.checked);
});

$debugCheckbox.click();

// hotkeys
function bindingsOnKeypress({ code }) {
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

  // console.log(code);

  keyBindingsMap.get(code)?.();
}

document.addEventListener("keydown", bindingsOnKeypress);

$btnDebug.addEventListener("click", () => {
  $debugControlPanel.hidden = !$debugControlPanel.hidden;
});

$btnFinishCancel.addEventListener("click", () => {
  $modalOverlay.hidden = true;
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

{
  preloadSvgs();
  prepareQuiz();
  await signAnonUser();
}
