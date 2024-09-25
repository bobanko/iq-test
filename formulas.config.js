import { renderFormulasEmojiQuestion } from "./formulas-emoji.renderer.js";
import {
  formulaGenerators,
  generateFormulasQuestion,
} from "./formulas.generator.js";
import { renderFormulasQuestion } from "./formulas.renderer.js";

const _formulasConfigs = {
  // defaultFormula: {
  //   formulaType: "formulaTypes.random",
  //   patternsInCol: 3,
  //   // maxAnswerCount: 8,

  //   formulaGenerator: formulaGenerators.formulaGenerator,
  //   renderer: renderFormulasQuestion,
  // },

  spanishEmojiFormula: {
    formulaType: "formulaTypes.random",
    patternsInCol: 3,
    // maxAnswerCount: 8,
    formulaGenerator: formulaGenerators.formulaEmojiGenerator,
    renderer: renderFormulasEmojiQuestion,
  },
  spanishFormula: {
    formulaType: "formulaTypes.random",
    patternsInCol: 3,
    // maxAnswerCount: 8,
    formulaGenerator: formulaGenerators.formulaEmojiGenerator,
    renderer: renderFormulasQuestion,
  },
};

// todo(vmyshko): get rid of this patcher, keep everything in config obj instead
export const formulasConfigs = Object.fromEntries(
  Object.entries(_formulasConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateFormulasQuestion;
    // value.renderer = renderFormulasQuestion;

    return entry;
  })
);
