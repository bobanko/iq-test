// todo(vmyshko): extract dictionaries?

const translations = {
  US: {
    "logo-slogan": "challenge your brain",
    "splash-slogan-1": "You're definitely smarter than you think.",
    "splash-slogan-2": "Prove it!",
  },

  RU: {
    "logo-slogan": "Проверь, на что способен твой мозг",
    "splash-slogan-1": "Ты точно умнее, чем думаешь.",
    "splash-slogan-2": "Докажи это!",
  },

  UA: {
    "logo-slogan": "Дізнайся, на що здатен твій мозок",
    "splash-slogan-1": "Ти точно розумніший, ніж думаєш.",
    "splash-slogan-2": "Доведи це!",
  },
  ES: {
    "logo-slogan": "Descubre de qué es capaz tu cerebro",
    "splash-slogan-1":
      "Definitivamente eres más inteligente de lo que piensas.",
    "splash-slogan-2": "¡Demuéstralo!",
  },
  CN: {
    "logo-slogan": "测试你的大脑能做什么",
    "splash-slogan-1": "你绝对比你想的更聪明",
    "splash-slogan-2": "证明给你看！",
  },
  KR: {
    "logo-slogan": "당신의 뇌가 무엇을 할 수 있는지 확인해보세요",
    "splash-slogan-1": "당신은 분명 생각보다 더 똑똑합니다.",
    "splash-slogan-2": "증명해봐요!",
  },
};

export const translationLangKeys = Object.keys(translations);

export function applyTranslations(langKey = "EN") {
  const elements = document.querySelectorAll("[data-translation]");

  elements.forEach(($elem) => {
    const transKey = $elem.dataset.translation;

    const transString = translations[langKey]?.[transKey];
    if (transString?.length > 0) {
      $elem.textContent = transString;
      $elem.title = transString;
    }
  });
}
