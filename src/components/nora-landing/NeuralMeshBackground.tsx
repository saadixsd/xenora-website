import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

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
        className="absolute inset-0"
        aria-hidden
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, var(--mesh-glow), transparent 60%)' }} />
      </motion.div>

      <motion.div
        style={{ y: gridY }}
        className="absolute inset-0 opacity-[0.06]"
        transition={{ type: 'tween', ease: 'linear' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(var(--mesh-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--mesh-grid) 1px, transparent 1px)
          `,
            backgroundSize: '58px 58px',
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(135deg, var(--mesh-diag) 1px, transparent 1px),
            linear-gradient(45deg, var(--mesh-diag) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 0%, var(--mesh-vignette) 78%)` }} />
    </div>
  );
};
