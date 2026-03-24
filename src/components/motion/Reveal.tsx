import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export function Reveal({
  children,
  delay = 0,
  y = 20,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
