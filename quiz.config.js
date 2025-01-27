import { rotationalConfigs } from "./rotational.config.js";
import { movableMatrixConfigs } from "./movable-matrix.config.js";
import { booleanMatrixConfigs } from "./boolean-matrix.config.js";
import { booleanFiguresConfigs } from "./boolean-figures.config.js";
import { numberProgressionConfigs } from "./number-progressions.config.js";
import { shuffleFiguresConfigs } from "./shuffle-figures.config.js";
import { formulasConfigs } from "./formulas.config.js";
import { resizableConfigs } from "./resizable.config.js";
import { cutoutConfigs } from "./cutout.config.js";
import { cropFiguresConfigs } from "./crop-figures.config.js";
import { colRowSumFiguresConfigs } from "./col-row-sum.config.js";

// todo(vmyshko): config every question here? or in each type? shuffle here? no.
export const quizQuestionConfigs = Object.fromEntries([
  // todo(vmyshko): refac, move to local config? or keep here?

  ...Object.entries(colRowSumFiguresConfigs),
  ...Object.entries(cropFiguresConfigs),
  ...Object.entries(cutoutConfigs),

  ...Object.entries(shuffleFiguresConfigs),
  ...Object.entries(resizableConfigs),

  ...Object.entries(formulasConfigs),
  ...Object.entries(numberProgressionConfigs),
  ...Object.entries(booleanFiguresConfigs),
  ...Object.entries(booleanMatrixConfigs),
  ...Object.entries(rotationalConfigs),
  ...Object.entries(movableMatrixConfigs),
]);
