export class Point {
  constructor({ row, col, color = null }) {
    this.row = row;
    this.col = col;

    this.color = color;
  }

  toString() {
    const { col, row, color } = this;

    return `'${color}':[${row},${col}];`;
  }
}

export function getPossibleMatrixCells(mtxSize) {
  return Array(mtxSize)
    .fill(null)
    .map((_, row) =>
      Array(mtxSize)
        .fill(null)
        .map((_, col) => new Point({ row, col }))
    )
    .flat();
}
