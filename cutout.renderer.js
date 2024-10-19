import { getUid } from "./common.js";
import { createQuestionMark } from "./common.renderer.js";
import { preventSvgCache, wait } from "./helpers.js";

function getFigureUrl({ link, id }) {
  return `${link}#${id}`;
}

function createCutoutMask({ x, y, size, width = size, height = size }) {
  const $mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  $mask.id = "mask-" + getUid();

  $mask.innerHTML = `
    <rect x="0" y="0" width="100%" height="100%" fill="white"></rect>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="black"></rect>
    `;

  return $mask;
}

function createPatternBase({ figureConfig, config }) {
  const { figureLink, figures = [] } = config;

  // svg as container
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true);

  // add pattern figs
  for (let figure of figures) {
    const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);
    $use.href.baseVal = getFigureUrl({ link: figureLink, id: figure });
    $svgPatternContainer.appendChild($use);
  }

  return $svgPatternContainer;
}

function createQuestionPattern({ figureConfig, config }) {
  const { viewBox, figureLink, cutoutSize, figures = [] } = config;

  const { cutout } = figureConfig;

  // svg as container
  const $questionPattern = createPatternBase({ figureConfig, config });

  $questionPattern.setAttribute("viewBox", viewBox);

  // setup cutout mask
  const [x, y] = cutout;
  const $mask = createCutoutMask({ x, y, size: cutoutSize });

  $questionPattern.appendChild($mask);
  $questionPattern.style.mask = `url(#${$mask.id})`;

  //question mark

  const $questionMark = createQuestionMark({
    classList: ["pattern-figure", "m-10"],
  });

  $questionMark.style.setProperty("position", "absolute");

  $questionMark.style.setProperty("--pattern-size", `${cutoutSize}px`);
  $questionMark.style.setProperty("left", `${x}px`);
  $questionMark.style.setProperty("top", `${y}px`);

  // todo(vmyshko): fix this shit, wrap properly
  const $div = document.createElement("div");
  $div.appendChild($questionPattern);
  $div.appendChild($questionMark);
  return $div;
  //
  return $questionPattern;
}

function createAnswerPattern({ figureConfig, config }) {
  const { cutoutSize } = config;
  const { cutout } = figureConfig;

  const $answerPattern = createPatternBase({ figureConfig, config });

  const [x, y] = cutout;
  const cutoutViewBox = `${x} ${y} ${cutoutSize} ${cutoutSize}`;

  $answerPattern.setAttribute("viewBox", cutoutViewBox);

  return $answerPattern;
}

export function renderCutoutQuestion({ config, questionData, questionIndex }) {
  const { patterns, answers } = questionData;

  const questionPatterns = patterns.map((figureConfig) =>
    createQuestionPattern({ figureConfig, config })
  );

  // ANSWERS

  const answerPatterns = answers.map((figureConfig) => {
    const { id, isCorrect } = figureConfig;

    return {
      $pattern: createAnswerPattern({ figureConfig, config }),
      id,
      isCorrect,
    };
  });

  //debug
  setTimeout(() => {
    preventSvgCache();
  }, 0);

  return {
    questionPatterns,
    answerPatterns,
  };
}
