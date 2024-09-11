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
