import { SeededRandom } from "../helpers/random.helpers.js";

import { makeFigureParts, maxFigsPerCell } from "./col-row-sum.generator.js";

function pickFrom({ pool, count, random }) {
  // eg: [0, 0, 0, 1, 1, 2, 2, 2, 2, 2] for [3,2,5]
  const indexPool = pool.map((count, index) => Array(count).fill(index)).flat();

  const indexPoolShuffled = random.shuffle(indexPool);

  const indexesPicked = random.popRangeFrom(indexPoolShuffled, count);

  const indexesCounts = pool.map((_, index) => {
    // todo(vmyshko): refac to use reduce to decrease O*
    return indexesPicked.filter((ip) => ip === index).length;
  });

  return indexesCounts;
}

function getCellSum(cell) {
  return cell.reduce((acc, value) => acc + value, 0);
}

export function answerGeneratorROWSUBFIGS({
  correctAnswer: correctAnswerBytes,
  random,
  config,
}) {
  const { byteGenConfig } = config;

  const full = byteGenConfig.map(({ max }) => max);

  const answerSum = getCellSum(correctAnswerBytes);

  const answerSumRange = [
    Math.max(1, answerSum - 1),
    Math.min(maxFigsPerCell, answerSum + 2),
  ];

  const answerBytes = pickFrom({
    pool: full,
    count: random.fromRange(...answerSumRange),
    random,
  });

  return answerBytes;
}

export function preGenBytesROWSUBFIGS({ random, config }) {
  // todo(vmyshko): fix - 2 zeros
  const { byteGenConfig, patternsInCol = 3 } = config;

  const full = byteGenConfig.map(({ max }) => max);

  const pool = [4, 5]; // == full

  const rows = [];

  for (let _ of Array(patternsInCol).fill(0)) {
    const cell_0 = pickFrom({
      pool: full,
      count: random.fromRange(2, maxFigsPerCell),
      random,
    });

    const cell_1 = pickFrom({
      pool: cell_0,
      count: random.fromRange(1, getCellSum(cell_0) - 1),
      random,
    });
    const cell_2 = cell_0.map((_, index) => cell_0[index] - cell_1[index]);

    const row = [cell_0, cell_1, cell_2];

    rows.push(row);
  }

  return rows.flat();
}

export function preRenderPatternROWSUBFIGS({
  bytes,
  preRenderConfig,
  random,
  config,
}) {
  if (bytes === null) return null; // for [?]

  const { figureIds } = preRenderConfig;

  const rnd = new SeededRandom(random._seed);

  const randomFigIds = rnd.shuffle(figureIds);

  const figs = bytes
    .slice(0, 2)
    .map((byte, index) => Array(byte).fill(randomFigIds[index]))
    .flat();

  return {
    debugInfo: bytes,
    figureParts: makeFigureParts({
      figures: figs,
      config,
      random,
    }),
  };

  // ----
}
