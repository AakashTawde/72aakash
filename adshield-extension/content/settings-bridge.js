/*
 * settings-bridge.js
 *
 * Loads the user's settings from chrome.storage and exposes a tiny shared API
 * (`window.AdShield`) that the other content scripts await before doing any
 * work. This keeps a single source of truth for "is the extension active on
 * this site?" and routes block counts back to the service worker for the
 * toolbar badge.
 */
(function () {
  "use strict";

  const DEFAULT_SETTINGS = {
    enabled: true,
    whitelist: [],
    placeholder: {
      enabled: false,
      // "collapse" simply removes leftover gaps; "custom" renders the user's
      // own HTML snippet in their browser only.
      mode: "collapse",
      html: "",
      label: "Hidden by AdShield"
    },
    hideAntiAdblock: true
  };

  function currentHost() {
    try {
      return location.hostname || (window.top && window.top.location.hostname) || "";
    } catch (e) {
      return location.hostname || "";
    }
  }

  function isWhitelisted(settings, host) {
    if (!host) return false;
    return (settings.whitelist || []).some(function (entry) {
      const e = String(entry || "").toLowerCase();
      const h = host.toLowerCase();
      return h === e || h.endsWith("." + e);
    });
  }

  let resolveReady;
  const readyPromise = new Promise(function (res) {
    resolveReady = res;
  });

  const api = {
    settings: DEFAULT_SETTINGS,
    active: false,
    host: currentHost(),
    ready: readyPromise,
    // Used by other modules to register callbacks that re-run when settings
    // change at runtime (e.g. the user toggles the extension in the popup).
    _onChange: [],
    onChange: function (fn) {
      if (typeof fn === "function") this._onChange.push(fn);
    },
    reportBlocked: function (count) {
      if (!count) return;
      try {
        chrome.runtime.sendMessage({ type: "adshield:blocked", count: count });
      } catch (e) {
        /* service worker asleep or context invalidated — safe to ignore */
      }
    }
  };

  function apply(settings) {
    api.settings = Object.assign({}, DEFAULT_SETTINGS, settings || {});
    api.settings.placeholder = Object.assign(
      {},
      DEFAULT_SETTINGS.placeholder,
      (settings && settings.placeholder) || {}
    );
    const host = api.host;
    api.active = !!api.settings.enabled && !isWhitelisted(api.settings, host);
  }

  window.AdShield = api;

  try {
    chrome.storage.local.get(DEFAULT_SETTINGS, function (stored) {
      apply(stored);
      resolveReady(api);
    });

    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area !== "local") return;
      const merged = Object.assign({}, api.settings);
      Object.keys(changes).forEach(function (k) {
        merged[k] = changes[k].newValue;
      });
      apply(merged);
      api._onChange.forEach(function (fn) {
        try {
          fn(api);
        } catch (e) {
          /* a misbehaving listener shouldn't break the others */
        }
      });
    });
  } catch (e) {
    // chrome.storage unavailable (very early / restricted frame) — fall back to
    // defaults so the extension still does something useful.
    apply(DEFAULT_SETTINGS);
    resolveReady(api);
  }
})();
