import { wrapAnswers } from "./common.js";
import { shuffle, spliceRandom } from "./helpers.js";

const mtxSize = 3;
const cellCount = mtxSize ** 2;

const difficultyLevel = 3;

// todo(vmyshko): extract?
export class Point {
  get index() {
    return this.row * mtxSize + this.col;
  }

  constructor({ row, col, color = null }) {
    this.row = row;
    this.col = col;

    this.color = color;
  }

  shift({ row, col }) {
    this.row = (this.row + row) % mtxSize; // only positive rules!
    this.col = (this.col + col) % mtxSize; // todo(vmyshko): refac to allow neg rules
  }

  toString() {
    const { col, row, color } = this;

    return `'${color}':[${row},${col}];`;
  }
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
        .map((_, col) => new Point({ row, col }))
    )
    .flat();
}

function applyRule(prevPoint, rule) {
  const nextPoint = new Point({ ...prevPoint });
  //apply rule
  nextPoint.shift({ ...rule });

  return nextPoint;
}

function generateMatrixQuiz() {
  $questionBlock.replaceChildren(); //clear

  // todo(vmyshko): gen rules..
  // todo(vmyshko): ..based on difficulty level (top/left/diagonals/..)

  const simpleRules = [
    { row: 0, col: 1 }, // right
    { row: 1, col: 0 }, // down
    { row: 2, col: 0 }, // up
    { row: 0, col: 2 }, // left
  ];

  const advancedRules = [
    //diagonals
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },

    // todo(vmyshko): add rotation rules? knight-horse rule?
  ];

  const rules = [
    //simple
    ...shuffle(simpleRules),
    ...shuffle(advancedRules),
  ];

  const correctAnswerPoints = [];

  // todo(vmyshko): pt count depends on difficulty level
  const pointColors = shuffle([
    "green",
    "red",
    "blue",
    "yellow",
    //
  ]); // todo(vmyshko): shuffle
  // remove extra colors based on difficulty
  pointColors.splice(difficultyLevel);
  rules.splice(difficultyLevel);

  console.log({ rules });

  const freeCellsForPoints = getPossibleMatrixCells();
  for (let row = 0; row < mtxSize; row++) {
    const prevPoints = [];
    for (let ptColor of pointColors) {
      //new point for each row
      const randomPoint = spliceRandom(freeCellsForPoints);

      const currentPoint = new Point({ ...randomPoint, color: ptColor });

      prevPoints.push(currentPoint);
    } // ptColor

    //first mtx in row
    const $questionMatrix = createPaintedMatrix(prevPoints);
    $questionBlock.appendChild($questionMatrix);

    // skip 1st
    for (let col = 1; col < mtxSize; col++) {
      const nextPoints = [];

      for (let [index, prevPoint] of prevPoints.entries()) {
        // todo(vmyshko): apply rule
        const nextPoint = applyRule(prevPoint, rules[index]);

        nextPoints.push(nextPoint);
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

  // ANSWERS

  // todo(vmyshko):
  // move 1 *2
  // move 2 *2
  // move 1&2 *2 -- hard, can replace each other

  // ???

  const answerPointGroups = [correctAnswerPoints];

  function serializePointGroup(pointGroup) {
    return pointGroup.reduce(
      (acc, currentPoint) => acc + currentPoint.toString(),
      ""
    );
  }

  const uniqueGroups = new Set([serializePointGroup(correctAnswerPoints)]);
  while (answerPointGroups.length < 6) {
    // todo(vmyshko): create unique wrong answers
    const incorrectPoints = [];

    // todo(vmyshko): gen random

    const possibleCells = getPossibleMatrixCells();

    for (let ptColor of pointColors) {
      const randomFreeCell = spliceRandom(possibleCells);

      const randomPoint = new Point({ ...randomFreeCell, color: ptColor });

      incorrectPoints.push(randomPoint);
    }

    //check existance
    if (uniqueGroups.has(serializePointGroup(incorrectPoints))) {
      // points already exist
      // skip
      continue;
    }

    //add
    answerPointGroups.push(incorrectPoints);

    //push if unique
  }

  const answerQuestions = answerPointGroups.map((apg) =>
    createPaintedMatrix(apg)
  );

  wrapAnswers({
    $answerBlock,
    answerQuestions,
    $tmplAnswer,
    $correctAnswerQuestion: answerQuestions[0],
  });
}

$btnGenerate.addEventListener("click", generateMatrixQuiz);

generateMatrixQuiz();
