export const NeuralMeshBackground = () => (
  <div
    className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    aria-hidden
  >
    {/* Base grid */}
    <div
      className="absolute inset-0 opacity-[0.14]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />
    {/* Diagonal neural mesh */}
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(45deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '56px 56px',
      }}
    />
    {/* Radial vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030303_78%)]" />
  </div>
);
