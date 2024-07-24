// questions

import { wrapAnswers } from "./common.js";
import { fromRange, pickRandom, preventSvgCache, shuffle } from "./helpers.js";

function rotateTo($elem, deg) {
  $elem.style.transform = `rotate(${deg}deg)`;
}

function getRandomDeg({ stepDeg = 45, skipZero = false } = {}) {
  const randomDeg = fromRange(skipZero ? 1 : 0, 360 / stepDeg - 1) * stepDeg;

  return randomDeg;
}

function normalizeDeg(deg) {
  return deg % 360;
}

// todo(vmyshko): gen answers/anything!
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
  arrow: "./images/clock-arrow.svg?kek#arrow",
};

const colors = ["red", "green", "blue", "yellow"];

const allFigs = [
  svgHrefs.quarter,
  svgHrefs.circle,
  svgHrefs.square,
  svgHrefs.arrow,
];

const genConfigs = {
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

      // rotateTo($svg, startDeg);

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
  colors.splice(0, colors.length, ...shuffle(colors));

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

  $questionBlock.replaceChildren();
  const deltaDegs = [];
  const $baseQuestion = createQuestionRotational(config);
  for (let row = 0; row < rowsNum; row++) {
    // row

    // todo(vmyshko): make this for each fig
    // make unique basic delta deg
    // todo(vmyshko): extract unique gen logic
    const rowDeltaDegs = [];
    for (let fig of config.figs) {
      do {
        const randomDeg = getRandomDeg({
          stepDeg: fig.stepDeg,
          skipZero: fig.skipZero,
        });

        //   check deg for unique
        if (rowDeltaDegs.includes(randomDeg)) continue;

        rowDeltaDegs.push(randomDeg);

        break;
      } while (true);
    }
    deltaDegs.push(rowDeltaDegs);

    if (config.shiftColorsBetweenRows) {
      colors.push(colors.shift());
    }

    if (config.shiftFigsBetweenRows) {
      // todo(vmyshko): impl, but how?
    }

    for (let col = 0; col < colsNum; col++) {
      const $question = $baseQuestion.cloneNode(true);

      // get parts
      const parts = [...$question.querySelectorAll(".rotational-part")];

      parts.forEach(($part, index) => {
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

      $questionBlock.appendChild($question);
    } //col
  } //row

  console.log("deltaDegs", deltaDegs);
  console.log("correctDegs", correctDegs);

  // replace last question with ? and move it to answers
  const $correctAnswerQuestion = $questionBlock.lastChild;

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
      do {
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
