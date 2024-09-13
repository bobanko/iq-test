import { preventSvgCache } from "./helpers.js";

const figureIds = [
  // todo(vmyshko): generate this shit
  "8-lines-1", //12
  "8-lines-3", //3
  "8-lines-5", //6
  "8-lines-7", //9
  "8-lines-2",
  "8-lines-4",
  "8-lines-6",
  "8-lines-8",
];

const figLink = "./images/boolean-lines/8-lines-group.svg";

function getFigureUrl({ link = figLink, index }) {
  return `${link}#${figureIds[index]}`;
}

function createFigurePattern({ figures = [] }) {
  // todo(vmyshko): is it ok to use svg as contaienr directly?
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true); //fragment

  for (let figure of figures) {
    // todo(vmyshko): create svg figs and add to it
    const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);

    $use.href.baseVal = getFigureUrl({ index: figure });

    $svgPatternContainer.appendChild($use);
  }

  return $svgPatternContainer;
}

export function renderFiguresQuestion({ config, questionData, questionIndex }) {
  const { patternsInRow, figureCount, patterns, answers } = questionData;

  // todo(vmyshko): put replace with append for fast rendering
  $patternArea.replaceChildren(); //clear

  $patternArea.style.setProperty("--size", patternsInRow);

  //

  patterns.forEach(({ figures, id }) => {
    const $figurePattern = createFigurePattern({ figures });
    $patternArea.appendChild($figurePattern);
  });

  // todo(vmyshko): this should be done (once) outside for all renderers
  // replace last pattern with ? and move it to answers
  const $correctAnswerPattern = $patternArea.lastChild;

  const patternQuestionMarkTmpl =
    $tmplPatternQuestionMark.content.cloneNode(true); //fragment
  const $patternQuestionMark = patternQuestionMarkTmpl.firstElementChild;

  $patternQuestionMark.classList.add("pattern-matrix");
  //new,old
  $patternArea.replaceChild($patternQuestionMark, $correctAnswerPattern);

  // *******
  // ANSWERS
  // *******

  const answerPatterns = answers.map(({ figures, id, isCorrect }) => {
    return {
      $pattern: createFigurePattern({ figures }),
      id,
      isCorrect,
    };
  });

  //debug
  setTimeout(() => {
    preventSvgCache();
  }, 0);

  // todo(vmyshko): it should return question patterns too
  return answerPatterns;
}
