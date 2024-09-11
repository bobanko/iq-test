import { getUid } from "./common.js";
import { SeededRandom } from "./helpers.js";
import { defaultColors } from "./rotational.config.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { getPossibleMatrixCells, Point } from "./matrix.helpers.js";

// OR
function addPoints(points1, points2) {
  // todo(vmyshko): remove dupes
  // both from both
  return [...points1, ...points2];
}

// A&!B
function subPoints(points1, points2, skipColor = false) {
  // all from 1 but no from 2
  return points1.filter(
    (pt1) =>
      !points2.some(
        (pt2) => pt2.toString(skipColor) === pt1.toString(skipColor)
      )
  );
}

// AND
function mulPoints(points1, points2) {
  // only same from both
  return points1.filter((pt1) =>
    points2.some((pt2) => pt2.toString() === pt1.toString())
  );
}

// XOR
function xorPoints(points1, points2) {
  //only unique from both
  const mulResult = mulPoints(points1, points2);

  return subPoints([...points1, ...points2], mulResult);
}

// NAND - !AND
// NOR  - !OR
// XNOR - !XOR

function copyPoints(points) {
  return points.map((pt) => new Point({ ...pt }));
}

function colorPoints({ points, color }) {
  points.forEach((pt) => (pt.color = color));

  return points;
}

export function generateAddRowPatterns({
  basicPoints,
  mtxSize,
  random,
  pointColors,
}) {
  // [9]  rnd | (all-first)@part | first + mid
  // first col
  const firstPattern = {
    points: basicPoints,
    id: getUid(),
  };

  // middle col
  const freePointsLeft = subPoints(
    getPossibleMatrixCells(mtxSize),
    basicPoints
  );

  const middlePattern = {
    points: random.popRangeFrom(
      freePointsLeft,
      random.fromRange(1, freePointsLeft.length)
    ),
    id: getUid(),
  };

  // last col
  const lastPattern = {
    points: [...basicPoints, ...middlePattern.points],

    id: getUid(),
  };

  const patternsInRow = [firstPattern, middlePattern, lastPattern];

  // todo(vmyshko): color all points
  patternsInRow.forEach((pattern) => {
    colorPoints({ points: pattern.points, color: pointColors.at(0) });
  });

  return [firstPattern, middlePattern, lastPattern];
}

export function generateSubRowPatterns({
  basicPoints,
  mtxSize,
  random,
  pointColors,
}) {
  // [8]  rnd | first@part | first - mid
  const [firstPattern, middlePattern, lastPattern] = generateAddRowPatterns({
    basicPoints,
    mtxSize,
    random,
    pointColors,
  });
  // just reorder add patterns to get sub
  return [lastPattern, firstPattern, middlePattern];
}

export function generateColorDiffRowPatterns({
  basicPoints,
  mtxSize,
  random,
  pointColors,
}) {
  // [7] rnd | first@part | mid + (first - mid)@recolor [!!!custom answer logic]

  colorPoints({ points: basicPoints, color: pointColors.at(0) });

  // first col
  const firstPattern = {
    points: copyPoints(basicPoints),
    id: getUid(),
  };

  // middle col | first@part
  const middlePattern = {
    points: random.popRangeFrom(
      copyPoints(basicPoints),
      random.fromRange(1, basicPoints.length - 1)
    ),

    id: getUid(),
  };

  // last col | mid + (first - mid)@recolor [!!!custom answer logic]

  const colorDiffPoints = copyPoints(
    subPoints(firstPattern.points, middlePattern.points, true)
  );

  const lastPattern = {
    points: [
      ...copyPoints(middlePattern.points),
      ...colorPoints({
        points: colorDiffPoints,
        color: pointColors.at(1),
      }),
    ],

    id: getUid(),
  };

  return [firstPattern, middlePattern, lastPattern];
}

export function generateAddAndSubRowPatterns({
  basicPoints,
  mtxSize,
  random,
  pointColors,
}) {
  // [10] rnd | first@part@recolor
  //          + (all-first)@part | first - first@part@recolor + (all - first)@part

  // # first col
  const firstPattern = {
    points: copyPoints(basicPoints),
    id: getUid(),
  };

  colorPoints({ points: firstPattern.points, color: pointColors.at(0) });

  // ## middle col | first@part@recolor + (all-first)@part
  // todo(vmyshko): need better naming
  const firstPartToSub = random.popRangeFrom(
    copyPoints(basicPoints),
    random.fromRange(1, basicPoints.length - 1)
  );

  const allCells = getPossibleMatrixCells(mtxSize);
  const notFirst = copyPoints(subPoints(allCells, basicPoints, true));

  const notFirstPartToAdd = random.popRangeFrom(
    copyPoints(notFirst),
    random.fromRange(1, notFirst.length - 1)
  );

  colorPoints({ points: firstPartToSub, color: pointColors.at(1) });
  colorPoints({ points: notFirstPartToAdd, color: pointColors.at(0) });

  const middlePattern = {
    points: copyPoints([...firstPartToSub, ...notFirstPartToAdd]),
    id: getUid(),
  };

  // ### last col | first - first@part@recolor + (all - first)@part

  const resultPoints = copyPoints([
    ...subPoints(basicPoints, firstPartToSub, true),
    ...notFirstPartToAdd,
  ]);

  console.log({ basicPoints, firstPartToSub, resultPoints });

  colorPoints({ points: resultPoints, color: pointColors.at(0) });

  const lastPattern = {
    points: resultPoints,
    id: getUid(),
  };

  return [firstPattern, middlePattern, lastPattern];
}

export function generateXorRowPatterns({
  basicPoints,
  mtxSize,
  random,
  pointColors,
}) {
  // [9]  rnd | all@part | first XOR mid
  // first col
  const firstPattern = {
    points: basicPoints,
    id: getUid(),
  };

  // middle col
  const allCells = getPossibleMatrixCells(mtxSize);

  const middlePattern = {
    points: random.popRangeFrom(allCells, random.fromRange(1, allCells.length)),
    id: getUid(),
  };

  // last col
  const lastPattern = {
    points: copyPoints(xorPoints(firstPattern.points, middlePattern.points)),
    id: getUid(),
  };

  const patternsInRow = [firstPattern, middlePattern, lastPattern];

  // color all points
  patternsInRow.forEach((pattern) => {
    colorPoints({ points: pattern.points, color: pointColors.at(0) });
  });

  return [firstPattern, middlePattern, lastPattern];
}

export function generateSumAll3RowPatterns({
  basicPoints,
  mtxSize,
  random,
  pointColors,
}) {
  // [all-3] rnd | all-first@part | all-first-(all-first@part)

  // first col
  const firstPattern = {
    points: basicPoints,
    id: getUid(),
  };

  // middle col
  const allCells = getPossibleMatrixCells(mtxSize);

  const notFirst = copyPoints(subPoints(allCells, basicPoints, true));

  const middlePattern = {
    points: random.popRangeFrom(
      notFirst,
      random.fromRange(1, Math.floor(notFirst.length / 2)) //half
    ),
    id: getUid(),
  };

  // last col
  const lastPattern = {
    points: copyPoints(notFirst), //copy whats left
    id: getUid(),
  };

  const patternsInRow = [firstPattern, middlePattern, lastPattern];

  // todo(vmyshko): color all points
  patternsInRow.forEach((pattern) => {
    colorPoints({ points: pattern.points, color: pointColors.at(0) });
  });

  return [firstPattern, middlePattern, lastPattern];
}

export function generateBooleanMatrixQuestion({ config, seed, questionIndex }) {
  const patternsInRow = 3; //always 3 -- a+b=c --like

  const {
    patternsInCol = 3, // can be reduced by gen-non-unique reason
    maxAnswerCount = 6, //over 8 will not fit
    mtxSize = 3, // single pattern matrix size [2..5]

    ruleSet = 0, // add, mul, sub, xor? multicolor? highlight added/removed?
  } = config;

  const basicCellCountRange = [2, Math.round(mtxSize ** 2 / 2)]; //potential config val

  const random = new SeededRandom(seed + questionIndex);

  const patterns = [];
  // ---

  function generateBasicPoints(cellCountRange) {
    const basicPoints = [];
    const freeCellsForPoints = getPossibleMatrixCells(mtxSize);

    // todo(vmyshko): rewrite to func approach? or not?
    for (
      let pointIndex = 0;
      pointIndex < random.fromRange(...cellCountRange);
      pointIndex++
    ) {
      //new point for each row
      const randomPoint = random.popFrom(freeCellsForPoints);

      const currentPoint = new Point({ ...randomPoint });

      basicPoints.push(currentPoint);
    } // ptColor

    return basicPoints;
  }

  const basicPointsPerRow = generateUniqueValues({
    existingValues: [],
    maxValuesCount: patternsInCol,
    generateFn: () => generateBasicPoints(basicCellCountRange),
    getValueHashFn: (points) => points.toString(),
  });

  // ---

  const pointColors = random.shuffle(defaultColors);

  const ruleSets = [
    generateAddRowPatterns, //[9]
    generateSubRowPatterns, //[8]
    generateColorDiffRowPatterns, //[7]
    generateAddAndSubRowPatterns, //[10]
    generateXorRowPatterns, // [xor]
    generateSumAll3RowPatterns, //[sum-all-3]
  ];

  function generateRowPatterns({ basicPoints, mtxSize, ruleSet = 0 }) {
    return ruleSets[ruleSet]({
      basicPoints,
      mtxSize,
      random,
      pointColors,
    });
  }

  for (let currentRowBasicPoints of basicPointsPerRow) {
    const patternsInRow = generateRowPatterns({
      basicPoints: currentRowBasicPoints,
      mtxSize,
      ruleSet,
    });

    patterns.push(...patternsInRow);
  } // row

  //last block
  const correctAnswer = patterns.at(-1);
  correctAnswer.isCorrect = true;

  // *******
  // ANSWERS
  // *******

  function generateAnswer(refPoints) {
    const deviation = 0.5;
    // todo(vmyshko): calc range based on first+second?
    const points = generateBasicPoints([
      Math.max(Math.floor(refPoints.length * (1 - deviation)), 1),
      Math.min(Math.round(refPoints.length * (1 + deviation)), mtxSize ** 2),
    ]);

    const availableColors = refPoints.map((pt) => pt.color);
    // todo(vmyshko): try to keep color proportions

    points.forEach((pt) => {
      pt.color = random.sample(availableColors);
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
    generateFn: () => generateAnswer(correctAnswer.points),

    getValueHashFn: ({ points }) =>
      points.toSorted((pt1, pt2) => (pt1 > pt2 ? 1 : -1)).toString(),
  });

  console.log(
    "a",
    answers.map((a) => a.points.toString())
  );

  //
  return {
    seed,
    patternsInRow,
    patternsInCol,
    mtxSize,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}
