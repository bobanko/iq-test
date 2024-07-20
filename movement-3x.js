import { fromRange, pickRandom } from "./helpers.js";

function createPaintedMatrix(points = []) {
  const size = 3;
  const questionTmpl = $tmplQuestionMatrix.content.cloneNode(true); //fragment
  const $questionMatrix = questionTmpl.firstElementChild;

  for (let { row, col, color } of points) {
    $questionMatrix.children[row * size + col].classList.add(color);
  }

  return $questionMatrix;
}

function generateMatrixQuiz() {
  //1

  $questionBlock.replaceChildren(); //clear

  const size = 3;

  // todo(vmyshko): gen rule-1..
  const rule1 = { row: fromRange(1, 2), col: 0 };
  console.log({ rule1 });

  for (let row = 0; row < 3; row++) {
    // todo(vmyshko): gen basic pos

    const basicPos1 = { row: fromRange(0, 2), col: fromRange(0, 2) };

    const point1 = { row: basicPos1.row, col: basicPos1.col, color: "red" };
    for (let col = 0; col < 3; col++) {
      // calc rule
      point1.row = (point1.row + rule1.row) % size; // only positive rules!
      point1.col = (point1.col + rule1.col) % size; // todo(vmyshko): refac to allow neg rules
      // todo(vmyshko): apply rule

      console.log({ point1 });

      const $questionMatrix = createPaintedMatrix([point1]);

      //
      $questionBlock.appendChild($questionMatrix);
    }
  }

  // todo(vmyshko): replace last question with ? and move it to answers

  const $correctAnswerQuestion = $questionBlock.lastChild;

  const questionMarkTmpl = $tmplQuestionMark.content.cloneNode(true); //fragment
  const $questionMark = questionMarkTmpl.firstElementChild;

  //new,old
  $questionBlock.replaceChild($questionMark, $correctAnswerQuestion);

  //2
  //3
  //
  // gen answers

  const answers = [$correctAnswerQuestion];

  for (let answerIndex = 1; answerIndex < 6; answerIndex++) {
    const $mtx = createPaintedMatrix();

    answers.push($mtx);
  }

  $answerBlock.replaceChildren(); //clear

  const answerLetters = "abcdef";
  let letterCount = 0;
  for (let $answerMtx of answers) {
    // answer wrapper
    const fragment = $tmplAnswer.content.cloneNode(true); //fragment
    const $answer = fragment.firstElementChild;

    const $answerLetter = $answer.querySelector(".answer-letter");
    $answerLetter.textContent = answerLetters[letterCount++];

    // question

    $answer.appendChild($answerMtx);

    $answer.addEventListener("click", () => toggleAnswerSelect($answer));

    $answerBlock.appendChild($answer);
  }
}

$btnGenerate.addEventListener("click", generateMatrixQuiz);

generateMatrixQuiz();

function toggleAnswerSelect($newAnswer) {
  $answerBlock
    .querySelectorAll(".answer")
    .forEach(($answer) => $answer.classList.remove("selected"));

  $newAnswer.classList.add("selected");
}
