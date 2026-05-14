/**
 * Fallback data so the UI looks rich even on first load or if the
 * Liquipedia API is unreachable. Replaced by live data as soon as the
 * fetch resolves.
 */
export const FALLBACK_DATA = {
  fetchedAt: null,
  matches: [
    { team1: 'Sentinels', team2: 'LOUD', timeLabel: 'LIVE' },
    { team1: 'Fnatic', team2: 'Team Liquid', timeLabel: '21:00 CET' },
    { team1: 'Paper Rex', team2: 'DRX', timeLabel: 'Tomorrow' },
    { team1: 'NRG', team2: '100 Thieves', timeLabel: 'Tomorrow' },
    { team1: 'EDward Gaming', team2: 'BLG', timeLabel: 'In 2 days' },
    { team1: 'KOI', team2: 'Karmine Corp', timeLabel: 'In 2 days' },
  ],
  tournaments: [
    { name: 'VCT 2026: Masters Toronto', url: 'https://liquipedia.net/valorant/VCT/2026' },
    { name: 'VCT 2026: Pacific Stage 2', url: 'https://liquipedia.net/valorant/VCT/2026' },
    { name: 'VCT 2026: Americas Stage 2', url: 'https://liquipedia.net/valorant/VCT/2026' },
    { name: 'VCT 2026: EMEA Stage 2', url: 'https://liquipedia.net/valorant/VCT/2026' },
    { name: 'Game Changers Championship 2026', url: 'https://liquipedia.net/valorant/VCT' },
    { name: 'Challengers Ascension 2026', url: 'https://liquipedia.net/valorant/VCT' },
  ],
  transfers: [
    { text: 'TenZ rejoins Sentinels as IGL — May 12, 2026' },
    { text: 'Derke transfers from Fnatic to Team Heretics — May 10, 2026' },
    { text: 'Aspas signs 2-year contract extension with LEVIATÁN' },
  ],
  news: [
    { text: 'Patch 10.05 introduces a new map rotation and Vyse buffs across all queues.' },
    { text: 'Riot announces expanded prize pool for VCT Masters Toronto 2026.' },
    { text: 'Game Changers EMEA Stage 1 wraps with G2 Gozen taking the title.' },
    { text: 'Pacific Stage 1 finals see DRX overcome Paper Rex in a five-map thriller.' },
  ],
};
