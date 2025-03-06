import { createQuestionMark } from "./common.renderer.js";

export function applyValue($elem, value) {
  $elem.innerHTML = `<span>${value}</span>`;
}

function createValuePattern({ pattern, config }) {
  const { value } = pattern;
  const { color = "black" } = config;

  const $patternContainer =
    $tmplPatternValue.content.firstElementChild.cloneNode(true);

  applyValue($patternContainer, value);

  $patternContainer.style.setProperty("--color", color);

  return $patternContainer;
}

export function renderValuesQuestion({ config, questionData }) {
  const { patterns, answers } = questionData;

  const questionPatterns = patterns.map((pattern) =>
    pattern ? createValuePattern({ pattern, config }) : createQuestionMark()
  );

  const answerPatterns = answers.map(({ value, id, isCorrect }) => {
    return {
      $pattern: createValuePattern({ pattern: { value }, config }),
      id,
      isCorrect,
    };
  });

  return { questionPatterns, answerPatterns };
}
