import { defaultViewBox } from "./common.config.js";
import { scaleViewBox } from "./common.js";
import { createQuestionMark } from "./common.renderer.js";
import { preventSvgCache, wait } from "./helpers.js";

function getFigureUrl({ link, id }) {
  return `${link}#${id}`;
}

async function rotateTo($elem, deg) {
  // to help user to understand rotations
  await wait(0);
  $elem.style.transform = `rotate(${deg}deg)`;
}

function createFigurePattern({ figureConfig, config }) {
  const {
    viewBox = defaultViewBox,
    color = "black",
    figureLink,
    strokeWidth = 1,
    staticFigures = [],
  } = config;

  const {
    figures = [],
    rotation = 0,
    color: figureColor,
    scaleX = 1,
    scaleY = 1,
  } = figureConfig;

  // svg as container
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true);

  $svgPatternContainer.setAttribute(
    "viewBox",
    scaleViewBox(viewBox, scaleX, scaleY)
  );

  rotateTo($svgPatternContainer, rotation);

  $svgPatternContainer.style.setProperty("--color", figureColor ?? color);
  $svgPatternContainer.style.setProperty("stroke-width", strokeWidth);

  // todo(vmyshko): impl separate coloring for each part?
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

  const questionPatterns = patterns.map((figureConfig) =>
    figureConfig
      ? createFigurePattern({ figureConfig, config })
      : createQuestionMark()
  );

  const answerPatterns = answers.map((figureConfig) => {
    const { id, isCorrect } = figureConfig;

    return {
      $pattern: createFigurePattern({ figureConfig, config }),
      id,
      isCorrect,
    };
  });

  //debug
  setTimeout(() => {
    preventSvgCache();
  }, 0);

  return { questionPatterns, answerPatterns };
}
