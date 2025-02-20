import { getHash, setHash } from "./hash-param.js";
import { getSafeIndex } from "./helpers.js";
import { Timer } from "./timer.js";

// handle menu item highlights
const menuItems = $navMenu.querySelectorAll("a");
function onHashChanged() {
  const pageHash = getHash();

  if (pageHash === "") {
    const miHash = menuItems[0].getAttribute("href").substring(1);
    setHash(miHash);
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
  const slides = Array.from({ length: 10 }, (_, index) => {
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
