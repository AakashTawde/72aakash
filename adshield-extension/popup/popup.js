/* popup.js — wires the toolbar popup to the service worker. */
(function () {
  "use strict";

  const els = {
    host: document.getElementById("host"),
    count: document.getElementById("count"),
    enabled: document.getElementById("enabled"),
    whitelist: document.getElementById("whitelist"),
    options: document.getElementById("options")
  };

  function send(msg) {
    return new Promise(function (resolve) {
      chrome.runtime.sendMessage(msg, function (res) {
        resolve(res || {});
      });
    });
  }

  function render(state) {
    els.host.textContent = state.host || "this page";
    els.count.textContent = state.count || 0;
    els.enabled.checked = !!(state.settings && state.settings.enabled);
    els.whitelist.checked = !!state.whitelisted;
    // Allowing ads only makes sense while protection is on.
    els.whitelist.disabled = !els.enabled.checked;
    document.body.classList.toggle("disabled", !els.enabled.checked);
  }

  async function refresh() {
    const state = await send({ type: "adshield:getState" });
    render(state);
    return state;
  }

  els.enabled.addEventListener("change", async function () {
    await send({ type: "adshield:setEnabled", value: els.enabled.checked });
    await refresh();
    reloadActiveTab();
  });

  els.whitelist.addEventListener("change", async function () {
    const state = await send({ type: "adshield:getState" });
    if (!state.host) return;
    await send({ type: "adshield:toggleWhitelist", host: state.host });
    await refresh();
    reloadActiveTab();
  });

  els.options.addEventListener("click", function () {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  });

  function reloadActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs[0]) chrome.tabs.reload(tabs[0].id);
    });
  }

  refresh();
})();
