import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock, Swords, ChevronRight } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';

export default function MatchesSection({ matches }) {
  return (
    <section id="matches" className="relative py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="01 / Live Feed"
        title="Upcoming"
        accent="Matches"
        description="Synced from Liquipedia every minute. Hover a card to see more."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {matches.map((m, i) => (
          <MatchCard key={`${m.team1}-${m.team2}-${i}`} match={m} index={i} />
        ))}
      </div>
      {matches.length === 0 && <EmptyState label="No matches found right now." />}
    </section>
  );
}

function MatchCard({ match, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const isLive = /live/i.test(match.timeLabel || '');

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative glass clip-corner card-shine p-6 cursor-pointer"
    >
      {/* corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-valorant-red opacity-0 group-hover:opacity-100 transition" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-valorant-red opacity-0 group-hover:opacity-100 transition" />

      {/* status row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {isLive ? (
            <>
              <span className="live-dot" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-valorant-red">
                LIVE NOW
              </span>
            </>
          ) : (
            <>
              <Clock size={12} className="text-valorant-gray-light/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-valorant-gray-light/50">
                {match.timeLabel || 'TBD'}
              </span>
            </>
          )}
        </div>
        <Swords size={14} className="text-valorant-red/60" />
      </div>

      {/* teams */}
      <div className="space-y-3">
        <TeamRow name={match.team1} side="left" />
        <div className="flex items-center gap-3">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-valorant-red/40" />
          <span className="font-display text-lg text-valorant-red">VS</span>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-valorant-red/40" />
        </div>
        <TeamRow name={match.team2} side="right" />
      </div>

      {/* hover footer */}
      <div className="mt-5 pt-4 border-t border-valorant-gray-light/10 flex items-center justify-between text-xs">
        <span className="font-mono uppercase tracking-wider text-valorant-gray-light/40">
          BO3 · VCT
        </span>
        <span className="flex items-center gap-1 text-valorant-red opacity-0 group-hover:opacity-100 transition">
          Details <ChevronRight size={12} />
        </span>
      </div>
    </motion.article>
  );
}

function TeamRow({ name, side }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 grid place-items-center bg-valorant-black-light clip-corner-sm border border-valorant-red/20 font-display text-lg text-valorant-red">
        {initials}
      </div>
      <div className="font-display text-xl tracking-wide text-valorant-gray-light truncate">
        {name}
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="text-center py-16 text-valorant-gray-light/40 font-mono text-sm uppercase tracking-wider">
      {label}
    </div>
  );
}
