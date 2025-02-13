import { renderFormulasEmojiQuestion } from "./formulas-emoji.renderer.js";
import {
  formulaGenerators,
  generateFormulasQuestion,
} from "./formulas.generator.js";
import { renderFormulasQuestion } from "./formulas.renderer.js";

export const formulasConfigs = {
  // todo(vmyshko): fix unsolvables for this
  // defaultFormula: {
  //   formulaType: "formulaTypes.random",
  //   patternsInCol: 3,
  //   // maxAnswerCount: 8,

  //   formulaGenerator: formulaGenerators.formulaGenerator,
  //   renderer: renderFormulasQuestion,
  // },

  iq26alt_spanishEmojiFormula: {
    order: 26,
    formulaType: "formulaTypes.random",
    patternsInCol: 3,
    // maxAnswerCount: 8,
    formulaGenerator: formulaGenerators.formulaEmojiGenerator,

    renderer: renderFormulasEmojiQuestion,
    generator: generateFormulasQuestion,
  },
  //same but different renderer
  iq26alt_spanishFormula: {
    skip: true,
    order: 26,
    formulaType: "formulaTypes.random",
    patternsInCol: 3,
    // maxAnswerCount: 8,
    formulaGenerator: formulaGenerators.formulaEmojiGenerator,

    renderer: renderFormulasQuestion,
    generator: generateFormulasQuestion,
  },
};
