import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

// todo(vmyshko): rename this, its more visual config
export const ruleSets = {
  random: 0,
};

export const shuffleTypes = {
  random: 0, //15 -- 1=a, 2=b
};

function generateRandomFigures({ random, config }) {
  const { figureCount } = config;
  const basicFigures = [];

  const freeFigures = getFreeFiguresIndexes(figureCount);

  const figuresLeft = [...freeFigures];
  // todo(vmyshko): rewrite to func approach? or not?
  for (
    let pointIndex = 0;
    // todo(vmyshko): make configurable
    pointIndex < random.fromRange(1, figureCount - 1); // skip 'all-figs' pattern
    pointIndex++
  ) {
    //new point for each row
    const randomFigure = random.popFrom(figuresLeft);

    basicFigures.push(randomFigure);
  } // ptColor

  return basicFigures;
}

function mapValueToPattern(figures) {
  return {
    figures,
    id: getUid(),
  };
}

const generators = {
  // =====
  [shuffleTypes.random]: {
    rowGenerator: function* ({ random, config }) {
      const basicFigures = generateRandomFigures({ random, config });

      // patternsInCol -- max is 2 for this type
      const firstPattern = basicFigures;
      // middle col
      const middlePattern = generateRandomFigures({ random, config });
      // last col
      const lastPattern = generateRandomFigures({ random, config });

      yield [firstPattern, middlePattern, lastPattern].map(mapValueToPattern);
    },
    answerGenerator: ({ random, config }) =>
      generateRandomFigures({ random, config }),
  },
};

function getFreeFiguresIndexes(figureCount) {
  return Array(figureCount)
    .fill(null)
    .map((_, index) => index);
}

export function generateShuffleFiguresQuestion({
  config,
  seed,
  questionIndex,
}) {
  const patternsInRow = 3; //always 3 -- a+b=c --like

  const {
    patternsInCol = 3, // can be reduced by gen-non-unique reason
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const rowPatterns = [
    ...generators[config.shuffleType].rowGenerator({
      random,
      config,
    }),
  ];

  const patterns = [...rowPatterns.flat()];

  //last block
  const correctAnswer = patterns.at(-1);
  correctAnswer.isCorrect = true;

  // *******
  // ANSWERS
  // *******

  const answers = generateUniqueValues({
    existingValues: [correctAnswer],
    maxValuesCount: maxAnswerCount - 1,
    generateFn: () => {
      return {
        // todo(vmyshko): rewrite to normal gen based on gen type and config?
        figures: generators[config.shuffleType].answerGenerator({
          random,
          config,
        }),
        id: getUid(),
      };
    },
    getValueHashFn: ({ figures }) => figures.toString(),
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    patternsInCol,
    figureCount,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}
