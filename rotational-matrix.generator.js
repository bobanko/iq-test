import { getUid } from "./common.js";
import { SeededRandom } from "./helpers.js";

import { generateUniqueValues } from "./generate-unique-values.js";
import { getPossibleMatrixCells, Point } from "./matrix.helpers.js";
import { defaultColors } from "./common.config.js";

function rotateMatrix({ mtxPoints, mtxSize, times = 1 }) {
  const rotated = Array(times % 4)
    .fill()
    .reduce((acc, _) => rotateMatrixCw({ mtxPoints: acc, mtxSize }), mtxPoints);

  function rotateMatrixCw({ mtxPoints, mtxSize }) {
    return mtxPoints.map((point) => ({
      ...point,
      row: point.col,
      col: mtxSize - 1 - point.row,
    }));
  }

  return rotated;
}

function generateBasicPoints({ cellGroups, groupColors, random, mtxSize }) {
  const basicPoints = [];

  const freeCellsForPoints = getPossibleMatrixCells(mtxSize);

  const maxCellCount = freeCellsForPoints.length;

  // todo(vmyshko): rename/refac/extract?
  const pointCountPerGroup = [];
  const safeMaxes = [];
  for (let index = 0; index < cellGroups.length; index++) {
    const { min, max } = cellGroups[index];
    const slicePoint = index + 1;
    const minsBelow = cellGroups
      .slice(slicePoint)
      .map(({ min }) => min)
      .reduce((acc, value) => acc + value, 0);

    const sumAbove = pointCountPerGroup.reduce((acc, value) => acc + value, 0);

    const safeMax = Math.min(max, maxCellCount - minsBelow - sumAbove);

    safeMaxes.push(safeMax);

    const value = random.fromRange(min, safeMax);
    pointCountPerGroup.push(value);
  }

  console.log({ safeMaxes });
  //---

  pointCountPerGroup.forEach((pointCount, index) => {
    //new point for each row
    const groupPoints = Array(pointCount)
      .fill()
      .map((_) => {
        const randomPoint = random.popFrom(freeCellsForPoints);
        const currentPoint = new Point({
          ...randomPoint,
          color: groupColors.at(index),
        });
        return currentPoint;
      });

    basicPoints.push(...groupPoints);
  });

  return basicPoints;
}

export function generateRotationalMatrixQuestion({
  config,
  seed,
  questionIndex,
}) {
  const {
    patternsInRow = 3,
    patternsInCol = 3, // can be reduced by gen-non-unique reason
    maxAnswerCount = 6,
    mtxSize = 3, // single pattern matrix size [2..5]

    cellGroups,
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const groupColors = random.shuffle(defaultColors);

  const patterns = [];
  // ---

  // gen unique 1st-patterns-in-row

  const basicPointsPerRow = generateUniqueValues({
    existingValues: [],
    maxValuesCount: patternsInCol,
    generateFn: () =>
      generateBasicPoints({
        cellGroups,
        groupColors,
        random,
        mtxSize,
      }),
    getValueHashFn: (points) => points.toString(),
  });

  // ---

  for (let currentRowBasicPoints of basicPointsPerRow) {
    // rotate(rnd,0) | rotate(rnd,1) | rotate(rnd,2) | ...

    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      const rotatedPoints = rotateMatrix({
        mtxPoints: currentRowBasicPoints,
        mtxSize,
        times: colIndex,
      });

      const colPattern = {
        points: rotatedPoints,
        id: getUid(),
      };

      patterns.push(colPattern);
    }
  } // row

  //last block
  const [correctAnswer] = patterns.splice(-1, 1, null);
  correctAnswer.isCorrect = true;
  correctAnswer.id = getUid();

  // *******
  // ANSWERS
  // *******

  function generateAnswer() {
    const points = generateBasicPoints({
      cellGroups,
      groupColors,
      random,
      mtxSize,
    });

    return {
      points,
      isCorrect: false,
      // todo(vmyshko):  this spoils uids by bad gen attempts
      id: getUid(),
    };
  }

  const answers = generateUniqueValues({
    existingValues: [correctAnswer],
    maxValuesCount: maxAnswerCount - 1,
    generateFn: () => generateAnswer(),

    getValueHashFn: ({ points }) =>
      points.toSorted((pt1, pt2) => (pt1 > pt2 ? 1 : -1)).toString(),
  });

  //
  return {
    patternsInRow,

    mtxSize,
    //
    patterns,
    answers,
  };
}
