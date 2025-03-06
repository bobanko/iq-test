// todo(vmyshko): make it reusable, and more hashy
export const getUid = (() => {
  let _id = 0;

  return () => `${_id++}`;
})();

/**
 *
 * @param {number} num number to clamp
 * @param {number} min min allowed value
 * @param {number} max max allowed value
 * @returns clamped value
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 *
 * @param {string} viewBox like '0 0 100 100'
 * @param {number} scaleX 0.5 is 50%, 1.5 is 150%
 * @param {number} scaleY 0.5 is 50%, 1.5 is 150%, defaults to scaleX
 * @returns scaled viewBox
 */
export function scaleViewBox(viewBox, scaleX, scaleY = scaleX) {
  const [x, y, width, height] = viewBox.split(" ").map((value) => +value);

  return [
    x + (width - width / scaleX) / 2,
    y + (height - height / scaleY) / 2,
    width / scaleX,
    height / scaleY,
  ]
    .map((value) => value.toFixed(2))
    .join(" ");
}
