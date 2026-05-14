import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function SectionHeader({ eyebrow, title, accent, description }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="mb-12 md:mb-16">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-4"
      >
        <span className="w-10 h-px bg-valorant-red" />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-valorant-red">
          {eyebrow}
        </span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tight"
      >
        <span className="text-valorant-gray-light">{title} </span>
        <span className="text-gradient-red">{accent}</span>
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-4 max-w-2xl text-valorant-gray-light/60"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
