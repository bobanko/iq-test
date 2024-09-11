import { rotationalConfigs } from "./rotational.config.js";
import { movableMatrixConfigs } from "./movable-matrix.config.js";
import { booleanMatrixConfigs } from "./boolean-matrix.config.js";

// todo(vmyshko): config every question here? or in each type? shuffle here? no.
export const quizQuestionConfigs = Object.fromEntries([
  ...Object.entries(rotationalConfigs).filter(
    ([configName]) =>
      // todo(vmyshko): refac, move to local config? or keep here?
      // ["oneQuarter90", "twoQuarters90", "threeQuarters"].includes(configName)
      // false
      true
  ),

  ...Object.entries(booleanMatrixConfigs),

  ...Object.entries(movableMatrixConfigs),
  //.slice(0, 1),
]);
