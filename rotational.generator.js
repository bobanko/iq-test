import { SeededRandom } from "./random.helpers.js";

// todo(vmyshko): make it reusable, and more hashy
const getUid = (() => {
  let _id = 0;

  return () => `${_id++}`;
})();

function normalizeDeg(deg) {
  return deg % 360;
}

// todo(vmyshko): gen answers/anything!
// todo(vmyshko): refac to have genFn and uniqueCheckFn only
export function makeUnique({
  genFn,
  prevValuesSet,
  serializeFn = (value) => value.toString(),
}) {
  const maxLoopCount = 100;
  let loopCount = 0;
  do {
    const uniqueValue = genFn();

    const serializedValue = serializeFn(uniqueValue);
    if (!prevValuesSet.has(serializedValue)) {
      prevValuesSet.add(serializedValue);
      return uniqueValue;
    }

    loopCount++;
  } while (loopCount < maxLoopCount);

  throw Error(
    `makeUnique: generation attempts reached ${loopCount}. aborting...`
  );
}

export function generateRotationalQuestion({ config, seed }) {
  const random = new SeededRandom(seed);

  // todo(vmyshko): keep it here to ensure seeded random
  function getRandomDeg({ stepDeg = 45, skipZero = false }) {
    if (stepDeg === 0) return 0;
    const randomDeg =
      random.fromRange(skipZero ? 1 : 0, 360 / stepDeg - 1) * stepDeg;

    if (isNaN(randomDeg)) throw Error("getRandomDeg: bad args");

    return normalizeDeg(randomDeg);
  }

  console.log("🍀 generation seed", { seed, config });
  // todo(vmyshko): make constructor for all gen helpers and init it here

  const rowsNum = 3;
  const colsNum = 3;

  // gen rules
  // todo(vmyshko): make unique rules, no dupes
  // todo(vmyshko): impl currentGenConfig.noOverlap
  const rules = config.figs.map((fig) =>
    getRandomDeg({ skipZero: fig.skipZero, stepDeg: fig.stepDeg })
  );

  console.log("rules", rules);

  const correctDegs = [];
  const rowsDeltaDegs = []; // basic rnd rotations for all figs in specific row
  const mtxDegs = []; // absolute rotations for all figs in all rows/cols

  for (let row = 0; row < rowsNum; row++) {
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

    mtxDegs[row] = [];

    for (let col = 0; col < colsNum; col++) {
      mtxDegs[row][col] = [];

      config.figs.forEach((fig, figIndex) => {
        // todo(vmyshko): grab last pattern degs as answer degs
        const currentDeg = normalizeDeg(
          fig.startDeg + rowsDeltaDegs[row][figIndex] + rules[figIndex] * col
        );

        mtxDegs[row][col].push(currentDeg);

        if (row === 2 && col == 2) {
          //last pattern -- correct
          correctDegs.push(currentDeg);
        }
      }); //fig
    } //col
  } //row

  // *******
  // ANSWERS
  // *******

  const usedDegsSet = new Set([correctDegs.toString()]);

  const answers = [];

  const correctAnswer = {
    id: getUid(),
    degs: correctDegs,
    isCorrect: true,
  };

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
    rowsNum,
    colsNum,
    config,

    mtxDegs,
    answers,
    correctAnswer,
  };
}
