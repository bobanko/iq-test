import { analytics, logEvent } from "./endpoints/firebase.init.js";

/**
 * how to use:
 *
  <button
    data-ga="start_quiz"
    data-ga-params='{"source": "landing_header"}'>
    start test
  </button>

  OR

  <a
    href="./quiz.html"
    data-ga="open_discord"
    data-ga-params='{"source": "footer"}'>
    discord
  </a>

  # GA4 events reference
  https://developers.google.com/analytics/devguides/collection/ga4/reference/events

 */
document.addEventListener("click", function (event) {
  const $gaEl = event.target.closest("[data-ga]");
  if (!$gaEl) return;

  const eventName = $gaEl.dataset.ga;
  if (!eventName) return;

  let params = {};
  if ($gaEl.dataset.gaParams) {
    try {
      params = JSON.parse($gaEl.dataset.gaParams);
    } catch (err) {
      console.error("Invalid JSON in data-ga-params", $gaEl);
    }
  }
  console.log(`📊 ga`, { event: eventName }, params);

  logEvent(analytics, eventName, params);
});
