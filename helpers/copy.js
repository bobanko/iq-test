export function copyTextFrom($element) {
  $element.select();
  document.execCommand("copy");
}
