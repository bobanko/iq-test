// questions

import { fromRange, shuffle } from "./helpers.js";

function getQuestionParts($questionRotational) {
  const [$rpQuarter, $rpQuarter2, $rpSquare, $rpCircle, $rpArrow] = [
    ".rp-quarter",
    ".rp-quarter2",
    ".rp-square",
    ".rp-circle",
    ".rp-arrow",
  ].map((selector) => $questionRotational.querySelector(selector));

  return { $rpQuarter, $rpQuarter2, $rpSquare, $rpCircle, $rpArrow };
}

function rotateTo($elem, deg) {
  $elem.style.transform = `rotate(${deg}deg)`;
}

function getRandomDeg({ stepDeg = 45, skipZero = false } = {}) {
  const randomDeg = fromRange(skipZero ? 1 : 0, 360 / stepDeg - 1) * stepDeg;

  return randomDeg;
}

function sumDeg(deg1, deg2) {
  return (deg1 + deg2) % 360;
}

function generateRotationalQuiz() {
  const colors = ["green", "red", "blue", "yellow"];
  if ($shuffleColors.checked) {
    colors.splice(0, colors.length, ...shuffle(colors));
  }

  const rowsNum = 3;
  const colsNum = 3;

  // todo(vmyshko): those who can't overlap -- rotate as pair

  // gen rules
  // todo(vmyshko): make unique rules, no dupes
  const rules = Array(4)
    .fill(null)
    .map((_) => getRandomDeg({ skipZero: true }));

  console.log("rules", rules);

  // todo(vmyshko): maybe make different question types here:
  // arrow and circle
  // quarters (multiple)
  // quarters + circle + square

  const difficulty = Number.parseInt($difficulty.value);

  rules.splice(difficulty);

  $questionBlock.replaceChildren();
  const deltaDegs = [];
  for (let row = 0; row < rowsNum; row++) {
    // row

    // todo(vmyshko): make this for each fig
    // make unique basic delta deg
    // todo(vmyshko): extract unique gen logic
    const rowDeltaDegs = [];
    for (let _ of rules) {
      do {
        const randomDeg = getRandomDeg();

        //   check deg for unique
        if (rowDeltaDegs.includes(randomDeg)) continue;

        rowDeltaDegs.push(randomDeg);

        break;
      } while (true);
    }
    deltaDegs.push(rowDeltaDegs);

    for (let col = 0; col < colsNum; col++) {
      // col * deg

      const questionTmpl = $tmplQuestionRotational.content.cloneNode(true); //fragment
      const $questionRotational = questionTmpl.firstElementChild;

      // get parts
      const { $rpQuarter, $rpSquare, $rpCircle, $rpArrow, $rpQuarter2 } =
        getQuestionParts($questionRotational);

      const parts = [
        //
        $rpArrow,
        $rpCircle,
        $rpSquare,
        $rpQuarter,
        $rpQuarter2,
      ];

      parts.forEach(($part) => {
        $part.ariaHidden = true;
      });

      parts.slice(0, difficulty).forEach(($part, index) => {
        $part.ariaHidden = false;
        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[index]);

        const currentDeg = sumDeg(deltaDegs[row][index], rules[index] * col);

        rotateTo($part, currentDeg);
      });

      $questionBlock.appendChild($questionRotational);
    }
  }

  console.log("deltaDegs", deltaDegs);

  // replace last question with ? and move it to answers
  const $correctAnswerQuestion = $questionBlock.lastChild;

  const questionMarkTmpl = $tmplQuestionMark.content.cloneNode(true); //fragment
  const $questionMark = questionMarkTmpl.firstElementChild;
  //new,old
  $questionBlock.replaceChild($questionMark, $correctAnswerQuestion);

  // ANSWERS

  // todo(vmyshko): gen answers

  const answers = [$correctAnswerQuestion];
  for (let index = 1; index < 6; index++) {
    // question
    const questionTmpl = $tmplQuestionRotational.content.cloneNode(true); //fragment
    const $questionRotational = questionTmpl.firstElementChild;

    // get parts
    const { $rpQuarter, $rpSquare, $rpCircle, $rpArrow } =
      getQuestionParts($questionRotational);

    $rpQuarter.ariaHidden = true;
    $rpSquare.ariaHidden = true;
    $rpCircle.ariaHidden = true;
    $rpArrow.ariaHidden = true;

    answers.push($questionRotational);
  }

  // wrap answers
  const answerLetters = "abcdef";
  $answerBlock.replaceChildren();
  for (let [index, $question] of shuffle(answers).entries()) {
    // answer
    const fragment = $tmplAnswer.content.cloneNode(true); //fragment
    const $answer = fragment.firstElementChild;

    const $answerLetter = $answer.querySelector(".answer-letter");
    $answerLetter.textContent = answerLetters[index];

    $answer.appendChild($question);
    $answer.addEventListener("click", () => toggleAnswerSelect($answer));

    $answerBlock.appendChild($answer);

    if ($question === $correctAnswerQuestion) {
      console.log({ answerLetter: answerLetters[index] });
    }
  }

  // todo(vmyshko): debug: prevent svg cache
  [...document.querySelectorAll("use")].forEach((use) => {
    const [url, hash] = use.href.baseVal.split("#");
    use.href.baseVal = `${url}?${Date.now()}#${hash}`;
  });
}

$btnGenerate.addEventListener("click", generateRotationalQuiz);

generateRotationalQuiz();

function toggleAnswerSelect($newAnswer) {
  $answerBlock
    .querySelectorAll(".answer")
    .forEach(($answer) => $answer.classList.remove("selected"));

  $newAnswer.classList.add("selected");
}

$difficulty.addEventListener("change", () => {
  $difficultyText.textContent = `[${$difficulty.value}]`;
});

$difficulty.dispatchEvent(new Event("change"));
