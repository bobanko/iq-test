export function createQuestionMark({ classList = [] } = {}) {
  const $patternQuestionMark =
    $tmplPatternQuestionMark.content.firstElementChild.cloneNode(true);
  //additional classes
  classList.forEach((_class) => $patternQuestionMark.classList.add(_class));

  //easter-egg
  let countdown = 10;
  $patternQuestionMark.addEventListener("click", questionMarkClick);

  function questionMarkClick() {
    countdown--;
    $patternQuestionMark.animate(
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

    const symbols = ["🖕", "🖕🏻", "🖕🏼", "🖕🏽", "🖕🏾", "🖕🏿"];

    if (countdown <= 0) {
      $patternQuestionMark.setAttribute(
        "symbol",
        symbols[(symbols.length - countdown) % symbols.length]
      );
    }
  }

  return $patternQuestionMark;
}
