import { colors } from "./common.config.js";
import { scaleViewBox } from "./common.js";
import { preventSvgCache, wait } from "./helpers.js";

function getFigureUrl({ link, id }) {
  return `${link}#${id}`;
}

// todo(vmyshko): move classlist to config
function createQuestionMark({ config }) {
  const $patternQuestionMark =
    $tmplPatternQuestionMark.content.firstElementChild.cloneNode(true);

  if (!config.questionMarkFigure) return $patternQuestionMark;

  // custom border frame for question-mark
  /// -----

  const {
    viewBox = "0 0 100 100",
    figureLink,
    questionMarkFigure = null,
  } = config;

  const classList = ["no-default-frame", "pattern-absolute"];

  // svg as container
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true);

  $patternQuestionMark.appendChild($svgPatternContainer);

  $svgPatternContainer.setAttribute("viewBox", viewBox);

  const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);

  $use.href.baseVal = getFigureUrl({
    link: figureLink,
    id: questionMarkFigure,
  });

  $use.style.setProperty("--color", colors.dimgray);
  $use.style.setProperty("--stroke-width", 3);

  const $svgPart = $svgPatternContainer;
  $svgPart.appendChild($use);

  //additional classes
  classList.forEach((_class) => $svgPatternContainer.classList.add(_class));

  return $patternQuestionMark;
}

function createFigurePattern({ figureConfig, config }) {
  const {
    viewBox = "0 0 100 100",
    color = "black",
    figureLink,
    staticFigures = [],
    questionMarkFigure = null,
    noRotationAnimation = false,
    scale: configScale = 1,
  } = config;

  const { figureParts, scaleX = 1, scaleY = 1 } = figureConfig;

  // svg as container
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true);

  $svgPatternContainer.setAttribute("viewBox", viewBox);

  for (let figurePart of figureParts) {
    const $svgPart = $svgPatternContainer;
    $svgPart.classList.add("pattern-figure");

    if (questionMarkFigure) {
      $svgPart.classList.add("no-default-frame");
    }

    $svgPart.setAttribute("viewBox", viewBox);

    const {
      figures = [],
      rotation = 0,
      scale = configScale,
      scaleX,
      scaleY,
      color: figureColor,
      strokeWidth,
      stroke,
      transformX,
      transformY,
    } = figurePart;

    // todo(vmyshko): impl separate coloring for each part?
    // pattern dynamic figures

    for (let figure of figures) {
      const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);

      $use.style.setProperty("--color", figureColor ?? color);
      if (strokeWidth) $use.style.setProperty("--stroke-width", strokeWidth);
      if (stroke) $use.style.setProperty("--stroke", stroke);

      (async () => {
        // to help user to understand rotations
        if (!noRotationAnimation) await wait(0);

        //scales
        if (Number.isFinite(scale))
          $use.style.setProperty("--scale", `${scale}`);
        if (Number.isFinite(scaleX))
          $use.style.setProperty("--scaleX", `${scaleX}`);
        if (Number.isFinite(scaleY))
          $use.style.setProperty("--scaleY", `${scaleY}`);

        // todo(vmyshko): do not set default values, skip setters

        $use.style.setProperty("--rotate", `${rotation}deg`);

        // calc transform origin based on viewBox
        const [x1, y1, x2, y2] = viewBox.split(" ");

        //center of viewBox
        $use.style.setProperty(
          "--transform-origin",
          `${(x2 - x1) / 2}px ${(y2 - y1) / 2}px`
        );

        if (Number.isFinite(transformX) && Number.isFinite(transformY)) {
          $use.style.setProperty(
            "--transform-origin",
            `${transformX}px ${transformY}px`
          );
        }
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

export function renderFigurePatternsQuestion({ config, questionData }) {
  const { patterns, answers } = questionData;

  const questionPatterns = patterns.map((figureConfig) =>
    figureConfig
      ? createFigurePattern({ figureConfig, config })
      : createQuestionMark({ config })
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
