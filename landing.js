import { getHash, setHash } from "./hash-param.js";

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
