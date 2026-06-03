/* options.js — read/write settings in chrome.storage.local with a live preview. */
(function () {
  "use strict";

  const DEFAULTS = {
    enabled: true,
    whitelist: [],
    placeholder: { enabled: false, mode: "collapse", label: "Ad removed", imageUrl: "" },
    hideAntiAdblock: true
  };

  const el = function (id) {
    return document.getElementById(id);
  };

  const ui = {
    enabled: el("enabled"),
    hideAntiAdblock: el("hideAntiAdblock"),
    phEnabled: el("ph-enabled"),
    phOptions: el("ph-options"),
    phLabel: el("ph-label"),
    phImage: el("ph-image"),
    customFields: el("custom-fields"),
    preview: el("preview"),
    wlInput: el("wl-input"),
    wlAdd: el("wl-add"),
    wlList: el("wl-list"),
    saved: el("saved")
  };

  let state = JSON.parse(JSON.stringify(DEFAULTS));
  let savedTimer = null;

  function load() {
    chrome.storage.local.get(DEFAULTS, function (stored) {
      state = Object.assign({}, DEFAULTS, stored);
      state.placeholder = Object.assign({}, DEFAULTS.placeholder, stored.placeholder || {});
      paint();
    });
  }

  function persist() {
    chrome.storage.local.set(state, function () {
      ui.saved.hidden = false;
      clearTimeout(savedTimer);
      savedTimer = setTimeout(function () {
        ui.saved.hidden = true;
      }, 1200);
    });
  }

  function selectedMode() {
    const checked = document.querySelector("input[name='ph-mode']:checked");
    return checked ? checked.value : "collapse";
  }

  function paint() {
    ui.enabled.checked = !!state.enabled;
    ui.hideAntiAdblock.checked = state.hideAntiAdblock !== false;
    ui.phEnabled.checked = !!state.placeholder.enabled;
    ui.phOptions.disabled = !state.placeholder.enabled;

    const mode = state.placeholder.mode || "collapse";
    document.querySelectorAll("input[name='ph-mode']").forEach(function (r) {
      r.checked = r.value === mode;
    });

    ui.phLabel.value = state.placeholder.label || "";
    ui.phImage.value = state.placeholder.imageUrl || "";
    ui.customFields.classList.toggle("hidden", mode !== "custom");

    paintPreview();
    paintWhitelist();
  }

  function paintPreview() {
    const box = ui.preview;
    box.innerHTML = "";
    const img = (ui.phImage.value || "").trim();
    if (/^https:\/\//i.test(img)) {
      const image = document.createElement("img");
      image.className = "adshield-placeholder__img";
      image.src = img;
      image.alt = "";
      box.appendChild(image);
    }
    const label = (ui.phLabel.value || "").trim();
    if (label) {
      const span = document.createElement("span");
      span.className = "adshield-placeholder__label";
      span.textContent = label;
      box.appendChild(span);
    }
  }

  function paintWhitelist() {
    ui.wlList.innerHTML = "";
    if (!state.whitelist.length) {
      const li = document.createElement("li");
      li.className = "wl-empty";
      li.textContent = "No sites added yet.";
      ui.wlList.appendChild(li);
      return;
    }
    state.whitelist.forEach(function (host) {
      const li = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = host;
      const rm = document.createElement("button");
      rm.type = "button";
      rm.textContent = "Remove";
      rm.addEventListener("click", function () {
        state.whitelist = state.whitelist.filter(function (h) {
          return h !== host;
        });
        persist();
        paintWhitelist();
      });
      li.appendChild(name);
      li.appendChild(rm);
      ui.wlList.appendChild(li);
    });
  }

  function normalizeHost(value) {
    let v = (value || "").trim().toLowerCase();
    if (!v) return "";
    v = v.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
    return v;
  }

  /* ----- events ----- */

  ui.enabled.addEventListener("change", function () {
    state.enabled = ui.enabled.checked;
    persist();
  });

  ui.hideAntiAdblock.addEventListener("change", function () {
    state.hideAntiAdblock = ui.hideAntiAdblock.checked;
    persist();
  });

  ui.phEnabled.addEventListener("change", function () {
    state.placeholder.enabled = ui.phEnabled.checked;
    ui.phOptions.disabled = !ui.phEnabled.checked;
    persist();
  });

  document.querySelectorAll("input[name='ph-mode']").forEach(function (r) {
    r.addEventListener("change", function () {
      state.placeholder.mode = selectedMode();
      ui.customFields.classList.toggle("hidden", state.placeholder.mode !== "custom");
      persist();
    });
  });

  ui.phLabel.addEventListener("input", function () {
    state.placeholder.label = ui.phLabel.value;
    paintPreview();
    persist();
  });

  ui.phImage.addEventListener("input", function () {
    state.placeholder.imageUrl = ui.phImage.value.trim();
    paintPreview();
    persist();
  });

  function addCurrent() {
    const host = normalizeHost(ui.wlInput.value);
    if (host && state.whitelist.indexOf(host) === -1) {
      state.whitelist = state.whitelist.concat(host);
      persist();
      paintWhitelist();
    }
    ui.wlInput.value = "";
  }

  ui.wlAdd.addEventListener("click", addCurrent);
  ui.wlInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addCurrent();
  });

  // Keep the page in sync if settings change elsewhere (e.g. the popup).
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "local") load();
  });

  load();
})();
