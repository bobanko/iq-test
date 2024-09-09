import { getUid } from "./common.js";
import { SeededRandom } from "./helpers.js";
import { defaultColors } from "./rotational.config.js";
import { generateUniqueValues } from "./generate-unique-values.js";

const maxAnswerCount = 8; // todo(vmyshko): make global?
// todo(vmyshko): make it configurable? not sure...
const patternCount = 9; // 9 or 4 or ... patterns count
// todo(vmyshko): maybe customize these as well? to make codebrak-like gameplay,
// ...when you can add more rows for better understanding
const patternsInRow = patternCount ** 0.5;
// const patternsInRow = 4;
const patternsInCol = patternCount ** 0.5;
// const patternsInCol = 4;

const mtxSize = 2; //single pattern matrix size
// todo(vmyshko): make it configurable, 2x2 looks nice

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
    this.col = (this.col + col) % mtxSize; // todo(vmyshko): refac to allow neg rules?
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

  const patterns = []; // matixes

  const basisPointsPerRow = [];

  for (let patternRow = 0; patternRow < patternsInCol; patternRow++) {
    // todo(vmyshko): rotate colors here if needed -- should be configurable
    pointColors.push(pointColors.shift());
    // ---
    const currentRowBasicPoints = [];

    const freeCellsForPoints = getPossibleMatrixCells();
    for (let ptColor of pointColors.slice(0, config.colorCount)) {
      //new point for each row
      const randomPoint = random.popFrom(freeCellsForPoints);

      const currentPoint = new Point({ ...randomPoint, color: ptColor });

      currentRowBasicPoints.push(currentPoint);
    } // ptColor

    // ---

    // todo(vmyshko): check for unique with prevs
    basisPointsPerRow.push(currentRowBasicPoints);

    // applying rules for full row
    for (let patternCol = 0; patternCol < patternsInRow; patternCol++) {
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

  function generateAnswer() {
    const incorrectPoints = [];
    const possibleCells = getPossibleMatrixCells();

    for (let ptColor of pointColors.slice(0, correctAnswer.points.length)) {
      const randomFreeCell = random.popFrom(possibleCells);

      const randomPoint = new Point({ ...randomFreeCell, color: ptColor });

      incorrectPoints.push(randomPoint);
    }

    return {
      points: incorrectPoints,
      isCorrect: false,
      // todo(vmyshko):  this spoils uids by bad gen attempts
      id: getUid(),
    };
  }

  const answers = generateUniqueValues({
    existingValues: [correctAnswer],
    maxValuesCount: maxAnswerCount - 1,
    generateFn: generateAnswer,

    getValueHashFn: ({ points }) => points.toString(),
  });

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
