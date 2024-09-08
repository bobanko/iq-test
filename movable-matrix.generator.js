import { getUid } from "./common.js";
import { SeededRandom } from "./helpers.js";
import { defaultColors } from "./rotational.config.js";

// todo(vmyshko): make it configurable? not sure...
const patternCount = 9; // 9 or 4 or ... patterns count
const patternsInRow = patternCount ** 0.5;
const patternsInCol = patternCount ** 0.5;
const mtxSize = 3; //single pattern matrix size

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

export function generateMovableQuestion({ config, seed, questionIndex }) {
  const random = new SeededRandom(seed + questionIndex);

  const backwardShift = mtxSize - 1;

  const orthogonalRules = [
    { row: 0, col: 1 }, // right
    { row: 1, col: 0 }, // down
    { row: backwardShift, col: 0 }, // up
    { row: 0, col: backwardShift }, // left
  ];

  const diagonalRules = [
    //diagonals
    { row: 1, col: 1 },
    { row: 1, col: backwardShift },
    { row: backwardShift, col: 1 },
    { row: backwardShift, col: backwardShift },

    // todo(vmyshko): add rotation rules? knight-horse rule?
  ];

  const ruleSets = [
    [...random.shuffle([...orthogonalRules])],
    [...random.shuffle([...diagonalRules])],
    [...random.shuffle([...orthogonalRules, ...diagonalRules])], //both
    //new to come
  ];

  const rules = ruleSets[config.ruleSet];

  const pointColors = random.shuffle(defaultColors);

  console.log({ rules });

  const patterns = []; // matixes

  const basisPointsPerRow = [];
  for (let row = 0; row < patternsInRow; row++) {
    const freeCellsForPoints = getPossibleMatrixCells();

    const currentRowBasicPoints = [];

    for (let ptColor of pointColors.slice(0, config.colorCount)) {
      //new point for each row
      const randomPoint = random.popFrom(freeCellsForPoints);

      const currentPoint = new Point({ ...randomPoint, color: ptColor });

      currentRowBasicPoints.push(currentPoint);
    } // ptColor

    // todo(vmyshko): check for unique with prevs
    basisPointsPerRow.push(currentRowBasicPoints);
    //

    for (let patternCol = 0; patternCol < patternsInCol; patternCol++) {
      const currentPattern = {
        // apply rules
        points: currentRowBasicPoints.map((point, pointIndex) => {
          const resultPoint = new Point({
            ...point,
          });

          resultPoint.shift({
            row: rules[pointIndex].row * patternCol,
            col: rules[pointIndex].col * patternCol,
          });

          return resultPoint;
        }),

        id: getUid(),
      };

      patterns.push(currentPattern);
    } // col
  } // row

  //last block
  const correctAnswer = patterns.at(-1);
  correctAnswer.isCorrect = true;
  // *******
  // ANSWERS
  // *******

  // todo(vmyshko):
  // move 1 *2
  // move 2 *2
  // move 1&2 *2 -- hard, can replace each other

  // ???

  const answers = [correctAnswer];

  function serializePoints(points) {
    return points.reduce(
      (acc, currentPoint) => acc + currentPoint.toString(),
      ""
    );
  }

  const uniqueGroups = new Set([serializePoints(correctAnswer.points)]);
  while (answers.length < 6) {
    // todo(vmyshko): create unique wrong answers
    const incorrectPoints = [];

    // todo(vmyshko): gen random

    const possibleCells = getPossibleMatrixCells();

    for (let ptColor of pointColors.slice(0, correctAnswer.points.length)) {
      const randomFreeCell = random.popFrom(possibleCells);

      const randomPoint = new Point({ ...randomFreeCell, color: ptColor });

      incorrectPoints.push(randomPoint);
    }

    //check existance
    if (uniqueGroups.has(serializePoints(incorrectPoints))) {
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
    patterns,
    answers,
    correctAnswer,
    //
  };
}
