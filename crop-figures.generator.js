import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";
import { colors } from "./common.config.js";

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
