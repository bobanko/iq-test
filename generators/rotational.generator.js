import { getUid } from "../helpers/common.js";
import { SeededRandom } from "../helpers/random.helpers.js";

function normalizeDeg(deg) {
  return deg % 360;
}

// todo(vmyshko): gen answers/anything!
// todo(vmyshko): refac to have genFn and uniqueCheckFn only

/**
 * @deprecated use common/generateUniqueValues
 */
export function makeUnique({
  prevValuesSet,
  // maxValuesCount = 6,
  genFn,
  serializeFn = (value) => value.toString(),
  maxTriesCount = 100,
}) {
  let triesCount = 0;

  do {
    const uniqueValue = genFn();

    const serializedValue = serializeFn(uniqueValue);
    if (!prevValuesSet.has(serializedValue)) {
      prevValuesSet.add(serializedValue);
      return uniqueValue;
    }

    triesCount++;
  } while (triesCount < maxTriesCount);

  throw Error(
    `makeUnique: generation attempts reached ${triesCount}. aborting...`
  );
}

/**
 * @deprecated use generateSequenceQuestion instead,
 * it should fully cover rotational cases as well
 */
export function generateRotationalQuestion({ config, seed, questionIndex }) {
  // todo(vmyshko): use hash/uid of question as seed
  const random = new SeededRandom(seed + questionIndex);

  // todo(vmyshko): keep it here to ensure seeded random
  function getRandomDeg({ stepDeg = 45, skipZero = false }) {
    if (stepDeg === 0) return 0;
    const randomDeg =
      random.fromRange(skipZero ? 1 : 0, 360 / stepDeg - 1) * stepDeg;

    if (isNaN(randomDeg)) throw Error("getRandomDeg: bad args");

    return normalizeDeg(randomDeg);
  }

  // todo(vmyshko): make constructor for all gen helpers and init it here

  const patternsInCol = 3;
  const patternsInRow = 3;

  // gen rules
  // todo(vmyshko): make unique rules, no dupes
  // todo(vmyshko): impl currentGenConfig.noOverlap
  const rules = config.figs.map((fig) =>
    getRandomDeg({ skipZero: fig.skipZero, stepDeg: fig.stepDeg })
  );

  console.log("rules", rules);

  const rowsDeltaDegs = []; // basic rnd rotations for all figs in specific row
  const mtxDegs = []; // absolute rotations for all figs in all rows/cols

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    // row

    // todo(vmyshko): make this for each fig

    // make unique basic delta deg

    const rowDeltaDegs = makeUnique({
      genFn: () => {
        const _rowDeltaDegs = [];

        for (let fig of config.figs) {
          const randomDeg = makeUnique({
            genFn: () =>
              getRandomDeg({
                stepDeg: fig.stepDeg,
                // no skip, cause it's initial pos
                skipZero: false,
              }),
            prevValuesSet: new Set(_rowDeltaDegs),
          });

          _rowDeltaDegs.push(randomDeg);
        }

        return _rowDeltaDegs;
      },
      //flatten inner arrays
      prevValuesSet: new Set(rowsDeltaDegs.map((dd) => dd.toString())),
    });

    rowsDeltaDegs.push(rowDeltaDegs);

    // *** cols ***

    mtxDegs[rowIndex] = [];

    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      mtxDegs[rowIndex][colIndex] = [];

      config.figs.forEach((fig, figIndex) => {
        // todo(vmyshko): grab last pattern degs as answer degs
        const currentDeg = normalizeDeg(
          fig.startDeg +
            rowsDeltaDegs[rowIndex][figIndex] +
            rules[figIndex] * colIndex
        );

        mtxDegs[rowIndex][colIndex].push(currentDeg);
      }); //fig
    } //col
  } //row

  const patterns = mtxDegs
    .map((row) => row.flat())
    .flat()
    .map((deg) => ({
      degs: [deg],
      figureParts: [
        {
          color: "var(--blue)",
          figures: ["letter-t"],
          rotation: deg,
          strokeWidth: 0,
        },
      ],
    }));

  //last block
  const [correctAnswer] = patterns.splice(-1, 1, null);
  correctAnswer.isCorrect = true;
  correctAnswer.id = getUid();

  const correctDegs = mtxDegs[patternsInCol - 1][patternsInRow - 1];

  // delete correct from patterns
  mtxDegs[patternsInCol - 1][patternsInRow - 1] = null;

  // *******
  // ANSWERS
  // *******

  const usedDegsSet = new Set([correctDegs.toString()]);

  const answers = [];

  answers.push(correctAnswer);

  const defaultAnswerCount = 6;
  for (
    //skip one for correct
    let answerIndex = 1;
    answerIndex < config.answerCount ?? defaultAnswerCount;
    answerIndex++
  ) {
    // todo(vmyshko): use makeUnique if possible
    try {
      let whileCount = 0;
      do {
        whileCount++;
        if (whileCount > 100) {
          throw Error("possible infinite loop");
        }
        const currentDegs = makeUnique({
          genFn: () =>
            config.figs.map((_, index) =>
              normalizeDeg(
                correctDegs[index] +
                  getRandomDeg({
                    stepDeg: config.figs[index].stepDeg,
                    skipZero: false,
                  })
              )
            ),
          prevValuesSet: usedDegsSet,
        });

        if (
          config.noOverlap &&
          currentDegs.length !== new Set(currentDegs).size
        ) {
          continue;
        }

        answers.push({
          id: getUid(),
          degs: currentDegs,
          isCorrect: false,

          figureParts: [
            {
              color: "var(--red)",
              figures: ["letter-t"],
              rotation: currentDegs[0],
              strokeWidth: 0,
            },
          ],
        });

        break;
      } while (config.noOverlap);
    } catch (error) {
      console.warn(error);
    }
  } //answers

  //****** */

  console.log({ rowsDeltaDegs });
  console.log({ mtxDegs });
  console.log({ answers });

  // todo(vmyshko): return question data

  return {
    seed,

    patternsInRow,
    patternsInCol,

    mtxDegs, //old
    // todo(vmyshko): refac to
    patterns,
    answers,
  };
}
