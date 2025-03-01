import { translations } from "./translations.js";

export const translationLangKeys = Object.keys(translations);

const defaultLangKey = translationLangKeys.at(0); // "US";

export function applyTranslations(langKey = defaultLangKey) {
  const elements = document.querySelectorAll("[data-translation]");

  elements.forEach(($elem) => {
    const transKey = $elem.dataset.translation;

    const translatedText = translations[langKey]?.[transKey];
    const hasTranslation = translatedText?.length > 0;

    if (!hasTranslation) return;

    if ($elem.dataset.translationAttr) {
      $elem.setAttribute($elem.dataset.translationAttr, translatedText);
    } else {
      $elem.textContent = translatedText;
    }
  });
}
