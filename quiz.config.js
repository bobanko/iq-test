import { rotationalConfigs } from "./rotational.config.js";
import { movableConfigs } from "./movable-matrix.config.js";

// todo(vmyshko): config every question here? or in each type? shuffle here? no.
export const quizQuestionConfigs = Object.fromEntries([
  ...Object.entries(rotationalConfigs).filter(([configName]) =>
    // todo(vmyshko): refac, move to local config? or keep here?
    ["oneQuarter90", "twoQuarters90", "threeQuarters"].includes(configName)
  ),
  ...Object.entries(movableConfigs),
]);

// todo(vmyshko):
// somehow keep only enabled questions from list, or filter by name?

const questionTypes = [
  // rotationals

  "oneQuarter90", //1
  "oneFig90", //1

  "letters45", //1.2
  "oneQuarter45", //1.2
  "oneFig45", //1.2

  "pentagon", //1.25
  "hexagonCircle", //1.25
  "hexagonSector1", //1.25

  "twoQuarters90", //2
  "quarterFig90", //2
  "hexagonSector2", //2.1

  "twoQuarters45", //2.2
  "clock4590", //2.2
  "twoArrowClock", //2.2

  "clock459090", //3
  "hexagonSector3", //3
  "triadSector", //3

  "threeQuarters", //3.2 hard

  "quarterFigs15mensa", //???

  // move matrix
];
