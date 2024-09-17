import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

// todo(vmyshko): rename this, its more visual config
export const ruleSets = {
  random: 0,
  symmetric: 1,
};

const figureGenerators = {
  [ruleSets.random]: generateRandomFigures,
  [ruleSets.symmetric]: generateSymmetricFigures,
};

// A&!B
function subFigures(figures1, figures2) {
  // all from 1 but no from 2
  return figures1.filter((pt1) => !figures2.some((pt2) => pt2 === pt1));
}

// AND
function mulFigures(figures1, figures2) {
  // only same from both
  return figures1.filter((pt1) => figures2.some((pt2) => pt2 === pt1));
}

// XOR
function xorFigures(figures1, figures2) {
  //only unique from both
  const mulResult = mulFigures(figures1, figures2);

  return subFigures([...figures1, ...figures2], mulResult);
}

function generateSymmetricFigures({ random, config }) {
  const { figureCount } = config;
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

    basicFigures.push(randomFigure);
    basicFigures.push(randomFigure + 1);
  } // ptColor

  return basicFigures;
}

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

function generateXorRowPatterns({ basicFigures, figureCount, random, config }) {
  // [9]  rnd | all@part | first XOR mid
  // first col
  const firstPattern = {
    figures: basicFigures,
    id: getUid(),
  };

  // middle col

  const middlePattern = {
    figures: figureGenerators[config.ruleSet]({ random, config }),
    id: getUid(),
  };

  // last col
  const lastPattern = {
    figures: xorFigures(firstPattern.figures, middlePattern.figures),
    id: getUid(),
  };

  return [firstPattern, middlePattern, lastPattern];
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
    figureCount, // single pattern figure count [2..n]
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const patterns = [];

  //---

  const basicFiguresPerRow = generateUniqueValues({
    existingValues: [],
    maxValuesCount: patternsInCol,
    generateFn: () => figureGenerators[config.ruleSet]({ random, config }),
    getValueHashFn: (figs) => figs.toSorted().toString(),
  });
  //

  basicFiguresPerRow.forEach((figures) => {
    const rowPatterns = generateXorRowPatterns({
      basicFigures: figures,
      random,
      config,
      figureCount,
    });

    patterns.push(...rowPatterns);
  });

  //   const pointColors = random.shuffle(defaultColors);

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
        figures: figureGenerators[config.ruleSet]({ random, config }),
        id: getUid(),
      };
    },
    getValueHashFn: ({ figures }) => figures.toSorted().toString(),
  });

  //
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
