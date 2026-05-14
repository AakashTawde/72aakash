/**
 * Firebase Cloud Functions for VAL|HUB.
 *
 * Two exports:
 *  - liquipediaProxy  HTTP function that fetches Liquipedia API with a
 *                     proper User-Agent and CORS headers for the browser.
 *  - refreshSnapshot  Scheduled function (every 5 min) that calls Liquipedia
 *                     server-side and stores the parsed Main_Page in
 *                     Firestore so clients can subscribe in real time.
 *
 * Requires the Firebase Blaze plan for outbound HTTP from functions and
 * for Cloud Scheduler. Deploy with:
 *   firebase deploy --only functions
 */

const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 5 });

// Identify yourself per Liquipedia API Terms of Use:
// https://liquipedia.net/api-terms-of-use
const USER_AGENT =
  'VAL|HUB/1.0 (https://github.com/aakashtawde/72aakash; community Valorant esports dashboard)';

const LIQUIPEDIA_API = 'https://liquipedia.net/valorant/api.php';

async function callLiquipedia(searchParams) {
  // Force JSON + ensure CORS-safe.
  searchParams.set('format', 'json');
  const url = `${LIQUIPEDIA_API}?${searchParams.toString()}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Encoding': 'gzip',
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Liquipedia ${res.status}`);
  return res.json();
}

/** Bare proxy: forward query string to Liquipedia, return JSON to client. */
exports.liquipediaProxy = onRequest(
  { cors: true, timeoutSeconds: 30, memory: '256MiB' },
  async (req, res) => {
    try {
      const params = new URLSearchParams(req.query);
      const data = await callLiquipedia(params);
      res.set('Cache-Control', 'public, max-age=60, s-maxage=60');
      res.json(data);
    } catch (err) {
      console.error('proxy error:', err);
      res.status(502).json({ error: String(err) });
    }
  }
);

/**
 * Scheduled snapshot: parse Main_Page and store HTML + timestamp in
 * Firestore under `liquipedia/main_page`. Clients can either fetch this
 * doc once or subscribe to onSnapshot for real-time updates.
 *
 * Liquipedia limits parse-action requests to 1 per 30s — running every
 * 5 minutes is well within that.
 */
exports.refreshSnapshot = onSchedule(
  { schedule: 'every 5 minutes', timeoutSeconds: 60, memory: '256MiB' },
  async () => {
    const params = new URLSearchParams({
      action: 'parse',
      page: 'Main_Page',
      prop: 'text|sections',
      disabletoc: '1',
    });
    const data = await callLiquipedia(params);
    const html = data?.parse?.text?.['*'] || '';
    await admin.firestore().doc('liquipedia/main_page').set(
      {
        html,
        sections: data?.parse?.sections || [],
        fetchedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`Refreshed Main_Page snapshot (${html.length} chars)`);
  }
);
