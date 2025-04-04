export function preloadImageByLink(imageUrl) {
  return new Promise((resolve, reject) => {
    const $preloadLink = document.createElement("link");
    $preloadLink.rel = "preload";
    $preloadLink.as = "image";
    $preloadLink.href = imageUrl;

    $preloadLink.onload = () => resolve(imageUrl);
    $preloadLink.onerror = () =>
      reject(new Error(`Failed to preload link: ${imageUrl}`));

    document.head.append($preloadLink);
  });
}

export function preloadImageByImg(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => resolve(imageUrl);
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
  });
}
