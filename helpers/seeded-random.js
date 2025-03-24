const modulus = 2 ** 32; // 2^32 modulus

export function getNormalizedSeed(rawSeed01 = Math.random()) {
  if (rawSeed01 > 0 && rawSeed01 < 1) {
    return Math.floor(rawSeed01 * modulus);
  } else {
    throw Error("raw seed should be in bounds [0,1]", rawSeed01);
  }
}

export function getSeededRandom(rawSeed) {
  // Park-Miller LCG algorithm
  const a = 1664525; // multiplier
  const c = 1013904223; // increment

  if (isNaN(rawSeed)) {
    console.warn(
      `seed should be number, 0..${modulus} (2^32); provided seed: ${rawSeed}`
    );
  }

  let stateSeed = isNaN(rawSeed) ? getNormalizedSeed() : rawSeed;
  // for backward compatibility with Math.random() values
  if (rawSeed > 0 && rawSeed < 1) {
    // if math.random provided as seed
    stateSeed = getNormalizedSeed(rawSeed);
  }

  const randomFn = () => {
    stateSeed = (a * stateSeed + c) % modulus;
    return stateSeed / modulus;
  };

  // todo(vmyshko): for seed 0..1 do progrev
  // todo(vmyshko): to fig rng first pseudo random results
  // randomFn(), randomFn(), randomFn(), randomFn(), randomFn();

  return randomFn;
}
