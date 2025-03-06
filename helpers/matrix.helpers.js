export class Point {
  constructor({ row, col, color = null, ...rest }) {
    this.row = row;
    this.col = col;

    this.color = color;

    Object.assign(this, rest);
  }

  toString(skipColor = false) {
    const { col, row, color } = this;

    return `${skipColor ? "" : `'${color}':`}[${row},${col}]`;
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
