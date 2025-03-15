import { createQuestionMark } from "./common.renderer.js";
import { applyValue } from "./value.renderer.js";

function createFormulaPattern({
  value = "",
  label = null,
  color = "white",
  config,
}) {
  const $patternContainer =
    $tmplPatternFormula.content.firstElementChild.cloneNode(true);

  const operators = ["+", "-", "×", "÷", "="];

  const classes = {
    operator: "pattern-formula-operator",
    var: "pattern-formula-variable",
    const: "pattern-formula-const",
  };

  const isOperator = operators.includes(value);
  const isVar = label != null;

  $patternContainer.classList.add(
    isOperator ? classes.operator : isVar ? classes.var : classes.const
  );

  applyValue($patternContainer, value);

  if (isVar) {
    $patternContainer.classList.add(color);
  }

  return $patternContainer;
}

export function renderFormulasQuestion({ config, questionData }) {
  const { patterns, answers } = questionData;

  const questionPatterns = patterns.map((pattern) =>
    pattern
      ? createFormulaPattern({ ...pattern, config })
      : createQuestionMark({ classList: ["pattern-formula"] })
  );

  const answerPatterns = answers.map((pattern) => {
    const { id, isCorrect } = pattern;
    return {
      $pattern: createFormulaPattern({ ...pattern, config }),
      id,
      isCorrect,
    };
  });

  return {
    questionPatterns,
    answerPatterns,
  };
}
