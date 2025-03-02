import { getLetter, getSafeIndex, preventSvgCache, wait } from "./helpers.js";
import { quizQuestionConfigs } from "./quiz.config.js";
import { SeededRandom } from "./random.helpers.js";

import { Timer } from "./timer.js";
import { updateHashParameter, getHashParameter } from "./hash-param.js";
import {
  preloadImageByImg,
  preloadImageByLink,
} from "./preload-image.helper.js";

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
  const timeGivenMs = questions.length * oneMinMs;

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

  $progressTime.max = timeGivenMs / 1000;
  $progressTime.value = Math.floor(diff / 1000);
});

// ***

const quizAnswers = [];

let _currentQuestion;
function updateCurrentQuestionLabel({ current, total = questions.length }) {
  _currentQuestion = current;
  $currentQuestionLabel.textContent = `${current + 1}/${total}`;
}

function updateProgressQuiz({ answered, total = questions.length }) {
  $progressQuiz.max = total;
  $progressQuiz.value = answered;

  $quizProgressAnswered.textContent = `${answered}/${total}`;
}

// todo(vmyshko): rename
function navigateQuestions(shift = 1) {
  const nextQuestion = getSafeIndex({
    length: questions.length,
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

function generateButtonClick() {
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

function windowOnLoad() {
  const seed = +getHashParameter("seed");

  if (!Number.isFinite(seed) || seed === 0) {
    generateButtonClick();
    return;
  }

  preloadSvgs();
  generateQuiz({ seed });
}

function onHashChanged() {
  const seed = +getHashParameter("seed");

  generateQuiz({ seed });
}

const questions = [];
function generateQuiz({ seed }) {
  // todo(vmyshko): debug
  $quizStats.textContent = "";

  const $prevQuestion = $questionList.querySelector(".selected");

  const questionIndexToSelect = $prevQuestion
    ? [...$questionList.children].indexOf($prevQuestion)
    : 0;
  //---

  // basic question list init
  // todo(vmyshko): add ability to input custom seed/ via url?
  console.log({ seed });

  $seed.value = seed;

  // todo(vmyshko):  gen questions

  quizAnswers.splice(0); // clear answers

  $questionList.replaceChildren(); // delete all question buttons

  const questionConfigEntries = Object.entries(quizQuestionConfigs);

  const generatingQuestionsTimeTestString = `🍀🍀 generating ${questionConfigEntries.length} questions`;
  console.time(generatingQuestionsTimeTestString);

  const _questions = questionConfigEntries.map(
    ([configName, config], questionIndex) => {
      // console.clear();
      console.log(`🍀 generation start: %c${configName}`, "color: gold");

      // "%cI am red %cI am green", "color: red", "color: green")

      const questionData = config.generator({
        config,
        seed,
        questionIndex,
      });

      console.log(`🍀 generation end: %c${configName}`, "color: gold", {
        seed,
        config,
        questionData,
      });

      return { questionData, configName, questionIndex };
    }
  );

  questions.splice(0, questions.length, ..._questions);

  console.timeEnd(generatingQuestionsTimeTestString);

  questions.forEach(({ questionData, configName, questionIndex }) => {
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
          quizAnswers,
        });

        updateCurrentQuestionLabel({
          current: questionIndex,
        });

        // preventSvgCache(seed);
      },
    });
  });

  updateProgressQuiz({
    answered: 0,
    total: questions.length,
  });

  // select question to start from

  $questionList.children[questionIndexToSelect].click();

  timer.start();
}

function checkAnswers() {
  // todo(vmyshko): grab answers and check them!111

  // todo(vmyshko): debug
  const stats = {
    isAnswered: 0,
    isCorrect: 0,
    total: 0,
  };

  questions.forEach(({ questionIndex, questionData }) => {
    const selectedAnswerId = quizAnswers[questionIndex];

    const isCorrect =
      questionData.answers.find((answer) => answer.id === selectedAnswerId)
        ?.isCorrect || false;

    const isAnswered = quizAnswers[questionIndex] !== undefined;

    // todo(vmyshko): debug
    stats.total++;
    if (isAnswered) stats.isAnswered++;
    if (isCorrect) stats.isCorrect++;

    if (!isAnswered) return;

    $questionList.children[questionIndex].classList.toggle(
      "correct",
      isCorrect
    );

    $questionList.children[questionIndex].classList.toggle("wrong", !isCorrect);
  }); //forEach

  // todo(vmyshko): debug
  $quizStats.textContent = `
  🟢${stats.isCorrect} 
  🔴${stats.isAnswered - stats.isCorrect} 
  ⚪️${stats.total - stats.isAnswered}`;
}

// apply handlers

$btnGenerate.addEventListener("click", () => generateButtonClick());

window.addEventListener("hashchange", onHashChanged);
window.addEventListener("load", windowOnLoad);

$seed.addEventListener("click", () => {
  $seed.select();
  document.execCommand("copy");
});

$btnFinishQuiz.addEventListener("click", () => {
  checkAnswers();
});

export function wrapAnswers({
  seed,
  $answerList,
  $tmplAnswer,
  answerPatterns,
  quizAnswers,
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

      quizAnswers[questionIndex] = id;
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
  $answerList
    .querySelector(`[data-id='${quizAnswers[questionIndex]}']`)
    ?.classList.add("selected");
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

function bindingsOnKeypress({ code }) {
  const questionsInRow = 9; // depends on layout
  const keyBindingsMap = new Map([
    ["ArrowRight", () => navigateQuestions(1)],
    ["ArrowLeft", () => navigateQuestions(-1)],
    // for quick navigation
    ["ArrowDown", () => navigateQuestions(questionsInRow)],
    ["ArrowUp", () => navigateQuestions(-questionsInRow)],

    ["KeyG", () => $btnGenerate.click()],
  ]);

  // console.log(code);

  keyBindingsMap.get(code)?.();
}

document.addEventListener("keydown", bindingsOnKeypress);
