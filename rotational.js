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
    onlyUniqueFigs: true, // [2 and more]
    canOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },

  twoQuarters45: {
    figs: [[svgHrefs.quarter], [svgHrefs.quarter]],
    onlyUniqueFigs: false,
    degSteps: [90, 90],
  },

  //
  oneQuarter45: {
    figs: [svgHrefs.quarter],
    degSteps: [45],
  },
  oneQuarter45: {
    figs: [svgHrefs.quarter],
    degSteps: [45],
  },
  twoQuarters90: {
    figs: [svgHrefs.quarter, svgHrefs.quarter],
    degSteps: [90, 90],
  },
  // 2
};

//  1 quarter (/arrow/circle/custom) 90deg
//  2 quarters 90deg same deg
//  1 quarter 45deg
//  2 quarters 90deg diff deg (no overlap)
//  3 quarters 90deg diff deg
//  2 quarters 45deg (semi-overlap/full overlap)

const currentGenConfig = genConfigs.oneQuarter90;

function createQuestionRotational({
  figs = [],
  onlyUniqueFigs = false, // [2 and more]
  canOverlap = true, // [2 and more] figs can overlap each other - have same deg
}) {
  const questionTmpl = $tmplQuestionRotational.content.cloneNode(true); //fragment
  const $questionRotational = questionTmpl.firstElementChild;
  const $partContainer = $questionRotational.querySelector(".part-container");

  const figsUsed = [];
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

    // todo(vmyshko): simplify?
    do {
      const randomFig = pickRandom(pickFrom);
      //unique fig found
      if (!onlyUniqueFigs || !figsUsed.includes(randomFig)) {
        figsUsed.push(randomFig);
        break;
      }
    } while (onlyUniqueFigs); //true
    $use.href.baseVal = figsUsed.at(-1); //pick last

    rotateTo($svg, startDeg);

    $partContainer.appendChild($svg);
  });

  return $questionRotational;
}

function generateRotationalQuiz() {
  const colors = ["green", "red", "blue", "yellow"];
  if ($shuffleColors.checked) {
    colors.splice(0, colors.length, ...shuffle(colors));
  }

  const rowsNum = 3;
  const colsNum = 3;

  // todo(vmyshko): those who can't overlap -- rotate as pair

  // gen rules
  // todo(vmyshko): make unique rules, no dupes
  const rules = Array(4)
    .fill(null)
    .map((_) => getRandomDeg({ skipZero: true }));

  console.log("rules", rules);

  // todo(vmyshko): maybe make different question types here:
  // arrow and circle
  // quarters (multiple)
  // quarters + circle + square

  const difficulty = Number.parseInt($difficulty.value);

  rules.splice(difficulty);

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
      const $questionRotational = $baseQuestion.cloneNode(true);

      // get parts
      const parts = [
        ...$questionRotational.querySelectorAll(".rotational-part"),
      ];

      parts.slice(0, difficulty).forEach(($part, index) => {
        $part.ariaHidden = false;
        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[index]);

        // todo(vmyshko): grab last question degs as answer degs
        const currentDeg = sumDeg(deltaDegs[row][index], rules[index] * col);

        rotateTo($part, currentDeg);
      });

      // todo(vmyshko): what i need to make 1 rot-q?
      // colors order
      // parts order
      // deg order

      // 1 part?

      // className
      // color
      // deg

      $questionBlock.appendChild($questionRotational);
    } //col
  } //row

  console.log("deltaDegs", deltaDegs);

  // replace last question with ? and move it to answers
  const $correctAnswerQuestion = $questionBlock.lastChild;

  const questionMarkTmpl = $tmplQuestionMark.content.cloneNode(true); //fragment
  const $questionMark = questionMarkTmpl.firstElementChild;
  //new,old
  $questionBlock.replaceChild($questionMark, $correctAnswerQuestion);

  // ANSWERS

  // todo(vmyshko): gen answers

  const answerQuestions = [$correctAnswerQuestion];
  for (let index = 1; index < 6; index++) {
    // question

    const $questionRotational = $baseQuestion.cloneNode(true);

    // get parts
    const parts = [...$questionRotational.querySelectorAll(".rotational-part")];

    parts[0].ariaHidden = false;

    answerQuestions.push($questionRotational);
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
