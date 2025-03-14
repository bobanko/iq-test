// Test 1: Same string produces same hash (deterministic)
const hash1 = stringToHash("hello");
const hash2 = stringToHash("hello");
console.assert(
  hash1 === hash2,
  "Test 1 Failed: Hash should be consistent for same input"
);
console.log("Test 1 Passed: Same string hash =", hash1);

// Test 2: Different strings produce different hashes
const hashHello = stringToHash("hello");
const hashWorld = stringToHash("world");
console.assert(
  hashHello !== hashWorld,
  "Test 2 Failed: Different strings should have different hashes"
);
console.log("Test 2 Passed: 'hello' =", hashHello, "'world' =", hashWorld);

// Test 3: Empty string produces a valid hash (0)
const hashEmpty = stringToHash("");
console.assert(hashEmpty === 0, "Test 3 Failed: Empty string should hash to 0");
console.log("Test 3 Passed: Empty string hash =", hashEmpty);

// Test 4: Single character produces a valid hash
const hashA = stringToHash("a");
console.assert(
  hashA === 97,
  "Test 4 Failed: 'a' should hash to its char code (97)"
);
console.log("Test 4 Passed: 'a' hash =", hashA);

// Test 5: Hash is always positive
const hashNegativeTest = stringToHash("test");
console.assert(
  hashNegativeTest >= 0,
  "Test 5 Failed: Hash should always be positive"
);
console.log("Test 5 Passed: 'test' hash =", hashNegativeTest);

// Test 6: Case sensitivity
const hashLower = stringToHash("Hello");
const hashUpper = stringToHash("HELLO");
console.assert(
  hashLower !== hashUpper,
  "Test 6 Failed: Case should affect hash"
);
console.log("Test 6 Passed: 'Hello' =", hashLower, "'HELLO' =", hashUpper);

// Test 7: Special characters
const hashSpecial = stringToHash("@#$%");
console.assert(
  typeof hashSpecial === "number" && hashSpecial >= 0,
  "Test 7 Failed: Special chars should produce valid hash"
);
console.log("Test 7 Passed: '@#$%' hash =", hashSpecial);
