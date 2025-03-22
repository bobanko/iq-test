import { getHash, setHash } from "./helpers/hash-param.js";
import { SeededRandom } from "./helpers/random.helpers.js";
import { getSafeIndex } from "./helpers/safe-index.js";
import { Timer } from "./helpers/timer.js";
import {
  applyTranslations,
  translationLangKeys,
} from "./helpers/translation.helper.js";
import { getCached } from "./helpers/local-cache.helper.js";

import { loadStats } from "./stats-results.js";
import { countries, emojiFlags } from "./countries.mapping.js";

import {
  getResultsLast10,
  getResultsLast24hCount,
  getResultsTotalCount,
} from "./endpoints/get-stats.js";
import { getCurrentUser, signAnonUser } from "./endpoints/auth.js";
import { getUserData, updateUserData } from "./endpoints/user-data.js";
import { fetchClientIpInfo } from "./endpoints/ip-info.js";
import { calcStaticIqByStats } from "./calc-iq.js";

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

{
  window.addEventListener("hashchange", onHashChanged);
  // window.onload
  onHashChanged();
}

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

    const currentDate = new Date();
    $phoneClock.textContent = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
  "Lea",
  "Martyna",
  "Khoirunnisa",
  "saalz",
  "Andrii",
  "super hepi",
  "Loo",
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
    displayName: random.sample(mockNames),
    countryCode: currentCountryCode,
    value: random.fromRange(60, 140),
    date: getRandomDate(),
  };
});

const data_results_perCountry = Array.from({ length: 10 }, (_) => {
  const randomCountryCode = random.sample(countryCodes);

  return {
    displayName: countries[randomCountryCode],
    countryCode: randomCountryCode,
    value: random.fromRange(60, 140),
    // no date
  };
});

// -----

async function loadStatsFb() {
  const { locale: defaultLocale } = Intl.DateTimeFormat().resolvedOptions();

  //real stats

  getResultsTotalCount().then((data) => {
    $statsTotal.textContent = data;
  });

  getResultsLast24hCount().then((data) => {
    $statsLast24h.textContent = data;
  });

  const data_results_recent_stub = Array(10).fill({
    countryCode: "__",
    displayName: "...",
    value: "...",
    date: new Date(),
  });

  $results_recent.classList.add("is-loading");
  loadStats({
    $container: $results_recent,
    data: data_results_recent_stub,
    locale: defaultLocale,
  });

  getResultsLast10().then((data) => {
    const last10results = data;
    console.log({ last10results });

    const data_results_recent = last10results.map((data) => ({
      displayName: data.user?.displayName ?? "not set",
      countryCode: data.user?.countryCode ?? "__",
      value: calcStaticIqByStats(data.stats),
      date: data.datePassed.toDate(),
    }));

    loadStats({
      $container: $results_recent,
      data: data_results_recent,
      locale: defaultLocale,
    });
    $results_recent.classList.remove("is-loading");
  });

  //stubs
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
}

loadStatsFb();

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

{
  // on page load
  loadLanguages({
    $container: $navLangItemList,
    data: langsCountryCodes,
    callbackFn: ({ countryCode }) => {
      switchLang(countryCode);
      toggleLangMenu(false);
    },
  });
}

{
  const $fieldset = $formContact.querySelector("fieldset");

  await signAnonUser();

  // fill form
  $fieldset.disabled = true;

  const user = await getCurrentUser();

  const userData = (await getUserData(user.uid)) ?? {};
  const { displayName = "", email = "", subject = "", message = "" } = userData;
  const formData = { displayName, email, subject, message };

  for (let [key, value] of Object.entries(formData)) {
    const input = $formContact.elements[key];

    input.value = value ?? "";
  }

  $fieldset.disabled = false;

  $formContact.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData($formContact);
    //disabling fieldset disables formdata fields from reading
    $fieldset.disabled = true;

    const email = formData.get("email");
    const displayName = formData.get("displayName");
    const subject = formData.get("subject");
    const message = formData.get("message");

    const ipInfo = await getCached({
      fn: fetchClientIpInfo,
      cacheKey: "client-ip-info",
    });

    const userData = {
      email,
      displayName,
      subject,
      message,

      countryCode: ipInfo.location.country.code,

      ipInfo,
    };

    const user = await getCurrentUser();
    const result = await updateUserData({
      userId: user.uid,
      userData,
    });

    console.log("result", result);

    $fieldset.disabled = false;
    // window.open(`mailto:${email}?subject=${subject}&body=${name}: ${message}`);
  });
}
