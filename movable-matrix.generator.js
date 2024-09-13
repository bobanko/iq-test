import { getUid } from "./common.js";
import { SeededRandom } from "./helpers.js";
import { defaultColors } from "./rotational.config.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { getPossibleMatrixCells, Point } from "./matrix.helpers.js";

function safeAddCoords({ point1, point2, mtxSize }) {
  return {
    row: (point1.row + point2.row) % mtxSize, // only positive rules!
    col: (point1.col + point2.col) % mtxSize, // todo(vmyshko): refac to allow neg rules?
  };
}

/**
 *
 * @param {object} params
 * @param {number} params.seed - generation seed
 * @param {number} params.questionIndex - for better seeding
 * @param {object} params.config
 * @param {number} params.config.patternsInRow - patterns in single row [2-6]
 * @param {number} params.config.patternsInCol - max row count [2-...]
 * @param {number} params.config.maxAnswerCount - answers to be generated (with correct answer)
 * @param {number} params.config.ruleSet - 0: orthogonal, 1: diagonal, 2: mixed
 * @param {number} params.config.colorCount - number of colored cells to be generated
 * @returns
 */
export function generateMovableQuestion({ config, seed, questionIndex }) {
  const {
    patternsInRow = 3, // 2 is too low to understand pattern in last row
    patternsInCol = 3, // can be reduced by gen-non-unique reason
    maxAnswerCount = 6, //over 8 will not fit
    mtxSize = 3, // single pattern matrix size [2..5]
    ruleSet = 0,
    colorCount = 1,
  } = config;

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

  const rules = ruleSets[ruleSet];

  const patterns = []; // matixes

  // ---

  function generateBasicPoints() {
    const basicPoints = [];
    const freeCellsForPoints = getPossibleMatrixCells(mtxSize);

    // todo(vmyshko): rewrite to func approach? or not?
    for (let pointIndex = 0; pointIndex < colorCount; pointIndex++) {
      //new point for each row
      const randomPoint = random.popFrom(freeCellsForPoints);

      const currentPoint = new Point({ ...randomPoint });

      basicPoints.push(currentPoint);
    } // ptColor

    return basicPoints;
  }

  const basicPointsPerRow = generateUniqueValues({
    existingValues: [],
    maxValuesCount: patternsInCol,
    generateFn: generateBasicPoints,
    getValueHashFn: (points) => points.toString(),
  });

  // ---

  const pointColors = random.shuffle(defaultColors);

  // pick rules

  for (let currentRowBasicPoints of basicPointsPerRow) {
    // todo(vmyshko): rotate colors here if needed -- should be configurable
    pointColors.push(pointColors.shift());
    // rules.push(rules.shift());

    // applying rules for full row
    for (let patternCol = 0; patternCol < patternsInRow; patternCol++) {
      const currentPattern = {
        // apply rules
        points: currentRowBasicPoints.map((point, pointIndex) => {
          // todo(vmyshko): should be random but unique for all points and same for point between rows
          const currentRule = rules.at(pointIndex);

          const movedPoint = safeAddCoords({
            point1: point,
            point2: {
              row: currentRule.row * patternCol,
              col: currentRule.col * patternCol,
            },
            mtxSize,
          });

          const resultPoint = new Point({
            ...movedPoint,
            color: pointColors.at(pointIndex),
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

    // todo(vmyshko): if cell overlap is allowed for question patterns,
    // ... it should also be allowed for answers
    // const possibleCells = getPossibleMatrixCells(mtxSize); // keep no-cell-overlap
    for (let ptColor of pointColors.slice(0, correctAnswer.points.length)) {
      const possibleCells = getPossibleMatrixCells(mtxSize); // allow cell overlap
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
    patternsInRow,

    mtxSize,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}
