import { createQuestionMark } from "./common.renderer.js";
import { SeededRandom } from "../helpers/random.helpers.js";
import { applyValue } from "./value.renderer.js";

function createFormulaPattern({
  value = "",
  label = null,
  color = "white",
  seed,
  config,
}) {
  const $patternContainer =
    $tmplPatternFormula.content.firstElementChild.cloneNode(true);

  const classes = {
    operator: "pattern-formula-operator",
    var: "pattern-formula-variable-emoji",
    const: "pattern-formula-const",
  };

  const operators = ["+", "-", "×", "÷", "="];

  const isOperator = operators.includes(value);
  const isVar = label != null;

  $patternContainer.classList.add(
    isOperator ? classes.operator : isVar ? classes.var : classes.const
  );

  const emojiSets = [
    ["🐸", "🐹", "🦊"],
    ["🍩", "🍆", "🍑"], //food#1
    ["🥦", "🌽", "🥕"],
    ["🍉", "🍒", "🫐"],

    // todo(vmyshko): pick better animals
    // ["🐖", "🐘", "🐙"], //animals#1
    // ["🐓", "🦀", "🐻"], //animals#2
    // ["🦒", "🐧", "🦉"], //animals#3

    //random sets
    // ["👾", "🐞", "🌚"],
    // ["🐷", "🍄", "🤖"],
  ];

  // todo(vmyshko): add questionIndex to seed?
  const random = new SeededRandom(seed);

  const emojiSet = random.sample(emojiSets);

  if (!isOperator) {
    applyValue(
      $patternContainer,
      isVar ? emojiSet["xyz".indexOf(label)] : value
    );
  } else {
    applyValue($patternContainer, value);
  }

  if (!isOperator) {
    $patternContainer.classList.add(color);
  }

  return $patternContainer;
}

export function renderFormulasEmojiQuestion({ config, questionData }) {
  const { patterns, answers, seed } = questionData;

  const questionPatterns = patterns.map((pattern) =>
    pattern
      ? createFormulaPattern({ ...pattern, seed, config })
      : createQuestionMark({ classList: ["pattern-formula"] })
  );

  const answerPatterns = answers.map((pattern) => {
    const { id, isCorrect } = pattern;

    return {
      $pattern: createFormulaPattern({ ...pattern, seed, config }),
      id,
      isCorrect,
    };
  });

  return {
    questionPatterns,
    answerPatterns,
  };
}
