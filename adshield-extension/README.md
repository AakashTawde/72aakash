# AdShield — Ad & Pop-up Blocker (Chrome, Manifest V3)

A lightweight Chrome extension that blocks ads and pop-ups, dismisses
"please disable your ad blocker" walls, and tidies up the empty space a
blocked ad leaves behind.

Everything happens **locally, in your own browser**. AdShield does not send
any data to websites, servers, or third parties, and it does not modify any
site's content on the server — it only changes what *you* see on your own
screen, the same way every ad blocker does.

## Features

- **Network blocking** — drops requests to ~45 well-known ad/tracking
  networks (DoubleClick, AdSense, Taboola, Outbrain, etc.) using Chrome's
  `declarativeNetRequest` API.
- **Cosmetic filtering** — hides leftover ad slots (banners, `ins.adsbygoogle`,
  GPT slots, sponsored boxes) before they paint.
- **Anti-adblock handling** — removes full-page "turn off your ad blocker"
  interstitials and re-enables scrolling/interaction that those walls disable.
- **Leftover-space tidy-up** — either collapses the empty gap (default) or, if
  you opt in, renders **your own** placeholder (a label and/or image) where the
  ad used to be. This placeholder is rendered only in your browser.
- **Per-site allow list** — turn AdShield off for sites you want to support.
- **Toolbar badge** — shows how many items were blocked on the current page.

## Install (developer / unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select the `adshield-extension/` folder.
4. The AdShield shield icon appears in your toolbar.

## How it fits together

```
adshield-extension/
├── manifest.json              # MV3 manifest, permissions, registrations
├── rules/
│   └── network-rules.json     # declarativeNetRequest block rules
├── background/
│   └── service-worker.js      # badge, whitelist rules, popup messaging
├── content/
│   ├── filter-data.js         # shared selector / phrase lists
│   ├── settings-bridge.js     # loads settings, gates the other scripts
│   ├── cosmetic.js            # hides ad containers
│   ├── anti-adblock.js        # dismisses detection walls, unlocks scroll
│   ├── placeholder.js         # collapses or fills leftover ad space
│   └── placeholder.css        # placeholder styling
├── popup/                     # toolbar popup (toggle, allow-site, stats)
├── options/                   # full settings + placeholder editor
├── icons/                     # generated PNG icons
└── tools/make_icons.py        # regenerates the icons (no dependencies)
```

### Settings model (`chrome.storage.local`)

```jsonc
{
  "enabled": true,
  "whitelist": ["example.com"],
  "hideAntiAdblock": true,
  "placeholder": {
    "enabled": false,
    "mode": "collapse",        // "collapse" | "custom"
    "label": "Ad removed",
    "imageUrl": ""             // https:// only
  }
}
```

## Design & safety notes

- **Client-side only.** Like every ad blocker, AdShield filters content in your
  browser for your own viewing. It does not alter websites for anyone else and
  sends nothing back to site owners or any server.
- **Custom placeholders are local.** The optional "custom" placeholder renders
  *your* text/image in *your* browser. The label is inserted via `textContent`
  and images are restricted to `https:`/`data:` URLs to avoid injection — even
  though the source is your own settings.
- **Conservative selectors.** Cosmetic and anti-adblock selectors target
  long-standing ad conventions to minimise the chance of hiding real content.
  Use the per-site allow list if a site breaks.
- **Respect site choices.** Some sites depend on ad revenue. The allow list
  makes it easy to support the ones you value.

## Regenerating icons

```bash
python3 tools/make_icons.py
```

Requires only the Python standard library.

## License

MIT — see headers in source files. Provided for personal use.
