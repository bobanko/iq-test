const oneDayMs = 24 * 60 * 60 * 1000;

export async function getCached({ fn, cacheKey, cacheDuration = oneDayMs }) {
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const parsedData = JSON.parse(cachedData);

      if (parsedData.timestamp) {
        const currentTime = Date.now();
        if (currentTime - parsedData.timestamp < cacheDuration) {
          // Cache is still valid, return the cached result
          console.log("Returning cached result for", cacheKey);
          return parsedData.value;
        } else {
          // Cache is expired, remove it
          console.log("Cache expired for", cacheKey);
          localStorage.removeItem(cacheKey);
        }
      } else {
        // If no timestamp, assume cache is valid
        console.log("Returning cached result (no expiration) for", cacheKey);
        return parsedData;
      }
    } catch (error) {
      // Handle JSON parsing errors
      console.error("Error parsing cached data:", error.message);
      localStorage.removeItem(cacheKey); // Remove invalid cache
    }
  }

  //no cache

  try {
    console.log(
      `no cache for fn:'${fn.name}', key:[${cacheKey}], getting results...`
    );
    const fnResult = await fn();

    // Step 4: Cache the result in localStorage with a timestamp
    const cacheEntry = {
      value: fnResult,
      timestamp: Date.now(), // Add timestamp for cache expiration
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    console.log("Result cached for", cacheKey);

    // Return the result
    return fnResult;
  } catch (error) {
    // Handle errors during function execution or caching
    console.error("Error executing function or caching result:", error.message);
    throw error; // Re-throw the error for the caller to handle
  }
}
