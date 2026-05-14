import { motion } from 'framer-motion';
import { Github, Globe, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-valorant-red/10 bg-valorant-black-deep/50 backdrop-blur">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 grid place-items-center bg-valorant-red clip-corner-sm">
              <Zap size={18} className="text-valorant-black-deep" strokeWidth={3} />
            </div>
            <div className="font-display tracking-[0.25em] text-2xl">
              <span>VAL</span>
              <span className="text-valorant-red">|</span>
              <span>HUB</span>
            </div>
          </div>
          <p className="text-sm text-valorant-gray-light/50 leading-relaxed max-w-xs">
            A community-built live tracker for competitive Valorant. Not affiliated
            with Riot Games or Liquipedia.
          </p>
        </div>

        <div>
          <h4 className="font-display tracking-[0.25em] text-sm mb-4 text-valorant-red">
            DATA SOURCE
          </h4>
          <a
            href="https://liquipedia.net/valorant/Main_Page"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-valorant-gray-light/70 hover:text-valorant-red transition"
          >
            <Globe size={14} />
            liquipedia.net/valorant
          </a>
          <p className="mt-3 text-xs text-valorant-gray-light/40 leading-relaxed">
            All content is licensed under CC-BY-SA 3.0 by the Liquipedia community.
          </p>
        </div>

        <div>
          <h4 className="font-display tracking-[0.25em] text-sm mb-4 text-valorant-red">
            COLOPHON
          </h4>
          <ul className="space-y-2 text-sm text-valorant-gray-light/70">
            <li>Built with React + Vite</li>
            <li>Animations by Framer Motion</li>
            <li>Hosted on Firebase</li>
          </ul>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-valorant-gray-light/5 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-valorant-gray-light/40"
      >
        <span>© {new Date().getFullYear()} VAL|HUB · Fan-made</span>
        <span>VALORANT is a trademark of Riot Games, Inc.</span>
      </motion.div>
    </footer>
  );
}
