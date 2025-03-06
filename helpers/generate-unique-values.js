/**
 
 *

 */

/**
 * generates unique values
 * @param {Object} params
 * @param {*[]} params.existingValues - already existing value sets
 * @param {number} params.maxValuesCount - maximum values to be generated
 * @param {number} params.maxAttemptsCount - maximum attempts (per value) before aborting future generations
 *
 * @param {generateFn} params.generateFn - fn to generate values for set
 * @param {getValueHashFn} params.getValueHashFn - fn to check values for uniqueness-ness; .toString() by default
 * @returns array of unique values
 */
export function generateUniqueValues({
  existingValues = [],
  maxValuesCount = 1,
  maxAttemptsCount = 100,
  generateFn,
  getValueHashFn = (value) => value.toString(),
}) {
  const generatedValues = [];

  const hashes = new Set(existingValues.map(getValueHashFn));

  // todo(vmyshko): calc total attempts for statistics?
  let attemptsCount = 0;

  do {
    const attemptValue = generateFn();

    const attemptHash = getValueHashFn(attemptValue);
    if (hashes.has(attemptHash)) {
      attemptsCount++;
      // existing value -- continue attempts...
      continue;
    }
    // value is unique, add & save hash
    generatedValues.push(attemptValue);
    hashes.add(attemptHash);
    ``;
    // reset attempts for next value
    attemptsCount = 0;
  } while (
    attemptsCount < maxAttemptsCount &&
    generatedValues.length < maxValuesCount
  );

  if (attemptsCount > 0) {
    console.log(
      `🎲 generated ${generatedValues.length} of ${maxValuesCount}, 
      by ${attemptsCount} of ${maxAttemptsCount} attempts`
    );
  }

  return [...existingValues, ...generatedValues];
}
