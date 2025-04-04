import { colors, defaultViewBox } from "../configs/common.config.js";
import { wait } from "../helpers/helpers.js";
import { applyEaster } from "./common.renderer.js";

function getFigureUrl({ link, id }) {
  return `${link}#${id}`;
}

// todo(vmyshko): move classlist to config
function createQuestionMark({ config }) {
  const $patternQuestionMark =
    $tmplPatternQuestionMark.content.firstElementChild.cloneNode(true);

  applyEaster($patternQuestionMark);

  if (!config.questionMarkFigure) return $patternQuestionMark;

  // custom border frame for question-mark
  /// -----

  const {
    viewBox = defaultViewBox,
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

  $use.style.setProperty("--fill", colors.dimgray);
  $use.style.setProperty("--stroke-width", 3);

  const $svgPart = $svgPatternContainer;
  $svgPart.appendChild($use);

  //additional classes
  classList.forEach((_class) => $svgPatternContainer.classList.add(_class));

  return $patternQuestionMark;
}

function createFigurePattern({ figureConfig, config }) {
  const {
    viewBox = defaultViewBox,
    //!
    color = "transparent",
    styles = {},
    strokeWidth,
    figureLink,
    staticFigures = [],
    questionMarkFigure = null,
    noRotationAnimation = false,
    scale: configScale = 1,
  } = config;

  const { figureParts, scaleX = 1, scaleY = 1, debugInfo = "∅" } = figureConfig;

  // svg as container
  const $svgPatternContainer =
    $tmplPatternFigure.content.firstElementChild.cloneNode(true);

  $svgPatternContainer.setAttribute("viewBox", viewBox);
  // apply styles
  Object.entries(styles).forEach(([key, value]) => {
    $svgPatternContainer.style.setProperty(key, value);
  });

  for (let figurePart of figureParts) {
    const $svgPart = $svgPatternContainer;

    if (questionMarkFigure) {
      $svgPart.classList.add("no-default-frame");
    }

    $svgPart.setAttribute("viewBox", viewBox);

    // todo(vmyshko): make generic? or exclude props if null
    const {
      figures = [],
      rotation = 0,
      scale = configScale,
      scaleX,
      scaleY,
      color: figureColor,
      strokeWidth: figureStrokeWidth,
      stroke,
      transformX,
      transformY,
      ...rest
    } = figurePart;

    // todo(vmyshko): impl separate coloring for each part?
    // pattern dynamic figures

    for (let figure of figures) {
      const $use = $tmplSvgUse.content.querySelector("use").cloneNode(true);

      $use.style.setProperty("--color", figureColor ?? color);
      if (figureStrokeWidth)
        $use.style.setProperty(
          "--stroke-width",
          figureStrokeWidth ?? strokeWidth
        );
      if (stroke) $use.style.setProperty("--stroke", stroke);

      (async () => {
        // todo(vmyshko): rename to noTransitions cause it impacts all transitions, not only rotation
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

        Object.entries(rest).map(([propName, value]) => {
          $use.style.setProperty(propName, value);
        });

        // calc transform origin based on viewBox
        const [x1, y1, x2, y2] = viewBox.split(" ");

        //center of viewBox

        const centerX = (x2 - x1) / 2;
        const centerY = (y2 - y1) / 2;

        $use.style.setProperty(
          "--transform-origin",
          `${centerX.toFixed(2)}px ${centerY.toFixed(2)}px`
        );

        if (Number.isFinite(transformX) && Number.isFinite(transformY)) {
          $use.style.setProperty(
            "--transform-origin",
            `${transformX.toFixed(2)}px ${transformY.toFixed(2)}px`
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

  const $debugText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  $debugText.classList.add("debug-info");
  $debugText.textContent = debugInfo;
  $svgPatternContainer.appendChild($debugText);

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

  return { questionPatterns, answerPatterns };
}
