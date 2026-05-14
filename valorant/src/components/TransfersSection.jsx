import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowLeftRight } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';

export default function TransfersSection({ transfers }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="transfers" className="relative py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="03 / Roster Moves"
        title="Latest"
        accent="Transfers"
        description="Player movements across the global Valorant scene."
      />
      <div ref={ref} className="relative">
        {/* timeline vertical line */}
        <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-valorant-red via-valorant-red/30 to-transparent" />

        <ul className="space-y-4">
          {transfers.map((t, i) => (
            <motion.li
              key={t.text + i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative pl-14 group"
            >
              <span className="absolute left-2.5 top-3 w-5 h-5 rounded-full bg-valorant-black-light border-2 border-valorant-red grid place-items-center">
                <ArrowLeftRight size={9} className="text-valorant-red" />
              </span>
              <div className="glass clip-corner-sm p-4 group-hover:border-valorant-red/30 transition border border-transparent">
                <p className="text-valorant-gray-light/90 leading-relaxed">{t.text}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        {transfers.length === 0 && (
          <p className="text-center py-12 text-valorant-gray-light/40 font-mono text-sm uppercase tracking-wider">
            No recent transfers.
          </p>
        )}
      </div>
    </section>
  );
}
