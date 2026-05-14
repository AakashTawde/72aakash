/**
 * Liquipedia API client for Valorant data.
 *
 * Per Liquipedia's API Terms of Use (https://liquipedia.net/api-terms-of-use):
 *  - Identify yourself with a descriptive User-Agent (best-effort from browser).
 *  - Rate limit: parse action max 1 req / 30s; other actions 1 req / 2s.
 *  - Cache responses; never hammer the API.
 *
 * Browser environments cannot set User-Agent freely, so for production-grade
 * usage you should run requests through the Firebase Cloud Function in
 * /functions/index.js (which sets a proper UA and centralizes caching).
 * The client falls back to a public CORS proxy if the function is not
 * configured.
 */

const LIQUIPEDIA_API = 'https://liquipedia.net/valorant/api.php';

// If you deploy the optional Cloud Function (functions/index.js), set this in
// .env as VITE_PROXY_URL — e.g. https://us-central1-<project>.cloudfunctions.net/liquipediaProxy
const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';

// Public CORS proxy fallback (best-effort, not for heavy production load).
const PUBLIC_PROXY = 'https://api.allorigins.win/raw?url=';

// MediaWiki API supports `origin=*` for anonymous CORS — try direct first.
async function callApi(params) {
  const query = new URLSearchParams({
    ...params,
    format: 'json',
    origin: '*',
  }).toString();

  const direct = `${LIQUIPEDIA_API}?${query}`;

  // 1) Try our own Cloud Function (best path).
  if (PROXY_URL) {
    try {
      const r = await fetch(`${PROXY_URL}?${query}`);
      if (r.ok) return r.json();
    } catch (_) {
      /* fall through */
    }
  }

  // 2) Try direct (works in some browsers because origin=* is supported).
  try {
    const r = await fetch(direct, {
      headers: { Accept: 'application/json' },
    });
    if (r.ok) return r.json();
  } catch (_) {
    /* fall through */
  }

  // 3) Public CORS proxy fallback.
  const r = await fetch(PUBLIC_PROXY + encodeURIComponent(direct));
  if (!r.ok) throw new Error(`Liquipedia fetch failed: ${r.status}`);
  return r.json();
}

/**
 * Strip MediaWiki HTML noise and extract clean text from an HTML fragment.
 */
function htmlToText(html) {
  if (typeof window === 'undefined') return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  // Remove edit links, references, scripts.
  div.querySelectorAll('.mw-editsection, sup.reference, script, style').forEach((n) => n.remove());
  return div.textContent.trim().replace(/\s+/g, ' ');
}

function parseDoc(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

/**
 * Fetch and parse the Valorant Main Page from Liquipedia.
 * Returns a normalized object the UI can consume.
 */
export async function fetchMainPage() {
  const data = await callApi({
    action: 'parse',
    page: 'Main_Page',
    prop: 'text|images|sections',
    disabletoc: '1',
  });

  if (!data?.parse?.text) {
    throw new Error('Unexpected Liquipedia response shape');
  }

  const html = data.parse.text['*'] || '';
  const doc = parseDoc(html);

  return {
    fetchedAt: new Date().toISOString(),
    matches: extractMatches(doc),
    tournaments: extractTournaments(doc),
    transfers: extractTransfers(doc),
    news: extractNews(doc),
    raw: { sections: data.parse.sections || [] },
  };
}

/**
 * Heuristic match extraction: Liquipedia's Main Page embeds an "Upcoming
 * Matches" infobox. We look for the matches table and read team names + time.
 */
function extractMatches(doc) {
  const out = [];
  // Liquipedia uses .infobox_matches_content or .match-row in different skins.
  const rows = doc.querySelectorAll(
    '.infobox_matches_content tr, table.matches-list tr, .wikitable.matches tr'
  );
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 2) return;
    const text = row.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    // Try to find two team names + a vs separator.
    const m = text.match(/^(.+?)\s*(?:vs\.?|–|—|-)\s*(.+?)(?:\s+(\d{1,2}:\d{2}|\d{4}-\d{2}-\d{2}.*))?$/i);
    if (m) {
      out.push({
        team1: m[1].slice(0, 40),
        team2: m[2].slice(0, 40),
        timeLabel: m[3] || '',
      });
    }
  });
  return out.slice(0, 12);
}

function extractTournaments(doc) {
  const out = [];
  // Tournaments are usually in .tournament-card or wikitable rows linking /valorant/Tournament:
  const links = doc.querySelectorAll('a[href*="/valorant/"]');
  const seen = new Set();
  links.forEach((a) => {
    const title = a.getAttribute('title') || a.textContent.trim();
    const href = a.getAttribute('href') || '';
    if (!title || seen.has(title)) return;
    // Heuristic: tournament-like titles include "Championship", "Masters", "VCT", "Challengers", etc.
    if (/championship|masters|vct|challengers|game changers|invitational|cup|league|finals/i.test(title)) {
      seen.add(title);
      out.push({
        name: title,
        url: href.startsWith('http') ? href : `https://liquipedia.net${href}`,
      });
    }
  });
  return out.slice(0, 12);
}

function extractTransfers(doc) {
  const out = [];
  const rows = doc.querySelectorAll('.divRow, .transfer-row, table.transfers-list tr');
  rows.forEach((r) => {
    const text = htmlToText(r.innerHTML);
    if (text && text.length < 200) out.push({ text });
  });
  return out.slice(0, 8);
}

function extractNews(doc) {
  const out = [];
  // News blocks usually live in .main-page-news or dl/dt structures.
  const items = doc.querySelectorAll('.main-page-news li, .news-list li, ul li');
  items.forEach((li) => {
    const text = htmlToText(li.innerHTML);
    if (text.length > 20 && text.length < 300 && !/edit|jump to/i.test(text)) {
      out.push({ text });
    }
  });
  // Dedupe + cap.
  const seen = new Set();
  return out
    .filter((n) => {
      if (seen.has(n.text)) return false;
      seen.add(n.text);
      return true;
    })
    .slice(0, 10);
}
