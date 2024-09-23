import { generateFormulasQuestion } from "./formulas.generator.js";
import { renderFormulasQuestion } from "./formulas.renderer.js";

const _formulasConfigs = {
  defaultFormula: {
    formulaType: "formulaTypes.random",
    patternsInCol: 3,
    // maxAnswerCount: 8,
  },
};

// todo(vmyshko): get rid of this patcher, keep everything in config obj instead
export const formulasConfigs = Object.fromEntries(
  Object.entries(_formulasConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateFormulasQuestion;
    value.renderer = renderFormulasQuestion;

    return entry;
  })
);
