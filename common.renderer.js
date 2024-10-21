// todo(vmyshko): do i need this? or apply only varcolors
// ...by default? boolean-figures may be affected
export function varColor(color) {
  return `var(--${color})`;
}

export function createQuestionMark({ classList = [] } = {}) {
  const $patternQuestionMark =
    $tmplPatternQuestionMark.content.firstElementChild.cloneNode(true);
  //additional classes
  classList.forEach((_class) => $patternQuestionMark.classList.add(_class));

  return $patternQuestionMark;
}
