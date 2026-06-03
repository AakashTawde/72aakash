/*
 * anti-adblock.js
 *
 * Dismisses "please disable your ad blocker" interstitials and re-enables the
 * page underneath. Detection walls almost always do two things: drop a
 * full-screen overlay in front of the content and lock scrolling on
 * <html>/<body>. We undo both, locally, so the page the user came for is
 * usable again. No requests are made and nothing is reported to the site.
 */
(function () {
  "use strict";

  const data = window.AdShieldData || {};
  const SELECTORS = data.ANTI_ADBLOCK_SELECTORS || [];
  const PHRASES = (data.ANTI_ADBLOCK_PHRASES || []).map(function (p) {
    return p.toLowerCase();
  });
  const BACKDROP_HINTS = data.BACKDROP_HINTS || [];

  function looksLikeWallText(el) {
    const text = (el.textContent || "").toLowerCase();
    if (text.length > 2000) return false; // too much content to be a small wall
    return PHRASES.some(function (p) {
      return text.indexOf(p) !== -1;
    });
  }

  function isOverlay(el) {
    const cs = window.getComputedStyle(el);
    if (!cs) return false;
    if (cs.position !== "fixed" && cs.position !== "absolute") return false;
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const z = parseInt(cs.zIndex, 10);
    const rect = el.getBoundingClientRect();
    const coversMost =
      rect.width >= window.innerWidth * 0.6 &&
      rect.height >= window.innerHeight * 0.6;
    return (z >= 1000 || coversMost) && (coversMost || z >= 9999);
  }

  function nameHints(el) {
    const id = (el.id || "").toLowerCase();
    const cls = (el.className && el.className.toString
      ? el.className.toString()
      : "").toLowerCase();
    const blob = id + " " + cls;
    return BACKDROP_HINTS.some(function (h) {
      return blob.indexOf(h) !== -1;
    });
  }

  function removeEl(el) {
    if (!el || !el.parentNode) return;
    try {
      el.parentNode.removeChild(el);
    } catch (e) {
      el.style.setProperty("display", "none", "important");
    }
  }

  // Re-enable scrolling and interaction that the wall disabled.
  function unlockPage() {
    const targets = [document.documentElement, document.body];
    targets.forEach(function (el) {
      if (!el) return;
      const cs = window.getComputedStyle(el);
      if (cs && (cs.overflow === "hidden" || cs.overflowY === "hidden")) {
        el.style.setProperty("overflow", "auto", "important");
        el.style.setProperty("overflow-y", "auto", "important");
      }
      if (cs && cs.position === "fixed") {
        el.style.setProperty("position", "static", "important");
      }
      // Some walls blur the content behind them.
      if (cs && cs.filter && cs.filter !== "none") {
        el.style.setProperty("filter", "none", "important");
      }
      el.classList.remove(
        "modal-open",
        "no-scroll",
        "noscroll",
        "ovh",
        "stop-scrolling",
        "adblock-active"
      );
    });
  }

  function cleanup() {
    if (!window.AdShield || !window.AdShield.active) return;
    if (window.AdShield.settings.hideAntiAdblock === false) return;

    let removed = 0;

    // 1. Known anti-adblock containers by name.
    SELECTORS.forEach(function (sel) {
      let nodes;
      try {
        nodes = document.querySelectorAll(sel);
      } catch (e) {
        return;
      }
      nodes.forEach(function (el) {
        removeEl(el);
        removed++;
      });
    });

    // 2. Heuristic: big overlays whose text reads like an ad-block plea.
    let candidates;
    try {
      candidates = document.querySelectorAll("div,section,aside,dialog,ins");
    } catch (e) {
      candidates = [];
    }
    Array.prototype.forEach.call(candidates, function (el) {
      if (!el.isConnected) return;
      if (!isOverlay(el)) return;
      if (looksLikeWallText(el) || nameHints(el)) {
        // Also drop an adjacent dimming backdrop if present.
        const sib = el.previousElementSibling || el.nextElementSibling;
        if (sib && isOverlay(sib) && nameHints(sib)) removeEl(sib);
        removeEl(el);
        removed++;
      }
    });

    if (removed) {
      unlockPage();
      window.AdShield.reportBlocked(removed);
    } else {
      // Even with nothing to remove, a wall may have only locked scrolling.
      unlockPage();
    }
  }

  let observer = null;
  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      cleanup();
    }, 50);
  }

  function start() {
    cleanup();
    if (!observer) {
      observer = new MutationObserver(schedule);
      observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
      });
    }
    // Detection often fires on a delay, so retry for a short window.
    [200, 600, 1200, 2500, 4000].forEach(function (t) {
      setTimeout(cleanup, t);
    });
  }

  window.AdShield.ready.then(function (api) {
    if (!api.active) return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
    window.addEventListener("load", cleanup, { once: true });
  });

  window.AdShield.onChange(function (api) {
    if (api.active) start();
  });
})();
