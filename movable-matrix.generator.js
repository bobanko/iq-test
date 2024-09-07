import { getUid } from "./common.js";
import { SeededRandom } from "./helpers.js";

// todo(vmyshko): make it configurable? not sure...
const patternCount = 9; // 9 or 4 or ... pattern matix count
const patternsInRow = patternCount ** 0.5;
const patternsInCol = patternCount ** 0.5;
const mtxSize = 3; //question matrix size

const difficultyLevel = 2; //3 is max, but why?

// todo(vmyshko): extract?
class Point {
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

export function generateMovableQuestion({ config, seed, questionIndex }) {
  const random = new SeededRandom(seed + questionIndex);

  // todo(vmyshko): gen rules..
  // todo(vmyshko): ..based on difficulty level (top/left/diagonals/..)

  const backwardShift = mtxSize - 1;
  const simpleRules = [
    { row: 0, col: 1 }, // right
    { row: 1, col: 0 }, // down
    { row: backwardShift, col: 0 }, // up
    { row: 0, col: backwardShift }, // left
  ];

  const advancedRules = [
    //diagonals
    { row: 1, col: 1 },
    { row: 1, col: backwardShift },
    { row: backwardShift, col: 1 },
    { row: backwardShift, col: backwardShift },

    // todo(vmyshko): add rotation rules? knight-horse rule?
  ];

  const rules = [
    //simple
    ...random.shuffle(simpleRules),
    ...random.shuffle(advancedRules),
  ];

  const correctAnswerPoints = [];

  // todo(vmyshko): pt count depends on difficulty level
  const pointColors = random.shuffle([
    "green",
    "red",
    "blue",
    "yellow",
    //
  ]);
  // remove extra colors based on difficulty
  pointColors.splice(difficultyLevel);
  rules.splice(difficultyLevel);

  console.log({ rules });

  const questions = [];

  const freeCellsForPoints = getPossibleMatrixCells();
  for (let row = 0; row < patternsInRow; row++) {
    const prevPoints = [];
    for (let ptColor of pointColors) {
      //new point for each row
      const randomPoint = random.popFrom(freeCellsForPoints);

      const currentPoint = new Point({ ...randomPoint, color: ptColor });

      prevPoints.push(currentPoint);
    } // ptColor

    questions.push({ points: prevPoints, id: getUid() });

    // skip 1st
    for (let col = 1; col < patternsInCol; col++) {
      const nextPoints = [];

      for (let [index, prevPoint] of prevPoints.entries()) {
        // todo(vmyshko): apply rule
        const nextPoint = applyRule(prevPoint, rules[index]);

        nextPoints.push(nextPoint);
      }

      //last block
      if (row === 2 && col === 2) {
        correctAnswerPoints.push(...nextPoints);
      }

      prevPoints.splice(0);
      prevPoints.push(...nextPoints);
      questions.push({ points: nextPoints, id: getUid() });
    } // col
  } // row

  // ANSWERS

  // todo(vmyshko):
  // move 1 *2
  // move 2 *2
  // move 1&2 *2 -- hard, can replace each other

  // ???

  const correctAnswer = {
    points: correctAnswerPoints,
    id: getUid(),
    isCorrect: true,
  };

  const answers = [correctAnswer];

  function serializePointGroup(pointGroup) {
    return pointGroup.reduce(
      (acc, currentPoint) => acc + currentPoint.toString(),
      ""
    );
  }

  const uniqueGroups = new Set([serializePointGroup(correctAnswerPoints)]);
  while (answers.length < 6) {
    // todo(vmyshko): create unique wrong answers
    const incorrectPoints = [];

    // todo(vmyshko): gen random

    const possibleCells = getPossibleMatrixCells();

    for (let ptColor of pointColors) {
      const randomFreeCell = random.popFrom(possibleCells);

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
    answers.push({
      points: incorrectPoints,
      id: getUid(),
      isCorrect: false,
    });

    //push if unique
  }

  //questionData
  return {
    seed,
    patternsInRow,
    patternsInCol,
    mtxSize,
    //
    questions,
    answers,
    correctAnswer,
    //
  };
}
