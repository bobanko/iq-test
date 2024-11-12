import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";
import { colors, defaultColors } from "./common.config.js";

const upscaleFactor = 1.9;

const strokeWidth = 5;

const figsToScale = ["circle", "rect", "star", "triangle"];

const scaleTypes = [
  { figures: ["horizontal"], scaleX: upscaleFactor },
  { figures: ["vertical"], scaleY: upscaleFactor },
  {
    figures: ["horizontal", "vertical"],
    scaleX: upscaleFactor,
    scaleY: upscaleFactor,
  },
];

const resizeLineColor = colors.red;
const figColors = defaultColors.filter((c) => c !== resizeLineColor);

function* resizableGenerator({ config, random }) {
  const possibleFigColors = [...figColors];
  const possibleFigs = [...figsToScale];

  for (let scaleType of random.shuffle(scaleTypes)) {
    const randomFig = random.popFrom(possibleFigs);
    const randomFigColor = random.popFrom(possibleFigColors);

    // base fig
    yield {
      figureParts: [
        {
          figures: [randomFig],
          color: randomFigColor,
          scale: config.scale,
          strokeWidth,
        },
      ],
    };

    // scale direction
    yield {
      figureParts: [
        {
          figures: scaleType.figures,
          scale: config.scale * upscaleFactor,
          color: resizeLineColor,
          strokeWidth,
        },
      ],
    };
    // upscaled fig

    yield {
      figureParts: [
        {
          figures: [randomFig],
          color: randomFigColor,
          scale: config.scale,
          scaleX: scaleType.scaleX * config.scale,
          scaleY: scaleType.scaleY * config.scale,
          strokeWidth,
        },
      ],
    };
  } //for
}

function generateAnswer({ random, config }) {
  const figure = random.sample(figsToScale);

  const possibleFigColors = [...figColors];
  const randomFigColor = random.popFrom(possibleFigColors);

  return {
    isCorrect: false,
    id: getUid(),
    figureParts: [
      {
        figures: [figure],
        color: randomFigColor,
        scale: config.scale,
        scaleX: random.sample([1, upscaleFactor]) * config.scale,
        scaleY: random.sample([1, upscaleFactor]) * config.scale,
        strokeWidth,
      },
    ],
  };
}

export function generateResizableQuestion({ config, seed, questionIndex }) {
  //
  const {
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]
  } = config;

  const patternsInRow = 3;

  const random = new SeededRandom(seed + questionIndex);

  const patterns = [
    ...resizableGenerator({
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
          ({
            figures,
            rotation = 0,
            color = "",
            scaleX = 1,
            scaleY = 1,
            strokeWidth = 0,
          }) =>
            `${figures.toString()};${color};${rotation};${strokeWidth};${scaleX};${scaleY}`
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
