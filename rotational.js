// questions

import { wrapAnswers } from "./common.js";
import {
  fromRange,
  pickRandom,
  preventSvgCache,
  shuffle,
  wait,
} from "./helpers.js";

async function rotateTo($elem, deg) {
  // to help user to understand rotations
  await wait(0);
  $elem.style.transform = `rotate(${deg}deg)`;
}

function getRandomDeg({ stepDeg = 45, skipZero = false } = {}) {
  if (stepDeg === 0) return 0;
  const randomDeg = fromRange(skipZero ? 1 : 0, 360 / stepDeg - 1) * stepDeg;

  if (isNaN(randomDeg)) throw Error("getRandomDeg: bad args");

  return normalizeDeg(randomDeg);
}

function normalizeDeg(deg) {
  return deg % 360;
}

// todo(vmyshko): gen answers/anything!
// todo(vmyshko): refac to have genFn and uniqueCheckFn only
function makeUnique({
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

const svgHrefs = {
  quarter: "./images/clock-quarter.svg#quarter",
  circle: "./images/clock-circle.svg#circle",
  square: "./images/clock-square.svg#square",
  arrow: "./images/clock-arrow.svg#arrow",
  arrowAlt: "./images/clock-arrow-alt.svg#arrow-alt",

  //letters
  letterP: "./images/letter-p.svg#letter",
  letterU: "./images/letter-u.svg#letter",
  letterT: "./images/letter-t.svg#letter",

  // static
  pentagon: "./images/pentagon.svg#pentagon",
  hexagon: "./images/hexagon.svg#hexagon",
  hexFlake: "./images/hex-snowflake.svg#hex-snowflake",
};

const defaultColors = ["red", "green", "blue", "yellow"];

const genConfigs = {
  //  custom letters
  letters: {
    // todo(vmyshko): put colors to use, shared between figs? how?

    // todo(vmyshko):
    // each fig has colors arr, as svgs
    // ? arr should be shared between figs, if you want unique figs took once?
    // same for colors
    // fig can be fixed/static, no rule for it, for static bgs, but startDeg still applies
    // OR put static figs separately?
    // fig order applies as z-index (naturally)
    // mirroring should be avail. same as degs for each fig.

    figs: [
      {
        pickFrom: [svgHrefs.letterP, svgHrefs.letterU, svgHrefs.letterT],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
        colorsFrom: ["black", "red"],
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: false,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  //  1 quarter (/arrow/circle/custom) 90deg
  oneQuarter90: {
    figs: [
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  //  1 quarter 45deg
  oneQuarter45: {
    figs: [
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  // todo(vmyshko): rotate both figs in one direction, same deg
  //  2 quarters 90deg same deg
  // twoQuarters90sameDir: null,

  //  2 quarters 45deg (semi-overlap/full overlap)
  twoQuarters45: {
    figs: [
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  //  2 quarters 90deg diff deg (no overlap)
  twoQuarters90: {
    figs: [
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: false, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: true, // [2 and more] figs can overlap each other - have same deg
  },

  //  3 quarters 90deg diff deg
  threeQuarters90: {
    figs: [
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: true, // [2 and more] figs can overlap each other - have same deg
  },

  // 1 fig
  oneFig90: {
    figs: [
      {
        pickFrom: [svgHrefs.circle, svgHrefs.square, svgHrefs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  //  2 fig 45deg
  oneFig45: {
    figs: [
      {
        pickFrom: [svgHrefs.circle, svgHrefs.square, svgHrefs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  // clock 2
  clock4590: {
    figs: [
      {
        pickFrom: [svgHrefs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.circle, svgHrefs.square],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },
  // true clock
  twoArrowClock: {
    figs: [
      {
        pickFrom: [svgHrefs.arrowAlt],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: false,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  // clock 3
  // todo(vmyshko): redraw square/circle
  clock459090: {
    figs: [
      {
        pickFrom: [svgHrefs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.square],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  quarterFig90: {
    figs: [
      {
        pickFrom: [svgHrefs.square, svgHrefs.circle],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  pentagon: {
    figs: [
      {
        pickFrom: [svgHrefs.square, svgHrefs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 5, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },

      //static
      {
        pickFrom: [svgHrefs.pentagon],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 0, // min rotation step by rules
        skipZero: false, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  hexagon: {
    figs: [
      {
        pickFrom: [svgHrefs.square, svgHrefs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      //static
      {
        pickFrom: [svgHrefs.hexFlake],
        startDeg: 30, // initial rotation, before rules: 0, -45
        stepDeg: 0, // min rotation step by rules
        skipZero: false, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  quarterFigs15mensa: {
    figs: [
      // todo(vmyshko): maybe make kinda groups between figs, to no-overlap, unique-color, etc.
      // like a group/arr which is shared between figs, and depletes from it,
      // also it may be possible to make same for degs
      {
        pickFrom: [svgHrefs.square, svgHrefs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 15, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.square, svgHrefs.circle],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 15, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgHrefs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 15, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    shiftFigsBetweenRows: true,
    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },
};

function createQuestionRotational({
  figs = [],
  onlyUniqueFigs = false, // [2 and more]
  canOverlap = true, // [2 and more] figs can overlap each other - have same deg
}) {
  // todo(vmyshko): make proper z-indexes for figs somehow?

  const questionTmpl = $tmplQuestionRotational.content.cloneNode(true); //fragment
  const $question = questionTmpl.firstElementChild;
  const $partContainer = $question.querySelector(".part-container");

  const figsUsed = new Set();
  figs.forEach((fig) => {
    const {
      pickFrom, // pick random from inner array
      startDeg = 0, // initial rotation, before rules: 0, -45
      stepDeg = 90, // min rotation step by rules
      skipZero = true, // no zero rotation by rules
    } = fig;

    const partTmpl = $tmplRotationalPart.content.cloneNode(true); //fragment
    const $svg = partTmpl.firstElementChild;
    const $use = $svg.querySelector("use");

    try {
      const currentFig = onlyUniqueFigs
        ? makeUnique({
            prevValuesSet: figsUsed,
            genFn: () => pickRandom(pickFrom),
          })
        : pickRandom(pickFrom);

      $use.href.baseVal = currentFig;

      $partContainer.appendChild($svg);
    } catch (error) {
      console.warn(error);
    }
  });

  return $question;
}

let lastConfig = null;
function generateRotationalQuiz(config = lastConfig) {
  lastConfig = config;
  // shuffle colors for new quiz
  defaultColors.splice(0, defaultColors.length, ...shuffle(defaultColors));

  const rowsNum = 3;
  const colsNum = 3;

  // todo(vmyshko): those who can't overlap -- rotate as pair

  // gen rules
  // todo(vmyshko): make unique rules, no dupes
  // todo(vmyshko): impl currentGenConfig.noOverlap
  const rules = config.figs.map((fig) =>
    getRandomDeg({ skipZero: fig.skipZero, stepDeg: fig.stepDeg })
  );

  // todo(vmyshko): maybe make different question types here:
  // arrow and circle
  // quarters (multiple)
  // quarters + circle + square

  console.log("rules", rules);

  const correctDegs = [];

  const questionElements = [];
  const deltaDegs = [];
  const $baseQuestion = createQuestionRotational(config);
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
      prevValuesSet: new Set(deltaDegs.map((dd) => dd.toString())),
    });

    deltaDegs.push(rowDeltaDegs);

    // shuffle colors for new quiz
    defaultColors.splice(0, defaultColors.length, ...shuffle(defaultColors));

    config.figs.forEach((fig) => {
      fig.colorsFrom?.splice(
        0,
        fig.colorsFrom.length,
        ...shuffle(fig.colorsFrom)
      );
    });

    if (config.shiftColorsBetweenRows) {
      defaultColors.push(defaultColors.shift());

      config.figs.forEach((fig) => {
        fig.colorsFrom?.push(fig.colorsFrom.shift());
      });
    }

    if (config.shiftFigsBetweenRows) {
      console.log("not implemented");
      // todo(vmyshko): impl, but how?
    }

    for (let col = 0; col < colsNum; col++) {
      const $question = $baseQuestion.cloneNode(true);

      // get parts
      const parts = [...$question.querySelectorAll(".rotational-part")];

      parts.forEach(($part, index) => {
        // todo(vmyshko): shuffle colors between
        const colors = config.figs[index].colorsFrom ?? [...defaultColors];

        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[index]);

        // todo(vmyshko): grab last question degs as answer degs
        const currentDeg = normalizeDeg(
          config.figs[index].startDeg +
            deltaDegs[row][index] +
            rules[index] * col
        );

        rotateTo($part, currentDeg);

        if (row === 2 && col == 2) {
          //last question -- correct
          correctDegs.push(currentDeg);
        }
      });

      questionElements.push($question);
    } //col
  } //row

  $questionBlock.replaceChildren(...questionElements);

  // const oldEls = [...$questionBlock.children];
  // questionElements.forEach(async (elem, index) => {
  //   const oldEl = oldEls[index];

  //   // todo(vmyshko): make animation here
  //   if (oldEl) {
  //     // await oldEl.animate([{}, { opacity: "0", transform: "scale(0)" }], {
  //     //   duration: 200,
  //     //   iterations: 1,
  //     //   easing: "ease-in-out",
  //     // }).finished;

  //     oldEl.remove();
  //   }

  //   $questionBlock.appendChild(elem);

  //   // elem.animate([{ opacity: "0", transform: "scale(0)" }, {}], {
  //   //   duration: 200,
  //   //   iterations: 1,
  //   //   easing: "ease-in-out",
  //   // });
  // });

  console.log("deltaDegs", deltaDegs);
  console.log("correctDegs", correctDegs);

  // replace last question with ? and move it to answers
  const $correctAnswerQuestion = questionElements.at(-1);

  const questionMarkTmpl = $tmplQuestionMark.content.cloneNode(true); //fragment
  const $questionMark = questionMarkTmpl.firstElementChild;
  //new,old
  $questionBlock.replaceChild($questionMark, $correctAnswerQuestion);

  // *******
  // ANSWERS
  // *******

  const answerQuestions = [$correctAnswerQuestion];
  const usedDegsSet = new Set([correctDegs.toString()]);
  for (let answerIndex = 1; answerIndex < 6; answerIndex++) {
    // question

    const $question = $baseQuestion.cloneNode(true);

    // get parts
    const parts = [...$question.querySelectorAll(".rotational-part")];

    try {
      let whileCount = 0;
      do {
        whileCount++;
        if (whileCount > 100) {
          throw Error("possible infinite loop");
        }
        const currentDegs = makeUnique({
          genFn: () =>
            parts.map((_, index) =>
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
          console.log("overlap degs", currentDegs);
          continue;
        }

        parts.forEach(($part, index) => {
          const colors = config.figs[index].colorsFrom ?? [...defaultColors];
          // todo(vmyshko): apply rule? color?
          $part.classList.add(colors[index]);

          rotateTo($part, currentDegs[index]);
        });

        answerQuestions.push($question);

        break;
      } while (config.noOverlap);
    } catch (error) {
      console.warn(error);
    }
  }

  wrapAnswers({
    $answerBlock,
    answerQuestions,
    $tmplAnswer,
    $correctAnswerQuestion,
  });

  preventSvgCache();
}

$btnGenerate.addEventListener("click", () => generateRotationalQuiz());

// generateRotationalQuiz();

// init config options
Object.entries(genConfigs).map(([key, value]) => {
  const $option = document.createElement("option");

  $option.value = key;
  $option.textContent = key;

  $selectConfig.appendChild($option);
});

$selectConfig.addEventListener("change", (event) => {
  const configName = event.target.value;

  generateRotationalQuiz(genConfigs[configName]);
});

$selectConfig.dispatchEvent(new Event("change"));
