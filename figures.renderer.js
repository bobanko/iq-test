import { preventSvgCache } from "./helpers.js";

function getFigureUrl({ link, id }) {
  return `${link}#${id}`;
}

function createFigurePattern({ figures = [], config }) {
  const {
    viewBox = "0 0 100 100",
    color = "black",
    figureLink,
    strokeWidth = 1,
    staticFigures = [],
  } = config;

  // svg as container
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true); //fragment

  $svgPatternContainer.setAttribute("viewBox", viewBox);
  $svgPatternContainer.style.setProperty("--color", color);
  $svgPatternContainer.style.setProperty("stroke-width", strokeWidth);

  // pattern dynamic figures
  for (let figure of figures) {
    const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);
    $use.href.baseVal = getFigureUrl({ link: figureLink, id: figure });
    $svgPatternContainer.appendChild($use);
  }

  // static decoration figures from config
  for (let figure of staticFigures) {
    const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);
    $use.href.baseVal = getFigureUrl({ link: figureLink, id: figure });
    $svgPatternContainer.appendChild($use);
  }

  return $svgPatternContainer;
}

export function renderFiguresQuestion({ config, questionData, questionIndex }) {
  const { patterns, answers } = questionData;

  const questionPatterns = patterns.map(({ figures, id }) =>
    createFigurePattern({ figures, config })
  );

  const answerPatterns = answers.map(({ figures, id, isCorrect }) => ({
    $pattern: createFigurePattern({ figures, config }),
    id,
    isCorrect,
  }));

  //debug
  setTimeout(() => {
    preventSvgCache();
  }, 0);

  // todo(vmyshko): it should return question patterns too
  return { questionPatterns, answerPatterns };
}
