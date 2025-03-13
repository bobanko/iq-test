/**
 * if index goes out of range, it starts from beginning, and vise-versa
 * @param {Object} parameters
 * @param {number} parameters.length total safe range length (from 0 to length)
 * @param {number} parameters.index that is possible out of range's bounds [0..length]
 * @returns safe index in range from 0 to length-1
 *
 * to check validity!
 * @example getSafeIndex({length: 5, index: 6}) => 1
 * @example getSafeIndex({length: 5, index: -2}) => 3
 * @example getSafeIndex({length: 5, index: -6}) => 4
 */

export function getSafeIndex({ length, index }) {
  return ((index % length) + length) % length;
}
/**
 * gets item by index from array, if index is greater than array.length,
 * it will continue count it from the beginning;
 * if index is lower - it starts from end of array and goes down
 * @param {Object} parameters
 * @param {number} parameters.array to take item from
 * @param {number} parameters.index that is possible out of array's bounds [0..array.length]
 * @returns item from array
 */

export function getSafeAt({ array, index }) {
  return array.at(index % array.length);
}
