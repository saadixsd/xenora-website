/**
 * Minimal neural mesh background — thin connected lines on deep black.
 */
export const NeuralMeshBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
    {/* Base */}
    <div className="absolute inset-0 bg-[#0A0A0F]" />

    {/* Subtle purple wash */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.06),transparent_60%)]" />

    {/* Grid lines — thin, sparse */}
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />

    {/* Diagonal mesh — neural network feel */}
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

    {/* Vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,15,0.7)_75%)]" />
  </div>
);
