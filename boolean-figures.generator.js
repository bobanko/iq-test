import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

export const figureGenRules = {
  random: 0,
  symmetric: 1,
};

const figureGenerators = {
  [figureGenRules.random]: generateRandomFigures,
  [figureGenRules.symmetric]: generateSymmetricFigures,
};

// A&!B &~
function subFigures(figures1, figures2) {
  // all from 1 but no from 2
  return figures1.filter((pt1) => !figures2.some((pt2) => pt2 === pt1));
}

// AND &
function mulFigures(figures1, figures2) {
  // only same from both
  return figures1.filter((pt1) => figures2.some((pt2) => pt2 === pt1));
}

// XOR ^
export function xorFigures(figures1, figures2) {
  //only unique from both
  const mulResult = mulFigures(figures1, figures2);

  return subFigures([...figures1, ...figures2], mulResult);
}

// todo(vmyshko): all logical ops could be done with binaries
// example
// convert from binary and do bitwise ops:
// parseInt('0111',2) &~ parseInt('1001',2) => 6
// from dec to binary
// (6).toString(2).padStart(4,'0')
// '0110'
// each binary digit can be mapped to corresponding figure

function generateSymmetricFigures({ random, config }) {
  const { figureCount, figures } = config;
  const basicFigures = [];

  const freeFigures = getFreeFiguresIndexes(figureCount / 2);

  const figuresLeft = [...freeFigures.map((f) => f * 2)];
  // todo(vmyshko): rewrite to func approach? or not?
  for (
    let pointIndex = 0;
    pointIndex < random.fromRange(1, figureCount / 2 - 1); // skip 'all-figs' pattern
    pointIndex++
  ) {
    //new point for each row
    const randomFigure = random.popFrom(figuresLeft);

    basicFigures.push(figures ? figures[randomFigure] : randomFigure);
    basicFigures.push(figures ? figures[randomFigure + 1] : randomFigure + 1);
  } // ptColor

  return basicFigures;
}

function generateRandomFigures({ random, config }) {
  const { figureCount, figures } = config;
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

    basicFigures.push(figures ? figures[randomFigure] : randomFigure);
  } // ptColor

  return basicFigures;
}

function generateXorRowPatterns({ basicFigures, random, config }) {
  // [9]  rnd | all@part | first XOR mid
  // first col
  const firstPattern = {
    figures: basicFigures,
    id: getUid(),
  };

  // middle col

  const middlePattern = {
    figures: figureGenerators[config.figureGenRule]({ random, config }),
    id: getUid(),
  };

  // last col
  const lastPattern = {
    figures: xorFigures(firstPattern.figures, middlePattern.figures),
    id: getUid(),
  };

  return [firstPattern, middlePattern, lastPattern].map(mapToFigureParts);
}

function mapToFigureParts(oldPattern) {
  return {
    figureParts: [
      {
        figures: oldPattern.figures.sort((a, b) => a - b),
      },
    ],
  };
}

function getFreeFiguresIndexes(figureCount) {
  return Array(figureCount)
    .fill(null)
    .map((_, index) => index);
}

export function generateBooleanFiguresQuestion({
  config,
  seed,
  questionIndex,
}) {
  const patternsInRow = 3; //always 3 -- a+b=c --like

  const {
    patternsInCol = 3, // can be reduced by gen-non-unique reason
    maxAnswerCount = 6, //over 8 will not fit
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const patterns = [];

  //---

  const basicFiguresPerRow = generateUniqueValues({
    existingValues: [],
    maxValuesCount: patternsInCol,
    generateFn: () =>
      figureGenerators[config.figureGenRule]({ random, config }),
    getValueHashFn: (figs) => figs.toSorted().toString(),
  });
  //

  basicFiguresPerRow.forEach((figures) => {
    const rowPatterns = generateXorRowPatterns({
      basicFigures: figures,
      random,
      config,
    });

    patterns.push(...rowPatterns);
  });

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
    generateFn: () =>
      mapToFigureParts({
        figures: figureGenerators[config.figureGenRule]({ random, config }),
        id: getUid(),
      }),

    getValueHashFn: ({ figureParts = [] }) =>
      figureParts
        .map(
          // todo(vmyshko): why defaults are not set yet? re-check!
          ({ figures, rotation = 0, color = "", strokeWidth = 0 }) =>
            `${figures.toString()};${color};${rotation};${strokeWidth}`
        )
        .toString(),
  });

  //
  return {
    seed,
    patternsInRow,
    patternsInCol,
    //
    patterns,
    answers,
  };
}
