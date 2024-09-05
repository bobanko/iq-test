import { toggleAnswerSelect, wrapAnswerPattern } from "./common.js";
import { SeededRandom, preventSvgCache, wait } from "./helpers.js";
import { defaultColors, genConfigs, svgFrames } from "./rotational.config.js";
import {
  generateRotationalQuestion,
  makeUnique,
} from "./rotational.generator.js";

import { Timer } from "./timer.js";

// globals
const timer = new Timer();

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

  $timer.textContent = timeStr;

  $progressTime.max = timeGivenMs;
  $progressTime.value = diff;
});

// ***

function createPatternRotationalBase({ svgFrame = svgFrames.circle }) {
  const patternTmpl = $tmplPatternRotational.content.cloneNode(true); //fragment
  const $pattern = patternTmpl.firstElementChild;

  const $partContainer = $pattern.querySelector(".part-container");

  $partContainer.style.mask = `url(${svgFrame})`;

  // apply bg and border
  $pattern.querySelector(".frame-fill>use").href.baseVal = svgFrame;
  $pattern.querySelector(".frame-stroke>use").href.baseVal = svgFrame;

  return $pattern;
}

// todo(vmyshko): extract to rotational
function createPatternRotational({
  config: {
    figs = [],
    onlyUniqueFigs = false, // [2 and more]
    canOverlap = true, // [2 and more] figs can overlap each other - have same deg
    svgFrame = svgFrames.circle,
  },
  seed,
}) {
  const random = new SeededRandom(seed);
  const $pattern = createPatternRotationalBase({ svgFrame });
  const $partContainer = $pattern.querySelector(".part-container");

  const figsUsed = new Set();
  figs.forEach((fig) => {
    const {
      pickFrom, // pick random from inner array
      startDeg = 0, // initial rotation, before rules: 0, -45
      stepDeg = 90, // min rotation step by rules
      skipZero = true, // no zero rotation by rules
    } = fig;

    const partTmpl = $tmplRotationalPart.content.cloneNode(true); //fragment
    const $svg = partTmpl.firstElementChild;
    const $use = $svg.querySelector("use");

    try {
      const currentFig = onlyUniqueFigs
        ? makeUnique({
            prevValuesSet: figsUsed,
            genFn: () => random.sample(pickFrom),
          })
        : random.sample(pickFrom);

      $use.href.baseVal = currentFig;

      $partContainer.appendChild($svg);
    } catch (error) {
      console.warn(error);
    }
  });

  return $pattern;
}

const quizAnswers = [];

function displayRotationalQuestion({ config, questionData, questionIndex }) {
  async function rotateTo($elem, deg) {
    // to help user to understand rotations
    await wait(0);
    $elem.style.transform = `rotate(${deg}deg)`;
  }

  const {
    //
    rowsNum,
    colsNum,
    //
    mtxDegs,
    answers,
    correctAnswer,
    seed,
  } = questionData;

  // todo(vmyshko): make it better, to randomize colors between questions,
  // mb use question hash/id as seed
  const random = new SeededRandom(seed + questionIndex);
  // todo(vmyshko): those who can't overlap -- rotate as pair

  const patterns = [];

  const $basePattern = createPatternRotational({ config, seed });

  const shuffledDefaultColors = random.shuffle(defaultColors);

  for (let row = 0; row < rowsNum; row++) {
    // row

    if (config.shiftColorsBetweenRows) {
      // todo(vmyshko): do not alter config colors!
      // config.figs.forEach((fig) => {
      //   fig.colorsFrom?.push(fig.colorsFrom.shift());
      // });
    }

    // ***

    for (let col = 0; col < colsNum; col++) {
      const $pattern = $basePattern.cloneNode(true);

      // get parts
      const parts = [...$pattern.querySelectorAll(".rotational-part")];

      parts.forEach(($part, partIndex) => {
        const colors =
          config.figs[partIndex].colorsFrom ?? shuffledDefaultColors;

        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[partIndex]);

        const currentDeg = mtxDegs[row][col][partIndex];
        rotateTo($part, currentDeg);
      });

      patterns.push($pattern);
    } //col
  } //row

  $patternArea.replaceChildren(...patterns);

  // replace last pattern with ? and move it to answers
  const $correctAnswerPattern = patterns.at(-1);

  const $patternQuestionMark = createPatternRotationalBase({
    svgFrame: config.svgFrame,
  });

  $patternQuestionMark.classList.add("pattern-question-mark");

  //new,old
  $patternArea.replaceChild($patternQuestionMark, $correctAnswerPattern);

  // *******
  // ANSWERS
  // *******

  const answerPatterns = [];

  for (let { degs, id } of answers) {
    const $pattern = $basePattern.cloneNode(true);

    // get parts
    const parts = [...$pattern.querySelectorAll(".rotational-part")];

    parts.forEach(($part, partIndex) => {
      const colors = config.figs[partIndex].colorsFrom ?? shuffledDefaultColors;
      // todo(vmyshko): apply rule? color?
      $part.classList.add(colors[partIndex]);

      rotateTo($part, degs[partIndex]);
    });

    answerPatterns.push({ $pattern, id });
  }

  const answerLetters = "abcdef";
  $answerList.replaceChildren();

  random.shuffle(answerPatterns).forEach(({ $pattern, id }, answerIndex) => {
    const $answerButton = wrapAnswerPattern({
      $tmplAnswer,
      $pattern,
      letter: answerLetters[answerIndex],
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
        total: questions.length,
      });

      // todo(vmyshko): bug when user is on last question and no nav happens, answers become disabled
      [...$answerList.children].forEach(($btn) => ($btn.disabled = true));
      // go to next question
      await wait(500);
      $questionList.children[questionIndex].nextSibling?.click();
    });

    $answerList.appendChild($answerButton);
  });

  // select previously selected answer if possible
  $answerList
    .querySelector(`[data-id='${quizAnswers[questionIndex]}']`)
    ?.classList.add("selected");

  preventSvgCache();
}

let _currentQuestion;
function updateCurrentQuestionLabel({ current, total }) {
  _currentQuestion = current;
  $currentQuestionLabel.textContent = `${current + 1}/${total}`;
}

function updateProgressQuiz({ answered, total }) {
  $progressQuiz.max = total;
  $progressQuiz.value = answered;

  $quizProgressAnswered.textContent = `${answered}/${total}`;
}

$btnPrevQuestion.addEventListener("click", () => {
  $questionList.children[_currentQuestion].previousElementSibling?.click();
});
$btnNextQuestion.addEventListener("click", () => {
  $questionList.children[_currentQuestion].nextElementSibling?.click();
});
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
  const questionButtonTmpl = $tmplQuestionButton.content.cloneNode(true); //fragment
  const $questionButton = questionButtonTmpl.firstElementChild;

  $questionButton.textContent = text;
  $questionList.appendChild($questionButton);

  $questionButton.addEventListener("click", () => {
    questionButtonClick($questionButton);
    callbackFn($questionButton);
  });
}

// ***

const questions = [];
function generateQuiz() {
  // basic question list init
  const seed = Math.random();
  // todo(vmyshko): add ability to input custom seed/ via url?
  $seed.value = seed;

  // todo(vmyshko): save answers between buttons
  // Object.entries(genConfigs);

  const questionTypes = [
    "oneQuarter90", //1
    "oneFig90", //1

    "letters45", //1.2
    "oneQuarter45", //1.2
    "oneFig45", //1.2

    "pentagon", //1.25
    "hexagonCircle", //1.25
    "hexagonSector1", //1.25

    "twoQuarters90", //2
    "quarterFig90", //2
    "hexagonSector2", //2.1

    "twoQuarters45", //2.2
    "clock4590", //2.2
    "twoArrowClock", //2.2

    "clock459090", //3
    "hexagonSector3", //3
    "triadSector", //3

    "threeQuarters", //3.2 hard

    "quarterFigs15mensa", //???
  ];

  // debug
  // questionTypes.splice(2);

  // todo(vmyshko):  gen questions

  quizAnswers.splice(0); // clear answers

  $questionList.replaceChildren(); // delete all question buttons

  const generatingQuestionsTimeTestString = `🍀🍀 generating ${questionTypes.length} questions`;
  console.time(generatingQuestionsTimeTestString);
  const _questions = questionTypes.map((configName, questionIndex) => {
    const config = genConfigs[configName];
    const questionData = generateRotationalQuestion({
      config,
      seed,
      questionIndex,
    });

    return { questionData, configName, questionIndex };
  });

  questions.splice(0, questions.length, ..._questions);

  console.timeEnd(generatingQuestionsTimeTestString);

  questions.forEach(({ questionData, configName, questionIndex }) => {
    addQuestionButton({
      text: `${questionIndex + 1}`,
      callbackFn: () => {
        const config = genConfigs[configName];
        console.log("🔮", configName);
        displayRotationalQuestion({
          config,
          questionData,
          questionIndex,
        });

        updateCurrentQuestionLabel({
          current: questionIndex,
          total: questions.length,
        });
      },
    });
  });

  updateProgressQuiz({
    answered: 0,
    total: questions.length,
  });

  $questionList.firstElementChild.click();

  timer.start();
}

function checkAnswers() {
  // todo(vmyshko): grab answers and check them!111

  questions.forEach(({ questionIndex, questionData }) => {
    const isCorrect =
      questionData.correctAnswer.id === quizAnswers[questionIndex];

    const isAnswered = quizAnswers[questionIndex] !== undefined;

    if (!isAnswered) return;

    $questionList.children[questionIndex].classList.toggle(
      "correct",
      isCorrect
    );

    $questionList.children[questionIndex].classList.toggle("wrong", !isCorrect);
  });
}

// apply handlers

$btnGenerate.addEventListener("click", () => generateQuiz());
$btnGenerate.click();

$seed.addEventListener("click", () => {
  $seed.select();
  document.execCommand("copy");
});

$btnFinishQuiz.addEventListener("click", () => {
  checkAnswers();
});
