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
