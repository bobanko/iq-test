import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";
import { colors } from "./common.config.js";

const defaultPatternCount = { patternsInCol: 3, patternsInRow: 3 };
// todo(vmyshko): refac to reuse same code? only yield differs (mostly)
export const shuffleTypes = {
  /**
   * single for all cols/rows but basically random
   * @param {*} param0
   * @returns same item for all rows/cols but basically random
   */
  single: ({ items }) =>
    function* ({ random, config }) {
      const { patternsInCol, patternsInRow } = {
        ...defaultPatternCount,
        ...config,
      };

      const shuffledItems = random.shuffle(items);

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield shuffledItems.at(0);
        }
      }
    },
  /**
   * returns same item for same row
   * @example row1: [A, A, A];
   *          row2: [B, B, B];
   *          row3: [C, C, C];
   * @returns same item for same row
   */
  rowProgression: ({ items }) =>
    function* rowProgression({ random, config }) {
      const { patternsInCol, patternsInRow } = {
        ...defaultPatternCount,
        ...config,
      };

      const shuffledItems = random.shuffle(items);

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield shuffledItems[rowIndex % shuffledItems.length];
        }
      }
    },
  /**
   * returns same item for same col
   * @example row1: [A, B, C];
   *          row2: [A, B, C];
   *          row3: [A, B, C];
   */
  colProgression: ({ items }) =>
    function* colProgression({ random, config }) {
      const { patternsInCol, patternsInRow } = {
        ...defaultPatternCount,
        ...config,
      };

      const shuffledItems = random.shuffle(items);

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield shuffledItems[colIndex % shuffledItems.length];
        }
      }
    },

  // todo(vmyshko): impl truly random!11
  /**
   * truly random, items can repeat in row/col
   */

  /**
   *
   * @returns random unique items per row, rows can repeat
   * @example
   * [A, B, C]
   * [B, C, A]
   * [B, C, A]
   */
  randomInRow: ({ items }) =>
    function* randomInRow({ random, config }) {
      // todo(vmyshko): impl
      const { patternsInCol, patternsInRow } = {
        ...defaultPatternCount,
        ...config,
      };

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        const shuffledItems = random.shuffle(items);
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield shuffledItems[(rowIndex + colIndex) % shuffledItems.length];
        }
      }
    },
  /**
   *
   * @returns random unique items per col, cols can repeat
   * @example
   * [A, B, B]
   * [B, C, C]
   * [C, A, A]
   */
  randomInCol: ({ items }) =>
    function* randomInCol({ random, config }) {
      const { patternsInCol, patternsInRow } = {
        ...defaultPatternCount,
        ...config,
      };

      const colsShuffledItems = Array(patternsInCol)
        .fill(items)
        .map((items) => random.shuffle(items));

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield colsShuffledItems[colIndex][rowIndex % items.length];
        }
      }
    },

  /**
   * @returns unique sequence per each row/col
   * @example row1: [A, B, C];
   *          row2: [B, C, A];
   *          row3: [C, A, B];
   * OR
   * @example row1: [A, B, C];
   *          row2: [C, A, B];
   *          row1: [B, C, A];
   *
   */
  unique123: ({ items }) =>
    function* unique123({ random, config }) {
      const { patternsInCol, patternsInRow } = {
        ...defaultPatternCount,
        ...config,
      };

      const shuffledItems = random.shuffle(items);

      // todo(vmyshko): these should be separated
      // todo(vmyshko): ...but random should concat both
      const mainDiagIndex = ({ rowIndex, colIndex, itemsCount }) =>
        itemsCount - rowIndex + colIndex;
      const secondaryDiagIndex = ({ rowIndex, colIndex }) =>
        rowIndex + colIndex;

      const indexFn = random.sample([mainDiagIndex, secondaryDiagIndex]);

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield shuffledItems[
            indexFn({ rowIndex, colIndex, itemsCount: shuffledItems.length }) %
              shuffledItems.length
          ];
        }
      }
    },

  /**
   *
   * @returns items shifted by col/row shift
   * todo: explain this:
   *
   * rowIndex * rowShift + colIndex + colShift;
   *
   * todo: update example -- this is copy from above
   * @example rowShift = 0, colShift = 0
   *          row1: [A, B, C];
   *          row2: [A, B, C];
   *          row1: [A, B, C];
   * OR
   * @example rowShift = 1, colShift = 1
   *          row1: [1, 2, 3];
   *          row2: [2, 3, 4];
   *          row3: [3, 4, 5];
   *
   *
   */
  shiftedBy: ({ items, rowShift = 0, colShift = 0, shuffle = false }) =>
    function* shifted123({ random, config }) {
      const { patternsInCol, patternsInRow } = {
        ...defaultPatternCount,
        ...config,
      };

      const shuffledItems = shuffle ? random.shuffle(items) : [...items];

      // todo(vmyshko): these should be separated
      // todo(vmyshko): ...but random should concat both
      const mainDiagIndex = ({ rowIndex, colIndex, itemsCount }) =>
        itemsCount - rowIndex + colIndex;

      const secondaryDiagIndex = ({ rowIndex, colIndex }) =>
        rowIndex * rowShift + colIndex + colShift;

      const indexFn = secondaryDiagIndex;

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield shuffledItems[
            indexFn({ rowIndex, colIndex, itemsCount: shuffledItems.length }) %
              shuffledItems.length
          ];
        }
      }
    },

  // todo(vmyshko):  impl shifted progressions
};

function applyToMtx({ mtx, callback }) {
  for (let rowIndex = 0; rowIndex < mtx.length; rowIndex++) {
    for (let colIndex = 0; colIndex < mtx[rowIndex].length; colIndex++) {
      callback({ rowIndex, colIndex, mtx });
    } //col
  } //row
}

function applyToEachRow({ mtx, callback }) {
  for (let rowIndex = 0; rowIndex < mtx.length; rowIndex++) {
    callback({ rowIndex, mtx });
  } //row
}

function getBaseMatrix({ patternsInCol, patternsInRow, byteCount = 1 }) {
  return Array(patternsInCol)
    .fill(null)
    .map((_, row) =>
      Array(patternsInRow)
        .fill(null)
        .map((_, col) => Array(byteCount).fill(0))
    );
}

function arrGet(arr, index) {
  return Number.isInteger(index) ? arr[index % arr.length] : null;
}

export function shuffleFiguresGeneratorGeneric({ random, config }) {
  const {
    //
    patternsInCol = 3,
    patternsInRow = 3,
    preGenConfig,
    fullShuffle = false,
    shuffleRows = false,
  } = config;

  // todo(vmyshko): item count should come from config
  const mtx = getBaseMatrix({
    patternsInCol,
    patternsInRow,
    byteCount: preGenConfig.length,
  });

  // apply rules
  applyToMtx({
    mtx,
    callback: ({ rowIndex, colIndex, mtx }) => {
      preGenConfig.forEach((byteConfig, index) => {
        const { count, shifts } = byteConfig;

        const [rowShift, colShift, extraShift = 0] = shifts;

        mtx[rowIndex][colIndex][index] =
          (rowIndex * rowShift + colIndex * colShift + extraShift) % count;
      });
    },
  });

  // todo(vmyshko): maybe work with flat matrix from the begining?

  if (fullShuffle) {
    return random.shuffle(mtx.flat());
  }

  if (shuffleRows) {
    return mtx.map((row) => random.shuffle(row)).flat();
  }

  return mtx.flat();
}

/**
 * can process two var types
 * { static: "frame" } -- returns static value
 * { byteIndex: 0, from: "figs" } -- returns value by index from provided array
 */
function processVar({ variable, sets, bytes }) {
  if (variable === undefined) return null;

  if (variable.hasOwnProperty("static")) {
    return variable.static;
  } else if (variable.hasOwnProperty("byteIndex")) {
    return sets[variable.from][
      (bytes[variable.byteIndex] + (variable.shift ?? 0)) %
        sets[variable.from].length
    ];
  }
}

export function preRenderPatternGeneric({ bytes, preRenderConfig }) {
  if (bytes === null) return null;

  const { figureParts, sets } = preRenderConfig;

  const resultFigParts = figureParts.map((figurePartConfig) => {
    const { figures, ...rest } = figurePartConfig;
    // todo(vmyshko): simplify?
    const remap = Object.fromEntries([
      ...Object.entries(rest).map(([propName, value]) => {
        return [propName, processVar({ variable: value, sets, bytes })];
      }),
    ]);

    return {
      figures: figures.map((figCfg) =>
        processVar({ variable: figCfg, sets, bytes: bytes })
      ),

      ...remap,

      // color: processVar({ variable: color, sets, bytes: bytes }),
      // rotation: processVar({ variable: rotation, sets, bytes: bytes }) ?? 0,
    };
  });

  return {
    debugInfo: bytes,
    figureParts: resultFigParts,
  };
}

export function shuffleFiguresGenerator1triangles({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;

  const mtx = getBaseMatrix({ patternsInCol, patternsInRow, byteCount: 3 });

  const colorIndices = random.shuffle([0, 1, 2]);

  //rule#1
  applyToMtx({
    mtx,
    callback: ({ rowIndex, colIndex, mtx }) => {
      // todo(vmyshko): limit gen to max variations: like %colors.length etc.
      //r1 - set colors
      mtx[rowIndex][colIndex][0] = colorIndices[(colIndex + rowIndex) % 3];
      //r2 - set colors
      mtx[rowIndex][colIndex][1] = colorIndices[(colIndex + rowIndex + 1) % 3];

      //  mtx[rowIndex][colIndex][0] =
      //   figIndices[
      //     (rowIndex * rowShift + colIndex * colShift) % figIndices.length
      //   ];
      // //r2 - set colors
      // mtx[rowIndex][colIndex][1] =
      //   colorIndices[
      //     (rowIndex * rowShift + colIndex * colShift) % colorIndices.length
      //   ];

      // rotate 180 2nd row
      // mtx[rowIndex][colIndex][2] = rowIndex % 2;
    },
  });

  applyToEachRow({
    mtx,
    callback: ({ rowIndex, colIndex, mtx }) => {
      // randomize rows inside
      // mtx[rowIndex] = random.shuffle(mtx[rowIndex]);
    },
  });

  return mtx.flat();
}

function generateAnswer({ random, config }) {
  const { preGenConfig } = config;

  // todo(vmyshko): stub for not yet updated configs --remove
  if (!preGenConfig)
    return [
      random.fromRange(0, 2),
      random.fromRange(0, 2),
      0,
      // random.fromRange(1, 3),
    ];

  return preGenConfig.map((byteCfg) => {
    return random.fromRange(0, byteCfg.count - 1);
  });
}

// todo(vmyshko): this is sample for exact pre-renderer with triangles
// it can process bytes like [color1,color2,rotation] into triangles
export function preRenderPattern1trigs(patternBytes) {
  if (patternBytes === null) return null;

  //config?
  const colorsToUse = [colors.yellow, colors.blue, colors.red];
  const rotationsToUse = [0, 180];
  //

  // rules

  const [color1, color2, rotation] = patternBytes;

  return {
    debugInfo: patternBytes,
    figureParts: [
      {
        figures: ["triangle-bottom"],
        color: arrGet(colorsToUse, color1),
        rotation: arrGet(rotationsToUse, rotation),
      },
      {
        figures: ["triangle-top"],
        color: arrGet(colorsToUse, color2),
        rotation: arrGet(rotationsToUse, rotation),
      },
      {
        figures: ["diagonal"],
        rotation: arrGet(rotationsToUse, rotation),
      },
    ],
  };
}

export function generateSequenceQuestion({ config, seed, questionIndex }) {
  //
  const {
    patternsInRow = 3,
    maxAnswerCount = 6, //over 8 will not fit
    //
    preGenBytes = shuffleFiguresGeneratorGeneric,
    preRenderPattern = preRenderPatternGeneric,
    preRenderConfig,
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const patternsBytes = [
    ...preGenBytes({
      random,
      config,
    }),
  ];

  //last block
  const [correctAnswerBytes] = patternsBytes.splice(-1, 1, null);

  // *******
  // ANSWERS
  // *******

  const answersBytes = generateUniqueValues({
    existingValues: [correctAnswerBytes],
    maxValuesCount: maxAnswerCount - 1,
    generateFn: () => {
      return generateAnswer({
        correctAnswer: correctAnswerBytes,
        random,
        config,
      });
    },
    getValueHashFn: (bytes = []) => bytes.toString(),
  });

  // mark correct
  // answers.at(0).isCorrect = true;
  // delete answers.at(0).id;

  console.log(config.figureLink);

  console.log({ patternsBytes });
  console.log({ answersBytes });

  const answers = answersBytes
    .map((bytes) => preRenderPattern({ bytes, preRenderConfig }))
    .map((a) => ({ ...a, isCorrect: false, id: getUid() }));

  answers.at(0).isCorrect = true;

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    //
    patterns: patternsBytes.map((bytes) =>
      preRenderPattern({ bytes, preRenderConfig })
    ),
    answers,
  };
}
