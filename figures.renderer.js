import { preventSvgCache } from "./helpers.js";

function getFigureUrl({ link, index }) {
  return `${link}#${index}`;
}

function createFigurePattern({ figures = [], config }) {
  const {
    viewBox = "0 0 100 100",
    color = "black",
    figureLink,
    strokeWidth = 1,
  } = config;

  // todo(vmyshko): is it ok to use svg as contaienr directly?
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true); //fragment

  $svgPatternContainer.setAttribute("viewBox", viewBox);
  $svgPatternContainer.style.setProperty("--color", color);
  $svgPatternContainer.style.setProperty("stroke-width", strokeWidth);

  for (let figure of figures) {
    // todo(vmyshko): create svg figs and add to it
    const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);

    $use.href.baseVal = getFigureUrl({ link: figureLink, index: figure });

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
    const $figurePattern = createFigurePattern({ figures, config });
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
      $pattern: createFigurePattern({ figures, config }),
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
