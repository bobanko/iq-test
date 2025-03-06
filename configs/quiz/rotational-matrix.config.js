import { defaultColors } from "../common.config.js";
import { renderMatrixQuestion } from "../../renderers/matrix.renderer.js";
import { generateRotationalMatrixQuestion } from "../../generators/rotational-matrix.generator.js";

export const rotationalMatrixConfigs = {
  iq06_mtxbool_rotate: {
    order: 6,
    // one color group
    colors: defaultColors,
    cellGroups: [{ min: 2, max: 4 }],

    patternsInCol: 3,
    patternsInRow: 3,
    mtxSize: 3,

    // todo(vmyshko): impl v sequence?
    generator: generateRotationalMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
  iq4_mtxbool_rotate: {
    order: 4,
    // two by two
    colors: defaultColors,
    cellGroups: [
      { min: 2, max: 2 },
      { min: 2, max: 2 },
      // { min: 1, max: 2 },
      // { min: 1, max: 2 },
    ],

    patternsInCol: 3,
    patternsInRow: 3,
    mtxSize: 3,

    // todo(vmyshko): impl v sequence?
    generator: generateRotationalMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
};
