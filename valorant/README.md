# VAL|HUB — Live Valorant Esports Tracker

A React single-page app that pulls live data from
[liquipedia.net/valorant](https://liquipedia.net/valorant/Main_Page) and
renders it with a custom Valorant-inspired UI: dark theme, red accents,
beveled "clip-path" panels, motion-graphics hero, animated particle field,
scroll-driven reveals, glassmorphism cards, and a live status indicator that
auto-refreshes every 60 seconds.

```
valorant/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── firebase.json
├── .firebaserc                 ← edit project id here before deploy
├── .env.example                ← optional: proxy URL after deploying functions
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── services/liquipedia.js  ← MediaWiki API client + HTML parser
│   ├── hooks/useLiveData.js    ← polls every 60s, caches in localStorage
│   ├── data/fallback.js        ← static seed so UI is never empty
│   └── components/             ← Hero, Matches, Tournaments, Transfers,
│                                  News, Navbar, Footer, ParticleField
└── functions/                  ← optional Cloud Functions scraper
    └── index.js
```

## Quick start (local dev)

```bash
cd valorant
npm install
npm run dev
```

Open <http://localhost:5173>. The app will load with seed data and then
hydrate from Liquipedia within a couple of seconds.

## How "live updates" work

Three layered fetch strategies — the client tries them in order:

1. **Your Cloud Function** (preferred, if `VITE_PROXY_URL` is set in `.env`).
   Runs server-side with a proper `User-Agent` header per Liquipedia's
   [API Terms](https://liquipedia.net/api-terms-of-use). No CORS issues.
2. **Direct call** with `origin=*` — works in modern browsers because
   MediaWiki supports anonymous CORS.
3. **Public CORS proxy** (`api.allorigins.win`) as last-resort fallback.

The client polls every 60 seconds and also refetches whenever the tab
becomes visible. Responses are cached in `localStorage` (10-minute TTL) so
the page loads instantly on repeat visits.

Liquipedia rate limits: max **1 request per 30s** for `action=parse` (the
endpoint we hit). Our 60s poll is well inside that. **Do not lower the
interval** without batching.

## Deploy to Firebase Hosting (free Spark plan)

This deploys only the static site — no functions, no scheduler. The site
will still fetch live from the browser via the direct/proxy fallback.

```bash
# one-time
npm install -g firebase-tools
firebase login

# edit .firebaserc and set your project id
# then:
npm run deploy
```

That's it. Open the hosting URL Firebase prints.

## Deploy with the live server-side scraper (Blaze plan required)

For a production setup with proper User-Agent identification and real-time
Firestore-backed updates:

```bash
cd valorant/functions
npm install
cd ..

firebase deploy --only functions
# Firebase prints a URL like:
#   https://us-central1-<your-project>.cloudfunctions.net/liquipediaProxy

# Copy that URL into .env:
cp .env.example .env
# set VITE_PROXY_URL=<the URL above>

# Rebuild and redeploy hosting:
npm run deploy
```

The scheduled function `refreshSnapshot` will run every 5 minutes and
write a fresh `Main_Page` snapshot to Firestore at
`liquipedia/main_page`. (Wire the client to `onSnapshot` if you want
true real-time — the `firebase-admin` SDK in `functions/index.js` is
already set up for it.)

## Tech notes

- **React 18** + **Vite 5** — fast dev, sub-second HMR.
- **Tailwind CSS 3** — custom Valorant palette in `tailwind.config.js`.
- **Framer Motion 11** — scroll/viewport animations, hover tilts, layered
  hero reveal, navbar scroll-state.
- **Canvas particle field** — no Three.js; pure 2D canvas, mouse-reactive.
- **react-intersection-observer** — viewport-triggered animations.
- **lucide-react** — icon set.

## Legal / attribution

- Data © Liquipedia contributors, licensed
  [CC-BY-SA 3.0](https://liquipedia.net/valorant/Liquipedia:Copyrights).
- VALORANT is a trademark of Riot Games, Inc. This is a fan project and is
  not affiliated with Riot or Liquipedia.

## Known caveats

- **HTML parsing is heuristic.** Liquipedia's Main Page layout occasionally
  changes — selectors in `src/services/liquipedia.js` may need tweaks if
  matches/tournaments/news come back empty. The fallback data in
  `src/data/fallback.js` keeps the UI populated either way.
- **Browser User-Agent limit.** Browsers can't set a custom User-Agent
  header, so direct fetches don't fully comply with Liquipedia's ToU.
  Run the Cloud Function path for compliant, production-grade access.
