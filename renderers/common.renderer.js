export function createQuestionMark({ classList = [] } = {}) {
  const $patternQuestionMark =
    $tmplPatternQuestionMark.content.firstElementChild.cloneNode(true);
  //additional classes
  classList.forEach((_class) => $patternQuestionMark.classList.add(_class));

  applyEaster($patternQuestionMark);

  return $patternQuestionMark;
}

export function applyEaster($element) {
  //easter-egg
  let countdown = 10;
  const symbols = ["🖕", "🖕🏻", "🖕🏼", "🖕🏽", "🖕🏾", "🖕🏿"];
  $element.addEventListener("click", easterClick);

  function easterClick() {
    countdown--;
    $element.animate(
      [
        // keyframes
        { transform: "rotate(30deg)" },
        { transform: "rotate(0deg)" },
      ],
      {
        // timing options
        duration: 200,
        easing: "ease-in-out",
        iterations: 1,
      }
    );

    if (countdown <= 0) {
      $element.setAttribute(
        "symbol",
        symbols[(symbols.length - countdown) % symbols.length]
      );
    }
  }
}
