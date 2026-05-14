import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, ExternalLink } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';

const TIER_COLORS = ['from-valorant-red to-valorant-red-dark', 'from-valorant-gold to-amber-600', 'from-valorant-cyan to-blue-500'];

export default function TournamentsSection({ tournaments }) {
  return (
    <section id="tournaments" className="relative py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="02 / Circuit"
        title="Active"
        accent="Tournaments"
        description="The biggest events in the VCT pipeline right now."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tournaments.map((t, i) => (
          <TournamentCard key={t.name + i} tournament={t} index={i} />
        ))}
      </div>
      {tournaments.length === 0 && (
        <div className="text-center py-16 text-valorant-gray-light/40 font-mono text-sm uppercase tracking-wider">
          No tournaments listed.
        </div>
      )}
    </section>
  );
}

function TournamentCard({ tournament, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const grad = TIER_COLORS[index % TIER_COLORS.length];

  return (
    <motion.a
      ref={ref}
      href={tournament.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
      style={{ transformPerspective: 1000 }}
      className="group relative block glass-strong clip-corner p-6 overflow-hidden"
    >
      {/* gradient sliver */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${grad}`} />

      {/* big number */}
      <div className="absolute -top-6 -right-4 font-display text-[8rem] leading-none text-valorant-red/5 select-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-12 h-12 grid place-items-center bg-gradient-to-br ${grad} clip-corner-sm`}>
            <Trophy size={20} className="text-valorant-black-deep" />
          </div>
          <ExternalLink
            size={16}
            className="text-valorant-gray-light/30 group-hover:text-valorant-red group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
          />
        </div>

        <h3 className="font-display text-2xl md:text-3xl leading-tight tracking-wide text-valorant-gray-light group-hover:text-valorant-red transition-colors">
          {tournament.name}
        </h3>

        <div className="mt-6 pt-4 border-t border-valorant-gray-light/10 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <span className="text-valorant-gray-light/40">Liquipedia</span>
          <span className="text-valorant-red/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-valorant-red animate-pulse" />
            ACTIVE
          </span>
        </div>
      </div>
    </motion.a>
  );
}
