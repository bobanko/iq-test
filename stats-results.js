import { countries, emojiFlags } from "./countries.mapping.js";

function createResultItem({
  countryCode,
  name,
  value,
  date,
  locale = countryCode,
}) {
  const $resultItem = $tmplResultItem.content.firstElementChild.cloneNode(true);

  const $itemCountry = $resultItem.querySelector(".item-country");
  $itemCountry.textContent = emojiFlags[countryCode];
  $itemCountry.title = countries[countryCode];

  const $itemName = $resultItem.querySelector(".item-name");
  $itemName.textContent = name;
  $itemName.title = name;

  const $itemValue = $resultItem.querySelector(".item-value");
  $itemValue.textContent = value;

  const $itemDate = $resultItem.querySelector(".item-date");
  $itemDate.textContent = date?.toLocaleString(locale);
  $itemDate.title = date?.toLocaleString(locale);

  return $resultItem;
}

export function loadStats({ $container, data, locale }) {
  data.forEach((itemData) => {
    const $resultItem = createResultItem({ ...itemData, locale });

    $container.appendChild($resultItem);
  });
}
