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

    if (translations[langKey]?.[transKey]?.length > 0) {
      $elem.textContent = translations[langKey]?.[transKey];
    }
  });
}
