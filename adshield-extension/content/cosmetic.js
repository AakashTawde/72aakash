/*
 * cosmetic.js
 *
 * Hides ad containers that survive network blocking (e.g. self-hosted slots or
 * elements injected before the request is made). A <style> rule is injected at
 * document_start so ad boxes never paint, then a MutationObserver keeps up with
 * dynamically inserted slots and reports counts for the toolbar badge.
 */
(function () {
  "use strict";

  const data = window.AdShieldData || { COSMETIC_SELECTORS: [] };
  const SELECTORS = data.COSMETIC_SELECTORS;
  const STYLE_ID = "adshield-cosmetic-style";
  const HIDE_CSS = SELECTORS.join(",\n") +
    " { display: none !important; visibility: hidden !important;" +
    " height: 0 !important; min-height: 0 !important; }";

  // Inject the hiding stylesheet as early as possible so ad slots never flash.
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = HIDE_CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function removeStyle() {
    const el = document.getElementById(STYLE_ID);
    if (el) el.remove();
  }

  injectStyle();

  let observer = null;
  let scanScheduled = false;
  const counted = new WeakSet();

  function tagHidden(el) {
    if (counted.has(el)) return false;
    counted.add(el);
    el.setAttribute("data-adshield-hidden", "1");
    return true;
  }

  function scan() {
    scanScheduled = false;
    if (!window.AdShield || !window.AdShield.active) return;
    let newlyHidden = 0;
    for (let i = 0; i < SELECTORS.length; i++) {
      let nodes;
      try {
        nodes = document.querySelectorAll(SELECTORS[i]);
      } catch (e) {
        continue; // skip any selector a given engine dislikes
      }
      for (let j = 0; j < nodes.length; j++) {
        if (tagHidden(nodes[j])) newlyHidden++;
      }
    }
    if (newlyHidden) window.AdShield.reportBlocked(newlyHidden);
  }

  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    (window.requestAnimationFrame || setTimeout)(scan, 0);
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(scheduleScan);
    const target = document.documentElement || document;
    observer.observe(target, { childList: true, subtree: true });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function applyState(api) {
    if (api.active) {
      injectStyle();
      startObserver();
      scheduleScan();
    } else {
      removeStyle();
      stopObserver();
    }
  }

  window.AdShield.ready.then(function (api) {
    applyState(api);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scheduleScan, { once: true });
    }
    window.addEventListener("load", scheduleScan, { once: true });
  });

  window.AdShield.onChange(applyState);
})();
