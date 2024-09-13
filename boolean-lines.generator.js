import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

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

function generateXorRowPatterns({ basicFigures, figureCount, random }) {
  // [9]  rnd | all@part | first XOR mid
  // first col
  const firstPattern = {
    figures: basicFigures,
    id: getUid(),
  };

  // middle col

  const freeFigures = getFreeFiguresIndexes(figureCount);

  const allFigures = [...freeFigures];

  const middlePattern = {
    figures: random.popRangeFrom(
      allFigures,
      random.fromRange(2, allFigures.length)
    ),
    id: getUid(),
  };

  // last col
  const lastPattern = {
    figures: xorFigures(firstPattern.figures, middlePattern.figures),
    id: getUid(),
  };

  const patternsInRow = [firstPattern, middlePattern, lastPattern].map(
    (pattern) => {
      return { ...pattern, figures: pattern.figures };
    }
  );

  // color all figures
  patternsInRow.forEach((pattern) => {
    // colorPoints({ points: pattern.points });
  });

  return patternsInRow; //[firstPattern, middlePattern, lastPattern];
}

function getFreeFiguresIndexes(figureCount) {
  return Array(figureCount)
    .fill(null)
    .map((_, index) => index);
}

export function generateBooleanLinesQuestion({ config, seed, questionIndex }) {
  const patternsInRow = 3; //always 3 -- a+b=c --like

  const {
    patternsInCol = 3, // can be reduced by gen-non-unique reason
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]

    ruleSet = 0, // add, mul, sub, xor? multicolor? highlight added/removed?
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const patterns = [];

  //---
  function generateBasicFigures() {
    const basicFigures = [];

    const freeFigures = getFreeFiguresIndexes(figureCount);

    const figuresLeft = [...freeFigures];
    // todo(vmyshko): rewrite to func approach? or not?
    for (
      let pointIndex = 0;
      pointIndex < random.fromRange(2, figureCount - 1); // skip 'all-figs' pattern
      pointIndex++
    ) {
      //new point for each row
      const randomFigure = random.popFrom(figuresLeft);

      basicFigures.push(randomFigure);
    } // ptColor

    return basicFigures;
  }

  const basicFiguresPerRow = generateUniqueValues({
    existingValues: [],
    maxValuesCount: patternsInCol,
    generateFn: generateBasicFigures,
    getValueHashFn: (figs) => figs.toString(),
  });
  //

  basicFiguresPerRow.forEach((figures) => {
    const rowPatterns = generateXorRowPatterns({
      basicFigures: figures,
      random,
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

  // todo(vmyshko): shit is here, correct duplicates, excessive mapping

  const answers = generateUniqueValues({
    existingValues: [correctAnswer],
    maxValuesCount: maxAnswerCount - 1,
    generateFn: () => {
      return {
        figures: generateBasicFigures(),
        id: getUid(),
      };
    },
    getValueHashFn: ({ figures }) => figures.toString(),
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
