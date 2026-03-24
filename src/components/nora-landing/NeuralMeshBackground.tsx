/**
 * Layered ambient background: grid + soft editorial gradients (depth without neon “AI” clichés).
 */
export const NeuralMeshBackground = () => (
  <div
    className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    aria-hidden
  >
    {/* Base depth — near-black with a barely perceptible vertical lift */}
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, #060608 0%, #030303 42%, #050506 100%)',
      }}
    />

    {/* Cool ambient — top / center (like soft daylight, not cyan laser) */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(130,165,195,0.09),transparent_58%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_15%_25%,rgba(95,125,160,0.05),transparent_50%)]" />

    {/* Warm counterweight — bottom-right (paper / lamplight, very low chroma) */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_92%_88%,rgba(200,175,145,0.04),transparent_55%)]" />

    {/* Floor pool — anchors the page */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_110%,rgba(0,0,0,0.55),transparent_52%)]" />

    {/* Grid — fades out toward edges so gradients read */}
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(45deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '56px 56px',
      }}
    />

    {/* Edge vignette — focus center content */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,3,0.72)_72%)]" />

    {/* Keep layers lightweight to avoid GPU/memory issues on lower-end devices */}
  </div>
);
