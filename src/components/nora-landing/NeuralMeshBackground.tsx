import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * Ambient mesh background with very subtle motion depth.
 */
export const NeuralMeshBackground = () => {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  const gridY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -22]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 16]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--bg-base)]" />
      <motion.div
        style={{ y: glowY }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.08),transparent_60%)]"
      />

      <motion.div
        style={{ y: gridY }}
        className="absolute inset-0 opacity-[0.06]"
        transition={{ type: 'tween', ease: 'linear' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
          `,
            backgroundSize: '58px 58px',
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(45deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,15,0.72)_78%)]" />
    </div>
  );
};
