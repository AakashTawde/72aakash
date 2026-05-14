import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMainPage } from '../services/liquipedia.js';
import { FALLBACK_DATA } from '../data/fallback.js';

const REFRESH_MS = 60_000; // poll every 60s; respects Liquipedia rate limits
const STORAGE_KEY = 'valorant_hub_cache_v1';

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - new Date(parsed.fetchedAt).getTime() > 10 * 60_000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

export function useLiveData() {
  const [data, setData] = useState(() => readCache() || FALLBACK_DATA);
  const [status, setStatus] = useState('idle'); // idle | loading | live | error
  const [lastUpdated, setLastUpdated] = useState(() => {
    const c = readCache();
    return c?.fetchedAt ? new Date(c.fetchedAt) : null;
  });
  const timerRef = useRef(null);

  const refresh = useCallback(async () => {
    setStatus((s) => (s === 'live' ? 'live' : 'loading'));
    try {
      const fresh = await fetchMainPage();
      // Merge: if any field came back empty, keep prior values so UI never blanks.
      const merged = {
        fetchedAt: fresh.fetchedAt,
        matches: fresh.matches.length ? fresh.matches : data.matches,
        tournaments: fresh.tournaments.length ? fresh.tournaments : data.tournaments,
        transfers: fresh.transfers.length ? fresh.transfers : data.transfers,
        news: fresh.news.length ? fresh.news : data.news,
      };
      setData(merged);
      writeCache(merged);
      setLastUpdated(new Date(merged.fetchedAt));
      setStatus('live');
    } catch (err) {
      console.warn('[Liquipedia] refresh failed:', err);
      setStatus('error');
    }
  }, [data]);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, status, lastUpdated, refresh };
}
