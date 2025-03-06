import { bytesToFigNames, patternsGenerator } from "./col-row-sum.generator.js";
import { getUid } from "../helpers/common.js";
import { generateUniqueValues } from "../helpers/generate-unique-values.js";
import { SeededRandom } from "../helpers/random.helpers.js";

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

function generateRowSubMatrix({ random, config }) {
  const { figureTypesCountToUse, patternsInCol = 3 } = config;

  const maxFigsPerType = Math.floor(maxFigsPerCell / figureTypesCountToUse);

  const mtxResult = [];

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    const cell_00 = random.fromRange(1, maxFigsPerType);
    const cell_01 = random.fromRange(0, cell_00); // todo(vmyshko): can be 0 but not for all! how to impl?
    const cell_02 = cell_00 - cell_01;

    mtxResult.push([cell_00, cell_01, cell_02]);
  }

  return mtxResult;
}

function generateAnswer_rowSub({ random, config }) {
  const { figures, figureTypesCountToUse } = config;

  const maxFigsPerType = Math.floor(maxFigsPerCell / figureTypesCountToUse);

  // todo(vmyshko): get rid of this copy-pasta

  const figNamesToUse = random.popRangeFrom(
    [...figures],
    figureTypesCountToUse
  );

  const patternBytes = Array.from({ length: figureTypesCountToUse }, (_, i) => {
    const figCount = random.fromRange(1, maxFigsPerType);

    return figCount;
  });

  const randomAnswerFigs = bytesToFigNames({
    patternBytes,
    figNamesToUse,
  });

  return {
    isCorrect: false,
    id: getUid(),
    debugInfo: patternBytes,
    figureParts: makeFigureParts({ figures: randomAnswerFigs, random, config }),
  };
}

export function generatePatternsQuestion_rowSub({
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
    ...patternsGenerator({
      random,
      config,
      mtxGenFn: generateRowSubMatrix,
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
      return generateAnswer_rowSub({
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
