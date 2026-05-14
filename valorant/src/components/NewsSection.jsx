import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Newspaper, Sparkles } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';

export default function NewsSection({ news }) {
  return (
    <section id="news" className="relative py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="04 / Newsroom"
        title="Patch &"
        accent="Headlines"
        description="Patch notes, tournament announcements, and community headlines."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {news.map((n, i) => (
          <NewsCard key={n.text + i} item={n} index={i} />
        ))}
      </div>
      {news.length === 0 && (
        <div className="text-center py-16 text-valorant-gray-light/40 font-mono text-sm uppercase tracking-wider">
          No news at the moment.
        </div>
      )}
    </section>
  );
}

function NewsCard({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const isFeatured = index === 0;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      whileHover={{ scale: 1.01 }}
      className={`group relative glass clip-corner card-shine p-6 ${
        isFeatured ? 'md:col-span-2 md:p-8' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 grid place-items-center bg-valorant-red/10 text-valorant-red clip-corner-sm group-hover:bg-valorant-red group-hover:text-valorant-black-deep transition-colors">
          {isFeatured ? <Sparkles size={18} /> : <Newspaper size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          {isFeatured && (
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-valorant-red mb-2">
              Featured
            </div>
          )}
          <p
            className={`text-valorant-gray-light/90 leading-relaxed ${
              isFeatured ? 'text-lg md:text-xl' : 'text-base'
            }`}
          >
            {item.text}
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-valorant-gray-light/40">
            <span>SRC: Liquipedia</span>
            <span className="w-1 h-1 rounded-full bg-valorant-gray-light/30" />
            <span>Auto-synced</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
