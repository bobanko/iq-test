import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";
import { colors } from "./common.config.js";
import { xorFigures } from "./boolean-figures.generator.js";

function* cropFiguresGenerator({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;

  const { figures, figureColors, cropFigures } = config;

  const cropFiguresShuffled = random.shuffle([...cropFigures]);

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    const [color1, color2] = random.popRangeFrom([...figureColors], 2);

    const rotation = random.sample([0, 90]);

    const cropFigureRandom =
      cropFiguresShuffled[rowIndex % cropFiguresShuffled.length];

    // basic figure
    yield {
      figureParts: [
        {
          figures: [figures[0]],
          color: color1,
          rotation,
        },
        {
          figures: [figures[1]],
          color: color2,
          rotation,
        },
        {
          figures: [figures[2]],
          rotation,
        },
      ],
    };

    // figure to crop
    yield {
      figureParts: [
        {
          figures: [cropFigureRandom],
          color: colors.dark,
          rotation,
        },
      ],
    };
    // cropped result
    yield {
      figureParts: [
        {
          figures: [figures[0]],
          color: color1,
          rotation,
        },
        {
          figures: [figures[1]],
          color: color2,
          rotation,
        },
        {
          figures: [figures[2]],
          rotation,
        },
        //
        {
          figures: [cropFigureRandom],
          color: colors.white,
          rotation,
          strokeWidth: 2,
          stroke: colors.dark,
        },
      ],
    };
  } //row
}

function generateAnswer({ random, config, correctAnswer }) {
  const { figureParts, colorGroups, rotationGroups } = config;

  const { patternsInCol = 3, patternsInRow = 3 } = config;

  const { figures, figureColors, cropFigures } = config;

  const rotation = random.sample([0, 90]);
  // todo(vmyshko): get rid of this copy-pasta

  return {
    isCorrect: false,
    id: getUid(),
    figureParts: [
      {
        figures: [figures[0]],
        color: random.sample(figureColors),
        rotation,
      },
      {
        figures: [figures[1]],
        color: random.sample(figureColors),
        rotation,
      },
      {
        figures: [figures[2]],
        rotation,
      },
      //
      {
        figures: [random.sample(cropFigures)],
        color: colors.white,
        rotation,
        strokeWidth: 2,
        stroke: colors.dark,
      },
    ],
  };
}

export function generateCropFigurePatternsQuestion({
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
    ...cropFiguresGenerator({
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
      return generateAnswer({
        correctAnswer,
        random,
        config,
      });
    },
    getValueHashFn: ({ figureParts = [] }) =>
      figureParts
        .map(
          // todo(vmyshko): why defaults are not set yet? re-check!
          ({ figures, rotation = 0, color = "", strokeWidth = 0 }) =>
            `${figures.toString()};${color};${rotation};${strokeWidth}`
        )
        .toString(),
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}

// **************
// todo(vmyshko): funcs below copied from above, and modified, similar logic should be extracted

function* cropFiguresGeneratorAlt({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;

  const { figures, figureColors, cropFigures } = config;

  const cropFiguresShuffled = random.shuffle([...cropFigures]);

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    const [color1, color2, color3] = random.popRangeFrom([...figureColors], 3);

    const bgRotation = random.sample([0, 90]);

    const cropFigureRandom =
      cropFiguresShuffled[rowIndex % cropFiguresShuffled.length];

    // basic figure
    yield {
      figureParts: [
        {
          figures: [figures[0]],
          color: color1,
          rotation: bgRotation,
        },
        {
          figures: [figures[1]],
          color: color2,
          rotation: bgRotation,
        },
        {
          figures: [figures[2]],
          rotation: bgRotation,
        },
      ],
    };

    // figure to crop
    yield {
      figureParts: [
        //prev figs from col-1
        {
          figures: [figures[0]],
          color: color1,
          rotation: bgRotation,
        },
        {
          figures: [figures[1]],
          color: color2,
          rotation: bgRotation,
        },
        {
          figures: [figures[2]],
          rotation: bgRotation,
        },
        //...plus extra fig

        {
          figures: [cropFigureRandom],
          color: color3,
          strokeWidth: 2,
          stroke: colors.dark,
          rotation: 0,
        },
      ],
    };
    // 3rd col - just extra crop fig
    yield {
      figureParts: [
        {
          figures: [cropFigureRandom],
          color: color3,
          strokeWidth: 2,
          stroke: colors.dark,
          rotation: 0,
        },
      ],
    };
  } //row
}

function generateAnswerAlt({ random, config, correctAnswer }) {
  const { figureParts, colorGroups, rotationGroups } = config;

  const { patternsInCol = 3, patternsInRow = 3 } = config;

  const { figures, figureColors, cropFigures } = config;

  // todo(vmyshko): some figs looks same after 90 rot (circle and square) so skip rotation
  const bgRotation = random.sample([0, 90]);
  // todo(vmyshko): get rid of this copy-pasta

  const [color1, color2] = random.popRangeFrom([...figureColors], 2);

  return {
    isCorrect: false,
    id: getUid(),
    figureParts: random.sample([
      // full bg
      [
        {
          figures: [figures[0]],
          color: color1,
          rotation: bgRotation,
        },
        {
          figures: [figures[1]],
          color: color2,
          rotation: bgRotation,
        },
        {
          figures: [figures[2]],
          rotation: bgRotation,
        },
      ],
      //OR crop fig
      [
        {
          figures: [random.sample(cropFigures)],
          //figures: [random.sample(figures)],
          color: random.sample(figureColors),
          strokeWidth: 2,
          stroke: colors.dark,
          rotation: 0, //cause some crops has no visual diff when rotated
        },
      ],
    ]),
  };
}

export function generateCropFigurePatternsQuestionAlt({
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
    ...cropFiguresGeneratorAlt({
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
      return generateAnswerAlt({
        correctAnswer,
        random,
        config,
      });
    },
    getValueHashFn: ({ figureParts = [] }) =>
      figureParts
        .map(
          // todo(vmyshko): why defaults are not set yet? re-check!
          ({ figures, rotation = 0, color = "", strokeWidth = 0 }) =>
            `${figures.toString()};${color};${rotation};${strokeWidth}`
        )
        .toString(),
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}

//.. and some more copypasta

const bgCircleFig = {
  figures: ["circle"],
  color: "white",
};

const frameCircleFig = {
  figures: ["circle"],
  color: "transparent",
  strokeWidth: 2,
};

function* cropFiguresGeneratorXorCustom({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;

  const { figures, figureColors } = config;

  const [color1, color2] = random.popRangeFrom([...figureColors], 2);

  // to keep rows unique
  const possibleFigCounts = [2, 3, 4];

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    const quarterFigsCount = random.popFrom(possibleFigCounts);
    // fig count to xor
    const xorFigsCount = random.fromRange(1, quarterFigsCount - 1);

    const randomFigs = random.popRangeFrom([...figures], quarterFigsCount);

    // basic figure
    yield {
      figureParts: [
        bgCircleFig,
        {
          figures: randomFigs,
          color: color1,
        },
        frameCircleFig,
      ],
    };

    const figsToXor = random.popRangeFrom([...randomFigs], xorFigsCount);

    // figure to xor
    yield {
      figureParts: [
        bgCircleFig,
        {
          figures: figsToXor,
          color: color2,
        },
        frameCircleFig,
      ],
    };
    // 3rd col - just extra crop fig
    yield {
      figureParts: [
        bgCircleFig,
        {
          //sort for proper hash check
          figures: xorFigures(randomFigs, figsToXor).sort(),
          color: color1,
        },
        frameCircleFig,
      ],
    };
  } //row
}

function generateAnswerXorCustom({ random, config, correctAnswer }) {
  const { figureParts, colorGroups, rotationGroups } = config;

  const { patternsInCol = 3, patternsInRow = 3 } = config;

  const { figures, figureColors } = config;

  // todo(vmyshko): some figs looks same after 90 rot (circle and square) so skip rotation
  const bgRotation = random.sample([0, 90]);
  // todo(vmyshko): get rid of this copy-pasta

  const { color: color1 } = correctAnswer.figureParts[1];

  const quarterFigsCount = random.fromRange(1, 4);
  const randomFigs = random.popRangeFrom([...figures], quarterFigsCount);

  return {
    isCorrect: false,
    id: getUid(),
    figureParts:
      // full bg
      [
        bgCircleFig,
        {
          //sort for proper hash check
          figures: randomFigs.sort(),
          color: color1,
        },
        frameCircleFig,
      ],
  };
}

export function generateCropFigurePatternsQuestionXorCustom({
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
    ...cropFiguresGeneratorXorCustom({
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
      return generateAnswerXorCustom({
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
      console.log(figureParts, hash);

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
    correctAnswer,
    //
  };
}

// ... and more!

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

function shuffleFigsPositions({ figures, random }) {
  const colRowFigScale = 0.35;

  if (figures.length > maxFigsPerCell) {
    throw new Error(
      `Too many figures to fit in cell: ${figures.length}, max ${maxFigsPerCell}`
    );
  }

  const figPositions = random.popRangeFrom(
    [...possiblePositions],
    figures.length
  );
  // todo(vmyshko): for debug
  // const figPositions = [...possiblePositions];

  return figures.map((fig, i) => ({
    figures: [fig],
    scale: colRowFigScale,
    transformX: figPositions[i][0],
    transformY: figPositions[i][1],
  }));
}

function getFirstCellFigures({ figsAvailable, random }) {
  const firstCellFigs = random
    .popRangeFrom(
      [...figsAvailable],
      random.fromRange(
        // not less than, if too many figs
        Math.max(1, figsAvailable.length - maxFigsPerCell * 2),
        // minus 2 - to keep at least 1&1 for rest 2 columns
        Math.min(figsAvailable.length - 2, maxFigsPerCell)
      )
    )
    .sort();

  return firstCellFigs;
}

function getSecondCellFigures({ figsAvailable, random }) {
  const secondCellFigs = random
    .popRangeFrom(
      figsAvailable,
      random.fromRange(
        // not less than ???, last column can handle
        Math.max(1, figsAvailable.length - maxFigsPerCell),
        // minus 1 to keep at least 1 for 3rd column
        Math.min(figsAvailable.length - 1, maxFigsPerCell)
      )
    )
    .sort();

  return secondCellFigs;
}

/**
 * removes elements from basicArray
 * @param {Array} basicArray array to remove items from
 * @param {Array} elementsToRemove elements to remove from basicArray
 * @returns items from basicArray without elementsToRemove
 */
function subArrays(basicArray, elementsToRemove) {
  const resultArray = [...basicArray];

  elementsToRemove.forEach((element) => {
    resultArray.splice(resultArray.indexOf(element), 1);
  });

  return resultArray;
}

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

function* cropFiguresGenerator_colRowSum({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;
  const { figures, figureTypesCountToUse, colRowSum } = config;

  const figNamesToUse = random.popRangeFrom(
    [...figures],
    figureTypesCountToUse
  );

  const figName = random.sample(figNamesToUse);

  const mtxNumbers = generateNumberMatrix({ random, config });

  const figRows = mtxNumbers
    .map((row) => row.map((cellNumber) => Array(cellNumber).fill(figName)))
    .flat();

  for (let cellFigs of figRows) {
    yield {
      figureParts: shuffleFigsPositions({ figures: cellFigs, random }),
    };
  }
}

function generateAnswer_colRowSum({ random, config, correctAnswer }) {
  const { figureParts, colorGroups, rotationGroups } = config;

  const { patternsInCol = 3, patternsInRow = 3, colRowFigSum } = config;

  const { figures, figureTypesCountToUse } = config;

  // todo(vmyshko): get rid of this copy-pasta

  const figsToUse = figures;
  // random.popRangeFrom([...figures], figureTypesCountToUse);

  const allRowFigs = figsToUse
    .map((fig) => Array(colRowFigSum).fill(fig))
    .flat();

  const randomAnswerFigsCount = random.fromRange(
    // todo(vmyshko): fit answers to be  similar to correct
    Math.max(1, allRowFigs.length - maxFigsPerCell * 2),
    Math.min(allRowFigs.length / 3, maxFigsPerCell)
  );

  const randomFigs = random
    .popRangeFrom(allRowFigs, randomAnswerFigsCount)
    .sort();

  return {
    isCorrect: false,
    id: getUid(),
    figureParts: shuffleFigsPositions({ figures: randomFigs, random }),
  };
}

export function generateCropFigurePatternsQuestion_colRowSum({
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
    ...cropFiguresGenerator_colRowSum({
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
      console.log(figureParts, hash);

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
    correctAnswer,
    //
  };
}
