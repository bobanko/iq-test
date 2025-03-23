// todo(vmyshko): all logical ops could be done with binaries
// example
// convert from binary and do bitwise ops:
// parseInt('0111',2) &~ parseInt('1001',2) => 6
// from dec to binary
// (6).toString(2).padStart(4,'0')
// '0110'
// each binary digit can be mapped to corresponding figure

/**
 * @param {number} value decimal value
 * @returns non-zero bit indexes
 */
function toBitIndexes(value) {
  return value
    .toString(2)
    .split("")
    .reverse()
    .reduce((acc, value, i) => (value > 0 ? [...acc, i] : acc), []);
}

export function preGenBytesBOOLEAN({ random, config }) {
  //gen bytes

  const {
    //
    patternsInCol = 3,
    patternsInRow = 3,
    byteGenConfig,
  } = config;

  // todo(vmyshko): this is bad, rewrite config
  const { max: colRowSum } = byteGenConfig.at(0);

  ///------------

  function removeItemFromArray(item, array) {
    const index = array.indexOf(item);

    if (index < 0) return;
    array.splice(index, 1);
  }

  const uniqueValues = random.shuffle(
    Array.from({ length: colRowSum }, (_, index) => index)
  );
  removeItemFromArray(0, uniqueValues);

  // todo(vmyshko): do we need this unique logic at all?
  // todo(vmyshko): make it configurable?

  // 6 is total popped count (below: 4pops 2removes)
  if (uniqueValues.length < 6) {
    console.error("not enough combinations to fill patterns");
  }
  // first row
  const cell_00 = uniqueValues.pop();

  // first row rest
  const cell_01 = uniqueValues.pop();
  const cell_02 = cell_00 ^ cell_01;
  removeItemFromArray(cell_02, uniqueValues);

  //first col rest
  const cell_10 = uniqueValues.pop();
  const cell_20 = cell_00 ^ cell_10;
  removeItemFromArray(cell_20, uniqueValues);

  // center cell
  const cell_11 = uniqueValues.pop();

  // last middle cells
  const cell_12 = cell_11 ^ cell_10;
  const cell_21 = cell_11 ^ cell_01;

  // last cell
  const cell_22 = cell_02 ^ cell_12;

  return [
    // todo(vmyshko): is it possible to get rid of arr in arr?
    [[cell_00], [cell_01], [cell_02]],
    [[cell_10], [cell_11], [cell_12]],
    [[cell_20], [cell_21], [cell_22]],
  ].flat();
}

export function preRenderPatternBOOLEAN({ bytes, preRenderConfig }) {
  if (bytes === null) return null; // for [?]
  // bytes to figureparts
  const { figureIds, color } = preRenderConfig;

  const resultFigParts = bytes
    .map(toBitIndexes)
    .map((byteIndexArr) => byteIndexArr.map((i) => figureIds[i]))
    .map((figsArr) => ({
      color,
      figures: figsArr,
    }));

  const debugBytes = bytes.map((byte) => `${byte}:[${toBitIndexes(byte)}];`);

  return {
    debugInfo: debugBytes,
    figureParts: resultFigParts,
  };
}
