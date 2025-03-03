import { getHash, setHash } from "./hash-param.js";
import { getSafeIndex, SeededRandom } from "./helpers.js";
import { Timer } from "./timer.js";

import { loadStats } from "./stats-results.js";
import { countries, emojiFlags } from "./countries.mapping.js";
import {
  applyTranslations,
  translationLangKeys,
} from "./translation.helper.js";
import { appConfig } from "./app.config.js";
import { getCached } from "./local-cache.helper.js";

// handle menu item highlights
const menuItems = $navMenu.querySelectorAll("a");
function onHashChanged() {
  const pageHash = getHash();

  if (pageHash === "") {
    //select first?
    // const miHash = menuItems[0].getAttribute("href").substring(1);
    // setHash(miHash);
    return;
  }

  menuItems.forEach((mi) => {
    const miHash = mi.getAttribute("href").substring(1);

    mi.classList.toggle("selected", pageHash === miHash);
  });
}

window.addEventListener("hashchange", onHashChanged);
window.addEventListener("load", onHashChanged);

function initSlider() {
  const slides = Array.from({ length: 9 }, (_, index) => {
    const $imgSlide = document.createElement("img");

    const imgName = index.toString().padStart(2, 0);

    $imgSlide.src = `./images/app-preview/${imgName}.png`;

    return $imgSlide;
  });

  slides.forEach(($imgSlide) => $appPreviewSlider.appendChild($imgSlide));

  const timer = new Timer({ intervalMs: 5000 });

  const slideCount = slides.length;
  let currentSlideIndex = 0;

  timer.onUpdate((diff) => {
    currentSlideIndex = getSafeIndex({
      length: slideCount,
      index: currentSlideIndex + 1,
    });

    slides.forEach(($imgSlide) => $imgSlide.classList.remove("active"));
    slides[currentSlideIndex].classList.add("active");

    const date = new Date();
    $phoneClock.textContent = `${date.getHours()}:${date.getMinutes()}`;
  });

  timer.start();
}

initSlider();

const mockNames = [
  "Belyash",
  "Mukola",
  "yana",
  "Margosha30",
  "Володимир",
  "Світлана",
  "helenhlu",
  "kek",
  "kirayoha",
];

const random = new SeededRandom(Date.now());

const countryCodes = Object.keys(countries);

const getRandomDate = () => new Date(174e10 + random.fromRange(0, 9e9));

const data_results_recent = Array.from({ length: 10 }, (_) => {
  const randomCountryCode = random.sample(countryCodes);

  return {
    name: random.sample(mockNames),
    countryCode: randomCountryCode,
    value: random.fromRange(60, 140),
    date: getRandomDate(),
  };
});

const currentCountryCode = random.sample(countryCodes);

document.querySelectorAll("[data-id=current_country]").forEach(($elem) => {
  $elem.textContent = countries[currentCountryCode];
  $elem.title = countries[currentCountryCode];
});

const data_results_current = Array.from({ length: 10 }, (_) => {
  return {
    name: random.sample(mockNames),
    countryCode: currentCountryCode,
    value: random.fromRange(60, 140),
    date: getRandomDate(),
  };
});

const data_results_perCountry = Array.from({ length: 10 }, (_) => {
  const randomCountryCode = random.sample(countryCodes);

  return {
    name: countries[randomCountryCode],
    countryCode: randomCountryCode,
    value: random.fromRange(60, 140),
    // no date
  };
});

// -----

const { locale: defaultLocale } = Intl.DateTimeFormat().resolvedOptions();

loadStats({
  $container: $results_recent,
  data: data_results_recent,
  locale: defaultLocale,
});
loadStats({
  $container: $results_currentCountry,
  data: data_results_current,
  locale: defaultLocale,
});
loadStats({
  $container: $results_perCountry,
  data: data_results_perCountry,
  locale: defaultLocale,
});

// location

function fetchClientIpInfo() {
  return fetch(
    `https://api.ipregistry.co/?key=${appConfig.ipRegistryKey}`
  ).then((response) => response.json());
}

// page init
{
  const ipInfo = await getCached({
    fn: fetchClientIpInfo,
    cacheKey: "client-ip-info",
  });

  console.log(ipInfo);
  // const countryCode = "UA";
  const countryCode = ipInfo.location.country.code;

  // switchLang(countryCode);
}

// lang menu

function switchLang(countryCode) {
  $langFlag.textContent = emojiFlags[countryCode];
  $langCountryCode.textContent = countryCode;

  applyTranslations(countryCode);
}

function toggleLangMenu(open = $btnLangClose.hidden) {
  $navMenu.hidden = open;
  $btnBurgerMenu.hidden = open;

  $btnLangClose.hidden = !open;
  $popupMenu.hidden = !open;
  $mobileMenuOverlay.hidden = !open;
}

$btnLangMenu.addEventListener("click", () => toggleLangMenu(true));
$btnBurgerMenu.addEventListener("click", () => toggleLangMenu(true));

$btnLangClose.addEventListener("click", () => toggleLangMenu(false));
$mobileMenuOverlay.addEventListener("click", () => toggleLangMenu(false));

$mobileNavPopupMenuList.addEventListener("click", () => toggleLangMenu(false));

function createBtnLang({ countryCode }) {
  const $resultItem = $tmplBtnLang.content.firstElementChild.cloneNode(true);

  const $itemCountry = $resultItem.querySelector(".icon-emoji");
  $itemCountry.textContent = emojiFlags[countryCode];

  const $itemName = $resultItem.querySelector(".button-text");
  $itemName.textContent = countryCode;

  return $resultItem;
}

function loadLanguages({ $container, data, callbackFn }) {
  data.forEach((itemData) => {
    const $resultItem = createBtnLang(itemData);

    $resultItem.addEventListener("click", () => callbackFn(itemData));

    $container.appendChild($resultItem);
  });
}

const langsCountryCodes = translationLangKeys.map((key) => ({
  countryCode: key,
}));

window.addEventListener("load", () => {
  loadLanguages({
    $container: $navLangItemList,
    data: langsCountryCodes,
    callbackFn: ({ countryCode }) => {
      switchLang(countryCode);
      toggleLangMenu(false);
    },
  });

  $formContact.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData($formContact);

    const email = formData.get("email");
    const subject = formData.get("subject");
    const name = formData.get("name");
    const message = formData.get("message");

    window.open(`mailto:${email}?subject=${subject}&body=${name}: ${message}`);
  });
});
