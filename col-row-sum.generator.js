import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

const possiblePositions = [
  [0, 0],
  [50, 0],
  [100, 0],

  [0, 50],
  [50, 50],
  [100, 50],

  [0, 100],
  [50, 100],
  [100, 100],
];

const maxFigsPerCell = possiblePositions.length;

function makeFigureParts({ figures, random, config }) {
  const { shufflePositions = true } = config;
  const colRowFigScale = 0.35;

  if (figures.length > maxFigsPerCell) {
    throw new Error(
      `Too many figures to fit in cell: ${figures.length}, max ${maxFigsPerCell}`
    );
  }

  const figPositions = shufflePositions
    ? random.popRangeFrom([...possiblePositions], figures.length)
    : [...possiblePositions];

  // todo(vmyshko): for debug
  // const figPositions = [...possiblePositions];

  return figures.map((fig, i) => ({
    figures: [fig],
    scale: colRowFigScale,
    transformX: figPositions[i][0],
    transformY: figPositions[i][1],
  }));
}

// first cell range
// not less than, if too many figs
// Math.max(1, figsAvailable.length - maxFigsPerCell * 2),
// minus 2 - to keep at least 1&1 for rest 2 columns
// Math.min(figsAvailable.length - 2, maxFigsPerCell);

// second cell range
// not less than ???, last column can handle
// Math.max(1, figsAvailable.length - maxFigsPerCell),
// minus 1 to keep at least 1 for 3rd column
// Math.min(figsAvailable.length - 1, maxFigsPerCell);

function generateNumberMatrix({ random, config }) {
  const { colRowSum } = config;

  // first row
  const cell_00 = random.fromRange(1, colRowSum - 2);

  // first row rest
  const cell_01 = random.fromRange(1, colRowSum - cell_00 - 1);
  const cell_02 = colRowSum - cell_00 - cell_01;

  //first col rest
  const cell_10 = random.fromRange(1, colRowSum - cell_00 - 1);
  const cell_20 = colRowSum - cell_00 - cell_10;

  // center cell
  const cell_11 = random.fromRange(
    // todo(vmyshko): min range is unknown for now, i set safe min for now (less combinations)
    Math.min(cell_02, cell_20),
    colRowSum - Math.max(cell_01, cell_10) - 1
  );

  // last middle cells
  const cell_12 = colRowSum - cell_11 - cell_10;
  const cell_21 = colRowSum - cell_11 - cell_01;

  // last cell
  const cell_22 = colRowSum - cell_02 - cell_12;

  return [
    [cell_00, cell_01, cell_02],
    [cell_10, cell_11, cell_12],
    [cell_20, cell_21, cell_22],
  ];
}

function* colRowSumGenerator({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;
  const { figures, figureTypesCountToUse, colRowSum } = config;

  const figNamesToUse = random.popRangeFrom(
    [...figures],
    figureTypesCountToUse
  );

  const figGroupsCells = figNamesToUse.map((figName) => {
    const mtxNumbers = generateNumberMatrix({ random, config });

    const figCells = mtxNumbers
      .map((row) => row.map((cellNumber) => Array(cellNumber).fill(figName)))
      .flat();

    return figCells;
  });

  const result = Array.from({ length: 9 }, (_, i) =>
    figGroupsCells
      .map((arr) => arr[i] || null)
      .flat()
      .sort()
  );

  for (let cellFigs of result) {
    yield {
      figureParts: makeFigureParts({ figures: cellFigs, random, config }),
    };
  }
}

function generateAnswer_colRowSum({ random, config, correctAnswer }) {
  const { figureParts, colorGroups, rotationGroups } = config;

  const { patternsInCol = 3, patternsInRow = 3, colRowSum } = config;

  const { figures, figureTypesCountToUse } = config;

  // todo(vmyshko): get rid of this copy-pasta

  const figsToUse = random.popRangeFrom([...figures], figureTypesCountToUse);

  const randomAnswerFigs = figsToUse
    .map((fig) => {
      const figCount = random.fromRange(
        // todo(vmyshko): fit answers to be  similar to correct
        Math.max(1, colRowSum - maxFigsPerCell * 2),
        Math.min(colRowSum / 3, maxFigsPerCell)
      );

      return Array(figCount).fill(fig);
    })
    .flat()
    .sort();

  return {
    isCorrect: false,
    id: getUid(),
    figureParts: makeFigureParts({ figures: randomAnswerFigs, random, config }),
  };
}

export function generatePatternsQuestion_colRowSum({
  config,
  seed,
  questionIndex,
}) {
  //
  const {
    patternsInRow = 3,
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const patterns = [
    ...colRowSumGenerator({
      random,
      config,
    }),
  ];

  //last block
  const [correctAnswer] = patterns.splice(-1, 1, null);
  correctAnswer.isCorrect = true;
  correctAnswer.id = getUid();

  // *******
  // ANSWERS
  // *******

  const answers = generateUniqueValues({
    existingValues: [correctAnswer],
    maxValuesCount: maxAnswerCount - 1,
    generateFn: () => {
      return generateAnswer_colRowSum({
        correctAnswer,
        random,
        config,
      });
    },
    getValueHashFn: ({ figureParts = [] }) => {
      const hash = figureParts
        .map(
          // todo(vmyshko): why defaults are not set yet? re-check!
          ({ figures, rotation = 0, color = "", strokeWidth = 0 }) =>
            `${figures.toString()};${color};${rotation};${strokeWidth}`
        )
        .toString();

      return hash;
    },
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    //
    patterns,
    answers,
  };
}
