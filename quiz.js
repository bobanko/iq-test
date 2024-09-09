import { wait } from "./helpers.js";
import { quizQuestionConfigs } from "./quiz.config.js";
import { SeededRandom } from "./random.helpers.js";

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
  // todo(vmyshko): debug

  const $prevQuestion = $questionList.querySelector(".selected");

  const questionIdexToSelect = $prevQuestion
    ? [...$questionList.children].indexOf($prevQuestion)
    : 0;
  //---

  // basic question list init
  const seed = Math.random();
  // todo(vmyshko): add ability to input custom seed/ via url?
  $seed.value = seed;

  // todo(vmyshko):  gen questions

  quizAnswers.splice(0); // clear answers

  $questionList.replaceChildren(); // delete all question buttons

  const questionConfigEntries = Object.entries(quizQuestionConfigs);

  const generatingQuestionsTimeTestString = `🍀🍀 generating ${questionConfigEntries.length} questions`;
  console.time(generatingQuestionsTimeTestString);

  const _questions = questionConfigEntries.map(
    ([configName, config], questionIndex) => {
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
      callbackFn: () => {
        const config = quizQuestionConfigs[configName];
        console.log("🔮", configName);

        // todo(vmyshko): based on current/config
        const answerPatterns = config.renderer({
          config,
          questionData,
          questionIndex,
        });

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
      },
    });
  });

  updateProgressQuiz({
    answered: 0,
    total: questions.length,
  });

  // select question to start from

  $questionList.children[questionIdexToSelect].click();

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

export function wrapAnswers({
  seed,
  $answerList,
  $tmplAnswer,
  answerPatterns,
  quizAnswers,
  questionIndex,
}) {
  const random = new SeededRandom(seed);

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
  const fragment = $tmplAnswer.content.cloneNode(true); //fragment
  const $answer = fragment.firstElementChild;

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
