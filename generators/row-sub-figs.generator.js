import { bytesToFigNames, patternsGenerator } from "./col-row-sum.generator.js";

import { SeededRandom } from "../helpers/random.helpers.js";

const possiblePositions = [
  [0, 0],
  [50, 0],
  [100, 0],

  [0, 50],
  [50, 50],
  [100, 50],

  [0, 100],
  [50, 100],
  [100, 100],
];

const maxFigsPerCell = possiblePositions.length;

function makeFigureParts({ figures, random, shufflePositions = true }) {
  const colRowFigScale = 0.35;

  if (figures.length > maxFigsPerCell) {
    throw new Error(
      `Too many figures to fit in cell: ${figures.length}, max ${maxFigsPerCell}`
    );
  }

  const figPositions = shufflePositions
    ? random.popRangeFrom([...possiblePositions], figures.length)
    : [...possiblePositions];

  // todo(vmyshko): for debug
  // const figPositions = [...possiblePositions];

  return figures.map((fig, i) => ({
    figures: [fig],
    scale: colRowFigScale,
    transformX: figPositions[i][0],
    transformY: figPositions[i][1],
  }));
}

function generateRowSubMatrix({ random, config }) {
  // todo(vmyshko): fix - 2 zeros
  // http://127.0.0.1:8080/quiz.html#seed=0.4443700301994924
  const { figureTypesCountToUse, patternsInCol = 3 } = config;

  const maxFigsPerType = Math.floor(maxFigsPerCell / figureTypesCountToUse);

  const mtxResult = [];

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    const cell_00 = random.fromRange(1, maxFigsPerType);
    const cell_01 = random.fromRange(1, cell_00 - 1); // todo(vmyshko): can be 0 but not for all! how to impl?
    const cell_02 = cell_00 - cell_01;

    mtxResult.push([cell_00, cell_01, cell_02]);
  }

  return mtxResult;
}

export function preGenBytesROWSUBFIGS({ random, config }) {
  //gen bytes

  const {
    //
    patternsInCol = 3,
    patternsInRow = 3,
    byteGenConfig,
  } = config;

  const { max } = byteGenConfig.at(0);

  ///------------

  // first row
  // const cell_00 = uniqueValues.pop();

  // // first row rest
  // const cell_01 = uniqueValues.pop();
  // const cell_02 = cell_00 ^ cell_01;
  // removeItemFromArray(cell_02, uniqueValues);

  // //first col rest
  // const cell_10 = uniqueValues.pop();
  // const cell_20 = cell_00 ^ cell_10;
  // removeItemFromArray(cell_20, uniqueValues);

  // // center cell
  // const cell_11 = uniqueValues.pop();

  // // last middle cells
  // const cell_12 = cell_11 ^ cell_10;
  // const cell_21 = cell_11 ^ cell_01;

  // // last cell
  // const cell_22 = cell_02 ^ cell_12;

  return [
    // todo(vmyshko): is it possible to get rid of arr in arr?
    // [[cell_00], [cell_01], [cell_02]],
    // [[cell_10], [cell_11], [cell_12]],
    // [[cell_20], [cell_21], [cell_22]],

    [
      [3, 4, random.random()],
      [3, 4, random.random()],
      [3, 4, random.random()],
    ],
    [
      [3, 4, random.random()],
      [3, 4, random.random()],
      [3, 4, random.random()],
    ],
    [
      [3, 4, random.random()],
      [3, 4, random.random()],
      [3, 4, random.random()],
    ],
  ].flat();
}

export function preRenderPatternROWSUBFIGS({ bytes, preRenderConfig }) {
  if (bytes === null) return null; // for [?]

  const { figureIds, color } = preRenderConfig;

  const maxFigsPerType = 9;
  const figureTypesCountToUse = 2;

  const figs = bytes
    .slice(0, 2)
    .map((byte, index) => Array(byte).fill(figureIds[index]))
    .flat();

  const seed = bytes[2];

  console.log({ seed, b1: bytes[0], b2: bytes[1] });

  const random = new SeededRandom(seed);

  return {
    debugInfo: bytes,
    figureParts: makeFigureParts({
      figures: figs,
      random,
    }),
  };

  // ----
}
