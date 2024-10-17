export function createQuestionMark({ classList = [] } = {}) {
  const $patternQuestionMark =
    $tmplPatternQuestionMark.content.firstElementChild.cloneNode(true);
  //additional classes
  classList.forEach((_class) => $patternQuestionMark.classList.add(_class));

  return $patternQuestionMark;
}
