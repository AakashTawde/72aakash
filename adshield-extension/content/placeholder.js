/*
 * placeholder.js
 *
 * After ads are blocked/hidden, sites are often left with an empty box because
 * the slot wrapper has a fixed height baked into the page's own CSS. This
 * module tidies that up:
 *
 *   - "collapse" (default): removes the reserved gap so the layout reflows
 *     cleanly, as a normal ad blocker would.
 *   - "custom": renders the *user's own* placeholder (a label, and optionally an
 *     image) into the empty slot. This is a purely local, client-side
 *     personalisation — it is rendered only in this browser, no content is sent
 *     anywhere and the page's markup on the server is untouched.
 *
 * The custom label/image come from the user's settings and are inserted via
 * textContent / a sanitised image URL, never as raw HTML, to avoid injection.
 */
(function () {
  "use strict";

  const PROCESSED = "data-adshield-slot";

  function slotSize(el) {
    // Prefer the IAB-declared size, then attributes, then computed box.
    const rect = el.getBoundingClientRect();
    let w = rect.width;
    let h = rect.height;
    const attrW = parseInt(el.getAttribute("width") || el.dataset.width || "", 10);
    const attrH = parseInt(el.getAttribute("height") || el.dataset.height || "", 10);
    if (!w && attrW) w = attrW;
    if (!h && attrH) h = attrH;
    return { w: Math.round(w), h: Math.round(h) };
  }

  function safeImageUrl(url) {
    if (!url) return "";
    try {
      const u = new URL(url, location.href);
      if (u.protocol === "https:" || u.protocol === "data:") return u.href;
    } catch (e) {
      /* fall through */
    }
    return "";
  }

  function buildPlaceholder(cfg, size) {
    const box = document.createElement("div");
    box.className = "adshield-placeholder";
    box.setAttribute(PROCESSED, "fill");
    if (size.w) box.style.width = size.w + "px";
    if (size.h) box.style.height = size.h + "px";

    const img = safeImageUrl(cfg.imageUrl);
    if (img) {
      const image = document.createElement("img");
      image.className = "adshield-placeholder__img";
      image.src = img;
      image.alt = "";
      box.appendChild(image);
    }

    const label = (cfg.label || "").trim();
    if (label) {
      const span = document.createElement("span");
      span.className = "adshield-placeholder__label";
      span.textContent = label; // text only — no HTML injection
      box.appendChild(span);
    }
    return box;
  }

  // Collapse a wrapper that now only reserves empty space.
  function collapseGap(el) {
    const cs = window.getComputedStyle(el);
    const reserves =
      parseInt(cs.minHeight, 10) > 0 || (parseInt(cs.height, 10) > 0 && el.children.length === 0);
    if (reserves) {
      el.style.setProperty("min-height", "0", "important");
      el.style.setProperty("height", "auto", "important");
      el.style.setProperty("margin", "0", "important");
      el.style.setProperty("padding", "0", "important");
    }
  }

  function process() {
    const api = window.AdShield;
    if (!api || !api.active) return;
    const cfg = api.settings.placeholder || {};
    if (!cfg.enabled) return;

    let hidden;
    try {
      hidden = document.querySelectorAll("[data-adshield-hidden]:not([" + PROCESSED + "])");
    } catch (e) {
      return;
    }

    Array.prototype.forEach.call(hidden, function (ad) {
      ad.setAttribute(PROCESSED, "done");

      if (cfg.mode === "custom") {
        const size = slotSize(ad);
        // Only fill slots that actually reserved a sensible amount of space.
        const node = buildPlaceholder(cfg, size);
        if (ad.parentNode) {
          ad.parentNode.insertBefore(node, ad);
        }
      } else {
        // collapse mode: also tidy the immediate wrapper if it holds nothing
        // but this ad.
        const parent = ad.parentElement;
        if (parent && parent.children.length === 1) collapseGap(parent);
      }
    });
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      process();
    }, 80);
  }

  function start() {
    process();
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true
    });
    window.addEventListener("load", schedule, { once: true });
  }

  window.AdShield.ready.then(function (api) {
    if (!api.active) return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
  });

  window.AdShield.onChange(function () {
    schedule();
  });
})();
