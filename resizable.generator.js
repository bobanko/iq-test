import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";
import { colors, defaultColors } from "./rotational.config.js";

// todo(vmyshko): do i need this? or apply only varcolors by default? boolean-figures may be affected
function varColor(color) {
  return `var(--${color})`;
}

const upscaleFactor = 1.9;

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

function* resizableGenerator({ random }) {
  const resizeLineColor = colors.red;
  const possibleFigColors = defaultColors.filter((c) => c !== resizeLineColor);

  const possibleFigs = [...figsToScale];

  for (let scaleType of random.shuffle(scaleTypes)) {
    const randomFig = random.popFrom(possibleFigs);
    const randomFigColor = varColor(random.popFrom(possibleFigColors));

    // base fig
    yield [
      {
        figures: [randomFig],
        color: randomFigColor,
      },
    ];
    // scale direction
    yield [
      {
        figures: scaleType.figures,

        scaleX: upscaleFactor,
        scaleY: upscaleFactor,

        color: varColor(resizeLineColor),
      },
    ];
    // upscaled fig

    yield [
      {
        figures: [randomFig],
        color: randomFigColor,

        scaleX: scaleType.scaleX,
        scaleY: scaleType.scaleY,
      },
    ];
  } //for
}

function generateAnswer({ random, config, correctAnswer }) {
  const figure = random.sample(figsToScale);

  return {
    // ...correctAnswer,
    color: correctAnswer.color,
    scaleX: random.sample([1, upscaleFactor]),
    scaleY: random.sample([1, upscaleFactor]),
    figures: [figure],
    isCorrect: false,
    id: getUid(),
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

  const rowPatterns = [
    ...resizableGenerator({
      random,
      config,
    }),
  ];

  const patterns = [...rowPatterns.flat()];

  //last block
  const correctAnswer = patterns.at(-1);
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
    getValueHashFn: ({ figures, scaleX = 1, scaleY = 1 }) =>
      `${figures.toString()};${scaleX};${scaleY}`,
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    figureCount,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}
