import { getUid } from "./common.js";
import { SeededRandom } from "./helpers.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { getPossibleMatrixCells, Point } from "./matrix.helpers.js";

function applyRuleToPoint({ basePoint, rulePoint, steps = 1, mtxSize }) {
  // todo(vmyshko): to make neg, just add max (mtxSize) to new index (row/col)
  return new Point({
    row: (basePoint.row + rulePoint.row * steps) % mtxSize, // only positive rules!
    col: (basePoint.col + rulePoint.col * steps) % mtxSize, // todo(vmyshko): refac to allow neg rules?
  });
}

/**
 * checks wether two points will intersect on grid somewhere
 * @param {*} param0
 * @returns false if no conflicts found, otherwise - true
 */
function checkConflictingPoints({ point1, rule1, point2, rule2, mtxSize }) {
  for (let currentStep = 0; currentStep < mtxSize; currentStep++) {
    // apply rules to points
    const stepPoint1 = new Point({
      col: (point1.col + rule1.col * currentStep) % mtxSize,
      row: (point1.row + rule1.row * currentStep) % mtxSize,
    });

    const stepPoint2 = new Point({
      col: (point2.col + rule2.col * currentStep) % mtxSize,
      row: (point2.row + rule2.row * currentStep) % mtxSize,
    });

    if (stepPoint1.toString(true) === stepPoint2.toString(true)) {
      // intersects!!1
      return true;
    }
  }
}

// todo(vmyshko): make consistent naming: rules vs rulesets
// where one is abstract naming, and other is rule sets with rulePoints in it
export const cellMoveRules = {
  vertical: 0, // left-right
  horizontal: 1, // top-bottom
  orthogonal: 2, // all above
  diagonal: 3, // 4 diag directions
  mixed: 4, // all above
  static: 5, // no shift
  random: 6, // todo(vmyshko): unsure about this rule
};

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

    interPatternRules = [],
    interRowRules = [],
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const hasInterRowRules = interRowRules.length > 0;

  // todo(vmyshko): due to backwardShift all rulesets are inside fn, dependant on mtxSize
  // todo(vmyshko): make it just -1 instead, and support neg rule appliance, then extract

  const backwardShift = mtxSize - 1;

  const verticalRuleSet = [
    { row: backwardShift, col: 0, icon: "↑" }, // up
    { row: 1, col: 0, icon: "↓" }, // down
  ];

  const horizontalRuleSet = [
    { row: 0, col: backwardShift, icon: "←" }, // left
    { row: 0, col: 1, icon: "→" }, // right
  ];

  const orthogonalRuleSet = [...horizontalRuleSet, ...verticalRuleSet];

  const diagonalRuleSet = [
    //diagonals
    { row: 1, col: 1, icon: "↘️" },
    { row: 1, col: backwardShift, icon: "↙️" },
    { row: backwardShift, col: 1, icon: "↗️" },
    { row: backwardShift, col: backwardShift, icon: "↖️" },

    // todo(vmyshko): add rotation rules? knight-horse rule?
  ];

  const staticRuleSet = [{ row: 0, col: 0, icon: "⏹️" }];

  const ruleSets = {
    [cellMoveRules.static]: staticRuleSet,
    [cellMoveRules.vertical]: verticalRuleSet,

    [cellMoveRules.horizontal]: horizontalRuleSet,

    [cellMoveRules.orthogonal]: orthogonalRuleSet,
    [cellMoveRules.diagonal]: diagonalRuleSet,

    [cellMoveRules.mixed]: [...orthogonalRuleSet, ...diagonalRuleSet], //both
    //new to come?

    [cellMoveRules.random]: [
      {
        row: random.fromRange(1, mtxSize - 1),
        col: random.fromRange(1, mtxSize - 1),
        icon: "🎲",
      },
    ],
  };

  const interRowRulesList = interRowRules.map((ruleSetId) =>
    random.sample(ruleSets[ruleSetId])
  );

  const freeColorsList = random.shuffle(config.colors);
  const freeRulesList = interPatternRules.map((ruleSetId) =>
    random.sample(ruleSets[ruleSetId])
  );

  // get basic question cells with (no conflicting) rules
  function getQuestionCells() {
    const freePointsPool = random.shuffle(getPossibleMatrixCells(mtxSize));

    return config.cells.reduce((questionCellsAcc, cell, index) => {
      const possiblePointIndex = freePointsPool.findIndex(
        (potentialPoint) =>
          !questionCellsAcc.some((accCell) =>
            checkConflictingPoints({
              point1: accCell.basePoint,
              rule1: accCell.rulePoint,

              point2: potentialPoint,
              rule2: freeRulesList[cell.ruleIndex],

              mtxSize,
            })
          )
      );

      if (possiblePointIndex < 0) {
        console.log(
          "❌ no possible points found for rule:",
          freeRulesList[cell.ruleIndex]
        );
        return questionCellsAcc;
      }

      const [freePoint] = freePointsPool.splice(possiblePointIndex, 1);

      const resultCell = {
        ...cell,
        rulePoint: freeRulesList[cell.ruleIndex],
        basePoint: freePoint,
        color: freeColorsList[cell.colorIndex],
        // todo(vmyshko): somehow randomize rows/cols but only one of them
      };

      return [...questionCellsAcc, resultCell];
    }, []);
  }

  const patterns = [];
  const questionCells = [];
  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    // todo(vmyshko): reset/randomize next row cells
    if (rowIndex === 0 || !hasInterRowRules) {
      questionCells.splice(0, questionCells.length, ...getQuestionCells());
    }

    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      // do per pattern
      const currentPattern = {
        points: [],
      };

      for (let [index, cell] of questionCells.entries()) {
        const currentRulePoint = cell.rulePoint;
        const currentBasePoint = cell.basePoint;
        const currentColor = cell.color;

        // todo(vmyshko): allow randomize between rows? but how?
        const currentInterRowRule = hasInterRowRules
          ? interRowRulesList[cell.ruleIndex]
          : {
              row: 0,
              col: 0,
            };

        // console.log(vRulesList[cell.ruleIndex].icon);
        // here both col/row rule muls by COL-index to keep H-pattern change,
        // ... to do V-pattern -- mul by rowIndex instead.
        currentPattern.points.push(
          new Point({
            col:
              (currentBasePoint.col +
                currentRulePoint.col * colIndex +
                currentInterRowRule.col * rowIndex) %
              mtxSize,
            row:
              (currentBasePoint.row +
                currentRulePoint.row * colIndex +
                currentInterRowRule.row * rowIndex) %
              mtxSize,
            color: currentColor,

            icon: currentRulePoint.icon,
          })
        );
      }

      patterns.push(currentPattern);
    } // col
  } // row

  //last block
  const [correctAnswer] = patterns.splice(-1, 1, null);
  correctAnswer.isCorrect = true;
  correctAnswer.id = getUid();

  // *******
  // ANSWERS
  // *******

  function generateAnswer() {
    const incorrectPoints = [];

    // todo(vmyshko): if cell overlap is allowed for question patterns,
    // ... it should also be allowed for answers
    const possibleCells = getPossibleMatrixCells(mtxSize);
    for (let { color: ptColor } of correctAnswer.points) {
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
  };
}
