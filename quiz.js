import { quizQuestionConfigs } from "./quiz.config.js";

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
      const questionData = config.generator({
        config,
        seed,
        questionIndex,
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
        config.renderer({
          config,
          questionData,
          questionIndex,
          quizAnswers,
          updateProgressQuiz,
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
