/*
 * filter-data.js
 *
 * Shared selector lists used by the cosmetic, anti-adblock and placeholder
 * content scripts. Content scripts loaded into the same frame share the same
 * isolated-world global scope, so this file simply publishes its data on
 * `window.AdShieldData` for the others to read.
 *
 * These lists deliberately favour widely-used, well-known ad container
 * conventions so the extension behaves predictably and avoids hiding genuine
 * page content.
 */
(function () {
  "use strict";

  // CSS selectors for elements that are, by near-universal convention, ad
  // slots. Kept conservative to minimise the chance of hiding real content.
  const COSMETIC_SELECTORS = [
    // Generic id / class conventions
    "[id^='ad-']",
    "[id^='ad_']",
    "[id$='-ad']",
    "[id*='-ad-']",
    "[class^='ad-']",
    "[class*=' ad-']",
    "[class$='-ad']",
    "[class*='-ads-']",
    "[class*='advert']",
    "[id*='advert']",
    "[class*='sponsor']",
    "[data-ad]",
    "[data-ad-slot]",
    "[data-ad-client]",
    "[data-adunit]",
    // Google / IAB standard slots
    "ins.adsbygoogle",
    "div[id^='div-gpt-ad']",
    "div[id^='google_ads_']",
    "iframe[id^='google_ads_']",
    "iframe[src*='doubleclick']",
    "iframe[src*='googlesyndication']",
    "iframe[src*='amazon-adsystem']",
    "iframe[aria-label='Advertisement']",
    // Common banner wrappers
    ".ad-banner",
    ".ad-container",
    ".ad-wrapper",
    ".ad-slot",
    ".adslot",
    ".ad-unit",
    ".adsbox",
    ".adsbygoogle",
    ".advertisement",
    ".banner-ads",
    ".sponsored-content",
    ".outbrain",
    ".OUTBRAIN",
    ".taboola",
    "[id^='taboola-']",
    "[class*='trc_rbox']"
  ];

  // Selectors for full-page interstitials / "please turn off your ad blocker"
  // walls and the overlay backdrops they ship with.
  const ANTI_ADBLOCK_SELECTORS = [
    "[id*='adblock' i]",
    "[class*='adblock' i]",
    "[id*='ad-block' i]",
    "[class*='ad-block' i]",
    "[id*='adBlocker' i]",
    "[class*='adBlocker' i]",
    "[id*='ablocker' i]",
    "[class*='disable-adblock' i]",
    "[class*='adblocker-root' i]",
    "[class*='adblock-detected' i]",
    "[id*='adblock-detected' i]",
    ".modal-adblock",
    ".adblock-notice",
    ".adblock-popup",
    ".adblock-overlay",
    ".adb-overlay",
    "#adblock-modal",
    "#adblock-overlay"
  ];

  // Class / id fragments that strongly imply a modal backdrop. We only remove
  // these when they co-occur with anti-adblock messaging (see anti-adblock.js).
  const BACKDROP_HINTS = [
    "overlay",
    "backdrop",
    "modal",
    "popup",
    "interstitial",
    "paywall",
    "blocker"
  ];

  // Text fragments commonly found in anti-adblock walls (lower-cased match).
  const ANTI_ADBLOCK_PHRASES = [
    "ad blocker",
    "adblocker",
    "ad-blocker",
    "disable your ad",
    "turn off your ad",
    "whitelist us",
    "whitelist this site",
    "we noticed you're using",
    "please disable",
    "using an ad blocker",
    "ads help us"
  ];

  window.AdShieldData = {
    COSMETIC_SELECTORS,
    ANTI_ADBLOCK_SELECTORS,
    BACKDROP_HINTS,
    ANTI_ADBLOCK_PHRASES
  };
})();
