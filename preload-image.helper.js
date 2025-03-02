export function preloadImageByLink(imageUrl) {
  const $preloadLink =
    $tmplPreloadLink.content.firstElementChild.cloneNode(true);

  $preloadLink.href = imageUrl;

  document.head.append($preloadLink);
}

export function preloadImageByImg(imageUrl) {
  const img = new Image();
  img.src = imageUrl;

  // Optional: Handle load/error events
  img.onload = () => console.log("Image loaded:", imageUrl);
  img.onerror = () => console.error("Error loading:", imageUrl);
}
