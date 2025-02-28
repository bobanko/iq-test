// todo(vmyshko): add langs

const translations = {
  EN: {
    "logo-slogan": "challenge your brain",
  },
};

export function applyTranslations() {
  const elements = document.querySelectorAll("[data-translation]");

  // todo(vmyshko): get from global
  const langKey = "EN";

  elements.forEach(($elem) => {
    const transKey = $elem.dataset.translation;

    const transString = translations[langKey]?.[transKey];
    if (transString?.length > 0) {
      $elem.textContent = transString;
      $elem.title = transString;
    }
  });
}
