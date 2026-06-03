/*
 * service-worker.js
 *
 * Coordinates the extension:
 *   - seeds default settings on install
 *   - keeps the toolbar badge in sync with what each tab has blocked
 *   - turns the static blocking ruleset on/off with the global toggle
 *   - adds per-site "allow" rules for whitelisted domains
 *   - answers state/command messages from the popup
 */

const STATIC_RULESET_ID = "adshield_network_rules";
const DYNAMIC_BASE_ID = 1000; // keep clear of static rule ids (1-99)

const DEFAULT_SETTINGS = {
  enabled: true,
  whitelist: [],
  placeholder: { enabled: false, mode: "collapse", html: "", label: "Hidden by AdShield" },
  hideAntiAdblock: true
};

// Per-tab running count of blocked/hidden items (cleared on navigation).
const tabCounts = new Map();

/* ----------------------------- helpers ----------------------------- */

async function getSettings() {
  const stored = await chrome.storage.local.get(DEFAULT_SETTINGS);
  return Object.assign({}, DEFAULT_SETTINGS, stored);
}

function hostFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return "";
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

async function setBadge(tabId, count) {
  const text = count > 999 ? "999+" : count > 0 ? String(count) : "";
  try {
    await chrome.action.setBadgeBackgroundColor({ tabId, color: "#2f7d4f" });
    await chrome.action.setBadgeText({ tabId, text });
  } catch (e) {
    /* tab may have closed */
  }
}

/* Reflect the global toggle by enabling/disabling the static ruleset. */
async function syncRuleset(settings) {
  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets(
      settings.enabled
        ? { enableRulesetIds: [STATIC_RULESET_ID] }
        : { disableRulesetIds: [STATIC_RULESET_ID] }
    );
  } catch (e) {
    /* ruleset already in desired state */
  }
}

/* Rebuild dynamic "allow" rules so whitelisted domains see no blocking. */
async function syncWhitelistRules(settings) {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map(function (r) {
    return r.id;
  });

  const addRules = (settings.whitelist || []).map(function (host, i) {
    return {
      id: DYNAMIC_BASE_ID + i,
      priority: 100, // outrank the block rules (priority 1)
      action: { type: "allowAllRequests" },
      condition: {
        requestDomains: [String(host).toLowerCase()],
        resourceTypes: ["main_frame", "sub_frame"]
      }
    };
  });

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
  } catch (e) {
    console.warn("AdShield: failed to update whitelist rules", e);
  }
}

async function syncEverything() {
  const settings = await getSettings();
  await syncRuleset(settings);
  await syncWhitelistRules(settings);
}

/* ----------------------------- lifecycle ----------------------------- */

chrome.runtime.onInstalled.addListener(async function () {
  const current = await chrome.storage.local.get(null);
  // Only fill in values that are missing, so updates don't clobber prefs.
  const seeded = Object.assign({}, DEFAULT_SETTINGS, current);
  await chrome.storage.local.set(seeded);
  await chrome.action.setBadgeBackgroundColor({ color: "#2f7d4f" });
  await syncEverything();
});

chrome.runtime.onStartup.addListener(syncEverything);

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area !== "local") return;
  if (changes.enabled || changes.whitelist) syncEverything();
});

// Reset a tab's counter when it starts navigating to a new page.
chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === "loading" && info.url) {
    tabCounts.set(tabId, 0);
    setBadge(tabId, 0);
  }
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  tabCounts.delete(tabId);
});

/* ----------------------------- messaging ----------------------------- */

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (!msg || !msg.type) return;

  if (msg.type === "adshield:blocked") {
    const tabId = sender.tab && sender.tab.id;
    if (typeof tabId === "number") {
      const next = (tabCounts.get(tabId) || 0) + (msg.count || 0);
      tabCounts.set(tabId, next);
      setBadge(tabId, next);
    }
    return; // no response needed
  }

  if (msg.type === "adshield:getState") {
    (async function () {
      const settings = await getSettings();
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const host = tab ? hostFromUrl(tab.url || "") : "";
      let networkBlocked = 0;
      try {
        if (tab && chrome.declarativeNetRequest.getMatchedRules) {
          const res = await chrome.declarativeNetRequest.getMatchedRules({ tabId: tab.id });
          networkBlocked = (res.rulesMatchedInfo || []).length;
        }
      } catch (e) {
        /* needs the feedback permission / may be unavailable */
      }
      const cosmeticBlocked = (tab && tabCounts.get(tab.id)) || 0;
      sendResponse({
        settings,
        host,
        whitelisted: isWhitelisted(settings, host),
        count: cosmeticBlocked + networkBlocked
      });
    })();
    return true; // async response
  }

  if (msg.type === "adshield:setEnabled") {
    (async function () {
      await chrome.storage.local.set({ enabled: !!msg.value });
      sendResponse({ ok: true });
    })();
    return true;
  }

  if (msg.type === "adshield:toggleWhitelist") {
    (async function () {
      const settings = await getSettings();
      const host = (msg.host || "").toLowerCase();
      let list = settings.whitelist || [];
      if (list.indexOf(host) === -1) {
        list = list.concat(host);
      } else {
        list = list.filter(function (h) {
          return h !== host;
        });
      }
      await chrome.storage.local.set({ whitelist: list });
      sendResponse({ ok: true, whitelist: list });
    })();
    return true;
  }
});
