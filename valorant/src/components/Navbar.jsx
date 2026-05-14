import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap } from 'lucide-react';

const LINKS = [
  { label: 'Matches', href: '#matches' },
  { label: 'Tournaments', href: '#tournaments' },
  { label: 'Transfers', href: '#transfers' },
  { label: 'News', href: '#news' },
];

export default function Navbar({ status, lastUpdated, onRefresh }) {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.85]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.15]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.div
        style={{
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(7, 14, 21, ${v})`),
          borderBottom: useTransform(
            borderOpacity,
            (v) => `1px solid rgba(255, 70, 85, ${v})`
          ),
          backdropFilter: 'blur(20px)',
        }}
        className="px-4 md:px-10 py-4 flex items-center justify-between"
      >
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 grid place-items-center bg-valorant-red clip-corner-sm">
            <Zap size={18} className="text-valorant-black-deep" strokeWidth={3} />
            <div className="absolute inset-0 bg-valorant-red blur-md opacity-50 -z-10 group-hover:opacity-80 transition" />
          </div>
          <div className="font-display tracking-[0.25em] text-2xl">
            <span className="text-valorant-gray-light">VAL</span>
            <span className="text-valorant-red">|</span>
            <span className="text-valorant-gray-light">HUB</span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-4 py-2 font-display tracking-widest text-sm uppercase text-valorant-gray-light/80 hover:text-valorant-red transition group"
            >
              {l.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-2/3 h-[2px] bg-valorant-red transition-all duration-300" />
            </a>
          ))}
        </nav>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2.5 px-4 py-2 glass clip-tag text-xs font-mono uppercase tracking-wider hover:bg-valorant-red/10 transition"
          title="Click to refresh"
        >
          <span
            className={`live-dot ${
              status === 'live' ? '' : status === 'error' ? 'bg-valorant-gold' : ''
            }`}
          />
          <span className="text-valorant-gray-light/80">
            {status === 'live' && 'LIVE'}
            {status === 'loading' && 'SYNC...'}
            {status === 'error' && 'CACHED'}
            {status === 'idle' && 'INIT'}
          </span>
          {lastUpdated && (
            <span className="hidden sm:inline text-valorant-gray-light/40">
              · {timeAgo(lastUpdated)}
            </span>
          )}
        </button>
      </motion.div>
    </motion.header>
  );
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}
