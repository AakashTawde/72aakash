import { motion } from 'framer-motion';
import { ArrowDown, Crosshair, Radio } from 'lucide-react';

export default function Hero({ matchCount, tournamentCount }) {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* layered backgrounds */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-hex-pattern opacity-60" />
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-valorant-red/10 via-transparent to-transparent pointer-events-none" />

      {/* spotlight */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255,70,85,0.18) 0%, transparent 60%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-valorant-red to-transparent animate-scan-line" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 glass clip-tag"
        >
          <Radio size={12} className="text-valorant-red animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-valorant-gray-light/70">
            Powered by Liquipedia · Real-time
          </span>
        </motion.div>

        {/* huge title */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[18vw] md:text-[12rem] leading-[0.85] tracking-tight"
          >
            <span className="block text-valorant-gray-light">
              VALORANT
            </span>
            <span className="block text-gradient-red -mt-2 md:-mt-4">
              ESPORTS
            </span>
          </motion.h1>

          {/* glitchy duplicate */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ delay: 0.8 }}
            className="absolute inset-0 font-display text-[18vw] md:text-[12rem] leading-[0.85] tracking-tight text-valorant-cyan pointer-events-none animate-glitch"
          >
            <span className="block">VALORANT</span>
            <span className="block -mt-2 md:-mt-4">ESPORTS</span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-valorant-gray-light/70 leading-relaxed"
        >
          The complete live tracker for competitive Valorant. Matches, tournaments,
          transfers and patch news — synced directly from{' '}
          <span className="text-valorant-red font-semibold">liquipedia.net</span>.
        </motion.p>

        {/* stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-8"
        >
          <Stat icon={<Crosshair size={20} />} value={matchCount} label="Upcoming Matches" />
          <div className="w-px h-12 bg-valorant-red/30 hidden md:block" />
          <Stat icon={<Radio size={20} />} value={tournamentCount} label="Live Tournaments" />
          <div className="w-px h-12 bg-valorant-red/30 hidden md:block" />
          <Stat icon={<span className="font-display text-xl">∞</span>} value="24/7" label="Live Sync" raw />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#matches" className="btn-primary">
            <span>View Matches</span>
          </a>
          <a href="#tournaments" className="btn-ghost">
            <span>Tournaments</span>
          </a>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#matches"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-valorant-gray-light/40 hover:text-valorant-red transition"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown size={16} />
      </motion.a>
    </section>
  );
}

function Stat({ icon, value, label, raw }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 grid place-items-center bg-valorant-red/10 text-valorant-red clip-corner-sm">
        {icon}
      </div>
      <div className="text-left">
        <div className="font-display text-3xl text-valorant-gray-light leading-none">
          {raw ? value : <CountUp to={Number(value) || 0} />}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-valorant-gray-light/50 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

function CountUp({ to }) {
  return <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {to}
  </motion.span>;
}
