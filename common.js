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
 * @param {number} scale 0.5 is 50%, 1.5 is 150%
 * @returns scaled viewBox
 */
export function scaleViewBox(viewBox, scale) {
  const [x, y, width, height] = viewBox.split(" ").map((value) => +value);

  return [
    x + (width - width / scale) / 2,
    y + (height - height / scale) / 2,
    width / scale,
    height / scale,
  ]
    .map((value) => value.toFixed(2))
    .join(" ");
}
