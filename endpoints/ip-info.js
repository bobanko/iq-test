import { appConfig } from "../configs/app.config.js";

export function fetchClientIpInfo() {
  return fetch(
    `https://api.ipregistry.co/?key=${appConfig.ipRegistryKey}`
  ).then((response) => response.json());
}
