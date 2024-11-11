import { scaleViewBox } from "./common.js";
import { createQuestionMark } from "./common.renderer.js";
import { preventSvgCache, wait } from "./helpers.js";

function getFigureUrl({ link, id }) {
  return `${link}#${id}`;
}

function createFigurePattern({ figureConfig, config }) {
  const {
    viewBox = "0 0 100 100",
    color = "black",
    figureLink,
    staticFigures = [],
    noDefaultFrame = false,
    noRotationAnimation = false,
    scale = 1,
  } = config;

  const { figureParts, scaleX = 1, scaleY = 1 } = figureConfig;

  // svg as container
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true);
  // const $svgPatternContainer = $svgPatternContainerDiv.firstElementChild;

  $svgPatternContainer.setAttribute(
    "viewBox",
    scaleViewBox(viewBox, scaleX, scaleY)
  );

  for (let figurePart of figureParts) {
    // const $svgPart = document.createElement("svg");
    const $svgPart = $svgPatternContainer;
    $svgPart.classList.add("pattern-figure");

    if (noDefaultFrame) {
      $svgPart.classList.add("no-default-frame");
    }

    $svgPart.setAttribute("viewBox", scaleViewBox(viewBox, scaleX, scaleY));

    const {
      figures = [],
      rotation = 0,
      // todo(vmyshko):  impl scale for each figpart?
      // scale = 1,
      color: figureColor,
      strokeWidth,
    } = figurePart;

    // todo(vmyshko): impl separate coloring for each part?
    // pattern dynamic figures

    for (let figure of figures) {
      const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);

      $use.style.setProperty("--color", figureColor ?? color);
      $use.style.setProperty("--stroke-width", strokeWidth);

      (async () => {
        // to help user to understand rotations
        if (!noRotationAnimation) await wait(0);

        $use.style.setProperty("--scale", `${scale}`);

        $use.style.setProperty("--rotate", `${rotation}deg`);

        // calc transform origin based on viewBox
        const [x1, y1, x2, y2] = viewBox.split(" ");

        $use.style.setProperty(
          "--transform-origin",
          `${(x2 - x1) / 2}px ${(y2 - y1) / 2}px`
        );
      })();

      $use.href.baseVal = getFigureUrl({ link: figureLink, id: figure });
      $svgPart.appendChild($use);
    }

    // static decoration figures from config
    for (let figure of staticFigures) {
      const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);
      $use.href.baseVal = getFigureUrl({ link: figureLink, id: figure });
      $svgPart.appendChild($use);
    }

    // $svgPatternContainer.appendChild($svgPart);
  }

  return $svgPatternContainer;
}

export function renderFigurePatternsQuestion({
  config,
  questionData,
  questionIndex,
}) {
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
