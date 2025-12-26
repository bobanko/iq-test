import "./meta-pixel-code.js";

/**
 * how to use:
 * 
  <button 
    data-fbq="trackCustom" 
    data-fbq-event="AddToWishlist" 
    data-fbq-params='{"product_id": "12345", "value": 99.99, "currency": "USD"}'>
    add to wishlist
  </button>

  OR

  <a 
    href="/download" 
    data-fbq="track" 
    data-fbq-event="Lead" 
    data-fbq-params='{"source": "homepage_banner"}'>
    download smth
  </a>


  # standard events
  https://developers.facebook.com/docs/meta-pixel/reference#standard-events

 */
document.addEventListener("click", function (event) {
  const $fbqEl = event.target.closest("[data-fbq]");
  if (!$fbqEl) return;

  const actionName = $fbqEl.dataset.fbq; // "track" or "trackCustom"
  const eventName = $fbqEl.dataset.fbqEvent;
  if (!eventName) return;

  let params = {};
  if ($fbqEl.dataset.fbqParams) {
    try {
      params = JSON.parse($fbqEl.dataset.fbqParams);
    } catch (err) {
      console.error("Invalid JSON in data-fbq-params", $fbqEl);
    }
  }
  console.log(`🟦 fbq`, { action: actionName, event: eventName }, params);

  // // for debug
  // event.preventDefault();
  // return;

  // send event
  if (window.fbq) {
    window.fbq(actionName, eventName, params);
  } else {
    console.warn("fbq not registered in dom");
  }
});
