import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";
import { colors, defaultColors } from "./common.config.js";

// todo(vmyshko): do i need this? or apply only varcolors by default? boolean-figures may be affected
function varColor(color) {
  return `var(--${color})`;
}

const outerFigs = ["circle", "rect", "triangle"];
const innerFigs = ["inner-circle", "inner-rect", "inner-triangle"];

function* shuffleFiguresGenerator({ random }) {
  for (let row of [1, 2, 3]) {
    const possibleFigColors = [colors.red, colors.blue, colors.green];

    const possibleOuterFigs = [...outerFigs];
    const possibleInnerFigs = [...innerFigs];

    for (let col of [1, 2, 3]) {
      const randomOuterFig = random.popFrom(possibleOuterFigs);
      const randomInnerFig = random.popFrom(possibleInnerFigs);
      const randomFigColor = varColor(random.popFrom(possibleFigColors));

      yield [
        {
          figures: [randomOuterFig, randomInnerFig],
          color: randomFigColor,
        },
      ];
    } //col
  } //row
}

function generateAnswer({ random, config, correctAnswer }) {
  const outerFig = random.sample(outerFigs);
  const innerFig = random.sample(innerFigs);

  return {
    color: correctAnswer.color,
    figures: [outerFig, innerFig],
    isCorrect: false,
    id: getUid(),
  };
}

export function generateShuffleFiguresQuestion({
  config,
  seed,
  questionIndex,
}) {
  //
  const {
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]
  } = config;

  const patternsInRow = 3;

  const random = new SeededRandom(seed + questionIndex);

  const rowPatterns = [
    ...shuffleFiguresGenerator({
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
    getValueHashFn: ({ figures }) => `${figures.toString()}`,
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
