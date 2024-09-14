import { rotationalConfigs } from "./rotational.config.js";
import { movableMatrixConfigs } from "./movable-matrix.config.js";
import { booleanMatrixConfigs } from "./boolean-matrix.config.js";
import { booleanFiguresConfigs } from "./boolean-figures.config.js";

// todo(vmyshko): config every question here? or in each type? shuffle here? no.
export const quizQuestionConfigs = Object.fromEntries([
  // todo(vmyshko): refac, move to local config? or keep here?
  // ["oneQuarter90", "twoQuarters90", "threeQuarters"].includes(configName)

  ...Object.entries(rotationalConfigs),

  ...Object.entries(booleanFiguresConfigs),
  ...Object.entries(booleanMatrixConfigs),
  //.slice(5, 6),
  ...Object.entries(movableMatrixConfigs),
  //.slice(0, 1),
]);
