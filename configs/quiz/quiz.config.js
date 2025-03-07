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
import { rowSubFiguresConfigs } from "./row-sub-figs.config.js";
import { rotationalMatrixConfigs } from "./rotational-matrix.config.js";

// todo(vmyshko): config every question here? or in each type? shuffle here? no.
export const quizQuestionConfigs = Object.fromEntries(
  [
    // todo(vmyshko): we need logic to randomly choose diff renderers/configs for similar questions (boolFigs has samples)

    // by 4 questions each below:
    ...Object.entries(movableMatrixConfigs),
    ...Object.entries(booleanMatrixConfigs),
    ...Object.entries(booleanFiguresConfigs),
    ...Object.entries(rotationalConfigs),
    ...Object.entries(numberProgressionConfigs),
    ...Object.entries(cutoutConfigs),

    // by 1 question
    ...Object.entries(colRowSumFiguresConfigs), //1
    ...Object.entries(rowSubFiguresConfigs), //1
    ...Object.entries(resizableConfigs), //1
    ...Object.entries(formulasConfigs), //1
    // by 2 questions
    ...Object.entries(cropFiguresConfigs), //2

    ...Object.entries(rotationalMatrixConfigs), //2
    ...Object.entries(shuffleFiguresConfigs), // should be 8
  ]
    .filter(([, cfg]) => !cfg.skip)
    .sort(([, q1], [, q2]) => {
      return (q1.order || Infinity) - (q2.order || Infinity);
    }) //asc
);
