import { preGenBytes_equalSumPerRowCol } from "./number-progressions.generator.js";

export const possiblePositions = [
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

export const maxFigsPerCell = possiblePositions.length;

export function makeFigureParts({ figures, random, config }) {
  const { shufflePositions = true } = config ?? {};
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

// first cell range
// not less than, if too many figs
// Math.max(1, figsAvailable.length - maxFigsPerCell * 2),
// minus 2 - to keep at least 1&1 for rest 2 columns
// Math.min(figsAvailable.length - 2, maxFigsPerCell);

// second cell range
// not less than ???, last column can handle
// Math.max(1, figsAvailable.length - maxFigsPerCell),
// minus 1 to keep at least 1 for 3rd column
// Math.min(figsAvailable.length - 1, maxFigsPerCell);

export function generateColRowSumMatrix({ random, config }) {
  const { colRowSum: colRowSumRaw } = config;

  const colRowSum = Number.isFinite(colRowSumRaw)
    ? colRowSumRaw
    : random.fromRange(...colRowSumRaw);

  // first row
  const cell_00 = random.fromRange(1, colRowSum - 2);

  // first row rest
  const cell_01 = random.fromRange(1, colRowSum - cell_00 - 1);
  const cell_02 = colRowSum - cell_00 - cell_01;

  //first col rest
  const cell_10 = random.fromRange(1, colRowSum - cell_00 - 1);
  const cell_20 = colRowSum - cell_00 - cell_10;

  // center cell
  const cell_11 = random.fromRange(
    Math.max(colRowSum - cell_00 - cell_01 - cell_10 + 1, 1),
    colRowSum - Math.max(cell_01, cell_10) - 1
  );

  // last middle cells
  const cell_12 = colRowSum - cell_11 - cell_10;
  const cell_21 = colRowSum - cell_11 - cell_01;

  // last cell
  const cell_22 = colRowSum - cell_02 - cell_12;

  return [
    [cell_00, cell_01, cell_02],
    [cell_10, cell_11, cell_12],
    [cell_20, cell_21, cell_22],
  ];
}

export function preGenBytes_equalSumPerRowColWrapped({ random, config }) {
  const { byteGenConfig } = config;

  const full = byteGenConfig.map(({ max }) => max);

  const figCounts = full.map((max) =>
    preGenBytes_equalSumPerRowCol({ random, config })
  );

  const result = figCounts[0].map((_, index) =>
    figCounts.map((arr) => arr[index])
  );

  return result;
}
