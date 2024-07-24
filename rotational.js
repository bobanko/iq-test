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

function sumDeg(deg1, deg2) {
  return (deg1 + deg2) % 360;
}

// todo(vmyshko): gen answers/anything!
function makeUnique({ genFn, prevValuesSet, serializeFn }) {
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

const colors = ["green", "red", "blue", "yellow"];

const allFigs = [
  svgHrefs.quarter,
  svgHrefs.circle,
  svgHrefs.square,
  svgHrefs.arrow,
];

const genConfigs = {
  //  1 quarter (/arrow/circle/custom) 90deg
  //  2 quarters 90deg same deg
  //  1 quarter 45deg
  //  2 quarters 90deg diff deg (no overlap)
  //  3 quarters 90deg diff deg
  //  2 quarters 45deg (semi-overlap/full overlap)

  oneQuarter90: {
    figs: [
      {
        pickFrom: [...allFigs],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ], // pick random from inner array

    sameFigsBetweenRows: true,
    sameColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    canOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  twoQuarters45: {
    figs: [[svgHrefs.quarter], [svgHrefs.quarter]],
  },

  //
  oneQuarter45: {
    figs: [svgHrefs.quarter],
  },
  oneQuarter45: {
    figs: [svgHrefs.quarter],
  },
  twoQuarters90: {
    figs: [svgHrefs.quarter, svgHrefs.quarter],
  },
  // 2
};

const currentGenConfig = genConfigs.oneQuarter90;

function createQuestionRotational({
  figs = [],
  onlyUniqueFigs = false, // [2 and more]
  canOverlap = true, // [2 and more] figs can overlap each other - have same deg
}) {
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

    const currentFig = makeUnique({
      prevValuesSet: figsUsed,
      serializeFn: (value) => toString(),
      genFn: () => pickRandom(pickFrom),
    });

    $use.href.baseVal = currentFig;

    rotateTo($svg, startDeg);

    $partContainer.appendChild($svg);
  });

  return $question;
}

function generateRotationalQuiz() {
  if ($shuffleColors.checked) {
    colors.splice(0, colors.length, ...shuffle(colors));
  }

  const rowsNum = 3;
  const colsNum = 3;

  // todo(vmyshko): those who can't overlap -- rotate as pair

  // gen rules
  // todo(vmyshko): make unique rules, no dupes

  const rules = currentGenConfig.figs.map((fig) =>
    getRandomDeg({ skipZero: fig.skipZero, stepDeg: fig.stepDeg })
  );

  // todo(vmyshko): maybe make different question types here:
  // arrow and circle
  // quarters (multiple)
  // quarters + circle + square

  const difficulty = Number.parseInt($difficulty.value);

  rules.splice(difficulty);
  console.log("rules", rules);

  const correctDegs = [];

  $questionBlock.replaceChildren();
  const deltaDegs = [];
  const $baseQuestion = createQuestionRotational(currentGenConfig);
  for (let row = 0; row < rowsNum; row++) {
    // row

    // todo(vmyshko): make this for each fig
    // make unique basic delta deg
    // todo(vmyshko): extract unique gen logic
    const rowDeltaDegs = [];
    for (let _ of rules) {
      do {
        const randomDeg = getRandomDeg();

        //   check deg for unique
        if (rowDeltaDegs.includes(randomDeg)) continue;

        rowDeltaDegs.push(randomDeg);

        break;
      } while (true);
    }
    deltaDegs.push(rowDeltaDegs);

    for (let col = 0; col < colsNum; col++) {
      const $question = $baseQuestion.cloneNode(true);

      // get parts
      const parts = [...$question.querySelectorAll(".rotational-part")];

      parts.forEach(($part, index) => {
        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[index]);

        // todo(vmyshko): grab last question degs as answer degs
        const currentDeg = sumDeg(deltaDegs[row][index], rules[index] * col);

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
      const currentDegs = makeUnique({
        genFn: () =>
          parts.map((_, index) =>
            sumDeg(
              correctDegs[index],
              getRandomDeg({
                stepDeg: currentGenConfig.figs[index].stepDeg,
                skipZero: false,
              })
            )
          ),
        prevValuesSet: usedDegsSet,
        serializeFn: (value) => value.toString(),
      });

      parts.forEach(($part, index) => {
        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[index]);

        rotateTo($part, currentDegs[index]);
      });

      answerQuestions.push($question);
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

$btnGenerate.addEventListener("click", generateRotationalQuiz);

generateRotationalQuiz();

$difficulty.addEventListener("change", () => {
  $difficultyText.textContent = `[${$difficulty.value}]`;
});

$difficulty.dispatchEvent(new Event("change"));
