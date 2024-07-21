import { fromRange, pickRandom, spliceRandom } from "./helpers.js";

const mtxSize = 3;
const cellCount = mtxSize ** 2;

function getIndexByRowCol({ row, col }) {
  return row * mtxSize + col;
}

function createPaintedMatrix(points = []) {
  const questionTmpl = $tmplQuestionMatrix.content.cloneNode(true); //fragment
  const $questionMatrix = questionTmpl.firstElementChild;

  for (let { index, color } of points) {
    $questionMatrix.children[index].classList.add(color);
  }

  return $questionMatrix;
}

function getPossibleMatrixCells() {
  return Array(mtxSize)
    .fill(null)
    .map((_, row) =>
      Array(mtxSize)
        .fill(null)
        .map((_, col) => ({
          row,
          col,
          index: getIndexByRowCol({ row, col }),
        }))
    )
    .flat();
}

function applyRule(prevPoint, rule) {
  const row = (prevPoint.row + rule.row) % mtxSize; // only positive rules!
  const col = (prevPoint.col + rule.col) % mtxSize; // todo(vmyshko): refac to allow neg rules

  const nextPoint = {
    row,
    col,
    index: getIndexByRowCol({ row, col }),
    color: prevPoint.color,
  };

  return nextPoint;
}

function generateMatrixQuiz() {
  $questionBlock.replaceChildren(); //clear

  // todo(vmyshko): gen rules..
  // todo(vmyshko): ..based on difficulty level (top/left/diagonals/..)
  const rule1 = { row: fromRange(1, 2), col: 0 };
  console.log({ rule1 });

  const correctAnswerPoints = [];

  // todo(vmyshko): pt count depends on difficulty level
  const pointColors = [
    "green",
    // "red",
    // "blue",
    // "yellow",
    //
  ];

  const freeCellsForPoints = getPossibleMatrixCells();
  for (let row = 0; row < mtxSize; row++) {
    const prevPoints = [];
    for (let ptColor of pointColors) {
      //new point for each row
      const randomPoint = spliceRandom(freeCellsForPoints);

      const currentPoint = {
        row: randomPoint.row,
        col: randomPoint.col,
        index: randomPoint.index,
        color: ptColor,
      };

      prevPoints.push(currentPoint);
    } // ptColor

    //first mtx in row
    const $questionMatrix = createPaintedMatrix(prevPoints);
    $questionBlock.appendChild($questionMatrix);

    // skip 1st
    for (let col = 1; col < mtxSize; col++) {
      const nextPoints = [];

      for (let prevPoint of prevPoints) {
        // todo(vmyshko): apply rule
        const nextPoint = applyRule(prevPoint, rule1);

        nextPoints.push(nextPoint);
        console.log({ nextPoint });
      }

      const $questionMatrix = createPaintedMatrix(nextPoints);
      $questionBlock.appendChild($questionMatrix);

      //last block
      if (row === 2 && col === 2) {
        correctAnswerPoints.push(...nextPoints);
      }

      prevPoints.splice(0);
      prevPoints.push(...nextPoints);
    } // col
  } // row

  // replace last question with ? and move it to answers
  const $correctAnswerQuestion = $questionBlock.lastChild;

  const questionMarkTmpl = $tmplQuestionMark.content.cloneNode(true); //fragment
  const $questionMark = questionMarkTmpl.firstElementChild;
  //new,old
  $questionBlock.replaceChild($questionMark, $correctAnswerQuestion);

  //2
  //3
  //...
  // gen answers

  const answers = [$correctAnswerQuestion];

  // remove cell from correct answer
  const firstIndex = getIndexByRowCol(correctAnswerPoints[0]);

  const freeCellsForPt1 = getPossibleMatrixCells();

  for (let answerIndex = 1; answerIndex < 6; answerIndex++) {
    // todo(vmyshko): create unique wrong answers

    const { color } = correctAnswerPoints[0];
    const { index: rndCellIndex } = spliceRandom(freeCellsForPt1);

    const $mtx = createPaintedMatrix([{ index: rndCellIndex, color }]);

    answers.push($mtx);
  }

  $answerBlock.replaceChildren(); //clear

  const answerLetters = "abcdef";
  let letterCount = 0;

  pickRandom(answers);
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

    if ($answerMtx === $correctAnswerQuestion) {
      $answer.classList.add("green");
    }
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
